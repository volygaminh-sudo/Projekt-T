# Stack

## Summary
- **Primary Language**: JavaScript (ES6+)
- **Backend Framework**: Express.js (Node.js)
- **Frontend Framework**: Vanilla HTML/CSS/JS (Multi-page)
- **Database**: SQLite3
- **Dev Tooling**: Get Shit Done (GSD) v1.38.1

## Frontend
- **Structure**: Vanilla HTML5 files located in the `index/` directory.
- **Styling**: Vanilla CSS3.
- **Logic**: Vanilla JavaScript with AJAX/Fetch for API interactions.
- **Key Files**:
  - `index/home.html`: Main entry point.
  - `index/tier-list.html/js/css`: Hero tier list feature.
  - `index/hero-detail.html/js/css`: Detailed hero view.
  - `index/admin.html/js/css`: Administration dashboard.

## Backend
- **Environment**: Node.js
- **Framework**: Express (`express@^4.18.2`)
- **JSON Handling**: `cors@^2.8.5`
- **Entry Point**: `server/server.js`
- **Initialization**: `server/init-db.js` for database setup.

## Data & Storage
- **Database**: `server/database.sqlite` (SQLite3)
- **Data Files**: 
  - `heroes-data.json`: Comprehensive hero information.
  - `index/hero_images.json`: Mapping for hero images.
  - `data-sample.json`: Sample data structure.

## Infrastructure
- **Development Server**: Local Node.js environment.
- **Workflow**: GSD-orchestrated development.
