"""
CivicAI SLA Engine
Calculates deadlines, evaluates breach status, and manages automatic role escalations.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Tuple

# Default SLA Matrix (in hours)
SLA_MATRIX = {
    # Priority: (Response Hours, Resolution Hours)
    "CRITICAL": (2, 24),
    "HIGH": (6, 48),
    "MEDIUM": (24, 72),
    "LOW": (72, 120)
}

CATEGORY_SLA_MODIFIERS = {
    "Water": -2, # Faster response for drinking water
    "Flooding": -4,
    "Electric Infrastructure": -3,
}

class SLAService:
    @staticmethod
    def calculate_deadlines(category: str, priority: str) -> Tuple[str, str]:
        """
        Returns (response_deadline_iso, resolution_deadline_iso)
        """
        now = datetime.now(timezone.utc)
        base_resp, base_res = SLA_MATRIX.get(priority.upper(), (24, 72))
        
        # Apply category modifier if applicable
        modifier = CATEGORY_SLA_MODIFIERS.get(category, 0)
        resp_hours = max(1, base_resp + modifier)
        res_hours = max(6, base_res + modifier * 2)

        resp_deadline = now + timedelta(hours=resp_hours)
        res_deadline = now + timedelta(hours=res_hours)

        return resp_deadline.isoformat(), res_deadline.isoformat()

    @staticmethod
    def evaluate_sla_status(response_deadline_iso: str, resolution_deadline_iso: str, status: str) -> Dict[str, any]:
        """
        Evaluates remaining hours and breach status
        """
        now = datetime.now(timezone.utc)
        
        try:
            resp_dt = datetime.fromisoformat(response_deadline_iso.replace('Z', '+00:00'))
            res_dt = datetime.fromisoformat(resolution_deadline_iso.replace('Z', '+00:00'))
        except Exception:
            return {"is_breached": False, "remaining_seconds": 3600, "label": "On Track"}

        is_resolved = status in ["RESOLVED", "REJECTED"]
        
        if is_resolved:
            return {"is_breached": False, "remaining_seconds": 0, "label": "Resolved within SLA"}

        # If not yet assigned/in-progress, check response deadline
        if status in ["SUBMITTED", "AI_ANALYSIS"]:
            time_left = (resp_dt - now).total_seconds()
            if time_left < 0:
                return {"is_breached": True, "remaining_seconds": int(time_left), "label": "Response SLA Breached!"}
            else:
                hours = int(time_left // 3600)
                mins = int((time_left % 3600) // 60)
                return {"is_breached": False, "remaining_seconds": int(time_left), "label": f"{hours:02d}h {mins:02d}m remaining"}

        # If in progress, check resolution deadline
        time_left = (res_dt - now).total_seconds()
        if time_left < 0:
            return {"is_breached": True, "remaining_seconds": int(time_left), "label": "Resolution SLA Breached!"}
        
        hours = int(time_left // 3600)
        mins = int((time_left % 3600) // 60)
        return {"is_breached": False, "remaining_seconds": int(time_left), "label": f"{hours:02d}h {mins:02d}m remaining"}

sla_service = SLAService()
