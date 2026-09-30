"""
CivicAI Shared Backend - SQLite Database Schema & Initialization
Supports all 20+ tables specified in requirements.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "civicai.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL,
        organization_id TEXT,
        district_id TEXT,
        zone_id TEXT,
        ward_id TEXT,
        department_id TEXT,
        badge_number TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 2. Roles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        level INTEGER NOT NULL
    );
    """)

    # 3. Permissions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        description TEXT
    );
    """)

    # 4. User Roles mapping
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_roles (
        user_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );
    """)

    # 5. Departments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        default_sla_hours INTEGER DEFAULT 24,
        head_officer_id TEXT
    );
    """)

    # 6. Districts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS districts (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        state TEXT DEFAULT 'Tamil Nadu',
        headquarters TEXT
    );
    """)

    # 7. Zones
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS zones (
        id TEXT PRIMARY KEY,
        district_id TEXT NOT NULL,
        municipality TEXT NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        zonal_officer_id TEXT,
        FOREIGN KEY (district_id) REFERENCES districts(id)
    );
    """)

    # 8. Wards
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wards (
        id TEXT PRIMARY KEY,
        zone_id TEXT NOT NULL,
        ward_number TEXT NOT NULL,
        name TEXT NOT NULL,
        area_officer_id TEXT,
        FOREIGN KEY (zone_id) REFERENCES zones(id)
    );
    """)

    # 9. Areas / Localities
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS areas (
        id TEXT PRIMARY KEY,
        ward_id TEXT NOT NULL,
        name TEXT NOT NULL,
        pincode TEXT,
        latitude REAL,
        longitude REAL,
        FOREIGN KEY (ward_id) REFERENCES wards(id)
    );
    """)

    # 10. Field Teams
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS field_teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department_id TEXT NOT NULL,
        ward_id TEXT,
        leader_name TEXT,
        contact_number TEXT,
        status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, BUSY, OFF_DUTY
        active_task_count INTEGER DEFAULT 0,
        FOREIGN KEY (department_id) REFERENCES departments(id)
    );
    """)

    # 11. Complaint Categories
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaint_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department_id TEXT NOT NULL,
        default_priority TEXT DEFAULT 'HIGH',
        default_sla_hours INTEGER DEFAULT 24,
        FOREIGN KEY (department_id) REFERENCES departments(id)
    );
    """)

    # 12. Complaints
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        citizen_phone TEXT,
        category TEXT NOT NULL,
        title TEXT,
        description TEXT NOT NULL,
        landmark TEXT,
        image_url TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        readable_address TEXT NOT NULL,
        area TEXT NOT NULL,
        ward TEXT NOT NULL,
        zone TEXT NOT NULL,
        district TEXT NOT NULL,
        municipality TEXT NOT NULL,
        priority TEXT DEFAULT 'HIGH', -- CRITICAL, HIGH, MEDIUM, LOW
        severity TEXT DEFAULT 'HIGH',
        priority_score INTEGER DEFAULT 80,
        status TEXT DEFAULT 'SUBMITTED', 
        -- SUBMITTED, AI_ANALYSIS, VERIFIED, ASSIGNED, IN_PROGRESS, FIELD_VISIT, RESOLUTION_SUBMITTED, OFFICER_VERIFICATION, RESOLVED, REJECTED, ESCALATED, REOPENED
        escalation_level INTEGER DEFAULT 1, -- 0=Citizen, 1=Area Officer, 2=Dept Officer, 3=Supervisor, 4=District Manager
        escalation_reason TEXT,
        department_id TEXT,
        department_name TEXT,
        assigned_officer_id TEXT,
        assigned_officer_name TEXT,
        assigned_team_id TEXT,
        assigned_team_name TEXT,
        response_deadline TEXT NOT NULL,
        resolution_deadline TEXT NOT NULL,
        resolved_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (citizen_id) REFERENCES users(id)
    );
    """)

    # 13. AI Predictions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_predictions (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        model_name TEXT NOT NULL,
        predicted_category TEXT NOT NULL,
        confidence REAL NOT NULL,
        suggested_priority TEXT NOT NULL,
        detected_description TEXT,
        suggested_department TEXT,
        human_verified INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    );
    """)

    # 14. Complaint Status History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaint_status_history (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        status TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        notes TEXT,
        escalation_level INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    );
    """)

    # 15. Resolution Proofs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resolution_proofs (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        field_team_id TEXT,
        field_team_name TEXT,
        before_image_url TEXT,
        after_image_url TEXT NOT NULL,
        notes TEXT,
        latitude REAL,
        longitude REAL,
        upload_timestamp TEXT NOT NULL,
        verified_by TEXT,
        verified_at TEXT,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    );
    """)

    # 16. SLA Rules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sla_rules (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        response_time_hours INTEGER NOT NULL,
        resolution_time_hours INTEGER NOT NULL,
        escalation_target_role TEXT NOT NULL
    );
    """)

    # 17. Routing Rules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS routing_rules (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        department_id TEXT NOT NULL,
        auto_assign_officer_role TEXT DEFAULT 'AREA_OFFICER',
        created_at TEXT NOT NULL
    );
    """)

    # 18. Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        complaint_id TEXT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        action_url TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 19. Ratings & Feedback
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ratings (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        citizen_id TEXT NOT NULL,
        rating INTEGER NOT NULL, -- 1 to 5
        feedback TEXT,
        reopen_requested INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id)
    );
    """)

    # 20. Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        timestamp TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()
    print("Database schema successfully initialized.")

if __name__ == "__main__":
    init_db()
