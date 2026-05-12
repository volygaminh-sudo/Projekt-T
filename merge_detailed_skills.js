const fs = require('fs');

function normalize(name) {
    if (!name) return "";
    return name.toString().toLowerCase()
        .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/['-]/g, '')
        .replace(/\s+/g, '');
}

const nameMap = {
    'helene': 'helen',
    'payna': 'helen',
    'lưbố': 'lubo',
    'batman': 'kaine',
    'raz': 'raz'
    // Add more as needed
};

function main() {
    const heroes = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8'));
    const scraped = JSON.parse(fs.readFileSync('tmp_scraper/heroes_full_details.json', 'utf8'));

    const scrapedMap = new Map();
    scraped.forEach(s => {
        const key = normalize(s.name);
        scrapedMap.set(key, s);
    });

    let count = 0;
    heroes.forEach(h => {
        let key = normalize(h.name);
        if (nameMap[key]) key = nameMap[key];

        const sData = scrapedMap.get(key);
        if (sData && sData.skills.length >= 4) {
            // Mapping skills: Garena usually has Passive, S1, S2, S3 or S1, S2, S3, Ultimate? 
            // Usually 1=P, 2=S1, 3=S2, 4=S3
            h.skill_p = `${sData.skills[0].name}: ${sData.skills[0].desc}`;
            h.skill_1 = `${sData.skills[1].name}: ${sData.skills[1].desc}`;
            h.skill_2 = `${sData.skills[2].name}: ${sData.skills[2].desc}`;
            h.skill_3 = `${sData.skills[3].name}: ${sData.skills[3].desc}`;
            count++;
        } else {
            console.warn(`No full skill data found for ${h.name}`);
        }
    });

    fs.writeFileSync('data/heroes.json', JSON.stringify(heroes, null, 4));
    console.log(`Merged skills for ${count} heroes.`);
}

main();
