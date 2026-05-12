# Concerns

## Technical Debt
- **Vanilla Frontend**: As the project grows, managing dependencies and state in vanilla JS across many files may become difficult. Consider a light framework if complexity increases significantly.
- **Scraper Stability**: Reliance on external DOM structures for scraping means the data pipeline is fragile and may break if the source website updates.

## Performance
- **Image Assets**: Large numbers of high-resolution hero images may impact initial load times.
- **Database Scaling**: SQLite is excellent for current needs but might require migration if concurrent user numbers or data volume grows exponentially.

## Security
- **Admin Access**: Current admin pages in `index/` appear to lack robust authentication mechanisms.
- **Input Validation**: Backend endpoints should be audited for proper input sanitization.

## Maintenance
- **Data Sync**: The manual sync between JSON and SQLite could lead to data inconsistency if not automated via CI/CD or reliable scripts.
