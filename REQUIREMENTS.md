# CertiFlow — Requirements Analysis

## 1. Problem Statement

The Pragati Skills Mission currently uses a manual process involving spreadsheets, email, WhatsApp approvals and manually generated certificates. This causes delays, lack of accountability, difficulty tracking batches, and certificate fraud.

CertiFlow is a centralized platform designed to automate certificate issuance, approval workflows, delivery and public verification.

## 2. Objectives

- Allow training centres to upload candidate batches.
- Validate candidate data before persistence.
- Support multi-officer district approval.
- Require additional quality review for large batches.
- Provide final approval through the State Office.
- Generate unique digital certificates.
- Deliver certificates through a simulated WhatsApp provider.
- Allow public certificate verification without authentication.
- Maintain an audit trail of all important actions.
- Detect batches that remain pending for too long.

## 3. User Roles

- Training Centre
- District Officer
- Quality Team
- State Office
- Candidate
- Public/Employer

## 4. Functional Requirements

### Batch Management
- Create batches.
- Upload candidate spreadsheets.
- Validate all rows.
- Reject invalid uploads without partial persistence.
- Submit batches for approval.
- Track batch status.
- Correct and resubmit returned batches.

### Approval Workflow
- Require at least two district officer approvals.
- Support approve, reject and return decisions.
- Require quality review for large batches.
- Require final State Office approval.
- Prevent unauthorized workflow transitions.
- Handle concurrent approval requests safely.

### Certificate Issuance
- Generate certificates after final approval.
- Assign unique certificate identifiers.
- Generate PDFs and QR codes.
- Prevent duplicate issuance.

### Delivery
- Deliver certificates through a mock WhatsApp provider.
- Support failures, timeouts and retries.
- Process delivery asynchronously.
- Maintain delivery status.

### Verification
- Allow public verification without authentication.
- Return valid, revoked or not-found status.
- Avoid exposing sensitive personal information.

### Cancellation
- Allow the State Office to revoke certificates.
- Maintain historical certificate records.
- Record cancellation reason, actor and timestamp.

### Auditability
- Maintain an audit trail for batch and certificate actions.
- Record actor, action, entity, timestamp and relevant state changes.

### Realtime
- Update dashboards when workflow or delivery status changes.

### Monitoring
- Detect batches exceeding configured SLA thresholds.
- Display stuck batches to authorized users.

## 5. Non-Functional Requirements

- Scalable architecture.
- Reliable background processing.
- Secure role-based access control.
- Database consistency.
- Idempotent operations.
- Containerized local setup.
- Automated testing.
- Observability and auditability.

## 6. Engineering Decisions

- District approval requirement: two officers.
- Large batch threshold: more than 50 candidates.
- Returned batches create a new version.
- Previous approvals remain in history but are invalid for the new version.
- WhatsApp delivery is asynchronous.
- Failed deliveries are retried.
- Certificates are revoked, never deleted.
- Critical operations are protected by database constraints and transactions.

## 7. Critical Scenarios

1. Invalid spreadsheet upload must not partially save.
2. Concurrent district approvals must process the workflow exactly once.
3. Approved batches must generate exactly one certificate per candidate.
4. WhatsApp failures must not block certificate issuance.
5. Revoked certificates must immediately fail public verification.
6. Returned batches must invalidate previous approvals for the modified version.

## 8. Security Rules

- Users may only perform actions permitted by their role.
- Users cannot impersonate other users.
- Workflow transitions must be validated by the backend.
- Public verification must expose only necessary information.
- Certificate identifiers must be unique.
- Important actions must be auditable.

## 9. Hackathon Implementation Scope

The implementation prioritizes a small number of complete, reliable workflows over a large number of partially implemented features.

Priority is given to workflow correctness, concurrent operations, transactional uploads, certificate uniqueness, background processing, retries, auditability and automated tests.
