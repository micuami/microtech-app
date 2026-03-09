from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from config import settings

connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Tabelul pentru Utilizatori (Clienți)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String) # Aici salvăm parola criptată
    name = Column(String)
    
    # Relația: Un utilizator are o listă de tichete
    tickets = relationship("Ticket", back_populates="owner")

# Tabelul pentru Tichete
class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    name = Column(String)
    device = Column(String)
    issue = Column(String)
    date = Column(String)
    status = Column(String, default="Pending")
    phone = Column(String)
    
    # Legătura către ID-ul utilizatorului (poate fi gol dacă cineva face programare fără cont)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="tickets")