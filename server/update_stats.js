const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const content = fs.readFileSync(path.resolve(__dirname, 'raw_stats.txt'), 'utf8');
const lines = content.split('\n').map(l => l.trim()).filter(l => l !== '');

let startIndex = 0;
if (lines[0].includes('Tỉ lệ thắng')) {
    startIndex = 1;
}

const statsMap = new Map();

for (let i = startIndex; i < lines.length; ) {
    try {
        const name1 = lines[i];
        const name2 = lines[i+1];
        
        const tierWinRateLine = lines[i+2];
        const parts = tierWinRateLine.split(/[\s\t]+/);
        const tier = parts[0];
        const winRate = parts[parts.length - 1];
        
        const pickRate = lines[i+3];
        const banRate = lines[i+4];
        
        const counter1 = lines[i+5];
        const counter2 = lines[i+6];
        const counter3 = lines[i+7];
        
        statsMap.set(name2.toLowerCase(), {
            name: name2,
            tier: tier.toLowerCase(),
            winRate: winRate,
            pickRate: pickRate,
            banRate: banRate,
            counters: `${counter1}, ${counter2}, ${counter3}`
        });
        
        i += 8;
    } catch (e) {
        console.log("Error parsing at line", i, lines[i]);
        break;
    }
}

console.log(`Parsed ${statsMap.size} heroes.`);

const cols = ['win_rate', 'pick_rate', 'ban_rate', 'counters'];

db.serialize(() => {
    // 1. Add columns setup
    cols.forEach(col => {
        db.run(`ALTER TABLE heroes ADD COLUMN ${col} TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error(`Error adding ${col}:`, err.message);
            }
        });
    });

    // 2. Perform updates
    db.all("SELECT id, name FROM heroes", [], (err, rows) => {
        if (err) return console.error("Error reading db:", err);
        let updated = 0;
        let notFound = [];
        
        const stmt = db.prepare(`UPDATE heroes SET tier = ?, win_rate = ?, pick_rate = ?, ban_rate = ?, counters = ? WHERE id = ?`);

        rows.forEach(dbHero => {
            const dbNameLower = dbHero.name.toLowerCase();
            let parsed = statsMap.get(dbNameLower);
            
            if (!parsed) {
               // Try with alternative quote
               parsed = statsMap.get(dbNameLower.replace(/'/g, '’'));
            }
            if (!parsed) {
               // Try generic text matching
                for (let [k, v] of statsMap.entries()) {
                    if (k.replace(/['’\-\s]/g, '') === dbNameLower.replace(/['’\-\s]/g, '')) {
                        parsed = v;
                        break;
                    }
                }
            }

            if (parsed) {
                // normalize tier: "s+" -> "splus"
                let normalizedTier = parsed.tier.replace('+', 'plus');
                stmt.run(normalizedTier, parsed.winRate, parsed.pickRate, parsed.banRate, parsed.counters, dbHero.id);
                updated++;
            } else {
                notFound.push(dbHero.name);
            }
        });
        
        stmt.finalize(() => {
            console.log(`Updated ${updated} heroes in database.`);
            if (notFound.length > 0) {
                console.log(`Missing stats for: ${notFound.join(', ')}`);
            }
            db.close();
        });
    });
});
