"""
CivicAI Complaint Lifecycle API Endpoints
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from ..database import get_db_connection
from ..auth import get_current_user, TokenUser
from ..schemas import ComplaintCreate, StatusUpdateRequest, AssignTeamRequest, EscalateRequest, ResolutionProofCreate, RatingCreate
from ..services.sla_service import sla_service
from ..services.notification_service import notification_service
from ..services.audit_service import audit_service
from ..ai.ai_service import ai_service, CATEGORY_DEPARTMENT_MAP

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.get("")
def list_complaints(
    status: Optional[str] = None,
    category: Optional[str] = None,
    ward: Optional[str] = None,
    zone: Optional[str] = None,
    district: Optional[str] = None,
    department_id: Optional[str] = None,
    citizen_id: Optional[str] = None,
    escalated_only: Optional[bool] = False,
    current_user: TokenUser = Depends(get_current_user)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM complaints WHERE 1=1"
    params = []

    # Role-based data scoping
    if current_user.role == "CITIZEN":
        query += " AND citizen_id = ?"
        params.append(current_user.id)
    elif current_user.role == "AREA_OFFICER" and current_user.ward_id:
        query += " AND ward = ?"
        params.append(current_user.ward_id)
    elif current_user.role == "DEPARTMENT_OFFICER" and current_user.department_id:
        query += " AND department_id = ?"
        params.append(current_user.department_id)
    elif current_user.role == "SUPERVISOR" and current_user.zone_id:
        query += " AND zone = ?"
        params.append(current_user.zone_id)
    elif current_user.role == "FIELD_TEAM":
        query += " AND assigned_officer_id = ? OR assigned_team_name LIKE ?"
        params.extend([current_user.id, f"%{current_user.full_name}%"])

    # Query param filters
    if status:
        query += " AND status = ?"
        params.append(status)
    if category:
        query += " AND category = ?"
        params.append(category)
    if ward and current_user.role in ["ADMIN", "DISTRICT_MANAGER", "SUPERVISOR"]:
        query += " AND ward = ?"
        params.append(ward)
    if zone and current_user.role in ["ADMIN", "DISTRICT_MANAGER"]:
        query += " AND zone = ?"
        params.append(zone)
    if district and current_user.role in ["ADMIN", "DISTRICT_MANAGER"]:
        query += " AND district = ?"
        params.append(district)
    if department_id and current_user.role in ["ADMIN", "DISTRICT_MANAGER", "SUPERVISOR"]:
        query += " AND department_id = ?"
        params.append(department_id)
    if citizen_id and current_user.role == "ADMIN":
        query += " AND citizen_id = ?"
        params.append(citizen_id)
    if escalated_only:
        query += " AND (status = 'ESCALATED' OR escalation_level > 1)"

    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        c_dict = dict(r)
        sla_info = sla_service.evaluate_sla_status(
            c_dict["response_deadline"],
            c_dict["resolution_deadline"],
            c_dict["status"]
        )
        c_dict["sla_evaluation"] = sla_info
        result.append(c_dict)

    return result

@router.post("", status_code=status.HTTP_201_CREATED)
def create_complaint(data: ComplaintCreate, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    complaint_id = f"CIV-2026-{uuid.uuid4().hex[:6].upper()}"
    now = datetime.now(timezone.utc).isoformat()
    
    # Run AI Analysis
    ai_result = ai_service.analyze_complaint(
        description=data.description,
        image_url=data.image_url,
        latitude=data.latitude,
        longitude=data.longitude
    )

    assigned_dept = CATEGORY_DEPARTMENT_MAP.get(data.category, "Municipal Grievance Cell")
    dept_id = f"dept-{data.category.lower().replace(' ', '-')}"
    
    # Calculate SLA Deadlines
    resp_deadline, res_deadline = sla_service.calculate_deadlines(data.category, data.priority or "HIGH")

    title = data.title or f"{data.category} defect reported at {data.area}"

    cursor.execute("""
        INSERT INTO complaints 
        (id, citizen_id, citizen_name, citizen_phone, category, title, description, landmark, image_url,
         latitude, longitude, readable_address, area, ward, zone, district, municipality,
         priority, severity, priority_score, status, escalation_level,
         department_id, department_name, response_deadline, resolution_deadline,
         created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', 1, ?, ?, ?, ?, ?, ?)
    """, (
        complaint_id, current_user.id, current_user.full_name, getattr(current_user, 'phone', '+91 98401 23456'),
        data.category, title, data.description, data.landmark, data.image_url,
        data.latitude, data.longitude, data.readable_address, data.area, data.ward, data.zone,
        data.district, data.municipality, data.priority or "HIGH", data.severity or "HIGH",
        int(ai_result["confidence"] * 100), dept_id, assigned_dept, resp_deadline, res_deadline,
        now, now
    ))

    # Record AI Prediction
    ai_pred_id = f"ai-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO ai_predictions 
        (id, complaint_id, model_name, predicted_category, confidence, suggested_priority, detected_description, suggested_department, created_at)
        VALUES (?, ?, 'Google Gemini 2.0 Civic Engine', ?, ?, ?, ?, ?, ?)
    """, (
        ai_pred_id, complaint_id, ai_result["category"], ai_result["confidence"],
        ai_result["suggested_priority"], ai_result["detected_description"], ai_result["suggested_department"], now
    ))

    # Status History
    history_id = f"hist-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO complaint_status_history 
        (id, complaint_id, status, actor_id, actor_name, actor_role, notes, escalation_level, timestamp)
        VALUES (?, ?, 'SUBMITTED', ?, ?, 'CITIZEN', 'Complaint logged with live camera GPS coordinates.', 0, ?)
    """, (history_id, complaint_id, current_user.id, current_user.full_name, now))

    conn.commit()
    conn.close()

    # Trigger Notifications & Audit
    notification_service.send_notification(
        user_id=current_user.id,
        complaint_id=complaint_id,
        notif_type="COMPLAINT_SUBMITTED",
        title="Grievance Registered Successfully",
        message=f"Complaint {complaint_id} ({data.category}) logged for {data.ward}. Assigned SLA timer started.",
        action_url=f"/complaint/{complaint_id}"
    )

    audit_service.log_action(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="CREATE_COMPLAINT",
        resource_type="COMPLAINT",
        resource_id=complaint_id,
        details=f"Citizen logged complaint in {data.ward} - {data.municipality}"
    )

    return {"id": complaint_id, "status": "SUBMITTED", "message": "Complaint successfully registered"}

@router.get("/{id}")
def get_complaint(id: str, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM complaints WHERE id = ?", (id,))
    complaint = cursor.fetchone()
    if not complaint:
        conn.close()
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint_dict = dict(complaint)

    # Fetch status history
    cursor.execute("SELECT * FROM complaint_status_history WHERE complaint_id = ? ORDER BY timestamp ASC", (id,))
    history = [dict(h) for h in cursor.fetchall()]
    complaint_dict["history"] = history

    # Fetch resolution proof
    cursor.execute("SELECT * FROM resolution_proofs WHERE complaint_id = ?", (id,))
    proof = cursor.fetchone()
    complaint_dict["resolution_proof"] = dict(proof) if proof else None

    # Fetch AI prediction
    cursor.execute("SELECT * FROM ai_predictions WHERE complaint_id = ?", (id,))
    ai_pred = cursor.fetchone()
    complaint_dict["ai_analysis"] = dict(ai_pred) if ai_pred else None

    # Fetch ratings
    cursor.execute("SELECT * FROM ratings WHERE complaint_id = ?", (id,))
    rating = cursor.fetchone()
    complaint_dict["rating"] = dict(rating) if rating else None

    conn.close()

    # SLA evaluation
    complaint_dict["sla_evaluation"] = sla_service.evaluate_sla_status(
        complaint_dict["response_deadline"],
        complaint_dict["resolution_deadline"],
        complaint_dict["status"]
    )

    return complaint_dict

@router.patch("/{id}/status")
def update_status(id: str, data: StatusUpdateRequest, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    now = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
        UPDATE complaints 
        SET status = ?, updated_at = ?
        WHERE id = ?
    """, (data.status, now, id))

    history_id = f"hist-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO complaint_status_history 
        (id, complaint_id, status, actor_id, actor_name, actor_role, notes, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (history_id, id, data.status, current_user.id, current_user.full_name, current_user.role, data.notes, now))

    conn.commit()
    conn.close()

    audit_service.log_action(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="UPDATE_STATUS",
        resource_type="COMPLAINT",
        resource_id=id,
        details=f"Status changed to {data.status}. Notes: {data.notes}"
    )

    return {"message": f"Complaint {id} status updated to {data.status}"}

