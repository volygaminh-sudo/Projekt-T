const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function getAllHeroUrls() {
    try {
        const res = await fetch('https://lienquan.garena.vn/hoc-vien/tuong-skin/');
        const html = await res.text();
        const $ = cheerio.load(html);
        
        let urls = [];
        $('.heroes__list li a').each((i, el) => {
            urls.push($(el).attr('href'));
        });
        return urls.map(u => u.startsWith('http') ? u : 'https://lienquan.garena.vn' + u);
    } catch (e) {
        console.error('Error fetching list:', e);
        return [];
    }
}

async function scrapeHero(url) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        let name = $('title').text().replace(' | Liên Quân Mobile', '').trim();
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
            name: name,
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
    let urls = await getAllHeroUrls();
    console.log(`Found ${urls.length} urls`);
    
    let heroesJsonFile = path.resolve(__dirname, '../heroes-data.json');
    let heroes = JSON.parse(fs.readFileSync(heroesJsonFile, 'utf8'));

    // We can fetch concurrently since we have many, but we should be moderate.
    // Batch of 10.
    for (let i = 0; i < urls.length; i += 10) {
        let batch = urls.slice(i, i + 10);
        console.log(`Scraping batch ${i} to ${i+10}`);
        let results = await Promise.all(batch.map(u => scrapeHero(u).then(data => ({u, data}))));
        
        for (let res of results) {
            let data = res.data;
            if (data && data.name) {
                // Find hero by similar name (sometimes accents differ)
                // Normalize both to lowercase and remove spaces
                const norm = (s) => s.toLowerCase().replace(/\s/g, '');
                let heroIdx = heroes.findIndex(h => norm(h.name) === norm(data.name));
                
                // If not found, try finding by name inside the URL (e.g. dirak)
                if (heroIdx === -1) {
                    let urlSlug = res.u.split('/').filter(Boolean).pop();
                    heroIdx = heroes.findIndex(h => norm(h.name).includes(urlSlug) || norm(urlSlug).includes(norm(h.name)));
                }

                if (heroIdx !== -1) {
                    let h = heroes[heroIdx];
                    // only update if not already updated? Wait, we might write over placeholders anyway, so it's fine.
                    h.image_url = data.bgImg;
                    if (data.p_name && data.p_desc) h.skill_p = `${data.p_name}: ${data.p_desc}`;
                    if (data.p_icon) h.skill_p_img = data.p_icon;

                    if (data.s1_name && data.s1_desc) h.skill_1 = `${data.s1_name}: ${data.s1_desc}`;
                    if (data.s1_icon) h.skill_1_img = data.s1_icon;

                    if (data.s2_name && data.s2_desc) h.skill_2 = `${data.s2_name}: ${data.s2_desc}`;
                    if (data.s2_icon) h.skill_2_img = data.s2_icon;

                    if (data.s3_name && data.s3_desc) h.skill_3 = `${data.s3_name}: ${data.s3_desc}`;
                    if (data.s3_icon) h.skill_3_img = data.s3_icon;
                } else {
                    console.log('  Hero not found in current JSON array:', data.name, 'URL:', res.u);
                }
            }
        }
        await new Promise(r => setTimeout(r, 500)); // sleep between batches
    }
    fs.writeFileSync(heroesJsonFile, JSON.stringify(heroes, null, 2));
    console.log('Done mapping across all urls.');
}

run();
