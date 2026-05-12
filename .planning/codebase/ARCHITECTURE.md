# Architecture

## System Pattern: Monolithic Client-Server
The project follows a standard client-server architecture with a clear separation between the data management layers and the presentation layer.

## Presentation Layer (Frontend)
- **Pattern**: Multi-page Application (MPA).
- **Technology**: Vanilla HTML/CSS/JS.
- **Organization**: Each feature (home, admin, tier-list) has its own set of files in the `index/` directory.
- **State**: Managed mostly on the client side via local variables or fetched from the server.

## Logic Layer (Backend)
- **Framework**: Express.js.
- **Responsibility**: Provides RESTful endpoints for CRUD operations on hero data.
- **Security**: Basic CORS configuration for local development.

## Data Persistence Layer
- **Storage**: SQLite3.
- **Sync**: Maintenance scripts (`server/seed-json.js`, `index/update_sql.js`) sync JSON data from scrapers into the relational database.

## Data Flow
1. **Extraction**: `tmp_scraper` crawls Garena site → `heroes-data.json`.
2. **Ingestion**: `seed-json.js` → `database.sqlite`.
3. **Serving**: `server.js` → `express` endpoints.
4. **Consumption**: Frontend `tier-list.js` / `hero-detail.js` → fetch JSON from endpoints → DOM update.
