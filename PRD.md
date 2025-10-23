# Product Requirements Document (PRD)

## Tenant Management Backend (MVP)

### 1. Product Overview

Product Name: Tenant Management Backend MVP  
Version: 0.1.0  
Product Type: Backend API for Rental Property and Lease Management

The Tenant Management Backend is a RESTful API that enables landlords with multiple properties and units to manage tenants, leases, monthly rent invoicing, manual receipts, and maintenance issues with secure authentication and role-based access control. It prioritizes reliability, auditability, and simple automation to cover end-to-end rental operations for a single landlord organization.

### 2. Target Users

- Landlords: Create and manage properties, units, tenants, leases, invoices, receipts, and issues.  
- Tenants: View their lease and invoices, submit maintenance issues; limited self-service.  

### 3. Core Features

#### 3.1 Authentication & Authorization

- User Registration: Landlord account creation with email verification.  
- User Login: Secure authentication with JWT access and refresh tokens.  
- Password Management: Change password and forgot/reset password flows.  
- Email Verification: Tokenized verification for new accounts.  
- Token Management: Access token refresh and rotation; revoke on password change.  
- Role-Based Access Control: Roles landlord and tenant; resource access scoped to landlordId.  

#### 3.2 Property & Unit Management

- Property CRUD: Name, address, metadata; list and view details.  
- Unit CRUD: unitNo, bedrooms, bathrooms, baseRent, status (VACANT, OCCUPIED); list and filter by property/status.  
- Unit-Lease Sync: Unit status transitions via lease lifecycle (activate → OCCUPIED, end → VACANT).  

#### 3.3 Tenant & Basic KYC

- Tenant Profiles: Name, phone, email, ID type/number; attachments metadata only (e.g., storage key, MIME, size).  
- Tenant Listing/Details: Search and retrieve tenant records.  

#### 3.4 Lease Management

- Lease Creation: Bind tenant to unit with startDate, endDate, monthlyRent, deposit; requires unit VACANT.  
- Lease Listing/Details: Filter by propertyId, unitId, tenantId, status.  
- Lease Updates & Status: activate, notice, end; ending stops future invoices and sets unit VACANT.  

#### 3.5 Rent Invoicing

- Monthly Generation: Idempotent invoice generation per ACTIVE lease per period (YYYY-MM).  
- Invoice Status: PENDING, PARTIAL, PAID, OVERDUE with dueDate and graceDays; auto-mark OVERDUE after threshold.  
- Reminders: Email reminders at T−3, on due date, and D+3; store reminder logs.  
- Listing/Details: Filter by leaseId, period, status; update memo/status as needed.  

#### 3.6 Receipts & Reconciliation

- Record Receipt: Apply payments to invoices with amount, date, method, note.  
- Validation: Prevent over-application; auto-update invoice status to PARTIAL/PAID.  
- Exports: CSV exports for invoices and receipts.  

#### 3.7 Maintenance Issues

- Issue Creation: Per unit; category enum (PLUMBING, ELECTRICAL, GENERAL, OTHER), priority, description.  
- Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED; timestamps for opened, firstResponse, resolved; notes and attachment metadata.  
- Listing/Details/Updates: Filters by unit/status/priority.  

#### 3.8 System Health

- Health Check: Basic API status endpoint.  

### 4. Technical Specifications

#### 4.1 API Endpoints Structure

Authentication Routes (/api/v1/auth/)
- POST /register — User registration.  
- POST /login — User authentication.  
- POST /logout — User logout (secured).  
- GET /current-user — Current user info (secured).  
- POST /change-password — Change password (secured).  
- POST /refresh-token — Refresh access token.  
- GET /verify-email/:verificationToken — Verify email.  
- POST /forgot-password — Request password reset.  
- POST /reset-password/:resetToken — Reset password.  
- POST /resend-email-verification — Resend verification (secured).  

Property Routes (/api/v1/properties/)
- GET / — List properties (secured).  
- POST / — Create property (secured).  
- GET /:propertyId — Property details (secured).  
- PUT /:propertyId — Update property (secured).  
- DELETE /:propertyId — Delete property (secured).  

Unit Routes (/api/v1/units/)
- GET /?propertyId=&status= — List units with filters.  
- POST / — Create unit (secured).  
- GET /:unitId — Unit details (secured).  
- PUT /:unitId — Update unit (secured).  
- DELETE /:unitId — Delete unit (secured).  

