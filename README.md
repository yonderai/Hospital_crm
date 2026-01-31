# Hospital CRM System

A comprehensive Full-Stack Hospital Customer Relationship Management (CRM) system with role-based access control, patient management, medical records, and clinical workflows.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: NextAuth.js with Credentials Provider
- **Styling**: Tailwind CSS, Lucide React Icons
- **File Upload**: Multipart form handling with local storage

## 🛠 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Atlas cloud instance or local MongoDB server)
- npm or yarn package manager

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Hospital_crm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database Connection
MONGODB_URI="mongodb://127.0.0.1:27017/hospital-crm"
# Or use MongoDB Atlas:
# MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hospital-crm?retryWrites=true&w=majority"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-change-this-to-random-string"
NEXTAUTH_URL="http://127.0.0.1:3000"

# Optional
PORT=5001
NODE_ENV=development
```

> **Important**: Use `127.0.0.1` instead of `localhost` for `NEXTAUTH_URL` to prevent IPv6 resolution issues.

### 4. Seed the Database

Run the seed script to populate the database with demo users and data:
```bash
npm run seed
```

This will create:
- Demo users for all roles (doctor, nurse, admin, frontdesk, patient, etc.)
- Sample patients
- Sample appointments
- Sample lab results
- Sample inventory items

**Default Login Credentials:**
- **Doctor**: `doctor@medicore.com` / `a`
- **Patient**: `patient@medicore.com` / `a`
- **Admin**: `admin@medicore.com` / `a`
- **Nurse**: `nurse@medicore.com` / `a`
- **Front Desk**: `frontdesk@medicore.com` / `a`

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

## 🔑 Key Features

### Patient Portal
- Self-registration and profile management
- View medical history and uploaded documents
- View lab results and radiology reports
- Upload medical documents (prescriptions, reports, etc.)
- Download and print clinical reports

### Doctor Dashboard
- Patient management and clinical profiles
- View patient medical history
- Access lab results and imaging reports
- Appointment scheduling and management
- Real-time statistics and analytics

### Role-Based Access Control (RBAC)
- **Admin**: Full system access and user management
- **Doctor**: Patient care, prescriptions, medical records
- **Nurse**: Patient vitals, medication administration
- **Front Desk**: Patient registration, appointment booking
- **Lab Tech**: Lab orders and results management
- **Pharmacist**: Prescription fulfillment
- **Billing**: Invoice generation and payment processing

### Medical Records Management
- Electronic Medical Records (EMR)
- Document upload and preview (PDF, Images)
- Lab results tracking
- Radiology reports with findings and impressions
- Historical records timeline

### Additional Features
- Appointment booking with 30-minute slots
- Auto-cancellation for no-shows
- Real-time dashboard statistics
- Document preview modal (in-app PDF/image viewer)
- Responsive design for all devices

## 📂 Project Structure

```
Hospital_crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboards)/      # Role-based dashboards
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── lib/
│   │   ├── models/           # Mongoose schemas
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── mongoose.ts       # Database connection
│   └── middleware.ts         # Route protection
├── scripts/                   # Database seeding scripts
├── public/
│   └── uploads/              # User-uploaded files
├── .env.example              # Environment template
└── package.json
```

## 🗄️ Database Models

- **User**: System users with role-based permissions
- **Patient**: Patient demographics and medical information
- **Appointment**: Appointment scheduling and tracking
- **LabResult**: Laboratory test results
- **ImagingOrder**: Radiology orders and reports
- **MedicalDocument**: Patient-uploaded documents
- **InventoryItem**: Pharmacy and supply inventory

## 🧪 Testing & Verification

### Seed Additional Patient Data
To add clinical results for the demo patient:
```bash
npx ts-node scripts/seed_patient_data.ts
```

### Test Specific Features
The `scripts/` folder contains various testing utilities:
- `test_doctor_stats.js` - Verify doctor dashboard statistics
- `test_availability.js` - Test appointment availability logic
- `test_appointment_slots.js` - Validate slot booking

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure you update the following in your production environment:
- `MONGODB_URI` - Your production MongoDB connection string
- `NEXTAUTH_SECRET` - A strong, randomly generated secret
- `NEXTAUTH_URL` - Your production domain URL

## 🔒 Security Notes

- Never commit `.env` file to version control
- Change default passwords after initial setup
- Use strong `NEXTAUTH_SECRET` in production
- Implement rate limiting for API routes in production
- Validate and sanitize all user inputs
- Use HTTPS in production

## 🤝 Contributing

This is an academic project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is for educational purposes as part of a final year project.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas cluster is accessible
- Check your `MONGODB_URI` format
- Verify network access settings for MongoDB Atlas

### NextAuth Errors
- Ensure `NEXTAUTH_URL` uses `127.0.0.1` instead of `localhost`
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### File Upload Issues
- Ensure `public/uploads/` directory exists
- Check file permissions on the uploads directory
- Verify file size limits (default: 5MB)

## 📧 Support

For issues and questions, please open an issue on GitHub.
