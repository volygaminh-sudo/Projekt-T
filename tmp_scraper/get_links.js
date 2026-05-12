const puppeteer = require('puppeteer');
async function test() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Using the URL the subagent used successfully
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong-skin/', {waitUntil: 'networkidle2'});
    
    // Quick scroll to trigger lazy load
    await page.evaluate(async () => {
        window.scrollBy(0, 2000);
        await new Promise(r => setTimeout(r, 1000));
        window.scrollBy(0, 2000);
    });

    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => ({href: a.href, text: a.innerText.trim()}));
    });
    
    console.log(JSON.stringify(links.filter(l => l.href.includes('tuong-skin/d/')), null, 2));
    await browser.close();
}
test();
