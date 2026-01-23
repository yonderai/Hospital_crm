import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import frontdeskRoutes from './src/routes/frontdeskRoutes.js';
import nurseRoutes from './src/routes/nurseRoutes.js';
import revenueRoutes from './src/routes/revenueRoutes.js';
import financeRoutes from './src/routes/financeRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import hrRoutes from './src/routes/hrRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hospital CRM API is running...' });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/frontdesk', frontdeskRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/hr', hrRoutes);

export default app;
