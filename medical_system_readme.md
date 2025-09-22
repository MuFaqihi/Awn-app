# Medical Services System

## Overview
A medical services platform with distinct dashboards for Patients, Doctors, and Admins, providing appointment management, medical record tracking, and billing functionalities.

## Back-end Classes

### User (Base Class)
- Attributes: `id`, `name`, `email`, `password_hash`, `role` (Patient/Doctor/Admin), `created_at`
- Methods: `authenticate(password)`, `update_profile(data)`, `get_dashboard_data()`

### Patient (inherits User)
- Attributes: `medical_records`, `appointments`, `insurance_info`
- Methods: `book_appointment()`, `view_medical_records()`, `pay_invoice()`

### Doctor (inherits User)
- Attributes: `specialization`, `appointments`, `patients`
- Methods: `create_prescription()`, `view_schedule()`, `update_medical_record()`

### Admin (inherits User)
- Attributes: `system_logs`
- Methods: `manage_user()`, `view_system_metrics()`, `generate_reports()`

### Appointment
- Attributes: `id`, `patient_id`, `doctor_id`, `datetime`, `status`
- Methods: `reschedule()`, `cancel()`, `mark_completed()`

### MedicalRecord
- Attributes: `id`, `patient_id`, `doctor_id`, `diagnosis`, `treatment`, `date`
- Methods: `update_treatment()`, `get_summary()`

### Invoice
- Attributes: `id`, `patient_id`, `amount`, `status`, `created_at`
- Methods: `mark_paid()`, `generate_pdf()`

## Database Design (Relational)

### Tables
- `users`: id, name, email, password_hash, role, created_at
- `patients`: id (FK users.id), insurance_info
- `doctors`: id (FK users.id), specialization
- `appointments`: id, patient_id, doctor_id, datetime, status
- `medical_records`: id, patient_id, doctor_id, diagnosis, treatment, date
- `invoices`: id, patient_id, amount, status, created_at

### Relationships
- Patient ↔ Appointments: one-to-many
- Doctor ↔ Appointments: one-to-many
- Patient ↔ MedicalRecords: one-to-many
- Doctor ↔ MedicalRecords: one-to-many
- Patient ↔ Invoices: one-to-many

## Front-end Components

### Patient Dashboard
- Dashboard (summary, upcoming appointments)
- Appointment Booking Form
- Medical Records Viewer
- Invoice & Payment Section

### Doctor Dashboard
- Dashboard (appointments table, patient alerts)
- Patient Records Viewer & Editor
- Prescription Form
- Schedule Management

### Admin Dashboard
- User Management (CRUD)
- System Logs Viewer
- Reports Generator

## Component Interactions
- Front-end communicates with a unified back-end API.
- Dynamic actions: booking appointments, updating medical records, paying invoices, etc.

