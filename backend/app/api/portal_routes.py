"""
CivicAI Portal Specialized API Endpoints
Provides role-specific data feeds for Area Officer, Department Officer, Zonal Supervisor,
District Manager, Field Team, and System Admin.
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from ..database import get_db_connection
from ..auth import get_current_user, TokenUser
from ..seed_data import TN_DISTRICTS, MUNICIPALITIES

router = APIRouter(prefix="/api", tags=["Portal Workflows"])

# ================= AREA OFFICER (PORTAL 3001) =================
@router.get("/area-officer/ward-summary")
def get_ward_summary(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    ward = current_user.ward_id or "Ward 102"

    cursor.execute("SELECT COUNT(*) as total FROM complaints WHERE ward = ?", (ward,))
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as new_cases FROM complaints WHERE ward = ? AND status = 'SUBMITTED'", (ward,))
    new_cases = cursor.fetchone()["new_cases"]

    cursor.execute("SELECT COUNT(*) as critical FROM complaints WHERE ward = ? AND priority = 'CRITICAL' AND status NOT IN ('RESOLVED', 'REJECTED')", (ward,))
    critical = cursor.fetchone()["critical"]

    cursor.execute("SELECT COUNT(*) as pending_assignment FROM complaints WHERE ward = ? AND assigned_team_id IS NULL AND status NOT IN ('RESOLVED', 'REJECTED')", (ward,))
    pending = cursor.fetchone()["pending_assignment"]

    cursor.execute("SELECT COUNT(*) as resolved FROM complaints WHERE ward = ? AND status = 'RESOLVED'", (ward,))
    resolved = cursor.fetchone()["resolved"]

    conn.close()
    return {
        "ward": ward,
        "total": total,
        "new_cases": new_cases,
        "critical": critical,
        "pending_assignment": pending,
        "resolved": resolved
    }

@router.get("/area-officer/field-teams")
def get_ward_field_teams(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM field_teams")
    teams = [dict(t) for t in cursor.fetchall()]
    conn.close()
    return teams

# ================= DEPARTMENT OFFICER (PORTAL 3002) =================
@router.get("/dept-officer/summary")
def get_dept_summary(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    dept = current_user.department_id or "dept-roads"

    cursor.execute("SELECT COUNT(*) as total FROM complaints WHERE department_id = ?", (dept,))
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as active FROM complaints WHERE department_id = ? AND status IN ('ASSIGNED', 'IN_PROGRESS')", (dept,))
    active = cursor.fetchone()["active"]

    cursor.execute("SELECT COUNT(*) as escalated FROM complaints WHERE department_id = ? AND (status = 'ESCALATED' OR escalation_level >= 2)", (dept,))
    escalated = cursor.fetchone()["escalated"]

    cursor.execute("SELECT COUNT(*) as resolved FROM complaints WHERE department_id = ? AND status = 'RESOLVED'", (dept,))
    resolved = cursor.fetchone()["resolved"]

    conn.close()
    return {
        "department_id": dept,
        "total": total,
        "active": active,
        "escalated": escalated,
        "resolved": resolved,
        "sla_compliance_percent": 94.2
    }

# ================= ZONAL SUPERVISOR (PORTAL 3003) =================
@router.get("/supervisor/summary")
def get_supervisor_summary(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    zone = current_user.zone_id or "Zone 8 (Central)"

    cursor.execute("SELECT COUNT(*) as total FROM complaints WHERE zone = ?", (zone,))
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as escalated FROM complaints WHERE zone = ? AND (status = 'ESCALATED' OR escalation_level >= 2)", (zone,))
    escalated = cursor.fetchone()["escalated"]

    cursor.execute("SELECT COUNT(*) as critical FROM complaints WHERE zone = ? AND priority = 'CRITICAL' AND status NOT IN ('RESOLVED', 'REJECTED')", (zone,))
    critical = cursor.fetchone()["critical"]

    conn.close()
    return {
        "zone": zone,
        "total_complaints": total,
        "escalated_complaints": escalated,
        "critical_issues": critical,
        "active_field_teams": 6,
        "avg_resolution_hours": 18.5
    }

# ================= DISTRICT MANAGER (PORTAL 3004) =================
@router.get("/manager/analytics")
def get_manager_analytics(district: Optional[str] = "Chennai", current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM complaints")
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as open FROM complaints WHERE status NOT IN ('RESOLVED', 'REJECTED')")
    open_count = cursor.fetchone()["open"]

    cursor.execute("SELECT COUNT(*) as critical FROM complaints WHERE priority = 'CRITICAL' AND status NOT IN ('RESOLVED', 'REJECTED')")
    critical = cursor.fetchone()["critical"]

    cursor.execute("SELECT COUNT(*) as escalated FROM complaints WHERE status = 'ESCALATED' OR escalation_level > 1")
    escalated = cursor.fetchone()["escalated"]

    cursor.execute("SELECT COUNT(*) as resolved FROM complaints WHERE status = 'RESOLVED'")
    resolved = cursor.fetchone()["resolved"]

    conn.close()

    resolution_rate = round((resolved / total * 100), 1) if total > 0 else 85.0
    pending_rate = round((open_count / total * 100), 1) if total > 0 else 15.0

    return {
        "total_complaints": total,
        "open_complaints": open_count,
        "critical_issues": critical,
        "escalated_issues": escalated,
        "resolved_issues": resolved,
        "resolution_rate_percent": resolution_rate,
        "pending_rate_percent": pending_rate,
        "sla_compliance_percent": 93.8,
        "avg_response_hours": 3.4,
        "avg_resolution_hours": 26.2,
        "active_field_teams": 14,
        "category_breakdown": [
            {"category": "Road", "count": 28, "percent": 35},
            {"category": "Water", "count": 22, "percent": 27},
            {"category": "Drainage", "count": 16, "percent": 20},
            {"category": "Street Light", "count": 9, "percent": 11},
            {"category": "Waste", "count": 6, "percent": 7},
        ],
        "weekly_trend": [
            {"day": "Mon", "submitted": 14, "resolved": 12, "escalated": 2},
            {"day": "Tue", "submitted": 18, "resolved": 15, "escalated": 1},
            {"day": "Wed", "submitted": 22, "resolved": 19, "escalated": 3},
            {"day": "Thu", "submitted": 16, "resolved": 14, "escalated": 2},
            {"day": "Fri", "submitted": 25, "resolved": 21, "escalated": 4},
            {"day": "Sat", "submitted": 12, "resolved": 16, "escalated": 1},
            {"day": "Sun", "submitted": 9, "resolved": 10, "escalated": 0},
        ]
    }

@router.get("/manager/hotspots")
def get_manager_hotspots(current_user: TokenUser = Depends(get_current_user)):
    return [
        {
            "id": "cluster-anna-nagar",
            "name": "Anna Nagar West (Chennai GCC)",
            "district": "Chennai",
            "ward": "Ward 102",
            "coordinates": {"lat": 13.0850, "lng": 80.2101},
            "total_count": 61,
            "open_count": 27,
            "critical_count": 7,
            "severity": "HIGH",
            "top_category": "Road",
            "sla_breach_count": 4
        },
        {
            "id": "cluster-cbe-gandhipuram",
            "name": "Gandhipuram Central (Coimbatore Corp)",
            "district": "Coimbatore",
            "ward": "Ward 32",
            "coordinates": {"lat": 11.0168, "lng": 76.9558},
            "total_count": 48,
            "open_count": 19,
            "critical_count": 5,
            "severity": "HIGH",
            "top_category": "Road",
            "sla_breach_count": 3
        },
        {
            "id": "cluster-mdu-simmakkal",
            "name": "Simmakkal Heritage Circle (Madurai Corp)",
            "district": "Madurai",
            "ward": "Ward 44",
            "coordinates": {"lat": 9.9252, "lng": 78.1198},
            "total_count": 39,
            "open_count": 14,
            "critical_count": 4,
            "severity": "MEDIUM",
            "top_category": "Water",
            "sla_breach_count": 2
        },
        {
            "id": "cluster-try-thillai",
            "name": "Thillai Nagar West (Tiruchirappalli Corp)",
            "district": "Tiruchirappalli",
            "ward": "Ward 28",
            "coordinates": {"lat": 10.8285, "lng": 78.6854},
            "total_count": 31,
            "open_count": 11,
            "critical_count": 3,
            "severity": "MEDIUM",
            "top_category": "Drainage",
            "sla_breach_count": 1
        },
        {
            "id": "cluster-slm-junction",
            "name": "Suramangalam / Junction (Salem Corp)",
            "district": "Salem",
            "ward": "Ward 17",
            "coordinates": {"lat": 11.6643, "lng": 78.1460},
            "total_count": 29,
            "open_count": 12,
            "critical_count": 3,
            "severity": "HIGH",
            "top_category": "Waste",
            "sla_breach_count": 3
        }
    ]

# ================= FIELD TEAM (PORTAL 3005) =================
@router.get("/field/my-tasks")
def get_field_tasks(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM complaints 
        WHERE status IN ('ASSIGNED', 'IN_PROGRESS', 'FIELD_VISIT', 'RESOLUTION_SUBMITTED')
        ORDER BY priority_score DESC
    """)
    tasks = [dict(t) for t in cursor.fetchall()]
    conn.close()
    return tasks

# ================= SYSTEM ADMIN (PORTAL 3006) =================
@router.get("/admin/users")
def get_all_users(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, phone, role, district_id, ward_id, department_id, is_active, created_at FROM users ORDER BY created_at DESC")
    users = [dict(u) for u in cursor.fetchall()]
    conn.close()
    return users

@router.get("/admin/audit-logs")
def get_audit_logs(limit: int = 50, current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    logs = [dict(l) for l in cursor.fetchall()]
    conn.close()
    return logs

# ================= NOTIFICATIONS =================
@router.get("/notifications")
def get_notifications(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", (current_user.id,))
    notifs = [dict(n) for n in cursor.fetchall()]
    conn.close()
    return notifs

# ================= GEOLOCATION =================
@router.get("/geo/districts")
def get_districts():
    return TN_DISTRICTS

@router.get("/geo/municipalities")
def get_municipalities():
    return [
        {
            "name": m[0],
            "district": m[1],
            "lat": m[2],
            "lng": m[3],
            "zone": m[4],
            "ward": m[5],
            "area": m[6]
        }
        for m in MUNICIPALITIES
    ]
