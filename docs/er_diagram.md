# Hospital ERP ER Diagram

```mermaid
erDiagram
    Patients ||--o{ Encounters : "has"
    Patients ||--o{ Appointment : "schedules"
    Patients ||--o{ Claim : "billed_for"
    Patients ||--o{ ProblemList : "has"
    Patients ||--o{ ConsentRecord : "gives"
    
    Staff ||--o{ Appointment : "attends"
    Staff ||--o{ Encounters : "performs"
    Staff ||--o{ ClinicalNotes : "writes"
    Staff ||--o{ ORCase : "operates"
    Staff ||--o{ Incident : "reports"
    
    Encounters ||--o{ ClinicalNotes : "contains"
    Encounters ||--o{ Orders : "generates"
    Encounters ||--o{ Claim : "triggers"
    Encounters ||--o{ Televisit : "is_a"
    
    Orders ||--o{ Medications : "contains"
    
    FacilityLocation ||--o{ Appointment : "hosts"
    FacilityLocation ||--o{ InventoryItem : "stores"
    FacilityLocation ||--o{ Asset : "houses"
    FacilityLocation ||--o| FacilityLocation : "parent"
    
    Claim ||--o{ ClaimDenial : "can_be"
    Claim ||--o{ PaymentAllocation : "receives"
    
    Payment ||--o{ PaymentAllocation : "allocates"
    
    Supplier ||--o{ PurchaseOrder : "supplies"
    PurchaseOrder ||--o{ PurchaseOrderItem : "contains"
    PurchaseOrderItem }|--|| InventoryItem : "refers_to"
    
    ResearchStudy ||--o{ Patients : "enrolls"
```

## Entity Groupings

### Clinical
- `Patients`: Master identity record.
- `Encounters`: Single point of care interaction.
- `ClinicalNotes`: Documentation of care.
- `ProblemList`: Chronic/acute conditions.
- `Orders`: Clinical requests (Labs, Meds, Imaging).

### Admin & Staff
- `Staff`: Employees with credentials and roles.
- `FacilityLocation`: Wards, rooms, clinics, and sites.
- `Appointment`: Time-slotted resource booking.

### Billing
- `Payer`: Insurance companies or self-pay entities.
- `Claim`: Bill sent to payer.
- `Payment`: Financial transaction received.

### Logistics
- `InventoryItem`: Consumables and medications in stock.
- `PurchaseOrder`: Procurement of goods.
- `Asset`: Medical equipment tracking.
