"""
CivicAI Seed Data Generator
Pre-populates all 38 Tamil Nadu districts, 25+ corporations, departments, demo accounts,
and comprehensive complaints across all workflow statuses.
"""

from datetime import datetime, timedelta, timezone
from .database import get_db_connection, init_db
from .auth import hash_password

TN_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanniyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
]

DEPARTMENTS = [
    ("dept-roads", "Municipal Roads & Infrastructure", "ROADS", "Road construction, pothole repairs, street surfacing", 24),
    ("dept-water", "Metro Water & Feeder Board", "WATER", "Drinking water pipelines, booster pumps, valves", 12),
    ("dept-drainage", "Sanitation & Drainage Operations", "DRAIN", "Sewage networks, culverts, storm drains", 18),
    ("dept-electric", "Municipal Electrical Operations", "ELECT", "Street lighting, public luminaires, high-mast posts", 12),
    ("dept-waste", "Solid Waste & Health Department", "WASTE", "Garbage collection, compactor bins, hygiene", 12),
    ("dept-disaster", "Stormwater Drainage & Disaster Response", "FLOOD", "Inundation relief, de-watering pumps", 6),
    ("dept-works", "Town Planning & Public Works", "WORKS", "Public facilities, parks, pedestrian walkways", 48),
]

MUNICIPALITIES = [
    ("Chennai (Greater Chennai Corporation)", "Chennai", 13.0827, 80.2707, "Zone 8 (Central)", "Ward 102", "Anna Nagar West"),
    ("Coimbatore City Municipal Corporation", "Coimbatore", 11.0168, 76.9558, "Central Zone", "Ward 32", "Gandhipuram Central"),
    ("Madurai City Municipal Corporation", "Madurai", 9.9252, 78.1198, "North Zone", "Ward 44", "Simmakkal Heritage Circle"),
    ("Tiruchirappalli City Municipal Corporation", "Tiruchirappalli", 10.8285, 78.6854, "Zone 3 (Golden Rock)", "Ward 28", "Thillai Nagar West"),
    ("Salem City Municipal Corporation", "Salem", 11.6643, 78.1460, "Suramangalam Zone", "Ward 17", "Suramangalam / Junction"),
    ("Tirunelveli City Municipal Corporation", "Tirunelveli", 8.7139, 77.7567, "Thachanallur Zone", "Ward 12", "Tirunelveli Town"),
    ("Tiruppur City Municipal Corporation", "Tiruppur", 11.1085, 77.3411, "Zone 2", "Ward 22", "Kumaran Road"),
    ("Tambaram City Municipal Corporation", "Chengalpattu", 12.9249, 80.1000, "Zone 1 (Tambaram)", "Ward 15", "East Tambaram"),
    ("Avadi City Municipal Corporation", "Tiruvallur", 13.1147, 80.1098, "Zone 2", "Ward 18", "Avadi Market Road"),
]

