const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Kết nối Database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Lỗi khi kết nối Database SQLite:', err.message);
    } else {
        console.log('Đã kết nối thành công tới Database SQLite.');

        // Tự động thêm cột skins nếu chưa có (migration an toàn)
        db.run(`ALTER TABLE heroes ADD COLUMN skins TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error('Lỗi migration skins:', err.message);
            } else if (!err) {
                console.log('✅ Đã thêm cột skins vào database.');
            }
        });

        // Migration: thêm cột builds để hỗ trợ nhiều lối lên trang bị
        db.run(`ALTER TABLE heroes ADD COLUMN builds TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error('Lỗi migration builds:', err.message);
            } else if (!err) {
                console.log('✅ Đã thêm cột builds vào database.');
            }
        });

        // Migration: thêm các cột ảnh kỹ năng
        const skillImgCols = ['skill_p_img', 'skill_1_img', 'skill_2_img', 'skill_3_img'];
        skillImgCols.forEach(col => {
            db.run(`ALTER TABLE heroes ADD COLUMN ${col} TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    console.error(`Lỗi migration ${col}:`, err.message);
                } else if (!err) {
                    console.log(`✅ Đã thêm cột ${col} vào database.`);
                }
            });
        });

        // Migration: thêm các cột ngọc, phù hiệu
        const extraCols = ['recommended_arcanas', 'recommended_runes'];
        extraCols.forEach(col => {
            db.run(`ALTER TABLE heroes ADD COLUMN ${col} TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    console.error(`Lỗi migration ${col}:`, err.message);
                } else if (!err) {
                    console.log(`✅ Đã thêm cột ${col} vào database.`);
                }
            });
        });

        // Tự động tạo bảng items nếu chưa có
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            type TEXT,
            stat_atk TEXT,
            stat_def TEXT,
            stat_other TEXT,
            description TEXT,
            image_url TEXT,
            price INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng items:', err.message);
            else console.log('✅ Bảng items đã sẵn sàng.');
        });

        // Tự động tạo bảng ngọc (arcanas)
        db.run(`CREATE TABLE IF NOT EXISTS arcanas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            color TEXT,
            level INTEGER,
            stats TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng arcanas:', err.message);
            else console.log('✅ Bảng arcanas đã sẵn sàng.');
        });

        // Tự động tạo bảng phù hiệu (runes)
        db.run(`CREATE TABLE IF NOT EXISTS runes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            branch TEXT,
            tier INTEGER,
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng runes:', err.message);
            else console.log('✅ Bảng runes đã sẵn sàng.');
        });

        // Tự động tạo bảng feedbacks nếu chưa có
        db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng feedbacks:', err.message);
            else console.log('✅ Bảng feedbacks đã sẵn sàng.');
        });

        // Bảng Users (Đăng nhập)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            display_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng users:', err.message);
            else {
                console.log('✅ Bảng users đã sẵn sàng.');
                // Tạo user admin mặc định nếu chưa có
                db.run(`INSERT OR IGNORE INTO users (username, password, display_name) VALUES ('admin', 'admin', 'Administrator')`);
            }
        });

        // Bảng User Hero Order (Lưu sắp xếp tier list của từng user)
        db.run(`CREATE TABLE IF NOT EXISTS user_hero_order (
            user_id INTEGER NOT NULL,
            hero_id INTEGER NOT NULL,
            tier TEXT NOT NULL,
            sort_order INTEGER NOT NULL,
            PRIMARY KEY (user_id, hero_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (hero_id) REFERENCES heroes(id)
        )`, (err) => {
            if (err) console.error('Lỗi khởi tạo bảng user_hero_order:', err.message);
            else console.log('✅ Bảng user_hero_order đã sẵn sàng.');
        });
    }
});

// =================== API HEROES ===================

// GET: Toàn bộ tướng
app.get('/api/heroes', (req, res) => {
    db.all(`SELECT * FROM heroes ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// GET: 1 tướng theo ID
app.get('/api/heroes/:id', (req, res) => {
    db.get(`SELECT * FROM heroes WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Không tìm thấy tướng" });
        res.json({ message: "success", data: row });
    });
});

