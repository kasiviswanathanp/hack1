"""
CivicAI Notification and Audit Logging Services
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from ..database import get_db_connection

class NotificationService:
    @staticmethod
    def send_notification(user_id: str, complaint_id: Optional[str], notif_type: str, title: str, message: str, action_url: Optional[str] = None):
        conn = get_db_connection()
        cursor = conn.cursor()
        notif_id = f"notif-{uuid.uuid4().hex[:10]}"
        now = datetime.now(timezone.utc).isoformat()
        
        cursor.execute("""
            INSERT INTO notifications (id, user_id, complaint_id, type, title, message, read, action_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
        """, (notif_id, user_id, complaint_id, notif_type, title, message, action_url, now))
        
        conn.commit()
        conn.close()

class AuditService:
    @staticmethod
    def log_action(actor_id: str, actor_name: str, actor_role: str, action: str, resource_type: str, resource_id: str, details: Optional[str] = None, ip_address: Optional[str] = "127.0.0.1"):
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

notification_service = NotificationService()
audit_service = AuditService()
