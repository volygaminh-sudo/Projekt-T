---
created: 2026-05-06T07:01:30+07:00
title: Refactor shared utilities to utils.js
area: ui
files:
  - index/admin.js
---

## Problem

`BASE_URL` and `escapeHTML` are currently local to `admin.js`. Other admin pages (like a future dashboard or settings) would need to duplicate this logic. This leads to maintenance overhead and risks insecure rendering if XSS protection is forgotten in new files.

## Solution

1. Create `index/utils.js`.
2. Move `BASE_URL` and `escapeHTML` into `index/utils.js`.
3. Export them from `index/utils.js`.
4. Update `index/admin.js` to use these shared utilities (e.g., via `<script src="utils.js"></script>` or ES modules if supported).