Tenant Routes (/api/v1/tenants/)
- GET / — List tenants (secured).  
- POST / — Create tenant profile (secured).  
- GET /:tenantId — Tenant details (secured).  
- PUT /:tenantId — Update tenant profile (secured).  

Lease Routes (/api/v1/leases/)
- GET / — List leases (filters: propertyId, unitId, tenantId, status).  
- POST / — Create lease (secured).  
- GET /:leaseId — Lease details (secured).  
- PUT /:leaseId — Update lease (secured).  
- POST /:leaseId/activate — Activate lease (secured).  
- POST /:leaseId/notice — Mark notice (secured).  
- POST /:leaseId/end — End lease (secured).  

Invoice Routes (/api/v1/invoices/)
- GET / — List invoices (filters: leaseId, period, status).  
- POST /generate?period=YYYY-MM — Generate monthly invoices (secured).  
- GET /:invoiceId — Invoice details (secured).  
- PATCH /:invoiceId — Update status/memo (secured).  

Receipt Routes (/api/v1/receipts/)
- GET /?invoiceId= — List receipts.  
- POST / — Create receipt (secured).  
- GET /:receiptId — Receipt details (secured).  

Issue Routes (/api/v1/issues/)
- GET / — List issues (filters: unitId, status, priority).  
- POST / — Create issue (secured).  
- GET /:issueId — Issue details (secured).  
- PUT /:issueId — Update issue (secured).  
- POST /:issueId/start — Move to IN_PROGRESS (secured).  
- POST /:issueId/resolve — Move to RESOLVED (secured).  
- POST /:issueId/close — Move to CLOSED (secured).  

Exports and Health
- GET /api/v1/exports/invoices.csv — Export invoices CSV.  
- GET /api/v1/exports/receipts.csv — Export receipts CSV.  
- GET /api/v1/healthcheck/ — System health status.  

#### 4.2 Permission Matrix

| Feature                               | Landlord | Tenant |
| ------------------------------------- | -------- | ------ |
| Manage Properties/Units               | ✓        | ✗      |
| Create/Update/Delete Tenant Profiles  | ✓        | ✗      |
| Create/Update Leases                  | ✓        | ✗      |
| View Own Lease                        | ✓        | ✓      |
| Generate/List Invoices                | ✓        | ✗      |
| View Own Invoices                     | ✓        | ✓      |
| Create Receipts                       | ✓        | ✗      |
| Create/Update Issues                  | ✓        | ✓      |
| View Own Issues                       | ✓        | ✓      |

#### 4.3 Data Models

User Roles
- landlord — Full control within own organization scope.  
- tenant — Read own lease/invoices/issues; create issues.  

Unit Status
- VACANT, OCCUPIED.  

Lease Status
- ACTIVE, NOTICE, ENDED.  

Invoice Status
- PENDING, PARTIAL, PAID, OVERDUE.  

Issue Status
- OPEN, IN_PROGRESS, RESOLVED, CLOSED.  

### 5. Security Features

- JWT-based auth with refresh tokens; HTTP-only cookies recommended.  
- Role-based authorization middleware and landlordId scoping.  
- Input validation on all endpoints.  
- Email verification and secure password reset.  
- File uploads via signed URLs; DB stores metadata only.  
- CORS configuration.  

### 6. File Management

- Attachment metadata for tenant KYC and issue images.  
- Files stored in object storage; DB tracks URL/key, MIME type, size.  
- Secure upload handling; malware scanning deferred to future scope.  

### 7. Success Criteria

- End-to-end flow completed under 10 minutes: property → unit → tenant → lease → generate invoice → record receipt.  
- Idempotent monthly invoices: zero duplicates for lease+period across re-runs.  
- Reminder job logs present for T−3/Due/D+3 for all pending/overdue invoices.  
- Issue lifecycle: >90% issues progress beyond OPEN with timestamps in test data.  

### 8. Non-Goals (MVP)

- Payment gateway integration or automated bank reconciliation.  
- Advanced KYC verification, OCR, or background checks.  
- Vendor procurement, work orders, or cost tracking.  
- Mobile app, push notifications, or analytics dashboards.  

### 9. Tech Stack & Operations

- Backend: Node.js, Express, Mongoose (MongoDB Atlas).  
- Auth: JWT access/refresh; HTTP-only cookies.  
- Jobs: Cron/worker for invoice generation and reminders.  
- Observability: Request logging with correlationId; activity logs for critical actions; job run logs.  
- Deployment: Containerized service; environment-based configuration for DB and storage.  
