/**
 * scrape_missing_heroes.js
 * Scrape lại 4 tướng bị thiếu tên: Edras, Celica, Ormarr, Điêu Thuyền
 * Fallback: dùng tên từ URL slug nếu trang không trả về tên
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FINAL = path.resolve(__dirname, 'hero_skins_final.json');

// Map: tên hiển thị → URL slug trên Garena
const MISSING_HEROES = [
    { name: 'Edras',        url: 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/edras/' },
    { name: 'Điêu Thuyền',  url: 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/diao-chan/' },
    { name: 'Celica',       url: 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/celica/' },
    { name: 'Ormarr',       url: 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/ormarr/' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeHero(page, heroName, url) {
    try {
        console.log(`\n🔍 Scraping: ${heroName} → ${url}`);
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        if (resp.status() === 404) {
            console.log(`   ⚠️  Trang 404 - tướng này không có trên Garena VN`);
            return null;
        }

        await page.waitForSelector('ul.hero__skins--list, ul.hero__skills--list', { timeout: 8000 }).catch(() => {});
        await sleep(1000);

        const data = await page.evaluate((fallbackName) => {
            // Tên tướng - thử nhiều selectors
            const nameEl = document.querySelector('#heroSkin-1 h3')
                        || document.querySelector('.title-name')
                        || document.querySelector('h1.title')
                        || document.querySelector('h1');
            let heroName = nameEl ? nameEl.innerText.trim() : '';
            if (!heroName) heroName = fallbackName; // Dùng tên fallback nếu rỗng

            // Kỹ năng
            const skillNames = Array.from(
                document.querySelectorAll('ul.hero__skills--list li a[title]')
            ).map(a => a.getAttribute('title').trim()).filter(Boolean);

            // Skins
            const skinsData = Array.from(
                document.querySelectorAll('ul.hero__skins--list li a')
            ).map(a => ({
                'Tên': (a.getAttribute('title') || 'Mặc định').trim(),
                'Icon': a.querySelector('img')?.src || 'N/A'
            }));

            const heroIcon = skinsData.length > 0 ? skinsData[0]['Icon'] : 'N/A';

            return { heroName, skillNames, skinsData, heroIcon };
        }, heroName);

        console.log(`   ✅ ${data.heroName}: ${data.skinsData.length} skin, ${data.skillNames.length} kỹ năng`);
        return data;
    } catch (err) {
        console.log(`   ❌ Lỗi: ${err.message}`);
        return null;
    }
}

async function run() {
    const finalData = JSON.parse(fs.readFileSync(FINAL, 'utf-8'));

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36');

    let added = 0;

    for (const hero of MISSING_HEROES) {
        const data = await scrapeHero(page, hero.name, hero.url);
        
        if (data) {
            finalData['Dữ liệu'][hero.name] = {
                'Kỹ năng': data.skillNames,
                'Icon Skin': data.skinsData,
                'Icon tướng': data.heroIcon
            };
            added++;
        } else {
            // Hero không có trang → thêm placeholder
            finalData['Dữ liệu'][hero.name] = {
                'Kỹ năng': [],
                'Icon Skin': [],
                'Icon tướng': 'N/A',
                'Ghi chú': 'Trang không tồn tại trên Garena VN'
            };
            added++;
            console.log(`   📝 Đã thêm placeholder cho: ${hero.name}`);
        }
        
        await sleep(2000);
    }

    await browser.close();

    finalData['Tổng tướng tìm thấy'] = Object.keys(finalData['Dữ liệu']).length;
    fs.writeFileSync(FINAL, JSON.stringify(finalData, null, 4), 'utf-8');

    console.log(`\n🎉 XONG! Đã thêm ${added} tướng`);
    console.log(`📊 Tổng trong file: ${finalData['Tổng tướng tìm thấy']}/128`);
}

run().catch(console.error);
