from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

app = FastAPI()

#cors

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://dujejuric-web2-projekt2.onrender.com"
    "https://dujejuric-web2-projekt2.onrender.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


    

models.Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    email: str
    password: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


#POST, create a new user
@app.post("/createUser")
def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#POST, get a user by email and password
@app.post("/getUserVulnerable")
def get_user(user: UserBase, db: db_dependency):
    query = text("SELECT * FROM users WHERE email = '" + user.email + "' AND password = '" + user.password + "' LIMIT 1")
    
    db_user = db.execute(query).fetchone()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    column_names = ["id", "email", "password"]
    
    # Create a dictionary from the tuple and the column names
    user_data = {column_names[i]: value for i, value in enumerate(db_user)}
    return user_data

#POST, get a user by email and password
@app.post("/getUserSecure")
def get_user(user: UserBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.email == user.email, models.User.password == user.password).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


#POST, get a user by email and password
@app.post("/getUserBruteForceExample")
def get_user(user: UserBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.email == user.email, models.User.password == user.password).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user





