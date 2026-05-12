const puppeteer = require('puppeteer');
const fs = require('fs');

async function getAllLinks() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong-skin/', {waitUntil: 'networkidle2'});
    
    const roleSelectors = [
       '.filter-list li:nth-child(1)', // Tất cả
       '.filter-list li:nth-child(2)', // Đấu sĩ
       '.filter-list li:nth-child(3)', // Pháp sư
       '.filter-list li:nth-child(4)', // Xạ thủ
       '.filter-list li:nth-child(5)', // Trợ thủ
       '.filter-list li:nth-child(6)', // Sát thủ
       '.filter-list li:nth-child(7)'  // Đỡ đòn
    ];

    const allHeroes = new Map();

    for (const sel of roleSelectors) {
        try {
            await page.click(sel);
            await new Promise(r => setTimeout(r, 1000));
            // Scroll to load all
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    let distance = 300;
                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
            
            const heroes = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a[href*="/tuong-skin/d/"]'));
                return anchors.map(a => {
                    const nameEl = a.querySelector('.name') || a.querySelector('h3') || a.querySelector('p');
                    let name = nameEl ? nameEl.innerText.trim() : a.innerText.trim();
                    name = name.split('\n')[0].trim();
                    return { name, url: a.href };
                });
            });
            
            heroes.forEach(h => {
                if (h.name && h.name !== 'Học viện' && h.name !== 'Tướng') {
                    allHeroes.set(h.url, h.name);
                }
            });
            console.log(`Finished selector ${sel}, total unique so far: ${allHeroes.size}`);
        } catch(e) {
            console.log(`Failed selector ${sel}: ${e.message}`);
        }
    }

    const result = Array.from(allHeroes.entries()).map(([url, name]) => ({name, url}));
    fs.writeFileSync('all_hero_links.json', JSON.stringify(result, null, 2));
    await browser.close();
}

getAllLinks();
