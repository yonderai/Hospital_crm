# Hospital CRM

A full-stack Hospital CRM built with **Next.js 16 (App Router)** and **Flask (Python)**.

## Project Structure
- **/src**: Next.js Frontend & Core API (Port 3000)
- **/backend**: Flask AI Service (Port 5001) & Database Scripts
- **/public**: Static assets

## Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- MongoDB (running locally or cloud)

## 🚀 Getting Started

Follow these steps to set up the project from scratch.

### 1. Clone & Environment Setup
Clone the repo and create the environment file:
```bash
git clone <repo-url>
cd Hospital_crm

# Copy example env file
cp .env.example .env
```
> **Note:** Update `.env` with your `MONGODB_URI` and `OPENROUTER_API_KEY` (for AI features).

### 2. Install Dependencies

#### Frontend (Next.js)
```bash
npm install
```

#### Backend (Flask AI Service)
```bash
pip install -r backend/requirements.txt
```

#### Backend (Support Scripts)
```bash
cd backend
npm install
cd ..
```

### 3. Seed Database
Populate the database with initial data (Users, Patients, Inventory, etc.):
```bash
# Run from the root directory
node backend/src/utils/seeder.js
```

### 4. Run the Application

#### Start AI Service (Flask)
Open a new terminal:
```bash
python backend/app.py
```
*Runs on: [http://127.0.0.1:5001](http://127.0.0.1:5001)*

#### Start Main App (Next.js)
Open another terminal:
```bash
npm run dev
```
*Runs on: [http://localhost:3000](http://localhost:3000)*

## ✅ Verify Installation
1.  Open [http://localhost:3000/flask-test](http://localhost:3000/flask-test).
2.  You should see status **Green/Connected** for both Backend (Flask) and Database.
