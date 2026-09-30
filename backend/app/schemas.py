"""
CivicAI Pydantic Request & Response Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "CITIZEN"
    district_id: Optional[str] = None
    ward_id: Optional[str] = None
    department_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ComplaintCreate(BaseModel):
    category: str
    description: str
    title: Optional[str] = None
    landmark: Optional[str] = None
    image_url: Optional[str] = None
    latitude: float
    longitude: float
    readable_address: str
    area: str
    ward: str
    zone: str
    district: str
    municipality: str
    priority: Optional[str] = "HIGH"
    severity: Optional[str] = "HIGH"

class StatusUpdateRequest(BaseModel):
    status: str
    notes: Optional[str] = None
    assigned_officer_id: Optional[str] = None
    assigned_officer_name: Optional[str] = None

class AssignTeamRequest(BaseModel):
    team_id: str
    team_name: str
    instructions: Optional[str] = None

class EscalateRequest(BaseModel):
    reason: str
    target_level: Optional[int] = 2

class ResolutionProofCreate(BaseModel):
    complaint_id: str
    after_image_url: str
    before_image_url: Optional[str] = None
    notes: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class RatingCreate(BaseModel):
    complaint_id: str
    rating: int = Field(ge=1, le=5)
    feedback: Optional[str] = None
    reopen: Optional[bool] = False

class AIAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    text_hint: Optional[str] = None
    area_hint: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    category: str
    severity: str
    confidence: float
    detected_description: str
    suggested_department: str
    suggested_priority: str
    tags: List[str]
    is_duplicate: bool = False
    duplicate_of_id: Optional[str] = None
