# Roadmap: Project-T v1.0.0

## Phase 1: Data Integration & Enrichment
Goal: Ensure the hero database is complete and accurate.
- [x] Scrape 128 heroes from Garena website
- [x] Merge skills into heroes.json
- [x] Resolve missing heroes (Lữ Bố, Helen, etc.)
Status: complete

## Phase 2: Admin Dashboard - Hero Management
Goal: Create a UI for editing hero data.
- [x] Implement `admin.html` with pagination and filters
- [x] Integrate hero list with SQL database via `seed-json.js`
- [x] Enhance `admin.js` with client-side filtering
Status: complete

## Phase 3: Tier List & Stats
Goal: Add advanced features like tier lists and win rate tracking.
- [x] Phase 2: Backend & Advanced Dashboard
- [x] Phase 3: Tier List Management & Detailed Skills
- [ ] Phase 4: SEO & Final Polish (Meta tags, Sitemap, Performance)
- [ ] Add sorting/filtering by win/pick/ban rates
Status: complete

## Phase 4: Final Validation & Polish
Goal: Security audit and UI polish.
- [ ] Mitigate XSS risks in admin forms
- [ ] Add responsive design improvements
Status: not-started

## Phase 5: Patch Update 2026-04-23
Goal: Integrate latest patch notes (New Hero Flowborn & Balancing).
- [x] Add Flowborn (Mage) to heroes.json
- [x] Implement balancing changes for Rouie, Alice, Helen, Cresht
- [x] Update `hero_skills_details.md` documentation
Status: complete
