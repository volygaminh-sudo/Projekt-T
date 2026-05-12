# Conventions

## Coding Standards

### JavaScript
- **Style**: Standard ES6+ JavaScript.
- **Async**: Promises and `async/await` used for Fetch API and Database operations.
- **Modules**: Backend uses CommonJS (`require`). Frontend uses script tags (non-modular).

### CSS
- **Approach**: Vanilla CSS.
- **Organization**: One CSS file per HTML page to keep styles isolated.
- **Naming**: Primarily class-based targeting.

## Pattern & Abstractions

### API Communication
- Frontend uses `fetch()` to hit Express endpoints.
- Error handling is basic but present in JS logic.

### Database Interaction
- Uses `sqlite3` library.
- Direct SQL queries instead of an ORM.

## Error Handling
- Server-side: Basic middleware and try/catch blocks in routes.
- Client-side: Console logging of fetch errors.
