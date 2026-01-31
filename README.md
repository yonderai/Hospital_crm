# Hospital CRM / Medicare System

A comprehensive Full-Stack Hospital Customer Relationship Management (CRM) system built for the final year project. This application manages patient registrations, appointments, billing, insurance, and role-based access for hospital staff (Doctors, Front Desk, Admin, etc.).

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless) / Node.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, Lucide React Icons

## 🛠 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Atlas URI or Local instance)

## 📦 Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Hospital_crm.git
   cd Hospital_crm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory.
   - Copy the contents from `.env.example` and fill in your secrets.
   ```env
   MONGODB_URI="your-mongodb-connection-string"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔑 Key Features

- **Patient Portal**: Self-registration, Insurance dashboard, Appointment booking.
- **Role-Based Access**: Specialized dashboards for Admin, Doctor, Nurse, Front Desk, and Finance.
- **Appointment Management**: Booking, rescheduling, and queue management.
- **Billing & Insurance**: Split billing (Insurance vs Patient), Invoice generation.
- **Medical Records**: EMR integration for patient history.

## 📂 Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Database models (`models/`), utilities (`utils/`), and auth configuration.
- `public`: Static assets.

## 🤝 Contribution

This is a final year academic project.
