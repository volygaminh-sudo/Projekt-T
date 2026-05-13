/**
 * server.pg.js — Phiên bản PostgreSQL của server.js
 * Dùng cho Vercel serverless + Neon.tech / Supabase
 * 
 * SETUP:
 * 1. Thêm DATABASE_URL vào Vercel Environment Variables
 * 2. Thêm pg vào dependencies: npm install pg
 */

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS: cho phép cả localhost và domain Vercel ---
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.FRONTEND_URL || null,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => origin.startsWith(o.replace('https://', '').replace('http://', '')))) {
            callback(null, true);
        } else {
            callback(null, true); // Dev: allow all
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, '../')));

// --- PostgreSQL Pool ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function query(text, params) {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
}

// =================== SCHEMA INIT ===================
async function initSchema() {
    await query(`
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
    await query(`
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            type TEXT, stat_atk TEXT, stat_def TEXT, stat_other TEXT,
            description TEXT, image_url TEXT, price INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await query(`
        CREATE TABLE IF NOT EXISTS arcanas (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT, level INTEGER, stats TEXT, image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await query(`
        CREATE TABLE IF NOT EXISTS runes (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            branch TEXT, tier INTEGER, description TEXT, image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            display_name TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await query(`INSERT INTO users (username, password, display_name, role) VALUES ('admin','admin','Administrator','admin') ON CONFLICT (username) DO NOTHING`);
    await query(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL, email TEXT, subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await query(`
        CREATE TABLE IF NOT EXISTS user_hero_order (
            user_id INTEGER NOT NULL,
            hero_id INTEGER NOT NULL,
            tier TEXT NOT NULL, sort_order INTEGER NOT NULL,
            PRIMARY KEY (user_id, hero_id)
        )
    `);
    console.log('✅ PostgreSQL schema ready.');
}

initSchema().catch(err => console.error('Schema init error:', err.message));

// =================== API HEROES ===================

app.get('/api/heroes', async (req, res) => {
    try {
        const result = await query('SELECT * FROM heroes ORDER BY id ASC');
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/heroes/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM heroes WHERE id = $1', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Không tìm thấy tướng' });
        res.json({ message: 'success', data: result.rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/heroes', async (req, res) => {
    const { name, primary_role, secondary_role, tier, story, skill_p, skill_1, skill_2, skill_3,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img, items, builds,
            image_url, skins, win_rate, pick_rate, ban_rate, counters,
            recommended_arcanas, recommended_runes } = req.body;
    if (!name || !primary_role || !tier) return res.status(400).json({ error: 'Thiếu Name/Role/Tier' });

    try {
        const result = await query(`
            INSERT INTO heroes (name, primary_role, secondary_role, tier, story,
                skill_p, skill_1, skill_2, skill_3,
                skill_p_img, skill_1_img, skill_2_img, skill_3_img,
                items, builds, recommended_arcanas, recommended_runes,
                image_url, skins, win_rate, pick_rate, ban_rate, counters)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
            ON CONFLICT (name) DO UPDATE SET
                primary_role = EXCLUDED.primary_role,
                secondary_role = EXCLUDED.secondary_role,
                tier = EXCLUDED.tier,
                story = COALESCE(EXCLUDED.story, heroes.story),
                skill_p = COALESCE(EXCLUDED.skill_p, heroes.skill_p),
                skill_1 = COALESCE(EXCLUDED.skill_1, heroes.skill_1),
                skill_2 = COALESCE(EXCLUDED.skill_2, heroes.skill_2),
                skill_3 = COALESCE(EXCLUDED.skill_3, heroes.skill_3),
                builds = COALESCE(EXCLUDED.builds, heroes.builds),
                image_url = COALESCE(EXCLUDED.image_url, heroes.image_url),
                win_rate = COALESCE(EXCLUDED.win_rate, heroes.win_rate),
                pick_rate = COALESCE(EXCLUDED.pick_rate, heroes.pick_rate),
                ban_rate = COALESCE(EXCLUDED.ban_rate, heroes.ban_rate)
            RETURNING id
        `, [name, primary_role, secondary_role, tier || 'c', story,
            skill_p, skill_1, skill_2, skill_3,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img,
            items, builds, recommended_arcanas, recommended_runes,
            image_url, skins, win_rate, pick_rate, ban_rate, counters]);

        res.status(201).json({ message: 'success', id: result.rows[0].id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/heroes/:id', async (req, res) => {
    const { name, primary_role, secondary_role, tier, story, skill_p, skill_1, skill_2, skill_3,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img, items, builds,
            image_url, skins, win_rate, pick_rate, ban_rate, counters,
            recommended_arcanas, recommended_runes } = req.body;
    if (!name || !primary_role || !tier) return res.status(400).json({ error: 'Thiếu Name/Role/Tier' });

    try {
        await query(`
            UPDATE heroes SET
                name=$1, primary_role=$2, secondary_role=$3, tier=$4, story=$5,
                skill_p=$6, skill_1=$7, skill_2=$8, skill_3=$9,
                skill_p_img=$10, skill_1_img=$11, skill_2_img=$12, skill_3_img=$13,
                items=$14, builds=$15, recommended_arcanas=$16, recommended_runes=$17,
                image_url=$18, skins=$19, win_rate=$20, pick_rate=$21, ban_rate=$22, counters=$23
            WHERE id=$24
        `, [name, primary_role, secondary_role, tier, story,
            skill_p, skill_1, skill_2, skill_3,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img,
            items, builds, recommended_arcanas, recommended_runes,
            image_url, skins, win_rate, pick_rate, ban_rate, counters,
            req.params.id]);

        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/heroes/:id', async (req, res) => {
    try {
        await query('DELETE FROM heroes WHERE id = $1', [req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== API ITEMS ===================

app.get('/api/items', async (req, res) => {
    try {
        const result = await query('SELECT * FROM items ORDER BY name ASC');
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'success', data: result.rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/items', async (req, res) => {
    const { name, type, stat_atk, stat_def, stat_other, description, image_url, price } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên trang bị' });
    try {
        const result = await query(`
            INSERT INTO items (name, type, stat_atk, stat_def, stat_other, description, image_url, price)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            ON CONFLICT (name) DO UPDATE SET
                type=EXCLUDED.type, image_url=EXCLUDED.image_url, price=EXCLUDED.price
            RETURNING id
        `, [name, type, stat_atk, stat_def, stat_other, description, image_url, parseInt(price) || 0]);
        res.status(201).json({ message: 'success', id: result.rows[0].id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/items/:id', async (req, res) => {
    const { name, type, stat_atk, stat_def, stat_other, description, image_url, price } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên' });
    try {
        await query(`UPDATE items SET name=$1,type=$2,stat_atk=$3,stat_def=$4,stat_other=$5,description=$6,image_url=$7,price=$8 WHERE id=$9`,
            [name, type, stat_atk, stat_def, stat_other, description, image_url, parseInt(price) || 0, req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        await query('DELETE FROM items WHERE id=$1', [req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== API ARCANAS ===================

app.get('/api/arcanas', async (req, res) => {
    try {
        const result = await query('SELECT * FROM arcanas ORDER BY name ASC');
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/arcanas', async (req, res) => {
    const { name, color, level, stats, image_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên' });
    try {
        const result = await query(`
            INSERT INTO arcanas (name, color, level, stats, image_url)
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT (name) DO UPDATE SET image_url=EXCLUDED.image_url
            RETURNING id
        `, [name, color, parseInt(level) || null, stats, image_url]);
        res.status(201).json({ message: 'success', id: result.rows[0].id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/arcanas/:id', async (req, res) => {
    const { name, color, level, stats, image_url } = req.body;
    try {
        await query('UPDATE arcanas SET name=$1,color=$2,level=$3,stats=$4,image_url=$5 WHERE id=$6',
            [name, color, parseInt(level) || null, stats, image_url, req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/arcanas/:id', async (req, res) => {
    try {
        await query('DELETE FROM arcanas WHERE id=$1', [req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== API RUNES ===================

app.get('/api/runes', async (req, res) => {
    try {
        const result = await query('SELECT * FROM runes ORDER BY name ASC');
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/runes', async (req, res) => {
    const { name, branch, tier, description, image_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên' });
    try {
        const result = await query(`
            INSERT INTO runes (name, branch, tier, description, image_url)
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT (name) DO UPDATE SET image_url=EXCLUDED.image_url
            RETURNING id
        `, [name, branch, parseInt(tier) || null, description, image_url]);
        res.status(201).json({ message: 'success', id: result.rows[0].id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/runes/:id', async (req, res) => {
    const { name, branch, tier, description, image_url } = req.body;
    try {
        await query('UPDATE runes SET name=$1,branch=$2,tier=$3,description=$4,image_url=$5 WHERE id=$6',
            [name, branch, parseInt(tier) || null, description, image_url, req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/runes/:id', async (req, res) => {
    try {
        await query('DELETE FROM runes WHERE id=$1', [req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== API AUTH ===================

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Thiếu username hoặc password' });
    try {
        const result = await query('SELECT id, username, display_name, role FROM users WHERE username=$1 AND password=$2', [username, password]);
        if (!result.rows.length) return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        res.json({ message: 'success', user: result.rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/register', async (req, res) => {
    const { username, password, display_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Thiếu username hoặc password' });
    if (username.length < 3) return res.status(400).json({ error: 'Username phải có ít nhất 3 ký tự' });
    if (password.length < 4) return res.status(400).json({ error: 'Password phải có ít nhất 4 ký tự' });
    try {
        const result = await query(`
            INSERT INTO users (username, password, display_name, role)
            VALUES ($1,$2,$3,'user')
            RETURNING id, username, display_name, role
        `, [username.trim(), password, display_name || username]);
        res.status(201).json({ message: 'success', user: result.rows[0] });
    } catch (e) {
        if (e.message.includes('unique') || e.message.includes('duplicate')) {
            return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
        }
        res.status(500).json({ error: e.message });
    }
});

// =================== API FEEDBACK ===================

app.post('/api/feedback', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'Thiếu name/message' });
    try {
        await query('INSERT INTO feedbacks (name, email, subject, message) VALUES ($1,$2,$3,$4)',
            [name, email, subject, message]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/feedback', async (req, res) => {
    try {
        const result = await query('SELECT * FROM feedbacks ORDER BY created_at DESC');
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/feedback/:id', async (req, res) => {
    try {
        await query('DELETE FROM feedbacks WHERE id=$1', [req.params.id]);
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== API USER TIERS ===================

app.get('/api/user-tiers/:userId', async (req, res) => {
    try {
        const result = await query('SELECT * FROM user_hero_order WHERE user_id=$1 ORDER BY tier, sort_order', [req.params.userId]);
        res.json({ message: 'success', data: result.rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/user-tiers', async (req, res) => {
    const { userId, order } = req.body;
    if (!userId || !Array.isArray(order)) return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    try {
        await query('DELETE FROM user_hero_order WHERE user_id=$1', [userId]);
        for (let i = 0; i < order.length; i++) {
            const { heroId, tier } = order[i];
            await query('INSERT INTO user_hero_order (user_id, hero_id, tier, sort_order) VALUES ($1,$2,$3,$4)',
                [userId, heroId, tier, i]);
        }
        res.json({ message: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// =================== START (Local) ===================
// Trong Vercel, module.exports = app; đủ rồi
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server PostgreSQL đang chạy tại: http://localhost:${PORT}`);
    });
}

module.exports = app;
