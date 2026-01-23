-- Hospital ERP Expanded Schema (Normalized)

-- ==========================================
-- 1. MASTER DATA & CORE CLINICAL
-- ==========================================

CREATE TABLE Patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(50) UNIQUE NOT NULL, -- Medical Record Number
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20),
    contact_phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Encounters (
    encounter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    provider_id UUID, -- References Staff(staff_id)
    facility_id UUID, -- References FacilityLocation(location_id)
    encounter_type VARCHAR(50), -- Inpatient, Outpatient, Emergency, Telehealth
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(50), -- Planned, Arrived, In Progress, Finished, Cancelled
    chief_complaint TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ClinicalNotes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES Encounters(encounter_id),
    author_id UUID, -- References Staff(staff_id)
    note_type VARCHAR(50), -- SOAP, Progress, Discharge, Nursing
    content TEXT NOT NULL,
    signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ProblemList (
    problem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    code VARCHAR(20), -- ICD-10 code
    description TEXT,
    onset_date DATE,
    status VARCHAR(50), -- Active, Resolved, Inactive
    recorded_by UUID -- References Staff(staff_id)
);

CREATE TABLE Orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES Encounters(encounter_id),
    patient_id UUID REFERENCES Patients(patient_id),
    ordered_by UUID,
    order_type VARCHAR(50), -- Lab, Imaging, Medication, Procedure
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50), -- Pending, Processing, Completed, Cancelled
    priority VARCHAR(20) -- Stat, Routine
);

CREATE TABLE Medications (
    medication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES Orders(order_id),
    drug_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50),
    start_date DATE,
    end_date DATE,
    instructions TEXT,
    status VARCHAR(50)
);

-- ==========================================
-- 2. ADMINISTRATIVE & SCHEDULING
-- ==========================================

