const puppeteer = require('puppeteer');
async function test() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong-skin/d/valhein/', {waitUntil: 'networkidle2'});
    
    const data = await page.evaluate(() => {
        const name = document.querySelector('.title-name')?.innerText || 'Unknown';
        // Try to find skill names in titles or hidden elements
        const skillIcons = Array.from(document.querySelectorAll('.hero__skills--list img'));
        const skillNames = skillIcons.map(img => img.getAttribute('title') || img.getAttribute('alt'));
        
        // Also check if they are in .txt-name elements
        const txtNames = Array.from(document.querySelectorAll('.txt-name')).map(el => el.innerText);
        
        return { name, skillNames, txtNames };
    });
    
    console.log(JSON.stringify(data, null, 2));
    await browser.close();
}
test();
