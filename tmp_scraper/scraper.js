const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://lienquan.garena.vn';
const URLS = [
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/tachi/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/dirak/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/qi/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/erin/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/ming/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/bijan/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/bonnie/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/teeri/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/yue/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/yan/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/aya/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/aoi/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/iggy/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/bright/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/lorion/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/dextra/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/sinestrea/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/thorne/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/allain/',
    'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/zata/'
];

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
    let heroesJsonFile = path.resolve(__dirname, '../heroes-data.json');
    let heroes = JSON.parse(fs.readFileSync(heroesJsonFile, 'utf8'));

    for (let u of URLS) {
        console.log('Scraping', u);
        let data = await scrapeHero(u);
        if (data && data.name) {
            let heroIdx = heroes.findIndex(h => h.name.toLowerCase() === data.name.toLowerCase());
            if (heroIdx !== -1) {
                let h = heroes[heroIdx];
                h.image_url = data.bgImg;
                h.skill_p = `${data.p_name}: ${data.p_desc}`;
                h.skill_p_img = data.p_icon;

                h.skill_1 = `${data.s1_name}: ${data.s1_desc}`;
                h.skill_1_img = data.s1_icon;

                h.skill_2 = `${data.s2_name}: ${data.s2_desc}`;
                h.skill_2_img = data.s2_icon;

                h.skill_3 = `${data.s3_name}: ${data.s3_desc}`;
                h.skill_3_img = data.s3_icon;
                
                console.log('  Updated', data.name);
            } else {
                console.log('  Hero not found in current JSON array:', data.name);
            }
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    fs.writeFileSync(heroesJsonFile, JSON.stringify(heroes, null, 2));
    console.log('Done mapping scraped data to heroes-data.json.');
}

run();
