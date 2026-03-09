import os
import json
import random
import jwt # type: ignore
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Header # type: ignore
from pydantic import BaseModel
from groq import Groq # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from sqlalchemy.orm import Session
from passlib.context import CryptContext # type: ignore

from config import settings
from models import SessionLocal, engine, Base, Ticket, User

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microtech API", debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=settings.GROQ_API_KEY)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Funcții pentru Securitate / Token ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7) # Logat pentru 7 zile
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token lipsă")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: int = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Utilizator inexistent")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalid")

# --- Modele Pydantic ---
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class AnalysisResponse(BaseModel):
    status: str
    content: str
    confidence: int
    thought_process: Optional[str] = None

class AdminLoginRequest(BaseModel):
    password: str

class TicketUpdateStatus(BaseModel):
    status: str

class TicketCreateRequest(BaseModel):
    name: str
    phone: str
    device: str
    date: str
    issue: str
    
class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

# ==========================================
# ENDPOINT-URI UTILIZATORI (NOU)
# ==========================================

@app.post("/api/auth/register")
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # Verificăm dacă email-ul există deja
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email-ul este deja folosit")
    
    hashed_password = pwd_context.hash(req.password)
    new_user = User(name=req.name, email=req.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"user_id": new_user.id})
    return {"success": True, "token": token, "name": new_user.name}

@app.post("/api/auth/login")
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd_context.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email sau parolă greșite")
    
    token = create_access_token({"user_id": user.id})
    return {"success": True, "token": token, "name": user.name}

@app.get("/api/users/me/tickets")
def get_my_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Returnăm doar tichetele care aparțin acestui utilizator
    tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).order_by(Ticket.id.desc()).all()
    return {"tickets": tickets}

# ==========================================
# ENDPOINT-URI ADMIN & TICHETE
# ==========================================

@app.get("/")
def read_root():
    return {"message": "API is running!", "mode": "Dev" if settings.DEBUG else "Prod"}

@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    # Tragem parola din .env (sau folosim un default super lung doar ca să nu dea eroare dacă lipsește)
    correct_password = os.getenv("ADMIN_PASSWORD", "parola-default-lipsa-env-84920")
    
    if req.password.strip() == correct_password:
        return {"success": True, "token": "microtech-admin-token-777"}
    
    raise HTTPException(status_code=401, detail="Parolă incorectă")

@app.get("/api/tickets")
def get_all_tickets(db: Session = Depends(get_db)):
    db_tickets = db.query(Ticket).order_by(Ticket.id.desc()).all()
    tickets_list = [{"id": t.ticket_id, "name": t.name, "device": t.device, "issue": t.issue, "date": t.date, "status": t.status, "phone": t.phone} for t in db_tickets]
    return {"tickets": tickets_list}

@app.post("/api/tickets")
def create_ticket(req: TicketCreateRequest, db: Session = Depends(get_db), authorization: str = Header(None)):
    new_ticket_id = f"MT-{random.randint(1000, 9999)}"
    while db.query(Ticket).filter(Ticket.ticket_id == new_ticket_id).first():
        new_ticket_id = f"MT-{random.randint(1000, 9999)}"

    user_id = None
    # Dacă formularul trimite token (utilizatorul e logat), legăm tichetul de el!
    if authorization and authorization.startswith("Bearer "):
        try:
            token = authorization.split(" ")[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except:
            pass # Dacă e invalid, îl lăsăm Guest

    new_ticket = Ticket(
        ticket_id=new_ticket_id, name=req.name, phone=req.phone,
        device=req.device, date=req.date, issue=req.issue,
        status="Pending", user_id=user_id
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return {"success": True, "ticket_id": new_ticket.ticket_id}

@app.patch("/api/tickets/{ticket_id}/status")
def update_ticket_status(ticket_id: str, req: TicketUpdateStatus, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not db_ticket: raise HTTPException(status_code=404)
    db_ticket.status = req.status
    db.commit()
    return {"success": True}

@app.delete("/api/tickets/{ticket_id}")
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not db_ticket: raise HTTPException(status_code=404)
    db.delete(db_ticket)
    db.commit()
    return {"success": True}

# ==========================================
# LOGICA AI
# ==========================================
def get_it_diagnosis(messages):
    system_prompt = """
    You are an expert Senior IT Support Technician. Your goal is to diagnose and solve PC hardware/software issues.
    RULES: 1. Ask ONE clarifying question at a time. 2. Output valid JSON.
    JSON FORMAT: {"status": "question" | "solution", "content": "Text", "confidence": 0-100}
    """
    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in messages: api_messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", messages=api_messages, response_format={"type": "json_object"}, temperature=0.3
        )
        return json.loads(completion.choices[0].message.content)
    except:
        return {"status": "solution", "content": "Eroare la procesarea AI.", "confidence": 0}

@app.post("/diagnose", response_model=AnalysisResponse)
def diagnose_issue(request: ChatRequest):
    return get_it_diagnosis(request.messages)