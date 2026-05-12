/**
 * add_flowborn.js
 * Thêm Flowborn với cả 2 dạng (Pháp sư + Xạ thủ) vào hero_skins_final.json
 */

const fs = require('fs');
const path = require('path');

const FINAL = path.resolve(__dirname, 'hero_skins_final.json');
const data = JSON.parse(fs.readFileSync(FINAL, 'utf-8'));

// Flowborn (dạng chung - 1 trang web, nhưng có 2 bộ kỹ năng)
const FLOWBORN_ICON = 'https://lienquan.garena.vn/wp-content/uploads/2026/04/IMG-SQR-0150x0150-080151-ket-thuc2.jpg';

data['Dữ liệu']['Flowborn (Pháp Sư)'] = {
    'Kỹ năng': [
        'Dòng chảy năng lượng',  // Nội tại (chung)
        'Dòng chảy hội tụ',      // Chiêu 1 Pháp Sư
        'Nỏ tiễn phá không',     // Chiêu 2 chung
        'Nỏ tiễn liên hoàn'      // Chiêu 3 chung
    ],
    'Icon Skin': [
        { 'Tên': 'Flowborn', 'Icon': FLOWBORN_ICON }
    ],
    'Icon tướng': FLOWBORN_ICON,
    'Ghi chú dạng': 'Dạng Pháp Sư - kỹ năng sẽ đổi sang chiêu phép thuật'
};

data['Dữ liệu']['Flowborn (Xạ Thủ)'] = {
    'Kỹ năng': [
        'Dòng chảy năng lượng',  // Nội tại (chung)
        'Dòng chảy hội tụ',      // Chiêu 1 Xạ Thủ
        'Nỏ tiễn phá không',     // Chiêu 2 chung
        'Nỏ tiễn liên hoàn'      // Chiêu 3 chung
    ],
    'Icon Skin': [
        { 'Tên': 'Flowborn', 'Icon': FLOWBORN_ICON }
    ],
    'Icon tướng': FLOWBORN_ICON,
    'Ghi chú dạng': 'Dạng Xạ Thủ - kỹ năng sẽ đổi sang chiêu vật lý/cung tên'
};

data['Tổng tướng tìm thấy'] = Object.keys(data['Dữ liệu']).length;
data['Ghi chú Flowborn'] = 'Flowborn có 2 dạng biến đổi (Pháp Sư / Xạ Thủ) trong cùng 1 trang web. ' +
    'Garena chỉ có 1 trang chi tiết duy nhất tại /hoc-vien/tuong-skin/d/flowborn/';

fs.writeFileSync(FINAL, JSON.stringify(data, null, 4), 'utf-8');

console.log(`✅ Đã thêm Flowborn (Pháp Sư) và Flowborn (Xạ Thủ)`);
console.log(`📊 Tổng tướng trong file: ${data['Tổng tướng tìm thấy']}`);
console.log(`💾 Đã cập nhật: ${FINAL}`);
