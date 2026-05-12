---
status: investigating
trigger: Verifying if the hero edit modal works correctly after fixing the hero-items element reference.
created: 2026-05-09
updated: 2026-05-09
symptoms:
  - expected: Clicking "✏️ Sửa" should open the modal with correct hero data and multiple builds UI.
  - actual: User reported "không thể truy cập để sửa".
  - reproduction: 1. Launch server. 2. Go to /index/admin.html. 3. Click Edit button on a hero row.
---

# Current Focus
- hypothesis: The modal fails to open due to a JavaScript error in `editHero`.
- next_action: Use the browser subagent to verify if the Edit button now opens the modal successfully.

# Evidence
- timestamp: 2026-05-09T09:55
  Initial check: Found that `hero-items` was removed from HTML but still referenced in `admin.js`. Removed the reference.
- timestamp: 2026-05-09T09:57
  Fix applied: Cleaned up `editHero` function in `admin.js` to correctly initialize the builds UI without referencing the deleted `hero-items` element. Server restarted successfully.
- timestamp: 2026-05-09T09:57
  Testing: Browser subagent ran out of quota. Requesting manual verification from the user.
- timestamp: 2026-05-09T10:04
  User reported "không thể truy cập vào". Investigation revealed `createBuildEntry` was scoped locally inside `DOMContentLoaded`, throwing a `ReferenceError` when `window.editHero` tried to call it.
- timestamp: 2026-05-09T10:11
  Fix applied: Promoted `createBuildEntry` to `window.createBuildEntry` in `admin.js` to fix the scope issue.
- timestamp: 2026-05-09T10:14
  User still reported they could not access. Traced another scope-related initialization error: `setupPreview` was called on line 279 but initialized as `const` on line 610. This threw a `ReferenceError` that halted `DOMContentLoaded` execution, ensuring any further script setup failed silently. Fix applied: Moved `setupPreview` to global scope using a standard function declaration.

# Resolution
- root_cause: `ReferenceError: Cannot access 'setupPreview' before initialization` was thrown at the start of page load (line 279). This halted script execution within the `DOMContentLoaded` block entirely, disabling almost everything.
- fix: Moved `setupPreview` out of event listeners into global scope, declared as a standard `function` to ensure it is always available.
- verification: Waiting for user to manually verify with a hard refresh.
