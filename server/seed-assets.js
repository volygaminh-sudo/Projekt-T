const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const itemsPath = path.resolve(__dirname, '../data/items.json');
const arcanasPath = path.resolve(__dirname, '../data/runes.json'); // Bảng ngọc
const runesPath = path.resolve(__dirname, '../data/badges.json'); // Phù hiệu

function seedItems() {
    const data = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
    const stmt = db.prepare(`
        INSERT INTO items (name, type, price, description, stat_other, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            type = excluded.type,
            price = excluded.price,
            description = excluded.description,
            stat_other = excluded.stat_other,
            image_url = excluded.image_url
    `);

    data.forEach(item => {
        // baseStats in items.json is a string, let's put it in stat_other
        const passivesStr = item.passives.map(p => `${p.name}: ${p.description}`).join('\n');
        const desc = passivesStr || '';
        stmt.run([item.name, item.type, item.price, desc, item.baseStats, item.image]);
    });
    stmt.finalize();
    console.log(`✅ Seeded ${data.length} items`);
}

function seedArcanas() {
    const data = JSON.parse(fs.readFileSync(arcanasPath, 'utf8'));
    const stmt = db.prepare(`
        INSERT INTO arcanas (name, color, level, stats, image_url)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            color = excluded.color,
            level = excluded.level,
            stats = excluded.stats,
            image_url = excluded.image_url
    `);

    data.forEach(arc => {
        const statsStr = arc.stats.join(', ');
        // level string like "III" -> 3
        const levelMap = { 'I': 1, 'II': 2, 'III': 3 };
        const levelNum = levelMap[arc.level] || 0;
        stmt.run([arc.name, arc.color, levelNum, statsStr, arc.image]);
    });
    stmt.finalize();
    console.log(`✅ Seeded ${data.length} arcanas (Bảng ngọc)`);
}

function seedRunes() {
    const data = JSON.parse(fs.readFileSync(runesPath, 'utf8'));
    const stmt = db.prepare(`
        INSERT INTO runes (name, branch, tier, description, image_url)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            branch = excluded.branch,
            tier = excluded.tier,
            description = excluded.description,
            image_url = excluded.image_url
    `);

    data.forEach(rune => {
        stmt.run([rune.name, rune.branch, rune.level, rune.description, rune.image]);
    });
    stmt.finalize();
    console.log(`✅ Seeded ${data.length} runes (Phù hiệu)`);
}

db.serialize(() => {
    seedItems();
    seedArcanas();
    seedRunes();
});

db.close(() => {
    console.log('🚀 Seeding complete.');
});
