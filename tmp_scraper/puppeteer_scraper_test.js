const puppeteer = require('puppeteer');
async function test() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong', {waitUntil: 'networkidle2'});
    // Let's take a screenshot to see what shows up
    await page.screenshot({path: 'page.png'});
    // Let's get raw HTML
    const html = await page.content();
    require('fs').writeFileSync('page.html', html);
    await browser.close();
}
test();
