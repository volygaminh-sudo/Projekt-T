const puppeteer = require('puppeteer');
const fs = require('fs');

async function downloadHtml() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('https://lienquan.garena.vn/hoc-vien/trang-bi/', { waitUntil: 'networkidle2' });
    fs.writeFileSync('trang-bi.html', await page.content());
    
    await page.goto('https://lienquan.garena.vn/hoc-vien/bang-ngoc/', { waitUntil: 'networkidle2' });
    fs.writeFileSync('bang-ngoc.html', await page.content());
    
    await page.goto('https://lienquan.garena.vn/hoc-vien/phu-hieu/', { waitUntil: 'networkidle2' });
    fs.writeFileSync('phu-hieu.html', await page.content());
    
    await browser.close();
    console.log('Downloaded HTMLs');
}

downloadHtml().catch(console.error);