CREATE TABLE FacilityLocation (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    department_name VARCHAR(100),
    bed_count INTEGER DEFAULT 0,
    parent_location_id UUID REFERENCES FacilityLocation(location_id),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Staff (
    staff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- Link to Identity/Auth system
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    credentials TEXT[], -- e.g., ['MD', 'PHD']
    roles TEXT[], -- e.g., ['Clinician', 'Administrator']
    department_id UUID REFERENCES FacilityLocation(location_id),
    specialty VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Appointment (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    provider_id UUID REFERENCES Staff(staff_id),
    location_id UUID REFERENCES FacilityLocation(location_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50), -- Scheduled, Confirmed, Checked-in, No-show, Cancelled
    type VARCHAR(50), -- Follow-up, New Patient, Surgical
    reason TEXT,
    recurrence_rule TEXT -- iCal RRULE for recurring appts
);

-- ==========================================
-- 3. BILLING & REVENUE CYCLE MANAGEMENT
-- ==========================================

CREATE TABLE Payer (
    payer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    payer_type VARCHAR(50), -- Insurance, Government, Self-pay
    contact_info TEXT
);

CREATE TABLE ServiceCatalog (
    service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- CPT / HCPCS
    description TEXT,
    base_price DECIMAL(10, 2),
    category VARCHAR(100)
);

CREATE TABLE Claim (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    encounter_id UUID REFERENCES Encounters(encounter_id),
    payer_id UUID REFERENCES Payer(payer_id),
    status VARCHAR(50), -- Draft, Submitted, Pending, Paid, Denied, Appealed
    amount_billed DECIMAL(10, 2),
    amount_allowed DECIMAL(10, 2),
    adjudication_notes TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ClaimDenial (
    denial_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES Claim(claim_id),
    reason_code VARCHAR(20),
    appeal_status VARCHAR(50),
    action_taken TEXT
);

CREATE TABLE Payment (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payer_id UUID, -- Can be UUID from Payer or Patients (for self-pay)
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50), -- Cash, Credit Card, EFT, Check
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50)
);

CREATE TABLE PaymentAllocation (
    allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES Payment(payment_id),
    claim_id UUID REFERENCES Claim(claim_id),
    amount DECIMAL(10, 2) NOT NULL
);

-- ==========================================
-- 4. PHARMACY & INVENTORY
-- ==========================================

CREATE TABLE Supplier (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_info TEXT,
    tax_id VARCHAR(50)
);

CREATE TABLE InventoryItem (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_id UUID REFERENCES FacilityLocation(location_id),
    quantity_on_hand INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    lot VARCHAR(50),
    expiry_date DATE,
    unit_cost DECIMAL(10, 2)
);

CREATE TABLE PurchaseOrder (
    po_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES Supplier(supplier_id),
    status VARCHAR(50), -- Draft, Ordered, Received, Cancelled
    ordered_at TIMESTAMP,
    expected_delivery TIMESTAMP,
    total_amount DECIMAL(10, 2)
);

CREATE TABLE PurchaseOrderItem (
    poi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID REFERENCES PurchaseOrder(po_id),
    item_id UUID REFERENCES InventoryItem(item_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2)
);

-- ==========================================
-- 5. SURGICAL & SPECIALIZED SERVICES
-- ==========================================

CREATE TABLE ORCase (
    case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgeon_id UUID REFERENCES Staff(staff_id),
    patient_id UUID REFERENCES Patients(patient_id),
    location_id UUID REFERENCES FacilityLocation(location_id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    case_status VARCHAR(50), -- Scheduled, In Progress, Recovery, Completed
    procedure_notes TEXT,
    implants TEXT[] -- Serial numbers for tracking
);

CREATE TABLE CarePlan (
    careplan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    responsible_team UUID REFERENCES Staff(staff_id),
    problems TEXT[],
    goals TEXT[],
    interventions TEXT[],
    status VARCHAR(50)
);

-- ==========================================
-- 6. HR, TRAINING & QUALITY
-- ==========================================

CREATE TABLE PayrollRecord (
    payroll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES Staff(staff_id),
    period_start DATE,
    period_end DATE,
    gross_pay DECIMAL(10, 2),
    deductions DECIMAL(10, 2),
    net_pay DECIMAL(10, 2),
    processed_at TIMESTAMP
);

CREATE TABLE TrainingRecord (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES Staff(staff_id),
    course_name VARCHAR(255),
    completion_date DATE,
    score INTEGER,
    certificate_url TEXT
);

CREATE TABLE Incident (
    incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100), -- Medical Error, Fall, Facility Issue, Security
    reporter_id UUID REFERENCES Staff(staff_id),
    patient_id UUID REFERENCES Patients(patient_id),
    event_date TIMESTAMP NOT NULL,
    severity VARCHAR(20), -- Low, Medium, High, Critical
    outcome TEXT,
    status VARCHAR(50)
);

-- ==========================================
-- 7. ASSETS & FACILITIES
-- ==========================================

CREATE TABLE Asset (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    type VARCHAR(100), -- MRI, Bed, Ventilator
    location_id UUID REFERENCES FacilityLocation(location_id),
    maintenance_schedule TEXT, -- JSON or Frequency
    last_service_date DATE,
    next_service_date DATE,
    status VARCHAR(50)
);

-- ==========================================
-- 8. LEGAL, CONSENT & TRIALS
-- ==========================================

CREATE TABLE ConsentRecord (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id),
    consent_type VARCHAR(100), -- Surgery, Data Sharing, AI Research
    granted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_on TIMESTAMP,
    scope TEXT,
    signature_reference TEXT
);

CREATE TABLE ResearchStudy (
    study_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    principal_investigator UUID REFERENCES Staff(staff_id),
    eligibility_criteria TEXT,
    status VARCHAR(50),
    start_date DATE,
    end_date DATE
);

CREATE TABLE Televisit (
    televisit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES Encounters(encounter_id),
    video_link TEXT,
    recording_reference TEXT,
    consent_flag BOOLEAN DEFAULT FALSE
);

CREATE TABLE PolicyDocument (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    version VARCHAR(20),
    effective_date DATE,
    owner_id UUID REFERENCES Staff(staff_id),
    content_url TEXT
);
