const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Load links
    const linksPath = 'hero_links.json';
    if (!fs.existsSync(linksPath)) {
        console.error(`Missing ${linksPath}`);
        process.exit(1);
    }
    const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
    const results = [];

    console.log(`Scraping ${links.length} heroes...`);

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        try {
            await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
            
            const heroData = await page.evaluate(() => {
                const name = document.title.split(' | ')[0];
                const skills = [];
                for (let j = 1; j <= 5; j++) { // Check up to 5 skill containers
                    const container = document.querySelector(`#heroSkill-${j}`);
                    if (container) {
                        const sName = (container.querySelector('.txt-name') || container.querySelector('h3'))?.innerText.trim() || '';
                        const sDesc = (container.querySelector('.txt-desc') || container.querySelector('article'))?.innerText.trim() || '';
                        skills.push({ name: sName, desc: sDesc });
                    }
                }
                return { name, skills };
            });

            results.push(heroData);
            console.log(`[${i+1}/${links.length}] Scraped: ${heroData.name}`);
        } catch (err) {
            console.error(`Failed ${link}: ${err.message}`);
        }
    }

    fs.writeFileSync('heroes_full_details.json', JSON.stringify(results, null, 2));
    await browser.close();
    console.log('Done! Saved to tmp_scraper/heroes_full_details.json');
})();
