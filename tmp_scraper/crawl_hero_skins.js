/**
 * crawl_hero_skins.js  (v2)
 * Thu thập: Tên tướng, Icon tướng, Kỹ năng (tên), Danh sách Trang phục
 *
 * Cấu trúc trang thực tế (từ debug_hero.html):
 *  - Tên tướng      : #heroSkin-1 h3
 *  - Icon / skins   : ul.hero__skins--list li a  →  img[src], a[title]
 *  - Kỹ năng (tên)  : ul.hero__skills--list li a[title]
 *
 * Nguồn links       : hero_links.json (đã có sẵn, 128 tướng)
 * Output            : hero_skins_data.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const LINKS_FILE  = path.resolve(__dirname, 'hero_links.json');
const OUTPUT_FILE = path.resolve(__dirname, 'hero_skins_data.json');
const DELAY_MS    = 2000; // ms between pages

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeHeroDetail(page, url) {
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

        // Chờ ít nhất tên tướng xuất hiện
        await page.waitForSelector('#heroSkin-1 h3, h1', { timeout: 8000 }).catch(() => {});

        const heroData = await page.evaluate(() => {
            // ── Tên tướng ──────────────────────────────────────────────────
            const nameEl = document.querySelector('#heroSkin-1 h3')
                        || document.querySelector('h1');
            const heroName = nameEl ? nameEl.innerText.trim() : 'N/A';

            // ── Kỹ năng (tên) ───────────────────────────────────────────────
            // <ul class="hero__skills--list"><li><a title="Tên kỹ năng">
            const skillNames = Array.from(
                document.querySelectorAll('ul.hero__skills--list li a[title]')
            ).map(a => a.getAttribute('title').trim()).filter(Boolean);

            // ── Trang phục ─────────────────────────────────────────────────
            // <ul class="hero__skins--list"><li><a href="#heroSkin-N" title="Tên skin"><img src="...">
            const skinsData = Array.from(
                document.querySelectorAll('ul.hero__skins--list li a')
            ).map(a => ({
                'Tên'  : (a.getAttribute('title') || 'Mặc định').trim(),
                'Icon' : (a.querySelector('img')?.src) || 'N/A'
            }));

            // Icon tướng = icon trang phục đầu tiên (Mặc định)
            const heroIconUrl = skinsData.length > 0 ? skinsData[0]['Icon'] : 'N/A';

            return { heroName, heroIconUrl, skillNames, skinsData };
        });

        return {
            'Tên tướng' : heroData.heroName,
            'Icon tướng': heroData.heroIconUrl,
            'Kỹ năng'   : heroData.skillNames,
            'Trang phục': heroData.skinsData
        };
    } catch (err) {
        console.error(`  ❌ Lỗi khi scrape ${url}: ${err.message}`);
        return null;
    }
}

async function run() {
    // Đọc danh sách link đã có
    const heroLinks = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf-8'));
    console.log(`\n📋 Đã tải ${heroLinks.length} liên kết tướng từ hero_links.json`);

    console.log('🚀 Khởi động Puppeteer (headless)...\n');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
    });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
    );

    const allHeroesData = [];

    for (let i = 0; i < heroLinks.length; i++) {
        const url = heroLinks[i];
        process.stdout.write(`[${String(i + 1).padStart(3)}/${heroLinks.length}] ${url} ... `);

        const data = await scrapeHeroDetail(page, url);
        if (data) {
            allHeroesData.push(data);
            console.log(`✅ ${data['Tên tướng']} (${data['Trang phục'].length} skin, ${data['Kỹ năng'].length} kỹ năng)`);
        } else {
            console.log('❌ bỏ qua');
        }

        // Polite delay (không cần thiết nếu đã có link list, nhưng tránh bị chặn)
        if (i < heroLinks.length - 1) await sleep(DELAY_MS);
    }

    await browser.close();

    // ── Lưu kết quả ───────────────────────────────────────────────────────
    const finalResult = {
        'Ghi chú'         : 'Dữ liệu này chứa URL ảnh icon gốc, bạn có thể tự hiển thị nó mà không có khung viền CSS.',
        'Tổng số tướng'   : allHeroesData.length,
        'Thời gian'       : new Date().toLocaleString('vi-VN'),
        'Dữ liệu tướng'   : allHeroesData
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalResult, null, 4), 'utf-8');
    console.log(`\n🎉 HOÀN THÀNH! Đã lưu ${allHeroesData.length} tướng → ${OUTPUT_FILE}`);
}

run();
