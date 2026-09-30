"""
CivicAI Shared Backend - FastAPI Server
Shared backend for all 7 role-based portals on http://localhost:8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import init_db
from app.seed_data import seed_database
from app.api.auth_routes import router as auth_router
from app.api.complaint_routes import router as complaint_router
from app.api.portal_routes import router as portal_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB and seeds are ready
    print("Initializing CivicAI Shared Database...")
    seed_database()
    yield
    print("CivicAI Shared Backend shutting down.")

app = FastAPI(
    title="CivicAI Shared Platform API",
    description="Unified backend REST API powering Citizen, Officer, Supervisor, Manager, Field Team, and Admin portals.",
    version="2026.1.0",
    lifespan=lifespan
)

# Enable CORS for all 7 separate portal ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # Citizen Portal
        "http://localhost:3001", # Area Officer (Level 1)
        "http://localhost:3002", # Department Officer (Level 2)
        "http://localhost:3003", # Zonal Supervisor (Level 3)
        "http://localhost:3004", # District Manager
        "http://localhost:3005", # Field Team
        "http://localhost:3006", # System Admin
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
        "http://127.0.0.1:3006",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(complaint_router)
app.include_router(portal_router)

@app.get("/")
def root():
    return {
        "platform": "CivicAI Smart Civic Management Platform",
        "status": "ONLINE",
        "portals": {
            "citizen": "http://localhost:3000",
            "area_officer_l1": "http://localhost:3001",
            "dept_officer_l2": "http://localhost:3002",
            "zonal_supervisor_l3": "http://localhost:3003",
            "district_manager": "http://localhost:3004",
            "field_team": "http://localhost:3005",
            "system_admin": "http://localhost:3006",
        },
        "docs": "http://localhost:8000/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
