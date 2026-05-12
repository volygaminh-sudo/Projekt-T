const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const data = [
  {
    "hero": "Thane",
    "items": ["Đại địa mở trói", "Giày kiên cường", "Khiên thất truyền", "Giáp Gaia", "Giáp thống khổ", "Nham thuẫn"],
    "arcana": {
      "red": "10x Kim thân (Tốc đánh / Máu / Giáp)",
      "purple": "10x Bảo mệnh (Máu / Hồi máu / Tốc chạy)",
      "green": "10x Giáp tối ưu (Máu / Giáp / Giảm hồi chiêu)"
    },
    "runes": {
      "main_branch": "Rừng nguyên sinh (Canh gác, Bơm máu, Trói buộc)",
      "sub_branch": "Vực hỗn mang (Hấp huyết, Cố thủ)"
    }
  },
  {
    "hero": "Sinestrea",
    "items": ["Kiếm truy hồn", "Giày kiên cường", "Áo choàng băng giá", "Thương xuyên phá", "Nanh Fenrir", "Kiếm Muramasa"],
    "arcana": {
      "red": "10x Tỷ lệ chí mạng",
      "purple": "10x Hút máu",
      "green": "10x Công vật lý / Xuyên giáp"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Tương phản, Xuyên tâm, Thần quang)",
      "sub_branch": "Vực hỗn mang (Dư ảnh, Cường công)"
    }
  },
  {
    "hero": "Airi",
    "items": ["Giày kiên cường", "Thương xuyên phá", "Phức hợp kiếm", "Giáp Gaia", "Kiếm Muramasa", "Giáp hộ mệnh"],
    "arcana": {
      "red": "10x Công vật lý / Xuyên giáp",
      "purple": "10x Tốc đánh / Tốc chạy",
      "green": "10x Công vật lý / Xuyên giáp"
    },
    "runes": {
      "main_branch": "Vực hỗn mang (Dư ảnh, Cường công, Ma tính)",
      "sub_branch": ["Tháp quang minh (Tương phản)", "Rừng nguyên sinh (Nhạy bén)"]
    }
  },
  {
    "hero": "Lorion",
    "items": ["Giày thuật sĩ", "Mặt nạ Berith", "Sách thánh", "Quả cầu băng sương", "Trượng hỗn mang", "Trượng bùng nổ"],
    "arcana": {
      "red": "10x Công phép / Xuyên giáp phép",
      "purple": "10x Công phép / Hút máu phép",
      "green": "10x Tốc đánh / Xuyên giáp phép"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Sung mãn, Xuyên tâm, Thần quang)",
      "sub_branch": ["Vực hỗn mang (Ma hỏa)", "Thành khởi nguyên (Quả cầu băng sương)"]
    }
  },
  {
    "hero": "Flowborn",
    "items": ["Giày thuật sĩ", "Mặt nạ Berith", "Thập tự kiếm", "Vương miện Hecate", "Trượng hỗn mang", "Quả cầu băng sương"],
    "arcana": {
      "red": "10x Công phép / Xuyên giáp phép",
      "purple": "10x Công phép / Hút máu phép",
      "green": "10x Tốc đánh / Xuyên giáp phép"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Sung mãn, Xuyên tâm, Thần quang)",
      "sub_branch": "Vực hỗn mang (Ma hỏa, Cường công)"
    }
  },
  {
    "hero": "Rouie",
    "items": ["Giày thuật sĩ", "Mặt nạ Berith", "Sách thánh", "Vương miện Hecate", "Trượng bùng nổ", "Sách truy hồn"],
    "arcana": {
      "red": "10x Công phép / Xuyên giáp phép",
      "purple": "10x Công phép / Hút máu phép",
      "green": "10x Tốc đánh / Xuyên giáp phép"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Sung mãn, Xuyên tâm, Thần quang)",
      "sub_branch": "Vực hỗn mang (Ma hỏa, Cường công)"
    }
  },
  {
    "hero": "Ignis",
    "items": ["Giày thuật sĩ", "Mặt nạ Berith", "Sách thánh", "Trượng hỗn mang", "Vương miện Hecate", "Trượng bùng nổ"],
    "arcana": {
      "red": "10x Công phép / Xuyên giáp phép",
      "purple": "10x Công phép / Hút máu phép",
      "green": "10x Tốc đánh / Xuyên giáp phép"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Sung mãn, Xuyên tâm, Thần quang)",
      "sub_branch": "Vực hỗn mang (Ma hỏa, Cường công)"
    }
  },
  {
    "hero": "Tulen",
    "items": ["Gươm tận thế", "Giày thuật sĩ", "Mặt nạ Berith", "Vương miện Hecate", "Quyền trượng Rhea", "Quả cầu băng sương"],
    "arcana": {
      "red": "10x Công phép / Xuyên giáp phép",
      "purple": "10x Công phép / Hút máu phép",
      "green": "10x Tốc đánh / Xuyên giáp phép"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Tương phản, Xuyên tâm, Thần quang)",
      "sub_branch": "Vực hỗn mang (Ma hỏa, Cường công)"
    }
  },
  {
    "hero": "Wisp",
    "items": ["Giày kiên cường", "Thánh kiếm", "Diệt thần cung", "Song đao bão táp", "Cung tà ma", "Giáp hộ mệnh"],
    "arcana": {
      "red": "10x Tỷ lệ chí mạng / Sát thương chí mạng",
      "purple": "10x Hút máu vật lý",
      "green": "10x Công vật lý / Xuyên giáp"
    },
    "runes": {
      "main_branch": "Tháp quang minh (Tương phản, Xuyên tâm, Tinh linh)",
      "sub_branch": "Thành khởi nguyên (Quả cầu băng sương, Thợ săn)"
    }
  },
  {
    "hero": "Cresht",
    "items": ["Đại địa mở trói", "Giày kiên cường", "Giáp Gaia", "Khiên thất truyền", "Giáp thống khổ", "Huân chương Troy"],
    "arcana": {
      "red": "10x Kim thân (Tốc đánh / Máu / Giáp)",
      "purple": "10x Bảo mệnh (Máu / Hồi máu / Tốc chạy)",
      "green": "10x Giáp tối ưu (Máu / Giáp / Giảm hồi chiêu)"
    },
    "runes": {
      "main_branch": "Rừng nguyên sinh (Canh gác, Bơm máu, Trói buộc)",
      "sub_branch": "Vực hỗn mang (Hấp huyết, Cố thủ)"
    }
  }
];

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }

    console.log('Connected to DB. Starting import...');

    let updatedCount = 0;
    
    // We update each hero synchronously to track success using Promise
    for (const record of data) {
        await new Promise((resolve, reject) => {
            const heroName = record.hero;
            const itemsStr = record.items.join(', ');
            const buildsInfo = [
                {
                    title: 'Lên đồ từ HLV',
                    items: itemsStr,
                    arcana: record.arcana,
                    runes: record.runes
                }
            ];
            
            const buildsStr = JSON.stringify(buildsInfo);

            db.run(`UPDATE heroes SET items = ?, builds = ? WHERE name LIKE ?`, [itemsStr, buildsStr, "%" + heroName + "%"], function(err) {
                if (err) {
                    console.error('Error updating ' + heroName + ':', err);
                    resolve(); 
                } else {
                    if (this.changes > 0) {
                        updatedCount++;
                        console.log('- [OK] Updated ' + heroName);
                    } else {
                        console.log('- [SKIP] Hero ' + heroName + ' not found in DB.');
                    }
                    resolve();
                }
            });
        });
    }

    console.log(`Import complete. Successfully updated ${updatedCount} heroes.`);
    db.close();
});
