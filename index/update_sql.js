const fs = require('fs');
const path = require('path');

// 1. Đọc dữ liệu ảnh từ JSON
const imagesPath = path.join(__dirname, 'hero_images.json');
let heroImgMap = {};
try {
    const rawData = fs.readFileSync(imagesPath, 'utf8');
    heroImgMap = JSON.parse(rawData);
    console.log(`Đã nạp ${Object.keys(heroImgMap).length} link ảnh từ JSON.`);
} catch (err) {
    console.error('Không thể đọc file hero_images.json:', err.message);
    process.exit(1);
}

// 2. Đọc file SQL
const sqlPath = path.join(__dirname, 'p-T.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

const lines = sql.split('\n');
let count = 0;

const result = lines.map(line => {
    // Tìm các dòng chứa dữ liệu tướng (bắt đầu bằng dấu ngoặc và nháy đơn)
    if (line.match(/^\s*\(\'/)) {
        const parts = line.split(',');
        
        // Lấy tên tướng từ phần tử đầu tiên
        let nameRaw = parts[0]; 
        let name = nameRaw.replace(/^\s*\(\'/, '').replace(/\'$/, '').trim();
        let nameKey = name.replace(/''/g, "'"); // Xử lý escape squote trong SQL nếu có
        
        // Lấy URL từ bản đồ (nếu có)
        let targetUrl = heroImgMap[nameKey] ? "'" + heroImgMap[nameKey] + "'" : 'NULL';
        
        // Cấu trúc mong muốn: 11 cột. Cột cuối cùng (thứ 11) là image_url.
        if (parts.length >= 11) {
            // Lấy 10 cột đầu tiên
            const baseCols = parts.slice(0, 10).join(',');
            
            // Xác định ký tự kết thúc (dấu phẩy hoặc dấu chấm phẩy)
            let suffix = line.trim().endsWith('),') ? '),' : ');';
            
            if (targetUrl !== 'NULL') count++;
            return `${baseCols}, ${targetUrl}${suffix}`;
        }
    }
    return line;
}).join('\n');

// 3. Ghi lại file SQL
fs.writeFileSync(sqlPath, result);
console.log(`Đã cập nhật thành công ${count} tướng với link ảnh vào p-T.sql!`);