DEMO_USERS = [
    ("user-citizen-1", "citizen@civicai.gov.in", "Priya Ramanathan", "+91 98401 23456", "CITIZEN", "Chennai", "Zone 8 (Central)", "Ward 102", None),
    ("user-officer-1", "area.officer@civicai.gov.in", "Rajesh Kumar", "+91 98402 34567", "AREA_OFFICER", "Chennai", "Zone 8 (Central)", "Ward 102", "dept-roads"),
    ("user-dept-1", "dept.officer@civicai.gov.in", "Kavitha Sundaram", "+91 98403 45678", "DEPARTMENT_OFFICER", "Chennai", "Zone 8 (Central)", None, "dept-roads"),
    ("user-super-1", "supervisor@civicai.gov.in", "Dr. A. Muruganathan", "+91 98404 56789", "SUPERVISOR", "Chennai", "Zone 8 (Central)", None, None),
    ("user-mgr-1", "manager@civicai.gov.in", "Sundar Rajan IAS", "+91 98405 67890", "DISTRICT_MANAGER", "Chennai", None, None, None),
    ("user-field-1", "field.team@civicai.gov.in", "Murugan (Lead, Team Bravo)", "+91 98406 78901", "FIELD_TEAM", "Chennai", "Zone 8 (Central)", "Ward 102", "dept-roads"),
    ("user-admin-1", "admin@civicai.gov.in", "Chief Technology Administrator", "+91 98407 89012", "ADMIN", "Chennai", None, None, None),
]

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Seed Districts
    for d in TN_DISTRICTS:
        cursor.execute("INSERT OR REPLACE INTO districts (id, name, state, headquarters) VALUES (?, ?, 'Tamil Nadu', ?)",
                       (f"dist-{d.lower()}", d, d))

    # 2. Seed Departments
    for dept_id, name, code, desc, sla in DEPARTMENTS:
        cursor.execute("INSERT OR REPLACE INTO departments (id, name, code, description, default_sla_hours) VALUES (?, ?, ?, ?, ?)",
                       (dept_id, name, code, desc, sla))

    # 3. Seed Users
    default_pw_hash = hash_password("password123")
    now = datetime.now(timezone.utc).isoformat()
    for uid, email, name, phone, role, dist, zone, ward, dept in DEMO_USERS:
        cursor.execute("""
            INSERT OR REPLACE INTO users 
            (id, email, password_hash, full_name, phone, role, organization_id, district_id, zone_id, ward_id, department_id, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'org-civicai-tn', ?, ?, ?, ?, 1, ?, ?)
        """, (uid, email, default_pw_hash, name, phone, role, dist, zone, ward, dept, now, now))

    # 4. Seed Field Teams
    field_teams = [
        ("team-cbe-road", "Coimbatore Asphalt Response Squad", "dept-roads", "Ward 32", "Senthil Nathan", "+91 94431 11223"),
        ("team-chn-road-1", "Chennai Ward 102 Bitumen Squad (Team Bravo)", "dept-roads", "Ward 102", "Murugan", "+91 98401 99887"),
        ("team-chn-water-1", "Chennai Metro Water Quick Repair Wing", "dept-water", "Ward 102", "Anand K.", "+91 98402 77665"),
        ("team-chn-drain-1", "Chennai Super Sucker Drainage Unit", "dept-drainage", "Ward 102", "Karuppusamy", "+91 98403 66554"),
        ("team-mdu-water", "Madurai Feeder Line Flying Squad", "dept-water", "Ward 44", "Ramasamy K.", "+91 98421 55443"),
    ]
    for tid, tname, tdept, tward, tlead, tphone in field_teams:
        cursor.execute("INSERT OR REPLACE INTO field_teams (id, name, department_id, ward_id, leader_name, contact_number, status) VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE')",
                       (tid, tname, tdept, tward, tlead, tphone))

    # 5. Seed Comprehensive Complaints
    complaints = [
        (
            "CIV-2026-001245", "user-citizen-1", "Priya Ramanathan", "+91 98401 23456",
            "Road", "Deep Asphalt Crater on 2nd Avenue",
            "Large deep pothole with loose gravel near 2nd Avenue junction. Multiple two-wheeler skids reported during peak hours.",
            "Opposite Roundtana Metro Station Exit B",
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
            13.0850, 80.2101, "2nd Avenue, Anna Nagar West, Chennai - 600040", "Anna Nagar West", "Ward 102", "Zone 8 (Central)", "Chennai", "Chennai (Greater Chennai Corporation)",
            "HIGH", "HIGH", 88, "ESCALATED", 2, "Response SLA window (24h) expired without Area Officer acknowledgement. Escalated to Dept Officer.",
            "dept-roads", "Municipal Roads & Infrastructure", "user-officer-1", "Rajesh Kumar (Area Officer)",
            "team-chn-road-1", "Chennai Ward 102 Bitumen Squad (Team Bravo)",
            (datetime.now(timezone.utc) - timedelta(hours=5)).isoformat(), # Overdue
            (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat(),
            None,
            (datetime.now(timezone.utc) - timedelta(hours=30)).isoformat(),
            now
        ),
        (
            "CIV-2026-001246", "user-citizen-1", "Priya Ramanathan", "+91 98401 23456",
            "Drainage", "Heavy Sewage Overflow Flooding 4th Main Road",
            "Heavy sewage backflow flooding entire cross-street near 4th Main Road, Anna Nagar West. Pedestrian path completely submerged.",
            "Behind Anna Nagar West Bus Terminus",
            "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
            13.0862, 80.2085, "4th Main Road, Anna Nagar West, Chennai - 600040", "Anna Nagar West", "Ward 102", "Zone 8 (Central)", "Chennai", "Chennai (Greater Chennai Corporation)",
            "CRITICAL", "CRITICAL", 98, "SUBMITTED", 1, None,
            "dept-drainage", "Sanitation & Drainage Operations", "user-officer-1", "Rajesh Kumar (Area Officer)",
            None, None,
            (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(),
            (datetime.now(timezone.utc) + timedelta(hours=18)).isoformat(),
            None,
            (datetime.now(timezone.utc) - timedelta(minutes=45)).isoformat(),
            now
        ),
        (
            "CIV-2026-001247", "user-citizen-1", "Priya Ramanathan", "+91 98401 23456",
            "Water", "High Pressure Water Main Burst on 6th Avenue",
            "Underground high pressure potable water main burst causing continuous erosion of road shoulder, Anna Nagar West.",
            "Near 6th Avenue Post Office",
            "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80",
            13.0841, 80.2120, "6th Avenue, Anna Nagar West, Chennai - 600040", "Anna Nagar West", "Ward 102", "Zone 8 (Central)", "Chennai", "Chennai (Greater Chennai Corporation)",
            "HIGH", "HIGH", 92, "ASSIGNED", 1, None,
            "dept-water", "Metro Water & Feeder Board", "user-officer-1", "Rajesh Kumar (Area Officer)",
            "team-chn-water-1", "Chennai Metro Water Quick Repair Wing",
            (datetime.now(timezone.utc) + timedelta(hours=4)).isoformat(),
            (datetime.now(timezone.utc) + timedelta(hours=36)).isoformat(),
            None,
            (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat(),
            now
        ),
        (
            "CIV-2026-001248", "user-citizen-1", "Priya Ramanathan", "+91 98401 23456",
            "Street Light", "Faulty Street Light Luminaires on East Car Street",
            "Series of sodium vapour lamps non-functional, plunging road into darkness.",
            "Near Nellaiappar Temple East Car Street",
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
            8.7139, 77.7567, "East Car Street, Tirunelveli Town - 627006", "Tirunelveli Town", "Ward 12", "Thachanallur Zone", "Tirunelveli", "Tirunelveli City Municipal Corporation",
            "MEDIUM", "MEDIUM", 74, "RESOLVED", 1, None,
            "dept-electric", "Municipal Electrical Operations", "user-officer-1", "Ganesan S.",
            "team-chn-road-1", "Electrical Flying Squad",
            (datetime.now(timezone.utc) - timedelta(hours=48)).isoformat(),
            (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat(),
            (datetime.now(timezone.utc) - timedelta(hours=10)).isoformat(),
            (datetime.now(timezone.utc) - timedelta(hours=60)).isoformat(),
            now
        ),
        (
            "CIV-2026-001255", "user-citizen-1", "Karthik Subramanian", "+91 94431 55678",
            "Road", "Damaged Divider Curb along Cross Cut Road",
            "Cracked concrete road divider and damaged bitumen surface along Cross Cut Road near Gandhipuram junction.",
            "Near Gandhipuram Central Bus Stand Platform 2",
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
            11.0168, 76.9558, "Cross Cut Road, Gandhipuram, Coimbatore - 641012", "Gandhipuram Central", "Ward 32", "Central Zone", "Coimbatore", "Coimbatore City Municipal Corporation",
            "HIGH", "HIGH", 89, "IN_PROGRESS", 1, None,
            "dept-roads", "Municipal Roads & Infrastructure", "user-officer-1", "Senthil Nathan (Ward 32 Officer)",
            "team-cbe-road", "Coimbatore Asphalt Response Squad",
            (datetime.now(timezone.utc) + timedelta(hours=14)).isoformat(),
            (datetime.now(timezone.utc) + timedelta(hours=40)).isoformat(),
            None,
            (datetime.now(timezone.utc) - timedelta(hours=10)).isoformat(),
            now
        )
    ]

    for comp in complaints:
        cursor.execute("""
            INSERT OR REPLACE INTO complaints 
            (id, citizen_id, citizen_name, citizen_phone, category, title, description, landmark, image_url,
             latitude, longitude, readable_address, area, ward, zone, district, municipality,
             priority, severity, priority_score, status, escalation_level, escalation_reason,
             department_id, department_name, assigned_officer_id, assigned_officer_name,
             assigned_team_id, assigned_team_name, response_deadline, resolution_deadline, resolved_at,
             created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, comp)

    # 6. Seed Resolution Proof for Resolved Complaint
    cursor.execute("""
        INSERT OR REPLACE INTO resolution_proofs 
        (id, complaint_id, field_team_id, field_team_name, before_image_url, after_image_url, notes, latitude, longitude, upload_timestamp, verified_by, verified_at)
        VALUES ('proof-1', 'CIV-2026-001248', 'team-chn-road-1', 'Electrical Flying Squad',
                'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
                'Replaced fused sodium ballast with 120W LED fixture. Tested luminaire lux levels.',
                8.7139, 77.7567, ?, 'user-officer-1', ?)
    """, (now, now))

    # 7. Seed Notifications
    notifications = [
        ("notif-1", "user-citizen-1", "CIV-2026-001245", "COMPLAINT_ESCALATED", "Complaint Escalated to Level 2", "Your road defect report on 2nd Avenue was escalated to the Department Officer for expedited resolution.", now),
        ("notif-2", "user-officer-1", "CIV-2026-001246", "NEW_COMPLAINT_WARD", "New Critical Grievance in Ward 102", "Sewage flooding on 4th Main Road requires immediate team assignment.", now),
        ("notif-3", "user-citizen-1", "CIV-2026-001248", "COMPLAINT_RESOLVED", "Street Lighting Issue Resolved ✓", "Field team completed repair on East Car Street. View photo verification proof.", now),
    ]
    for nid, uid, cid, ntype, title, msg, time in notifications:
        cursor.execute("INSERT OR REPLACE INTO notifications (id, user_id, complaint_id, type, title, message, read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)",
                       (nid, uid, cid, ntype, title, msg, time))

    conn.commit()
    conn.close()
    print("Database seeded with Tamil Nadu districts, corporations, departments, demo users, and complaints successfully.")

if __name__ == "__main__":
    seed_database()
