# Structure

## Directory Layout

```
Projekt-T/
├── .agent/             # GSD System & configuration
├── .planning/          # GSD Planning artifacts
│   └── codebase/       # Codebase mapping (you are here)
├── index/              # Frontend (HTML, CSS, JS, SQL)
│   ├── admin.html      # Admin dashboard
│   ├── tier-list.html  # Hero tier list
│   ├── style.css       # Global styles
│   └── p-T.sql         # SQL schema/initial data
├── server/             # Backend (Express, SQLite)
│   ├── server.js       # Main API entry point
│   ├── database.sqlite # SQLite database file
│   └── package.json    # Backend dependencies
├── img/                # Asset storage (images)
├── tmp_scraper/        # Hero data scraping logic
└── heroes-data.json    # Master hero dataset
```

## Key Locations

| Location | Purpose |
|----------|---------|
| `index/` | Client-side presentation and feature logic |
| `server/` | API server and data persistence |
| `tmp_scraper/` | Tools for keeping data fresh from official sources |
| `.planning/` | Project roadmap, requirements, and state |

## Naming Conventions
- **Files**: Kebab-case for most files (e.g., `hero-detail.css`).
- **Directories**: Snippet-style or kebab-case.
- **Frontend**: Feature-specific files bundled in `index/`.