@router.post("/{id}/assign")
def assign_field_team(id: str, data: AssignTeamRequest, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
        UPDATE complaints 
        SET assigned_team_id = ?, assigned_team_name = ?, status = 'ASSIGNED', updated_at = ?
        WHERE id = ?
    """, (data.team_id, data.team_name, now, id))

    history_id = f"hist-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO complaint_status_history 
        (id, complaint_id, status, actor_id, actor_name, actor_role, notes, timestamp)
        VALUES (?, ?, 'ASSIGNED', ?, ?, ?, ?, ?)
    """, (history_id, id, current_user.id, current_user.full_name, current_user.role, f"Dispatched {data.team_name}. {data.instructions or ''}", now))

    conn.commit()
    conn.close()

    notification_service.send_notification(
        user_id="user-citizen-1",
        complaint_id=id,
        notif_type="FIELD_TEAM_ASSIGNED",
        title="Field Response Team Dispatched",
        message=f"{data.team_name} assigned to inspect and remediate defect.",
        action_url=f"/complaint/{id}"
    )

    return {"message": f"Team {data.team_name} assigned to complaint {id}"}

@router.post("/{id}/escalate")
def escalate_complaint(id: str, data: EscalateRequest, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
        UPDATE complaints 
        SET status = 'ESCALATED', escalation_level = ?, escalation_reason = ?, updated_at = ?
        WHERE id = ?
    """, (data.target_level or 2, data.reason, now, id))

    history_id = f"hist-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO complaint_status_history 
        (id, complaint_id, status, actor_id, actor_name, actor_role, notes, escalation_level, timestamp)
        VALUES (?, ?, 'ESCALATED', ?, ?, ?, ?, ?, ?)
    """, (history_id, id, current_user.id, current_user.full_name, current_user.role, data.reason, data.target_level or 2, now))

    conn.commit()
    conn.close()

    notification_service.send_notification(
        user_id="user-super-1",
        complaint_id=id,
        notif_type="COMPLAINT_ESCALATED",
        title=f"Complaint Escalated to Level {data.target_level or 2}",
        message=f"Grievance {id} escalated. Reason: {data.reason}",
        action_url=f"/complaint/{id}"
    )

    return {"message": f"Complaint {id} escalated to Level {data.target_level or 2}"}

