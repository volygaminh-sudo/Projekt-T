const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const dataDir = path.resolve(__dirname, '../data');

// Create data directory if not exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('📁 Created data/ directory');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Lỗi DB:', err);
    console.log('✅ Connected to database for export...');
});

const exportTable = (table, filename) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${table} ORDER BY id ASC`, [], (err, rows) => {
            if (err) {
                console.error(`❌ Error exporting ${table}:`, err.message);
                reject(err);
                return;
            }
            
            const filePath = path.join(dataDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(rows, null, 4), 'utf-8');
            console.log(`✅ Exported ${rows.length} rows from ${table} to data/${filename}`);
            resolve();
        });
    });
};

const runExport = async () => {
    try {
        await exportTable('heroes', 'heroes.json');
        await exportTable('items', 'items.json');
        await exportTable('arcanas', 'arcanas.json');
        await exportTable('runes', 'runes.json');
        console.log('\n🎉 ALL DATA EXPORTED SUCCESSFULLY!');
    } catch (err) {
        console.error('❌ Export failed');
    } finally {
        db.close();
    }
};

runExport();
