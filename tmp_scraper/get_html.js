const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://hocvien.lienquan.garena.vn/u/3773090', { waitUntil: 'networkidle2' });
    
    // give it an extra 5 seconds just in case
    await new Promise(r => setTimeout(r, 5000));
    
    const html = await page.content();
    fs.writeFileSync('profile_page.html', html);
    console.log('Saved to profile_page.html');
    
    await browser.close();
})();
