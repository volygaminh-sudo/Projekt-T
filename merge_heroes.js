const fs = require('fs');

const heroes = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('tmp_scraper/heroes_skills.json', 'utf8'));

function normalize(name) {
    if (!name) return '';
    return name.toString().toLowerCase()
        .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/’/g, "'")
        .replace(/[^a-z]/g, '');
}

const nameMap = {
    'riktor': 'richter',
    'brunhilda': 'celica',
    'diaochan': 'dieuthuyen',
    'batman': 'kaine',
    'helen': 'payna', // Payna was replaced by Helen, but maybe both names are used
};

let updatedCount = 0;

heroes.forEach(h => {
    let searchName = normalize(h.name);
    if (nameMap[searchName]) searchName = nameMap[searchName];
    
    const match = scraped.find(s => {
        let scName = normalize(s.name);
        return scName === searchName || scName.includes(searchName) || searchName.includes(scName);
    });
    
    if (match) {
        const skills = match.skills.split(', ');
        if (skills.length >= 3) {
            h.skill_p = skills[0] || h.skill_p;
            h.skill_1 = skills[1] || h.skill_1;
            h.skill_2 = skills[2] || h.skill_2;
            h.skill_3 = skills[3] || h.skill_3;
            updatedCount++;
        }
    }
});

fs.writeFileSync('data/heroes.json', JSON.stringify(heroes, null, 4));
console.log(`Updated ${updatedCount} heroes in data/heroes.json`);
