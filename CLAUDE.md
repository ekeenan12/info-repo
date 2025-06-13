# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing a personal knowledge repository application with:
- **Frontend**: Next.js + TypeScript + Tailwind CSS (in `/frontend/`)
- **Backend**: FastAPI + Python (in `/backend/`)
- **Deployment**: Frontend to Vercel, Backend to Railway

## Development Commands

### Frontend Development
```bash
# From root directory
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server

# Or from frontend/ directory
cd frontend && npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # Start FastAPI dev server
```

### Installation
```bash
npm install          # Installs frontend dependencies from root
cd backend && pip install -r requirements.txt
```

## Architecture

- **Frontend** (`/frontend/app/page.tsx`): Single-page React component handling file uploads, URL processing, search, and resource management
- **Backend** (`/backend/main.py`): Minimal FastAPI setup with health check endpoint
- **Database**: SQLite with SQLAlchemy ORM
- **File Processing**: Supports PDFs (PyMuPDF), DOCX (python-docx), and web content
- **AI Integration**: OpenAI API for content processing and search

## Environment Setup

Backend requires `.env` file with:
- `OPENAI_API_KEY`: For AI-powered content processing
- `DATABASE_URL`: SQLite database path (defaults to `sqlite:///./resources.db`)

Frontend uses `NEXT_PUBLIC_API_URL` for backend API endpoint.

## Deployment Configuration

- **Vercel**: Configured via `vercel.json` with Next.js framework detection
- **Railway**: Backend deployment via Railway platform
- **Monorepo Structure**: Root package.json provides convenience scripts for frontend operations