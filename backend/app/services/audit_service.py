"""
CivicAI Audit Logging Service
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from ..database import get_db_connection

class AuditService:
    @staticmethod
    def log_action(actor_id: str, actor_name: str, actor_role: str, action: str, resource_type: str, resource_id: str, details: Optional[str] = None, ip_address: Optional[str] = "127.0.0.1"):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            log_id = f"audit-{uuid.uuid4().hex[:10]}"
            now = datetime.now(timezone.utc).isoformat()

            cursor.execute("""
                INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, resource_type, resource_id, details, ip_address, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (log_id, actor_id, actor_name, actor_role, action, resource_type, resource_id, details, ip_address, now))
            
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Audit log error: {e}")

audit_service = AuditService()
