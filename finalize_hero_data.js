const fs = require('fs');
const heroes = JSON.parse(fs.readFileSync('data/heroes.json', 'utf8'));

heroes.forEach(h => {
    if (h.name === 'Lu Bu' || h.name === 'Lữ Bố') {
        h.name = 'Lữ Bố';
        h.skill_p = 'Chúa tể';
        h.skill_1 = 'Xích Thố';
        h.skill_2 = 'Phương thiên họa kích';
        h.skill_3 = 'Chiến thần';
    }
    if (h.name === 'Helen') {
        h.skill_p = 'Thanh Cao';
        h.skill_1 = 'Án sáng thần thánh';
        h.skill_2 = 'Linh hoa thánh khiết';
        h.skill_3 = 'Kết Giới Sinh Mệnh';
    }
});

fs.writeFileSync('data/heroes.json', JSON.stringify(heroes, null, 4));
console.log('Finalized Lu Bu and Helen.');
