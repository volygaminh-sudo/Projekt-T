/**
 * migrate-to-postgres.js
 * Đọc toàn bộ dữ liệu từ SQLite → đẩy vào PostgreSQL (Neon.tech / Supabase)
 * 
 * CÁCH DÙNG:
 * 1. npm install pg
 * 2. Tạo file .env ở thư mục gốc với nội dung:
 *    DATABASE_URL=postgresql://user:password@host/dbname
 * 3. node scripts/migrate-to-postgres.js
 * 
 * File này có thể chạy lại nhiều lần (dùng ON CONFLICT DO NOTHING / DO UPDATE)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
    console.error('❌ Thiếu biến môi trường DATABASE_URL trong file .env');
    process.exit(1);
}

const sqliteDb = new sqlite3.Database(path.join(__dirname, '../server/database.sqlite'));
const pgPool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

function sqliteAll(query, params = []) {
    return new Promise((resolve, reject) => {
        sqliteDb.all(query, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
}

async function pgQuery(text, values) {
    const client = await pgPool.connect();
    try {
        return await client.query(text, values);
    } finally {
        client.release();
    }
}

async function createSchema() {
    console.log('🏗️  Tạo schema PostgreSQL...');
    await pgQuery(`
        CREATE TABLE IF NOT EXISTS heroes (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            primary_role TEXT,
            secondary_role TEXT,
            tier TEXT DEFAULT 'c',
            story TEXT,
            skill_p TEXT, skill_1 TEXT, skill_2 TEXT, skill_3 TEXT,
            skill_p_img TEXT, skill_1_img TEXT, skill_2_img TEXT, skill_3_img TEXT,
            items TEXT, builds TEXT,
            recommended_arcanas TEXT, recommended_runes TEXT,
            image_url TEXT, skins TEXT,
            win_rate TEXT, pick_rate TEXT, ban_rate TEXT,
            counters TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            type TEXT,
            stat_atk TEXT, stat_def TEXT, stat_other TEXT,
            description TEXT, image_url TEXT,
            price INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS arcanas (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT, level INTEGER,
            stats TEXT, image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS runes (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            branch TEXT, tier INTEGER,
            description TEXT, image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            display_name TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT, subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pgQuery(`
        CREATE TABLE IF NOT EXISTS user_hero_order (
            user_id INTEGER NOT NULL,
            hero_id INTEGER NOT NULL,
            tier TEXT NOT NULL,
            sort_order INTEGER NOT NULL,
            PRIMARY KEY (user_id, hero_id)
        )
    `);

    console.log('✅ Schema đã tạo xong.\n');
}

async function migrateTable(name, rows, upsertFn) {
    console.log(`📦 Migrate bảng "${name}": ${rows.length} bản ghi...`);
    let ok = 0, skip = 0;
    for (const row of rows) {
        try {
            await upsertFn(row);
            ok++;
        } catch (e) {
            console.warn(`  ⚠️  Bỏ qua (conflict): ${e.message.substring(0, 80)}`);
            skip++;
        }
    }
    console.log(`  ✅ ${ok} thành công | ⚠️  ${skip} bỏ qua\n`);
}

async function main() {
    try {
        await pgPool.query('SELECT 1'); // Test connection
        console.log('✅ Đã kết nối PostgreSQL\n');
    } catch (e) {
        console.error('❌ Không kết nối được PostgreSQL:', e.message);
        process.exit(1);
    }

    await createSchema();

    // --- Heroes ---
    const heroes = await sqliteAll('SELECT * FROM heroes');
    await migrateTable('heroes', heroes, (h) => pgQuery(`
        INSERT INTO heroes (name, primary_role, secondary_role, tier, story,
            skill_p, skill_1, skill_2, skill_3,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img,
            items, builds, recommended_arcanas, recommended_runes,
            image_url, skins, win_rate, pick_rate, ban_rate, counters)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
        ON CONFLICT (name) DO UPDATE SET
            tier = EXCLUDED.tier,
            primary_role = EXCLUDED.primary_role,
            builds = EXCLUDED.builds,
            win_rate = EXCLUDED.win_rate,
            pick_rate = EXCLUDED.pick_rate,
            ban_rate = EXCLUDED.ban_rate
    `, [h.name, h.primary_role, h.secondary_role, h.tier || 'c', h.story,
        h.skill_p, h.skill_1, h.skill_2, h.skill_3,
        h.skill_p_img, h.skill_1_img, h.skill_2_img, h.skill_3_img,
        h.items, h.builds, h.recommended_arcanas, h.recommended_runes,
        h.image_url, h.skins, h.win_rate, h.pick_rate, h.ban_rate, h.counters]));

    // --- Items ---
    const items = await sqliteAll('SELECT * FROM items');
    await migrateTable('items', items, (i) => pgQuery(`
        INSERT INTO items (name, type, stat_atk, stat_def, stat_other, description, image_url, price)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url, price = EXCLUDED.price
    `, [i.name, i.type, i.stat_atk, i.stat_def, i.stat_other, i.description, i.image_url, i.price || 0]));

    // --- Arcanas ---
    const arcanas = await sqliteAll('SELECT * FROM arcanas');
    await migrateTable('arcanas', arcanas, (a) => pgQuery(`
        INSERT INTO arcanas (name, color, level, stats, image_url)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url
    `, [a.name, a.color, a.level, a.stats, a.image_url]));

    // --- Runes ---
    const runes = await sqliteAll('SELECT * FROM runes');
    await migrateTable('runes', runes, (r) => pgQuery(`
        INSERT INTO runes (name, branch, tier, description, image_url)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url
    `, [r.name, r.branch, r.tier, r.description, r.image_url]));

    // --- Users ---
    const users = await sqliteAll('SELECT * FROM users');
    await migrateTable('users', users, (u) => pgQuery(`
        INSERT INTO users (username, password, display_name, role)
        VALUES ($1,$2,$3,'user')
        ON CONFLICT (username) DO NOTHING
    `, [u.username, u.password, u.display_name]));

    // Ensure admin has role=admin
    await pgQuery(`UPDATE users SET role = 'admin' WHERE username = 'admin'`);
    console.log('👑 Đã gán role=admin cho tài khoản admin');

    // --- Feedbacks ---
    const feedbacks = await sqliteAll('SELECT * FROM feedbacks');
    await migrateTable('feedbacks', feedbacks, (f) => pgQuery(`
        INSERT INTO feedbacks (name, email, subject, message)
        VALUES ($1,$2,$3,$4)
    `, [f.name, f.email, f.subject, f.message]));

    sqliteDb.close();
    await pgPool.end();
    console.log('\n🎉 Migration hoàn tất! Database PostgreSQL đã sẵn sàng.');
    console.log('   Bước tiếp theo: Cập nhật DATABASE_URL trong Vercel Environment Variables.');
}

main().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
