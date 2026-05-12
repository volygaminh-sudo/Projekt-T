const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/';

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

async function scrapeHero(name) {
    let slug = slugify(name);
    // Special exceptions if any
    if (name === "Azzen’Ka" || name === "Azzen'ka") slug = "azzenka";

    let url = BASE_URL + slug + '/';
    
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log(`  Missed ${name} (${url})`);
            return null;
        }
        
        const html = await res.text();
        const $ = cheerio.load(html);

        let realName = $('title').text().replace(' | Liên Quân Mobile', '').trim();
        let bgImg = $('#heroSkin-1 picture img').attr('src') || '';
        let iconElements = $('.hero__skills--list img').toArray();
        let p_icon = $(iconElements[0]).attr('src') || '';
        let s1_icon = $(iconElements[1]).attr('src') || '';
        let s2_icon = $(iconElements[2]).attr('src') || '';
        let s3_icon = $(iconElements[3]).attr('src') || '';

        let p_name = $('#heroSkill-1 h3').text().trim();
        let p_desc = $('#heroSkill-1 article').text().trim();

        let s1_name = $('#heroSkill-2 h3').text().trim();
        let s1_desc = $('#heroSkill-2 article').text().trim();

        let s2_name = $('#heroSkill-3 h3').text().trim();
        let s2_desc = $('#heroSkill-3 article').text().trim();

        let s3_name = $('#heroSkill-4 h3').text().trim();
        let s3_desc = $('#heroSkill-4 article').text().trim();

        return {
            name: realName,
            bgImg, p_icon, s1_icon, s2_icon, s3_icon,
            p_name, p_desc,
            s1_name, s1_desc,
            s2_name, s2_desc,
            s3_name, s3_desc
        };
    } catch (e) {
        console.error('Error scraping', url, e.message);
        return null;
    }
}

async function run() {
    let heroesJsonFile = path.resolve(__dirname, '../heroes-data.json');
    let heroes = JSON.parse(fs.readFileSync(heroesJsonFile, 'utf8'));

    // We only need to check heroes that are not scraped yet. 
    // Wait, the currently scraped ones have skill descriptions containing colons `Name: Description` or have actual data.
    // The placeholder is just things like "Kỹ năng 1"
    let toScrape = heroes.filter(h => h.skill_1 === "Kỹ năng 1" || !h.skill_1.includes(':'));

    console.log(`Found ${toScrape.length} heroes to scrape out of ${heroes.length}.`);

    // We can fetch concurrently since we have many, but we should be moderate.
    for (let i = 0; i < toScrape.length; i += 5) {
        let batch = toScrape.slice(i, i + 5);
        console.log(`Scraping batch ${i} to ${i+5}`);
        let results = await Promise.all(batch.map(h => scrapeHero(h.name).then(data => ({h, data}))));
        
        for (let res of results) {
            let data = res.data;
            if (data && data.name) {
                let h = res.h;
                h.image_url = data.bgImg || h.image_url;
                if (data.p_name && data.p_desc) h.skill_p = `${data.p_name}: ${data.p_desc}`;
                if (data.p_icon) h.skill_p_img = data.p_icon;

                if (data.s1_name && data.s1_desc) h.skill_1 = `${data.s1_name}: ${data.s1_desc}`;
                if (data.s1_icon) h.skill_1_img = data.s1_icon;

                if (data.s2_name && data.s2_desc) h.skill_2 = `${data.s2_name}: ${data.s2_desc}`;
                if (data.s2_icon) h.skill_2_img = data.s2_icon;

                if (data.s3_name && data.s3_desc) h.skill_3 = `${data.s3_name}: ${data.s3_desc}`;
                if (data.s3_icon) h.skill_3_img = data.s3_icon;
                console.log('  Updated', res.h.name);
            }
        }
        // update file per batch to not lose progress
        fs.writeFileSync(heroesJsonFile, JSON.stringify(heroes, null, 2));
        await new Promise(r => setTimeout(r, 500)); // sleep between batches
    }
    console.log('Done mapping all remaining heroes.');
}

run();