// POST: Thêm tướng mới
app.post('/api/heroes', (req, res) => {
    const { name, primary_role, secondary_role, tier, story, skill_p, skill_1, skill_2, skill_3, items, builds, image_url, skins,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img, win_rate, pick_rate, ban_rate, counters, recommended_arcanas, recommended_runes } = req.body;
    if (!name || !primary_role || !tier) {
        return res.status(400).json({ error: "Thiếu trường bắt buộc (Name, Role, Tier)" });
    }

    const sql = `INSERT INTO heroes (name, primary_role, secondary_role, tier, story, skill_p, skill_1, skill_2, skill_3, items, builds, image_url, skins, skill_p_img, skill_1_img, skill_2_img, skill_3_img, win_rate, pick_rate, ban_rate, counters, recommended_arcanas, recommended_runes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(name) DO UPDATE SET
                 primary_role = excluded.primary_role,
                 secondary_role = excluded.secondary_role,
                 tier = excluded.tier,
                 story = CASE WHEN excluded.story IS NOT NULL THEN excluded.story ELSE heroes.story END,
                 skill_p = CASE WHEN excluded.skill_p IS NOT NULL THEN excluded.skill_p ELSE heroes.skill_p END,
                 skill_1 = CASE WHEN excluded.skill_1 IS NOT NULL THEN excluded.skill_1 ELSE heroes.skill_1 END,
                 skill_2 = CASE WHEN excluded.skill_2 IS NOT NULL THEN excluded.skill_2 ELSE heroes.skill_2 END,
                 skill_3 = CASE WHEN excluded.skill_3 IS NOT NULL THEN excluded.skill_3 ELSE heroes.skill_3 END,
                 items = CASE WHEN excluded.items IS NOT NULL THEN excluded.items ELSE heroes.items END,
                 builds = CASE WHEN excluded.builds IS NOT NULL THEN excluded.builds ELSE heroes.builds END,
                 image_url = CASE WHEN excluded.image_url IS NOT NULL THEN excluded.image_url ELSE heroes.image_url END,
                 skins = CASE WHEN excluded.skins IS NOT NULL THEN excluded.skins ELSE heroes.skins END,
                 skill_p_img = CASE WHEN excluded.skill_p_img IS NOT NULL THEN excluded.skill_p_img ELSE heroes.skill_p_img END,
                 skill_1_img = CASE WHEN excluded.skill_1_img IS NOT NULL THEN excluded.skill_1_img ELSE heroes.skill_1_img END,
                 skill_2_img = CASE WHEN excluded.skill_2_img IS NOT NULL THEN excluded.skill_2_img ELSE heroes.skill_2_img END,
                 skill_3_img = CASE WHEN excluded.skill_3_img IS NOT NULL THEN excluded.skill_3_img ELSE heroes.skill_3_img END,
                 win_rate = CASE WHEN excluded.win_rate IS NOT NULL THEN excluded.win_rate ELSE heroes.win_rate END,
                 pick_rate = CASE WHEN excluded.pick_rate IS NOT NULL THEN excluded.pick_rate ELSE heroes.pick_rate END,
                 ban_rate = CASE WHEN excluded.ban_rate IS NOT NULL THEN excluded.ban_rate ELSE heroes.ban_rate END,
                 counters = CASE WHEN excluded.counters IS NOT NULL THEN excluded.counters ELSE heroes.counters END,
                 recommended_arcanas = CASE WHEN excluded.recommended_arcanas IS NOT NULL THEN excluded.recommended_arcanas ELSE heroes.recommended_arcanas END,
                 recommended_runes = CASE WHEN excluded.recommended_runes IS NOT NULL THEN excluded.recommended_runes ELSE heroes.recommended_runes END`;
    
    const params = [
        name, primary_role, secondary_role || null, tier,
        story || null, skill_p || null, skill_1 || null, skill_2 || null, skill_3 || null,
        items || null, builds || null, image_url || null, skins || null,
        skill_p_img || null, skill_1_img || null, skill_2_img || null, skill_3_img || null,
        win_rate || null, pick_rate || null, ban_rate || null, counters || null,
        recommended_arcanas || null, recommended_runes || null
    ];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: { id: this.lastID || 0 } });
    });
});

// PUT: Cập nhật tướng
app.put('/api/heroes/:id', (req, res) => {
    const { name, primary_role, secondary_role, tier, story, skill_p, skill_1, skill_2, skill_3, items, builds, image_url, skins,
            skill_p_img, skill_1_img, skill_2_img, skill_3_img, win_rate, pick_rate, ban_rate, counters, recommended_arcanas, recommended_runes } = req.body;

    const sql = `UPDATE heroes SET
                 name = COALESCE(?, name),
                 primary_role = COALESCE(?, primary_role),
                 secondary_role = ?,
                 tier = COALESCE(?, tier),
                 story = COALESCE(?, story),
                 skill_p = COALESCE(?, skill_p),
                 skill_1 = COALESCE(?, skill_1),
                 skill_2 = COALESCE(?, skill_2),
                 skill_3 = COALESCE(?, skill_3),
                 items = COALESCE(?, items),
                 builds = COALESCE(?, builds),
                 image_url = COALESCE(?, image_url),
                 skins = ?,
                 skill_p_img = ?,
                 skill_1_img = ?,
                 skill_2_img = ?,
                 skill_3_img = ?,
                 win_rate = ?,
                 pick_rate = ?,
                 ban_rate = ?,
                 counters = ?,
                 recommended_arcanas = ?,
                 recommended_runes = ?
                 WHERE id = ?`;

    const params = [
        name, primary_role, secondary_role || null, tier,
        story, skill_p, skill_1, skill_2, skill_3,
        items, builds || null, image_url,
        skins || null,
        skill_p_img || null, skill_1_img || null, skill_2_img || null, skill_3_img || null,
        win_rate || null, pick_rate || null, ban_rate || null, counters || null,
        recommended_arcanas || null, recommended_runes || null,
        req.params.id
    ];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Không tìm thấy tướng để cập nhật" });
        res.json({ message: "success" });
    });
});

