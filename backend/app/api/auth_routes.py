"""
CivicAI Auth API Endpoints
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from ..database import get_db_connection
from ..auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user, TokenUser
from ..schemas import UserLogin, UserRegister, TokenResponse
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND is_active = 1", (creds.email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(creds.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_dict = dict(user)
    user_dict.pop("password_hash", None)

    token_data = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["full_name"],
        "role": user["role"],
        "district_id": user["district_id"],
        "zone_id": user["zone_id"],
        "ward_id": user["ward_id"],
        "department_id": user["department_id"],
        "organization_id": user["organization_id"]
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token({"sub": user["id"]})

    audit_service.log_action(
        actor_id=user["id"],
        actor_name=user["full_name"],
        actor_role=user["role"],
        action="USER_LOGIN",
        resource_type="USER",
        resource_id=user["id"],
        details=f"User logged in with role {user['role']}"
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_dict
    )

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (data.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    user_id = f"user-{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc).isoformat()
    pw_hash = hash_password(data.password)

    cursor.execute("""
        INSERT INTO users (id, email, password_hash, full_name, phone, role, district_id, ward_id, department_id, organization_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'org-civicai-tn', 1, ?, ?)
    """, (user_id, data.email, pw_hash, data.full_name, data.phone, data.role, data.district_id, data.ward_id, data.department_id, now, now))
    
    conn.commit()
    conn.close()

    user_dict = {
        "id": user_id,
        "email": data.email,
        "full_name": data.full_name,
        "phone": data.phone,
        "role": data.role,
        "district_id": data.district_id,
        "ward_id": data.ward_id,
        "department_id": data.department_id,
        "organization_id": "org-civicai-tn"
    }

    access_token = create_access_token({"sub": user_id, "email": data.email, "name": data.full_name, "role": data.role})
    refresh_token = create_refresh_token({"sub": user_id})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_dict
    )

@router.get("/me")
def get_profile(current_user: TokenUser = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, phone, role, district_id, zone_id, ward_id, department_id, badge_number FROM users WHERE id = ?", (current_user.id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return dict(user)
