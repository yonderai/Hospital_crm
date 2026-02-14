# Hospital CRM

A full-stack Hospital CRM built with **Next.js 16 (App Router)** and **Flask (Python)**. This project includes management for Personnel, Attendance, Complaints, Inventory, and AI-driven Clinical Insights.

## 📁 Project Structure
- **/src**: Next.js Frontend & Core API (Port 3000)
- **/backend**: Flask AI Service (Port 5001) & Python Logic
- **/scripts**: Utility scripts for data maintenance and verification

## ⚙️ Prerequisites
- **Node.js**: v18+
- **Python**: v3.14+ (recommended)
- **MongoDB**: Running locally or a MongoDB Atlas URI

## 🚀 Getting Started

### 1. Project Initialization
```bash
git clone <repo-url>
cd Hospital_crm

# Setup environment variables
cp .env.example .env
```
> **IMPORTANT:** Update `.env` with your `MONGODB_URI` and `OPENROUTER_API_KEY`.

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies (Python)
pip install -r backend/requirements.txt
```

### 3. Database Seeding
Populate your database with demo staff, patients, and inventory:
```bash
npm run seed
```

### 4. Running the Application
You need to run both the AI backend and the Next.js frontend:

**Terminal 1 (AI Service):**
```bash
python backend/app.py
```

**Terminal 2 (Main App):**
```bash
npm run dev
```

## 🔐 Default Admin Credentials
Use these after seeding to explore the system:

| Role | Email | Password |
|------|-------|----------|
| **HR / Admin** | admin@medicore.com | a |
| **Doctor** | doctor@medicore.com | a |
| **Nurse** | nurse@medicore.com | a |
| **Patient** | patient@medicore.com | a |

## 🛠 Troubleshooting
- **Port Conflict**: If port 3000 or 5001 is taken, kill the process or update config in `.env`.
- **MongoDB Connection**: Ensure `MONGODB_URI` in `.env` is correct.
- **Auth Issues**: Use `127.0.0.1:3000` instead of `localhost` in your browser.

## 📜 License
This project is private and intended for internal use.
