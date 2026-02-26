import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Configurare CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# --- Modele de Date ---
class Message(BaseModel):
    role: str  # "user" sau "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message] # Primim tot istoricul conversației

class AnalysisResponse(BaseModel):
    status: str       # "question" (dacă mai vrea detalii) SAU "solution" (dacă știe rezolvarea)
    content: str      # Textul întrebării sau pașii soluției
    confidence: int   # Cât de sigur e AI-ul (0-100)
    thought_process: Optional[str] = None # (Opțional) Să vedem cum gândește

# ==========================================
# MODELE PENTRU ADMIN DASHBOARD & LOGIN
# ==========================================

class AdminLoginRequest(BaseModel):
    password: str

class TicketUpdateStatus(BaseModel):
    status: str

# Bază de date "falsă" în memorie (până vei adăuga un DB real precum SQLite/PostgreSQL)
TICKETS_DB = [
  { "id": 'MT-8492', "name": 'Popescu Andrei', "device": 'Laptop Lenovo', "issue": 'Ecran negru', "date": '2024-03-15', "status": 'Pending', "phone": '0722123456' },
  { "id": 'MT-1120', "name": 'Maria Ionescu', "device": 'PC Desktop', "issue": 'Zgomot ventilatoare', "date": '2024-03-14', "status": 'In Progress', "phone": '0733987654' },
  { "id": 'MT-3391', "name": 'Firma Contab', "device": 'Imprimanta Brother', "issue": 'Toner', "date": '2024-03-13', "status": 'Completed', "phone": '0744555666' }
]

# ==========================================
# ENDPOINT-URI ADMIN
# ==========================================

# 1. Endpoint pentru Login
@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    # În producție, parola ar trebui luată din .env: os.getenv("ADMIN_PASSWORD")
    if req.password == "admin123":
        # Returnăm un "token" simplu de acces pentru a demonstra conceptul
        return {"success": True, "token": "microtech-admin-token-777"}
    
    raise HTTPException(status_code=401, detail="Parolă incorectă")

# 2. Endpoint pentru a aduce toate tichetele
@app.get("/api/tickets")
def get_all_tickets():
    return {"tickets": TICKETS_DB}

# 3. Endpoint pentru a schimba statusul unui tichet
@app.patch("/api/tickets/{ticket_id}/status")
def update_ticket_status(ticket_id: str, req: TicketUpdateStatus):
    for ticket in TICKETS_DB:
        if ticket["id"] == ticket_id:
            ticket["status"] = req.status
            return {"success": True, "ticket": ticket}
    raise HTTPException(status_code=404, detail="Tichetul nu a fost găsit")

# 4. Endpoint pentru a șterge un tichet
@app.delete("/api/tickets/{ticket_id}")
def delete_ticket(ticket_id: str):
    global TICKETS_DB
    initial_length = len(TICKETS_DB)
    TICKETS_DB = [t for t in TICKETS_DB if t["id"] != ticket_id]
    
    if len(TICKETS_DB) < initial_length:
        return {"success": True, "message": "Tichet șters"}
    
    raise HTTPException(status_code=404, detail="Tichetul nu a fost găsit")

# --- LOGICA AI ---
def get_it_diagnosis(messages):
    # System Prompt-ul este cheia. Îl instruim să fie detectiv.
    system_prompt = """
    You are an expert Senior IT Support Technician. Your goal is to diagnose and solve PC hardware/software issues.
    
    RULES:
    1. Analyze the user's problem.
    2. If the description is vague (e.g., "My PC is slow"), DO NOT guess. Ask clarifying questions (e.g., "Windows or Mac?", "When did it start?", "Any blue screens?").
    3. Ask ONE question at a time to not overwhelm the user.
    4. ONLY provide a solution when you are >85% confident you know the root cause.
    5. Output must be valid JSON.
    
    JSON FORMAT:
    {
        "status": "question" | "solution",
        "content": "The text to show the user (question or solution steps)",
        "confidence": 0-100,
        "thought_process": "Brief reasoning here"
    }
    """

    # Pregătim mesajele pentru Groq
    api_messages = [{"role": "system", "content": system_prompt}]
    
    # Adăugăm istoricul conversației
    for msg in messages:
        api_messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Model rapid și deștept
            messages=api_messages,
            response_format={"type": "json_object"},
            temperature=0.3 # Vrem precizie, nu creativitate
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Error: {e}")
        return {
            "status": "solution", 
            "content": "Eroare la procesarea AI. Te rog încearcă din nou.", 
            "confidence": 0
        }

# --- ENDPOINT ---
@app.post("/diagnose", response_model=AnalysisResponse)
def diagnose_issue(request: ChatRequest):
    ai_response = get_it_diagnosis(request.messages)
    return ai_response