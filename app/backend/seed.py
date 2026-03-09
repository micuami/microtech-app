from models import SessionLocal, Ticket, Base, engine

def seed_db():
    # Asigurăm-ne că tabelele sunt create
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Verificăm dacă avem deja date ca să nu le duplicăm la rulări multiple
    if db.query(Ticket).first():
        print("Baza de date are deja tichete în ea. Nu s-a adăugat nimic.")
        db.close()
        return

    print("Adaug tichetele de test în baza de date...")
    
    test_tickets = [
        Ticket(ticket_id="MT-8492", name="Popescu Andrei", device="Laptop Lenovo", issue="Ecran negru", date="2024-03-15", status="Pending", phone="0722123456"),
        Ticket(ticket_id="MT-1120", name="Maria Ionescu", device="PC Desktop", issue="Zgomot ventilatoare", date="2024-03-14", status="In Progress", phone="0733987654"),
        Ticket(ticket_id="MT-3391", name="Firma Contab", device="Imprimanta Brother", issue="Toner", date="2024-03-13", status="Completed", phone="0744555666"),
        Ticket(ticket_id="MT-4002", name="Alexandru D.", device="PS5", issue="Supraîncălzire", date="2024-03-16", status="Pending", phone="0755111222")
    ]

    db.add_all(test_tickets)
    db.commit()
    db.close()
    
    print("✅ Tichetele au fost adăugate cu succes!")

if __name__ == "__main__":
    seed_db()