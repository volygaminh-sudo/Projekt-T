const fs = require('fs');
const path = require('path');

const finalJsonPath = path.resolve(__dirname, 'tmp_scraper/hero_skins_final.json');
const heroesJsonPath = path.resolve(__dirname, 'data/heroes.json');

const finalData = JSON.parse(fs.readFileSync(finalJsonPath, 'utf-8'))['Dữ liệu'];
const heroesDb = JSON.parse(fs.readFileSync(heroesJsonPath, 'utf-8'));

const nameMap = {
    'Brunhilda': 'Celica',
    'Diao Chan': 'Điêu Thuyền',
    'Riktor': 'Richter',
    'Batman': 'Stuart',
};

let updated = 0;

for (const hero of heroesDb) {
    let nameToSearch = nameMap[hero.name] || hero.name.trim();

    if (nameToSearch.toLowerCase() === 'flowborn') {
        nameToSearch = 'Flowborn (Pháp Sư)'; 
    }

    let match = finalData[nameToSearch];
    if (!match) {
        // Fallback: try case-insensitive or partial
        const key = Object.keys(finalData).find(k => k.toLowerCase().includes(nameToSearch.toLowerCase()) || nameToSearch.toLowerCase().includes(k.toLowerCase()));
        if (key) {
            match = finalData[key];
        }
    }

    if (match && match['Icon tướng'] && match['Icon tướng'] !== 'N/A') {
        hero.image_url = match['Icon tướng'];
        updated++;
    } else {
        console.log(`⚠️ Không tìm thấy icon thay thế cho tướng: ${hero.name} (tìm kiếm với tên: ${nameToSearch})`);
    }
}

fs.writeFileSync(heroesJsonPath, JSON.stringify(heroesDb, null, 4), 'utf-8');
console.log(`✅ Đã cập nhật icon cho ${updated}/${heroesDb.length} tướng trong data/heroes.json`);