@router.post("/{id}/proof")
def upload_proof(id: str, data: ResolutionProofCreate, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    proof_id = f"proof-{uuid.uuid4().hex[:8]}"

    cursor.execute("""
        INSERT OR REPLACE INTO resolution_proofs 
        (id, complaint_id, field_team_id, field_team_name, before_image_url, after_image_url, notes, latitude, longitude, upload_timestamp, verified_by, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (proof_id, id, current_user.id, current_user.full_name, data.before_image_url, data.after_image_url, data.notes, data.latitude, data.longitude, now, current_user.id, now))

    cursor.execute("""
        UPDATE complaints 
        SET status = 'RESOLVED', resolved_at = ?, updated_at = ?
        WHERE id = ?
    """, (now, now, id))

    history_id = f"hist-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO complaint_status_history 
        (id, complaint_id, status, actor_id, actor_name, actor_role, notes, timestamp)
        VALUES (?, ?, 'RESOLVED', ?, ?, 'FIELD_TEAM', 'Remediation work completed. Verified photo proof uploaded.', ?)
    """, (history_id, id, current_user.id, current_user.full_name, now))

    conn.commit()
    conn.close()

    notification_service.send_notification(
        user_id="user-citizen-1",
        complaint_id=id,
        notif_type="COMPLAINT_RESOLVED",
        title="Grievance Marked as Resolved ✓",
        message=f"Field work completed for {id}. Please review before/after photo proof and rate service.",
        action_url=f"/complaint/{id}"
    )

    return {"message": "Resolution proof verified and complaint marked as RESOLVED"}

@router.post("/{id}/rate")
def rate_and_feedback(id: str, data: RatingCreate, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    rate_id = f"rate-{uuid.uuid4().hex[:8]}"

    cursor.execute("""
        INSERT OR REPLACE INTO ratings 
        (id, complaint_id, citizen_id, rating, feedback, reopen_requested, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (rate_id, id, current_user.id, data.rating, data.feedback, 1 if data.reopen else 0, now))

    if data.reopen:
        cursor.execute("UPDATE complaints SET status = 'REOPENED', updated_at = ? WHERE id = ?", (now, id))
        history_id = f"hist-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO complaint_status_history 
            (id, complaint_id, status, actor_id, actor_name, actor_role, notes, timestamp)
            VALUES (?, ?, 'REOPENED', ?, ?, 'CITIZEN', ?, ?)
        """, (history_id, id, current_user.id, current_user.full_name, f"Citizen reopened complaint. Feedback: {data.feedback}", now))

    conn.commit()
    conn.close()

    return {"message": "Feedback submitted successfully", "reopened": data.reopen}
