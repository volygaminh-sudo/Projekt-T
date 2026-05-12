const fs = require('fs');
const cheerio = require('cheerio');

// --- Parse Trang bị (Items) ---
function parseItems() {
  const html = fs.readFileSync('trang-bi.html', 'utf8');
  const $ = cheerio.load(html);
  const items = [];

  const typeMap = {
    '19': 'Công',
    '23': 'Đi rừng',
    '20': 'Phép',
    '21': 'Thủ',
    '22': 'Tốc độ',
    '24': 'Trợ thủ'
  };

  $('.st-items__item').each((i, el) => {
    const $el = $(el);
    const name = $el.find('.st-items__item--name').text().trim();
    const typeId = $el.attr('data-type');
    const type = typeMap[typeId] || 'Khác';
    
    // Price
    const priceText = $el.find('.st-items__item--content > p').first().text().trim();
    const price = parseInt(priceText.replace(/\D/g, '')) || 0;

    const contentHtml = $el.find('article').html();
    let baseStats = [];
    let passives = [];
    let tempStats = [];
    let tempPassives = [];
    
    if (contentHtml) {
        const textBlocks = $el.find('article').text().split('\n').map(s=>s.trim()).filter(s=>s);
        let parsingPassive = false;
        let lastPassive = null;
        for (let block of textBlocks) {
            if (block.match(/Nội tại duy nhất|Kích hoạt duy/i) || block.match(/Nội tại|Kích hoạt|Thống khổ|Tróc nã/)) {
                
                // Extra heuristic check to avoid matching normal stats too eagerly
                if(block.startsWith('+') && !block.match(/Nội tại/i)) {
                    if (!parsingPassive) {
                        tempStats.push(block);
                        continue;
                    }
                }

                if (block.length > 200 && !block.match(/Nội tại/) && !parsingPassive) {
                     // Probably just a long stat
                     tempStats.push(block);
                     continue;
                }

                parsingPassive = true;
                let splitIdx = block.indexOf('–');
                if (splitIdx === -1) splitIdx = block.indexOf('-');
                if (splitIdx === -1) splitIdx = block.indexOf(':');

                if (splitIdx !== -1 && splitIdx < 50) { // Should be near the start
                    tempPassives.push({
                        name: block.substring(0, splitIdx).trim(),
                        description: block.substring(splitIdx + 1).trim()
                    });
                } else {
                    tempPassives.push({
                        name: block,
                        description: ''
                    });
                }
                lastPassive = tempPassives[tempPassives.length - 1];
            } else if (!parsingPassive) {
                tempStats.push(block);
            } else if (lastPassive) {
                lastPassive.description += '\n' + block;
            }
        }
        if(tempStats.length || tempPassives.length) {
            baseStats = tempStats;
            passives = tempPassives;
        }
    }

    const image = $el.find('.st-items__item--img img').attr('src');

    items.push({
      name,
      type,
      price,
      image,
      baseStats: baseStats.join('\n').trim(),
      passives
    });
  });

  fs.writeFileSync('items.json', JSON.stringify(items, null, 2), 'utf8');
  console.log(`Parsed ${items.length} items.`);
}

// --- Parse Bảng ngọc (Runes) ---
function parseRunes() {
  const html = fs.readFileSync('bang-ngoc.html', 'utf8');
  const $ = cheerio.load(html);
  const runes = [];

  const typeMap = {
    '13': 'Đỏ',
    '15': 'Tím',
    '14': 'Xanh'
  };

  const levelMap = {
    '16': 'I',
    '17': 'II',
    '18': 'III'
  };

  $('.st-runes__item').each((i, el) => {
    const $el = $(el);
    const name = $el.find('.st-runes__item--name').text().trim();
    const typeId = $el.attr('data-type');
    const color = typeMap[typeId] || 'Không rõ';
    const levelId = $el.attr('data-level');
    const level = levelMap[levelId] || 'Không rõ';

    const stats = [];
    $el.find('article p').each((j, pEl) => {
      stats.push($(pEl).text().trim());
    });
    
    const image = $el.find('.st-runes__item--img img').attr('src');

    runes.push({
      name,
      color,
      level,
      image,
      stats
    });
  });

  fs.writeFileSync('runes.json', JSON.stringify(runes, null, 2), 'utf8');
  console.log(`Parsed ${runes.length} runes.`);
}

// --- Parse Phù hiệu (Badges) ---
function parseBadges() {
  const html = fs.readFileSync('phu-hieu.html', 'utf8');
  const $ = cheerio.load(html);
  const badges = [];

  $('.st-badges__item').each((i, el) => {
    const $el = $(el);
    const branchName = $el.find('h2.st-badges__item--name').text().trim();

    $el.find('.st-badges__skill').each((j, skillEl) => {
      const $skill = $(skillEl);
      const skillId = $skill.attr('id'); // e.g. badge1724-group1-skill1
      if (!skillId) return;

      const groupMatch = skillId.match(/group(\d+)/);
      const level = groupMatch ? parseInt(groupMatch[1], 10) : 1;

      const name = $skill.find('.st-badges__skill--title').text().trim();
      const description = $skill.find('.st-badges__skill--content').text().trim();
      const image = $skill.find('.st-badges__skill--head img').attr('src');

      badges.push({
        branch: branchName,
        level,
        name,
        image,
        description
      });
    });
  });

  fs.writeFileSync('badges.json', JSON.stringify(badges, null, 2), 'utf8');
  console.log(`Parsed ${badges.length} badges.`);
}

parseItems();
parseRunes();
parseBadges();
