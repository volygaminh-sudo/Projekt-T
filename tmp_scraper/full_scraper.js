const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrape() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("Fetching hero list...");
    await page.goto('https://lienquan.garena.vn/hoc-vien/tuong-skin/', {waitUntil: 'networkidle2'});
    
    // Scroll to the bottom to load all heroes
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
        const anchors = Array.from(document.querySelectorAll('a'));
        const seen = new Set();
        const list = [];
        anchors.forEach(a => {
            const href = a.href;
            if (href.includes('/tuong-skin/d/') && !seen.has(href)) {
                seen.add(href);
                // Try to find the name in the card structure
                // Assuming Name is in an element with class 'name' inside the anchor or similar
                const nameEl = a.querySelector('.name') || a.querySelector('h3') || a.querySelector('p');
                let name = nameEl ? nameEl.innerText.trim() : a.innerText.trim();
                // Clean up name if it contains "Xem chi tiết" or similar
                name = name.split('\n')[0].trim();
                if (name && name !== "Học viện" && name !== "Tướng") {
                    list.push({ name, url: href });
                }
            }
        });
        return list;
    });

    console.log(`Found ${heroes.length} heroes. Scrapping details...`);
    
    const results = [];
    const concurrency = 5;
    
    for (let i = 0; i < heroes.length; i += concurrency) {
        const batch = heroes.slice(i, i + concurrency);
        console.log(`Processing batch ${i / concurrency + 1}/${Math.ceil(heroes.length / concurrency)}...`);
        
        await Promise.all(batch.map(async (hero) => {
            let detailPage;
            try {
                detailPage = await browser.newPage();
                await detailPage.goto(hero.url, {waitUntil: 'networkidle2', timeout: 30000});
                
                const skills = await detailPage.evaluate(() => {
                    const skillIcons = Array.from(document.querySelectorAll('.hero__skills--list img'));
                    return skillIcons.map(img => img.getAttribute('title') || img.getAttribute('alt')).filter(Boolean);
                });
                
                results.push({
                    name: hero.name,
                    skills: skills.join(', ')
                });
            } catch (err) {
                console.error(`Failed to scrape ${hero.name}: ${err.message}`);
                results.push({ name: hero.name, skills: "Error loading skills" });
            } finally {
                if (detailPage) await detailPage.close();
            }
        }));
    }

    fs.writeFileSync('heroes_skills.json', JSON.stringify(results, null, 2));
    console.log("Scraping complete. Saved to heroes_skills.json");
    await browser.close();
}

scrape();
