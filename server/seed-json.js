const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const jsonPath = path.resolve(__dirname, '../data/heroes.json');

// Read JSON
const dataRaw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(dataRaw);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Lỗi DB:', err);
    console.log('✅ Đã kết nối SQLite để chèn dữ liệu JSON...');
});

const stmt = db.prepare(`
    INSERT INTO heroes (
        name, primary_role, secondary_role, tier, story, items, image_url, skins,
        skill_p, skill_1, skill_2, skill_3,
        skill_p_img, skill_1_img, skill_2_img, skill_3_img
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
        primary_role = excluded.primary_role,
        secondary_role = excluded.secondary_role,
        tier = excluded.tier,
        story = CASE WHEN excluded.story != '' THEN excluded.story ELSE heroes.story END,
        items = CASE WHEN excluded.items != '' THEN excluded.items ELSE heroes.items END,
        image_url = CASE WHEN excluded.image_url != '' THEN excluded.image_url ELSE heroes.image_url END,
        skins = CASE WHEN excluded.skins != '' THEN excluded.skins ELSE heroes.skins END,
        skill_p = CASE WHEN excluded.skill_p != '' THEN excluded.skill_p ELSE heroes.skill_p END,
        skill_1 = CASE WHEN excluded.skill_1 != '' THEN excluded.skill_1 ELSE heroes.skill_1 END,
        skill_2 = CASE WHEN excluded.skill_2 != '' THEN excluded.skill_2 ELSE heroes.skill_2 END,
        skill_3 = CASE WHEN excluded.skill_3 != '' THEN excluded.skill_3 ELSE heroes.skill_3 END
`);

let count = 0;
data.forEach(hero => {
    stmt.run([
        hero.name, hero.primary_role, hero.secondary_role, hero.tier, hero.story, hero.items, hero.image_url, hero.skins,
        hero.skill_p, hero.skill_1, hero.skill_2, hero.skill_3,
        hero.skill_p_img, hero.skill_1_img, hero.skill_2_img, hero.skill_3_img
    ], function(err) {
        if (err) {
            console.error('Lỗi khi chèn', hero.name, err.message);
        } else {
            count++;
            console.log(`- Đã nhúng: ${hero.name}`);
        }
    });
});

stmt.finalize(() => {
    db.close(() => {
        console.log(`\n🎉 XONG! Đã tích hợp thành công ${count} tướng vào Database Web!`);
    });
});
