# Restore the correct main.py content from previously defined backend logic

main_py_code = """
from fastapi import FastAPI, UploadFile, Form, File, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional
from uuid import uuid4
from datetime import datetime
import os
import requests
import fitz  # PyMuPDF
import docx
import openai
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_embedding(text: str) -> Optional[str]:
    try:
        response = openai.Embedding.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return json.dumps(response["data"][0]["embedding"])
    except Exception as e:
        print("Embedding error:", e)
        return None

DATABASE_URL = "sqlite:///./resources.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Resource(Base):
    __tablename__ = "resources"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    type = Column(String)
    notes = Column(Text)
    tags = Column(Text)
    text_content = Column(Text)
    embedding = Column(Text)
    created_at = Column(DateTime)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def extract_text_from_pdf(filepath):
    doc = fitz.open(filepath)
    return "\\n".join([page.get_text() for page in doc])

def extract_text_from_docx(filepath):
    document = docx.Document(filepath)
    return "\\n".join([para.text for para in document.paragraphs])

def get_youtube_transcript(video_url):
    video_id = video_url.split("v=")[-1].split("&")[0]
    response = requests.get(f"https://yt.lemnoslife.com/videos?part=transcript&id={video_id}")
    if response.status_code == 200 and 'items' in response.json():
        segments = response.json()['items'][0].get('transcript', {}).get('segments', [])
        return " ".join([s['text'] for s in segments])
    return ""

@app.post("/api/upload")
async def upload_resource(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    notes: str = Form(""),
    tags: str = Form(""),
    db: Session = Depends(get_db)
):
    title = file.filename if file else url.split("/")[-1] if url else "Untitled"
    resource_id = str(uuid4())
    ext = title.split(".")[-1].lower()
    resource_type = "pdf" if ext == "pdf" else "docx" if ext == "docx" else "video" if "youtube.com" in url else "web"
    text_content = ""

    if file:
        os.makedirs("uploads", exist_ok=True)
        path = os.path.join("uploads", file.filename)
        with open(path, "wb") as out_file:
            file_data = await file.read()
            out_file.write(file_data)
        if ext == "pdf":
            text_content = extract_text_from_pdf(path)
        elif ext == "docx":
            text_content = extract_text_from_docx(path)

    if url and "youtube.com" in url:
        text_content = get_youtube_transcript(url)

    full_text = f"{title}\\n{notes}\\n{text_content}"
    embedding = get_embedding(full_text)

    resource = Resource(
        id=resource_id,
        title=title,
        type=resource_type,
        notes=notes,
        tags=tags,
        text_content=text_content,
        embedding=embedding,
        created_at=datetime.utcnow()
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return {"success": True, "id": resource_id}

@app.get("/api/resources")
async def list_resources(query: str = "", db: Session = Depends(get_db)):
    resources = db.query(Resource).all()
    filtered = [
        {
            "id": r.id,
            "title": r.title,
            "type": r.type,
            "notes": r.notes,
            "tags": r.tags.split(",") if r.tags else [],
            "created_at": r.created_at
        }
        for r in resources
        if query.lower() in (r.title or '').lower()
        or query.lower() in (r.notes or '').lower()
        or query.lower() in (r.text_content or '').lower()
    ]
    return JSONResponse(content=filtered)

@app.put("/api/resources/{resource_id}")
async def update_resource(resource_id: str, notes: str = Form(""), tags: str = Form(""), db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.notes = notes
    resource.tags = tags
    db.commit()
    db.refresh(resource)
    return {"success": True, "updated": resource_id}

@app.delete("/api/resources/{resource_id}")
async def delete_resource(resource_id: str, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return {"success": True, "deleted": resource_id}
"""

# Save to file
main_py_path = "/mnt/data/info-repo/backend/main.py"
with open(main_py_path, "w") as f:
    f.write(main_py_code)

main_py_path
