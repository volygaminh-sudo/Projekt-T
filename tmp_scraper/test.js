const cheerio = require('cheerio');

async function test() {
    const res = await fetch('https://lienquan.garena.vn/hoc-vien/tuong');
    const html = await res.text();
    const $ = cheerio.load(html);
    const links = $('a').toArray().map(a => $(a).attr('href')).filter(h => h && h.includes('tuong'));
    console.log(links);
}
test();
