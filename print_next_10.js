const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8')).sort((a,b) => a.name.localeCompare(b.name));
const next10 = data.slice(30, 40);
let md = '| Hero | Passive | Skill 1 | Skill 2 | Skill 3 |\n| :--- | :--- | :--- | :--- | :--- |\n';
next10.forEach(h => {
    md += `| **${h.name}** | ${h.skill_p} | ${h.skill_1} | ${h.skill_2} | ${h.skill_3} |\n`;
});
console.log(md);
