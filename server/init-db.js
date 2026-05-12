const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const sqlPath = path.resolve(__dirname, '../index/p-T.sql');

// 1. Đọc file SQL và xử lý để an toàn hơn
let sql = fs.readFileSync(sqlPath, 'utf8');

// Loại bỏ các lệnh xóa dữ liệu nguy hiểm nếu lỡ có trong file SQL
sql = sql.replace(/DROP TABLE IF EXISTS/gi, '-- Đã chặn lệnh DROP:');
sql = sql.replace(/DELETE FROM/gi, '-- Đã chặn lệnh DELETE:');

// Chuyển INSERT thành INSERT OR REPLACE để giữ lại bản ghi và chỉ cập nhật thông tin mới
sql = sql.replace(/INSERT INTO/gi, 'INSERT OR REPLACE INTO');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Lỗi kết nối:', err.message);
    console.log('--- Đang kiểm tra và cập nhật Database ---');
});

// Chạy các câu lệnh SQL đã được làm sạch
db.exec(sql, (err) => {
    if (err) {
        console.error('Lỗi thực thi SQL:', err.message);
    } else {
        console.log('✅ Dữ liệu đã được đồng bộ thành công!');
        console.log('💡 Lưu ý: Các thay đổi cũ của bạn vẫn được giữ lại.');
    }
    db.close();
});