// DELETE: Xóa tướng
app.delete('/api/heroes/:id', (req, res) => {
    db.run(`DELETE FROM heroes WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Không tìm thấy tướng để xóa" });
        res.json({ message: "success" });
    });
});

// =================== API ITEMS ===================

// GET: Toàn bộ trang bị
app.get('/api/items', (req, res) => {
    db.all(`SELECT * FROM items ORDER BY type ASC, name ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// GET: 1 trang bị theo ID
app.get('/api/items/:id', (req, res) => {
    db.get(`SELECT * FROM items WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Không tìm thấy trang bị' });
        res.json({ message: 'success', data: row });
    });
});

// POST: Thêm trang bị mới
app.post('/api/items', (req, res) => {
    const { name, type, stat_atk, stat_def, stat_other, description, image_url, price } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên trang bị' });
    const sql = `INSERT INTO items (name, type, stat_atk, stat_def, stat_other, description, image_url, price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(name) DO UPDATE SET
                 type = excluded.type,
                 stat_atk = excluded.stat_atk,
                 stat_def = excluded.stat_def,
                 stat_other = excluded.stat_other,
                 description = CASE WHEN excluded.description IS NOT NULL THEN excluded.description ELSE items.description END,
                 image_url = CASE WHEN excluded.image_url IS NOT NULL THEN excluded.image_url ELSE items.image_url END,
                 price = excluded.price`;
    db.run(sql, [name, type || null, stat_atk || null, stat_def || null, stat_other || null,
                 description || null, image_url || null, price || 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: { id: this.lastID || 0 } });
    });
});

// PUT: Cập nhật trang bị
app.put('/api/items/:id', (req, res) => {
    const { name, type, stat_atk, stat_def, stat_other, description, image_url, price } = req.body;
    const sql = `UPDATE items SET
                 name = COALESCE(?, name), type = ?, stat_atk = ?, stat_def = ?,
                 stat_other = ?, description = ?, image_url = ?, price = ?
                 WHERE id = ?`;
    db.run(sql, [name, type || null, stat_atk || null, stat_def || null, stat_other || null,
                 description || null, image_url || null, price || 0, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy trang bị' });
        res.json({ message: 'success' });
    });
});

// DELETE: Xóa trang bị
app.delete('/api/items/:id', (req, res) => {
    db.run(`DELETE FROM items WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy trang bị' });
        res.json({ message: 'success' });
    });
});

// =================== API ARCANAS (NGỌC) ===================

// GET: Toàn bộ ngọc
app.get('/api/arcanas', (req, res) => {
    db.all(`SELECT * FROM arcanas ORDER BY level DESC, color ASC, name ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// GET: 1 ngọc theo ID
app.get('/api/arcanas/:id', (req, res) => {
    db.get(`SELECT * FROM arcanas WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Không tìm thấy ngọc' });
        res.json({ message: 'success', data: row });
    });
});

// POST: Thêm ngọc
app.post('/api/arcanas', (req, res) => {
    const { name, color, level, stats, image_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên ngọc' });
    const sql = `INSERT INTO arcanas (name, color, level, stats, image_url)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(name) DO UPDATE SET
                 color = excluded.color,
                 level = excluded.level,
                 stats = excluded.stats,
                 image_url = CASE WHEN excluded.image_url IS NOT NULL THEN excluded.image_url ELSE arcanas.image_url END`;
    db.run(sql, [name, color || null, level || null, stats || null, image_url || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: { id: this.lastID || 0 } });
    });
});

// PUT: Cập nhật ngọc
app.put('/api/arcanas/:id', (req, res) => {
    const { name, color, level, stats, image_url } = req.body;
    const sql = `UPDATE arcanas SET
                 name = COALESCE(?, name), color = ?, level = ?, stats = ?, image_url = ?
                 WHERE id = ?`;
    db.run(sql, [name, color || null, level || null, stats || null, image_url || null, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy ngọc' });
        res.json({ message: 'success' });
    });
});

// DELETE: Xóa ngọc
app.delete('/api/arcanas/:id', (req, res) => {
    db.run(`DELETE FROM arcanas WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy ngọc' });
        res.json({ message: 'success' });
    });
});


// =================== API RUNES (PHÙ HIỆU) ===================

// GET: Toàn bộ phù hiệu
app.get('/api/runes', (req, res) => {
    db.all(`SELECT * FROM runes ORDER BY branch ASC, tier ASC, name ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// GET: 1 phù hiệu theo ID
app.get('/api/runes/:id', (req, res) => {
    db.get(`SELECT * FROM runes WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Không tìm thấy phù hiệu' });
        res.json({ message: 'success', data: row });
    });
});

// POST: Thêm phù hiệu
app.post('/api/runes', (req, res) => {
    const { name, branch, tier, description, image_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên phù hiệu' });
    const sql = `INSERT INTO runes (name, branch, tier, description, image_url)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(name) DO UPDATE SET
                 branch = excluded.branch,
                 tier = excluded.tier,
                 description = CASE WHEN excluded.description IS NOT NULL THEN excluded.description ELSE runes.description END,
                 image_url = CASE WHEN excluded.image_url IS NOT NULL THEN excluded.image_url ELSE runes.image_url END`;
    db.run(sql, [name, branch || null, tier || null, description || null, image_url || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: { id: this.lastID || 0 } });
    });
});

// PUT: Cập nhật phù hiệu
app.put('/api/runes/:id', (req, res) => {
    const { name, branch, tier, description, image_url } = req.body;
    const sql = `UPDATE runes SET
                 name = COALESCE(?, name), branch = ?, tier = ?, description = ?, image_url = ?
                 WHERE id = ?`;
    db.run(sql, [name, branch || null, tier || null, description || null, image_url || null, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy phù hiệu' });
        res.json({ message: 'success' });
    });
});

// DELETE: Xóa phù hiệu
app.delete('/api/runes/:id', (req, res) => {
    db.run(`DELETE FROM runes WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy phù hiệu' });
        res.json({ message: 'success' });
    });
});

// =================== API USER & TIER PERSISTENCE ===================

// GET: Lấy sắp xếp custom của user
app.get('/api/user-tiers/:username', (req, res) => {
    const sql = `
        SELECT uho.* FROM user_hero_order uho
        JOIN users u ON uho.user_id = u.id
        WHERE u.username = ?
        ORDER BY uho.sort_order ASC
    `;
    db.all(sql, [req.params.username], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// POST: Lưu sắp xếp custom của user
app.post('/api/user-tiers', (req, res) => {
    const { username, tiers } = req.body; // tiers: array of {hero_id, tier, sort_order}
    if (!username || !Array.isArray(tiers)) return res.status(400).json({ error: "Dữ liệu không hợp lệ" });

    db.get(`SELECT id FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "Không tìm thấy người dùng" });

        db.serialize(() => {
            db.run(`BEGIN TRANSACTION`);
            
            // Xóa cũ (hoặc dùng UPSERT)
            const deleteSql = `DELETE FROM user_hero_order WHERE user_id = ?`;
            db.run(deleteSql, [user.id]);

            const insertSql = `INSERT INTO user_hero_order (user_id, hero_id, tier, sort_order) VALUES (?, ?, ?, ?)`;
            const stmt = db.prepare(insertSql);
            
            tiers.forEach(item => {
                stmt.run(user.id, item.hero_id, item.tier, item.sort_order);
            });
            
            stmt.finalize();
            db.run(`COMMIT`, (err) => {
                if (err) return res.status(500).json({ error: "Lỗi lưu sắp xếp" });
                res.json({ message: "success" });
            });
        });
    });
});

// POST: Đăng nhập (Mock simple)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
        // Trả về info user (không có password)
        const { password: _, ...user } = row;
        res.json({ message: "success", user });
    });
});

// POST: Đăng ký
app.post('/api/register', (req, res) => {
    const { username, password, display_name } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Thiếu username hoặc password" });
    }

    db.run(`INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)`, [username, password, display_name || username], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "success", user: { id: this.lastID, username, display_name: display_name || username } });
    });
});

// POST: Gửi ý kiến góp ý
app.post('/api/feedbacks', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: "Thiếu tên hoặc nội dung góp ý" });
    }

    const sql = `INSERT INTO feedbacks (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email || null, subject || null, message], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: { id: this.lastID } });
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`Mở Frontend: http://localhost:${PORT}/index/index.html`);
});
