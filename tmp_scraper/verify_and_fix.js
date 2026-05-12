/**
 * verify_and_fix.js
 * 1. Fix lỗi key rỗng "" (Gildur scraped về tên trống)
 * 2. So sánh danh sách 128 với dữ liệu hiện có
 * 3. Báo cáo những tướng còn thiếu
 */

const fs = require('fs');
const path = require('path');

const FINAL = path.resolve(__dirname, 'hero_skins_final.json');
const SKINS = path.resolve(__dirname, 'hero_skins_data.json');

const finalData = JSON.parse(fs.readFileSync(FINAL, 'utf-8'));
const skinsData = JSON.parse(fs.readFileSync(SKINS, 'utf-8'));

// Danh sách đầy đủ 128 mục theo user (Flowborn = 2 dạng)
const USER_LIST_128 = [
    'Flowborn (Pháp Sư)', 'Flowborn (Xạ Thủ)',
    'Dyadia', 'Edras', 'Goverra', 'Heino', 'Billow', 'Bolt Baron',
    'Biron', 'Dolia', 'Charlotte', 'Tachi', 'Dirak', 'Qi', 'Erin',
    'Ming', 'Bijan', 'Bonnie', 'Teeri', 'Yue', 'Yan', 'Aya', 'Aoi',
    'Iggy', 'Bright', 'Lorion', 'Dextra', 'Sinestrea', 'Thorne',
    'Allain', 'Zata', 'Rouie', 'Laville', 'Paine', 'Ata', 'Keera',
    'Ishar', "Eland'orr", 'Krizzix', 'Volkath', 'Celica', 'Zip',
    'Enzo', 'Yena', 'Errol', 'Capheny', 'Hayate', "D'Arcy", 'Veres',
    'Florentino', 'Sephera', 'Quillen', 'Wiro', 'Richter', 'Elsu',
    "Y'bneth", 'Amily', 'Annette', 'Baldum', 'Roxie', 'Marja',
    'Rourke', 'Arum', 'Wisp', 'The Flash', 'Max', 'Liliana', 'Tulen',
    'Omen', 'Lindis', 'TeeMee', 'Moren', "Kil'Groth", 'Xeniel',
    'Wonder Woman', 'Superman', "Tel'Annas", 'Astrid', 'Ryoma',
    'Stuart', 'Arduin', 'Zill', 'Murad', 'Ignis', 'Zuka', 'Airi',
    'Kaine', 'Lauriel', 'Raz', 'Skud', 'Preyta', 'Ilumia', 'Slimz',
    'Arthur', 'Kriknak', 'Ngộ Không', 'Maloch', 'Helen', 'Jinna',
    'Cresht', 'Natalya', 'Lumburr', 'Fennik', 'Aleister', 'Grakk',
    'Nakroth', 'Taara', 'Toro', 'Yorn', 'Gildur', 'Alice', "Azzen'Ka",
    'Ormarr', 'Butterfly', 'Violet', 'Chaugnar', 'Điêu Thuyền',
    'Zephys', 'Kahlii', 'Omega', 'Triệu Vân', 'Mganga', 'Krixi',
    'Mina', 'Lữ Bố', 'Veera', 'Thane', 'Valhein'
];

console.log('📊 USER_LIST_128 count:', USER_LIST_128.length);

const currentKeys = Object.keys(finalData['Dữ liệu']);
console.log('📊 Hiện có trong file:', currentKeys.length, 'entries');

// Fix lỗi: key rỗng "" = Gildur
if (finalData['Dữ liệu'][''] !== undefined) {
    console.log('\n🔧 Fix lỗi: key rỗng → Gildur');
    finalData['Dữ liệu']['Gildur'] = finalData['Dữ liệu'][''];
    delete finalData['Dữ liệu'][''];
    console.log('   ✅ Đã đổi "" → "Gildur"');
}

// Normalize để so sánh
function normalize(s) {
    return s.toLowerCase()
        .replace(/['\u2019`]/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

const currentNorms = new Map(
    Object.keys(finalData['Dữ liệu']).map(k => [normalize(k), k])
);

// Tìm những tướng trong user_list chưa có trong file
const missing = [];
const matched = [];

USER_LIST_128.forEach(name => {
    const norm = normalize(name);
    // Try exact match first, then partial
    let found = currentNorms.has(norm);
    if (!found) {
        // Try contains
        for (const [k, v] of currentNorms) {
            if (k.includes(norm) || norm.includes(k)) {
                found = true;
                break;
            }
        }
    }
    if (found) matched.push(name);
    else missing.push(name);
});

console.log('\n✅ Khớp:', matched.length);
console.log('❌ Thiếu:', missing.length);
if (missing.length > 0) {
    console.log('\nDanh sách thiếu:');
    missing.forEach(m => console.log('  -', m));
}

// Tìm keys trong file KHÔNG có trong user_list (thừa)
const extra = [];
Object.keys(finalData['Dữ liệu']).forEach(key => {
    const norm = normalize(key);
    const inUserList = USER_LIST_128.some(u => {
        const un = normalize(u);
        return un === norm || un.includes(norm) || norm.includes(un);
    });
    if (!inUserList) extra.push(key);
});

if (extra.length > 0) {
    console.log('\n⚠️  Entries thừa (không trong user_list):');
    extra.forEach(e => console.log('  +', e));
}

// Cập nhật tổng
finalData['Tổng tướng tìm thấy'] = Object.keys(finalData['Dữ liệu']).length;
fs.writeFileSync(FINAL, JSON.stringify(finalData, null, 4), 'utf-8');
console.log('\n💾 Đã lưu file cập nhật. Tổng hiện tại:', finalData['Tổng tướng tìm thấy']);

// Kiểm tra từ hero_skins_data.json có heroes nào match với missing không
if (missing.length > 0) {
    console.log('\n🔍 Tìm trong hero_skins_data.json:');
    const allHeroes = skinsData['Dữ liệu tướng'];
    missing.forEach(name => {
        const n = normalize(name).replace(/[()]/g, '').trim();
        const found = allHeroes.find(h => 
            normalize(h['Tên tướng']).includes(n) || n.includes(normalize(h['Tên tướng']))
        );
        if (found) {
            console.log(`  ✅ "${name}" → "${found['Tên tướng']}" (${found['Trang phục'].length} skins)`);
        } else {
            console.log(`  ❌ "${name}" → KHÔNG TÌM THẤY`);
        }
    });
}
