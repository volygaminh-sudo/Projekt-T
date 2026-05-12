const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8'));

let md = '# Liên Quân Mobile Hero Skills & Descriptions\n\n';

data.sort((a,b) => a.name.localeCompare(b.name)).forEach(h => {
    md += `## ${h.name}\n`;
    md += `| Skill | Name | Description |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Passive** | ${h.skill_p_name || '-'} | ${h.skill_p || '-'} |\n`;
    md += `| **Skill 1** | ${h.skill_1_name || '-'} | ${h.skill_1 || '-'} |\n`;
    md += `| **Skill 2** | ${h.skill_2_name || '-'} | ${h.skill_2 || '-'} |\n`;
    md += `| **Skill 3** | ${h.skill_3_name || '-'} | ${h.skill_3 || '-'} |\n\n`;
});

fs.writeFileSync('hero_skills_details.md', md);
console.log('Generated hero_skills_details.md');
