/**
 * process_hero_skins.js
 * Chuyển đổi hero_skins_data.json sang định dạng yêu cầu:
 * { "Tên tướng": { "Kỹ năng": [...], "Icon Skin": [...] } }
 * Output: hero_skins_final.json
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'hero_skins_data.json');
const OUTPUT = path.resolve(__dirname, 'hero_skins_final.json');

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const heroes = raw['Dữ liệu tướng'];

// Danh sách tướng yêu cầu (theo tên gốc)
const REQUESTED = [
    'Flowborn','Dyadia','Edras','Goverra','Heino','Billow','Bolt Baron',
    'Biron','Dolia','Charlotte','Tachi','Dirak','Qi','Erin','Ming','Bijan',
    'Bonnie','Teeri','Yue','Yan','Aya','Aoi','Iggy','Bright','Lorion',
    'Dextra','Sinestrea','Thorne','Allain','Zata','Rouie','Laville','Paine',
    'Ata','Keera','Ishar',"Eland'orr",'Krizzix','Volkath','Celica','Zip',
    'Enzo','Yena','Errol','Capheny','Hayate',"D'Arcy",'Veres','Florentino',
    'Sephera','Quillen','Wiro','Richter','Elsu',"Y'bneth",'Amily','Annette',
    'Baldum','Roxie','Marja','Rourke','Arum','Wisp','The Flash','Max',
    'Liliana','Tulen','Omen','Lindis','TeeMee','Moren',"Kil'Groth",'Xeniel',
    'Wonder Woman','Superman',"Tel'Annas",'Astrid','Ryoma','Stuart','Arduin',
    'Zill','Murad','Ignis','Zuka','Airi','Kaine','Lauriel','Raz','Skud',
    'Preyta','Ilumia','Slimz','Arthur','Kriknak','Ngộ Không','Maloch',
    'Helen','Jinna','Cresht','Natalya','Lumburr','Fennik','Aleister',
    'Grakk','Nakroth','Taara','Toro','Yorn','Gildur','Alice',"Azzen'Ka",
    'Ormarr','Butterfly','Violet','Chaugnar','Điêu Thuyền','Zephys',
    'Kahlii','Omega','Triệu Vân','Mganga','Krixi','Mina','Lữ Bố',
    'Veera','Thane','Valhein'
];

// Normalize tên để so sánh linh hoạt
function normalize(s) {
    return s.toLowerCase()
        .replace(/['\u2019]/g, '')
        .replace(/\s+/g, '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const normMap = new Map();
heroes.forEach(h => normMap.set(normalize(h['Tên tướng']), h));

const result = {};
const found = [];
const notFound = [];

REQUESTED.forEach(req => {
    // Thử tìm chính xác trước
    const hero = heroes.find(h => h['Tên tướng'].toLowerCase() === req.toLowerCase())
              || heroes.find(h => normalize(h['Tên tướng']) === normalize(req))
              || heroes.find(h => normalize(h['Tên tướng']).includes(normalize(req)))
              || heroes.find(h => normalize(req).includes(normalize(h['Tên tướng'])));

    if (hero) {
        result[hero['Tên tướng']] = {
            'Kỹ năng': hero['Kỹ năng'],
            'Icon Skin': hero['Trang phục'].map(s => ({
                'Tên': s['Tên'],
                'Icon': s['Icon']
            })),
            'Icon tướng': hero['Icon tướng']
        };
        found.push(`${req} → ${hero['Tên tướng']}`);
    } else {
        notFound.push(req);
    }
});

const finalOutput = {
    'Ghi chú': 'Dữ liệu này chứa URL ảnh icon gốc, bạn có thể tự hiển thị nó mà không có khung viền CSS.',
    'Thời gian': new Date().toLocaleString('vi-VN'),
    'Tổng tướng tìm thấy': found.length,
    'Tướng không tìm thấy': notFound,
    'Dữ liệu': result
};

fs.writeFileSync(OUTPUT, JSON.stringify(finalOutput, null, 4), 'utf-8');

console.log(`✅ Đã xử lý xong!`);
console.log(`📊 Tìm thấy: ${found.length}/${REQUESTED.length} tướng`);
if (notFound.length > 0) {
    console.log(`\n⚠️  Không tìm thấy (${notFound.length}):`);
    notFound.forEach(n => console.log('  -', n));
}
console.log(`\n💾 Đã lưu: ${OUTPUT}`);

// Thống kê nhanh
let totalSkins = 0;
Object.values(result).forEach(h => totalSkins += h['Icon Skin'].length);
console.log(`📸 Tổng skin: ${totalSkins} skins từ ${found.length} tướng`);
