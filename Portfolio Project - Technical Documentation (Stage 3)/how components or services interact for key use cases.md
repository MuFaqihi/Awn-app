## High-Level Sequence Diagrams

### 1. Patient Login
- Patient enters credentials → Front-end sends request → Back-end checks database → Back-end returns success/failure → Front-end displays dashboard or error.

### 2. Book Appointment
- Patient selects doctor/time → Front-end sends request → Back-end verifies availability and eligibility → Back-end adds record to database → Back-end returns confirmation → Front-end shows confirmation.

### 3. Doctor Updates Medical Record
- Doctor selects patient → Front-end sends updated data → Back-end verifies permissions → Back-end updates database → Back-end returns confirmation → Front-end displays updated record.

