import os
from dotenv import load_dotenv

# Încărcăm variabilele din fișierul .env local (dacă există)
load_dotenv()

# Definim calea de bază a proiectului (folderul backend)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Configurația de bază comună pentru toate mediile."""
    # Cheia secretă (folosită pentru JWT/sesiuni pe viitor)
    SECRET_KEY = os.getenv("SECRET_KEY", "o-cheie-secreta-default-pentru-dev")
    # Cheia Groq AI
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class DevConfig(Config):
    """Configurația pentru Dezvoltare (PC-ul tău)."""
    DEBUG = True
    # Folosim o bază de date SQLite locală (se va crea fișierul dev.db în folderul backend)
    DATABASE_URL = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')

class ProdConfig(Config):
    """Configurația pentru Producție (Render / Vercel)."""
    DEBUG = False
    # Luăm URL-ul bazei de date Neon din variabilele de mediu
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    def __init__(self):
        # Validare de siguranță: aplicația nu pornește în producție fără baza de date!
        if not self.DATABASE_URL:
            raise ValueError("Lipsește DATABASE_URL din variabilele de mediu (Neon)!")
        if not self.GROQ_API_KEY:
            raise ValueError("Lipsește GROQ_API_KEY pentru producție!")

# --- LOGICA DE SELECȚIE A MEDIULUI ---
def get_settings():
    # Căutăm o variabilă numită 'ENV'. Dacă nu există, presupunem că suntem pe 'dev'
    env_state = os.getenv("ENV", "dev").lower()
    
    if env_state == "prod" or env_state == "production":
        return ProdConfig()
    return DevConfig()

# Instanțiem configurația activă pe care o vom importa în restul aplicației
settings = get_settings()