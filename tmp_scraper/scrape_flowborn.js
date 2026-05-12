/**
 * scrape_flowborn.js
 * Flowborn có 2 dạng: Pháp Sư và Xạ Thủ
 * Lấy cả 2 entry từ trang web
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FLOWBORN_URL = 'https://lienquan.garena.vn/hoc-vien/tuong-skin/d/flowborn/';
const OUTPUT = path.resolve(__dirname, 'flowborn_data.json');

async function run() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36');

    console.log('🔍 Đang truy cập trang Flowborn...');
    await page.goto(FLOWBORN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#heroSkin-1', { timeout: 10000 }).catch(() => {});

    const data = await page.evaluate(() => {
        // Lấy TẤT CẢ heroSkin panels để xem có bao nhiêu dạng
        const skinPanels = Array.from(document.querySelectorAll('[id^="heroSkin-"]'));
        console.log('Số skin panels:', skinPanels.length);

        // Kỹ năng - tên từ a[title] trong skills list
        const skillNames = Array.from(
            document.querySelectorAll('ul.hero__skills--list li a[title]')
        ).map(a => a.getAttribute('title').trim()).filter(Boolean);

        // Danh sách trang phục (icons)
        const skinItems = Array.from(
            document.querySelectorAll('ul.hero__skins--list li a')
        ).map(a => ({
            'Tên': (a.getAttribute('title') || 'Mặc định').trim(),
            'Icon': a.querySelector('img')?.src || 'N/A'
        }));

        // Lấy tên tướng từ mỗi panel để thấy có 2 dạng không
        const skinPanelData = skinPanels.map(panel => ({
            id: panel.id,
            h3: panel.querySelector('h3')?.innerText.trim() || ''
        }));

        // Tên tướng chính
        const heroName = document.querySelector('#heroSkin-1 h3')?.innerText.trim() || 'Flowborn';

        return { heroName, skillNames, skinItems, skinPanelData };
    });

    await browser.close();

    console.log('\n📋 Tên tướng:', data.heroName);
    console.log('🔮 Kỹ năng:', data.skillNames);
    console.log('📸 Skin panels:', JSON.stringify(data.skinPanelData, null, 2));
    console.log('🎭 Tổng skins:', data.skinItems.length);
    data.skinItems.forEach((s, i) => console.log(`  [${i+1}] ${s['Tên']}: ${s['Icon'].substring(0, 80)}`));

    fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4), 'utf-8');
    console.log('\n💾 Đã lưu:', OUTPUT);
}

run().catch(console.error);
