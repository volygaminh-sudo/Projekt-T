# Phase 2: Admin Dashboard - Hero Management

## Goal
Enhance the administrative dashboard for improved usability, performance, and features.

## Proposed Changes

### [Admin UI Enhancement]

#### [MODIFY] [admin.js](file:///c:/Users/Admin/Desktop/Projekt-T/index/admin.js)
- Implement client-side pagination to handle 100+ heroes efficiently.
- Add multi-column sorting (Name, Role, Tier).
- Improve search logic to include "secondary_role".

#### [MODIFY] [admin.html](file:///c:/Users/Admin/Desktop/Projekt-T/index/admin.html)
- Add pagination controls (Prev, Next, Page numbers).
- Add filter dropdowns for Role and Tier.

## Verification Plan
### Manual Verification
- Open `admin.html` in browser.
- Verify heroes are paginated (e.g. 10 per page).
- Test sorting by clicking column headers.
- Test filtering by role and tier.
