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

### 🛠 Maintenance Support (New)
*   **Work Order Management:** Report, Prioritize, and Resolve facility issues.
*   **Approval Workflow:** Finance team approves/rejects high-cost maintenance requests.
*   **Overview Dashboard:** Real-time stats on facility health and pending repairs.

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
*(Note: You will need to provide your own MongoDB connection string in the `.env` file)*

### 4. Seed the Database
Populate the database with test users, roles, and demo data:
```bash
npm run seed
```
This will create users for all roles (Admin, Doctor, Finance, Maintenance, etc.) and generate sample data including Patients and Maintenance Tickets.

### 5. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Test Accounts

**Password for ALL accounts:** `a`

| Role | Email | Portal Feature |
|------|-------|----------------|
| **Admin** | `admin@medicore.com` | Master Control |
| **Doctor** | `doctor@medicore.com` | Clinical Dashboard |
| **Nurse** | `nurse@medicore.com` | Patient Care |
| **Emergency** | `emergency@medicore.com` | ER & Ambulance |
| **Finance** | `finance@medicore.com` | Approvals & Assets |
| **Maintenance** | `maintenance@medicore.com` | Work Orders & Repairs |
| **Front Desk** | `frontdesk@medicore.com` | Registration |
| **Pharmacist** | `pharmacy@medicore.com` | Inventory |
| **HR** | `hr@medicore.com` | Staffing |
| **Billing** | `billing@medicore.com` | Invoices |

| **Patient** | `patient@medicore.com` | Medical Records |
