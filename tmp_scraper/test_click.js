const puppeteer = require('puppeteer');
async function test() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong-skin/d/valhein/', {waitUntil: 'networkidle2'});
    
    // Wait for the hero title to appear
    try {
        await page.waitForSelector('.title-name', { timeout: 5000 });
    } catch(e) {
        console.log("Timeout waiting for .title-name");
    }

    const data = await page.evaluate(() => {
        const titleEl = document.querySelector('.title-name');
        const heroName = titleEl ? titleEl.innerText.trim() : 'Not Found';
        
        const skillNames = [];
        const items = document.querySelectorAll('.hero__skills--item');
        items.forEach(item => {
           // We might need to click or at least look for nested text
           const txt = item.querySelector('.txt-name') || document.querySelector('.txt-name');
           // If we don't click, we might get the first one multiple times or nothing
        });
        
        return { heroName };
    });

    console.log(JSON.stringify(data, null, 2));
    await browser.close();
}
test();
