const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Connection error:', err);
        return;
    }

    const builds = [
        {
            title: 'Thuần Pháp Thuật (Đi Mid)',
            items: 'Giày thuật sĩ, Mặt nạ Berith, Sách truy hồn, Vương miện Hecate, Trượng hỗn mang, Quả cầu băng sương'
        },
        {
            title: 'Trợ thủ / Cứng cáp',
            items: 'Đại địa mở trói, Giày kiên cường, Sách truy hồn, Trượng băng, Khiên thất truyền, Giáp Gaia'
        }
    ];

    const itemsStr = builds[0].items;
    const buildsStr = JSON.stringify(builds);

    db.run(`UPDATE heroes SET items = ?, builds = ? WHERE name LIKE '%Aleister%'`, [itemsStr, buildsStr], function(err) {
        if (err) {
            console.error('Update error:', err);
        } else {
            console.log('Aleister successfully updated, changes:', this.changes);
        }
        db.close();
    });
});
