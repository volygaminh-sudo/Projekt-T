const fs = require('fs');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const heroes = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8'));
const links = heroes.map(h => {
    let name = h.name;
    // Handle special cases
    if (name === 'Helen') name = 'Helen'; // Slugify will handle it
    if (name === 'Lu Bu' || name === 'Lữ Bố') return 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/lu-bo/';
    
    return `https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${slugify(name)}/`;
});

fs.writeFileSync('tmp_scraper/hero_links.json', JSON.stringify(links, null, 2));
console.log(`Generated ${links.length} links.`);
