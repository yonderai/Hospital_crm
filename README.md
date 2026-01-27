# 🏥 Hospital Management System - Emergency & Finance Portals

A comprehensive Hospital Management System featuring specialized portals for **Emergency Room Operations**, **Finance Management**, and **Administrator Controls**. Built with Next.js, MongoDB, and TailwindCSS.

## 🚀 Features

### 🚑 Emergency Portal
*   **Real-time Dashboard:** Track active cases, incoming ambulances, and waiting triage patients.
*   **Quick Registration:** "Trauma-X" rapid entry for unidentified critical patients.
*   **Triage System:** P1-P5 priority levels with vital sign tracking.
*   **Ambulance View:** Monitor ambulance fleet status (Available/Busy/Maintenance).

### 💰 Finance Portal
*   **Expense Management:** Track operating costs (Utilities, Maintenance, Payroll).
*   **Asset Management:** Registry of high-value medical equipment.
*   **Vendor & Procurement:** Manage suppliers and purchase orders.
*   **Audit Logs:** Full financial transparency and compliance tracking.

### 🔐 Multi-Role Access
*   **RBAC System:** Secure login for Doctors, Nurses, Admin, Finance Managers, and ER Staff.
*   **Middleware Protection:** Route guards ensure users only access authorized areas.

---

## 🛠️ Tech Stack
*   **Frontend:** Next.js 15 (App Router), TailwindCSS, Lucide Icons
*   **Backend:** Next.js server actions / API Routes
*   **Database:** MongoDB (with Mongoose ODM)
*   **Auth:** NextAuth.js (Credentials Provider)

---

## ⚙️ Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd hospital
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
*(Note: The provided `.env.example` contains the dev database connection string for quick start)*

### 4. Seed the Database
Populate the database with test users, roles, and demo data:
```bash
npm run seed
```
This will create:
*   **Admin:** `admin@hospital.com` / `password123`
*   **Emergency Manager:** `emergency@hospital.com` / `emergency123`
*   **Finance Manager:** `finance@hospital.com` / `password123`
*   **Doctor:** `doctor1@hospital.com` / `password123`
*   Plus sample Patients, Ambulances, and Emergency Cases.

### 5. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Test Accounts

**Password for ALL accounts:** `a`

| Role | Email |
|------|-------|
| **Admin** | `admin@medicore.com` |
| **Doctor** | `doctor@medicore.com` |
| **Nurse** | `nurse@medicore.com` |
| **Emergency** | `emergency@medicore.com` |
| **Finance** | `finance@medicore.com` |
| **HR** | `hr@medicore.com` |
| **Front Desk** | `frontdesk@medicore.com` |
| **Lab Tech** | `lab@medicore.com` |
| **Pharmacist** | `pharmacy@medicore.com` |
| **Billing** | `billing@medicore.com` |
| **Maintenance** | `maintenance@medicore.com` |
| **Back Office** | `backoffice@medicore.com` |
| **Patient** | `patient@medicore.com` |

