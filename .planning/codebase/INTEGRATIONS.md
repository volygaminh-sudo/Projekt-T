# Integrations

## Internal Integrations
- **REST API**: The Express backend in `server/server.js` provides endpoints for hero data, tier lists, and admin operations.
- **SQLite Database**: Local persistence in `server/database.sqlite`. Shared between `server.js` and maintenance scripts.
- **Static Assets**: Frontend files in `index/` serve static content and communicate with the backend via fetch.

## External Integrations
- **Garena Liên Quân Mobile (Scraping)**:
  - The project extracts hero data, skill descriptions, and images from the official Garena website.
  - Scraper logic found in `tmp_scraper/`.
  - Data is persisted to `heroes-data.json` and then imported into SQLite.

## Data Sources
- **`heroes-data.json`**: Primary JSON data source for hero information.
- **`index/hero_images.json`**: Asset mapping tool for frontend image resolution.
- **SQL Scripts**: `index/p-T.sql` for schema and initial data.
