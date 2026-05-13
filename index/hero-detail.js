const _API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000/api' : '/api';
const API_URL = `${_API_BASE}/heroes`;

const ROLE_INFO = {
    assassin: { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/sat-thu.png" class="role-icon-img" alt="Sát thủ">', name: 'Sát Thủ', color: 'rgba(231, 76, 60, 0.15)', textColor: '#ff6b6b', border: 'rgba(231, 76, 60, 0.3)' },
    fighter:  { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/dau-si.png" class="role-icon-img" alt="Đấu Sĩ">', name: 'Đấu Sĩ', color: 'rgba(230, 126, 34, 0.15)', textColor: '#f0b27a', border: 'rgba(230, 126, 34, 0.3)' },
    marksman: { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/xa-thu.png" class="role-icon-img" alt="Xạ Thủ">', name: 'Xạ Thủ', color: 'rgba(241, 196, 15, 0.15)', textColor: '#f7dc6f', border: 'rgba(241, 196, 15, 0.3)' },
    mage:     { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/phap-su.png" class="role-icon-img" alt="Pháp Sư">', name: 'Pháp Sư', color: 'rgba(155, 89, 182, 0.15)', textColor: '#c39bd3', border: 'rgba(155, 89, 182, 0.3)' },
    tank:     { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/do-don.png" class="role-icon-img" alt="Đỡ Đòn">', name: 'Đỡ Đòn', color: 'rgba(52, 152, 219, 0.15)', textColor: '#85c1e9', border: 'rgba(52, 152, 219, 0.3)' },
    support:  { icon: '<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/tro-thu.png" class="role-icon-img" alt="Trợ Thủ">', name: 'Trợ Thủ', color: 'rgba(46, 204, 113, 0.15)', textColor: '#82e0aa', border: 'rgba(46, 204, 113, 0.3)' },
};

const TIER_INFO = {
    splus: { label: 'S+', desc: 'Thống trị Meta', detail: 'Pick/ban ưu tiên mọi trận đấu.', gradient: 'linear-gradient(135deg, #cc3300, #ff6b00)' },
    s:     { label: 'S',  desc: 'Rất Mạnh', detail: 'Hiệu quả cao, leo rank tốt.', gradient: 'linear-gradient(135deg, #8b1a00, #d35400)' },
    a:     { label: 'A',  desc: 'Mạnh', detail: 'Tốt khi thành thạo kỹ năng.', gradient: 'linear-gradient(135deg, #145200, #27ae60)' },
    b:     { label: 'B',  desc: 'Ổn Định', detail: 'Cân bằng, hiệu quả ở tình huống cụ thể.', gradient: 'linear-gradient(135deg, #003666, #2980b9)' },
    c:     { label: 'C',  desc: 'Bình Thường', detail: 'Ít dùng trong meta hiện tại.', gradient: 'linear-gradient(135deg, #9a7d00, #f1c40f)' },
    d:     { label: 'D',  desc: 'Cần Buff', detail: 'Yếu so với phần còn lại.', gradient: 'linear-gradient(135deg, #222, #7f8c8d)' },
};

// Tab switching
window.switchTab = function(tabName) {
    document.querySelectorAll('.hd-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    event.target.closest('.hd-tab').classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

// Main load
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const heroId = urlParams.get('id');

    if (!heroId) {
        document.querySelector('.detail-main').innerHTML = `
            <div style="text-align:center; padding:100px;">
                <h1 style="color:#e74c3c">Không tìm thấy mã tướng!</h1>
                <a href="tier-list.html" style="color:#f39c12">Quay lại Tier-list</a>
            </div>`;
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${heroId}`);
        if (!res.ok) throw new Error("Server error");
        
        const json = await res.json();
        const hero = json.data;
        const tier = TIER_INFO[hero.tier] || TIER_INFO['b'];

        // ---- TẢI ITEMS ĐỂ LẤY HÌNH ẢNH ----
        let itemsMap = {};
        try {
            const itemsRes = await fetch(`${_API_BASE}/items`);
            if (itemsRes.ok) {
                const itemsData = await itemsRes.json();
                itemsData.data.forEach(it => {
                    itemsMap[it.name.toLowerCase().trim()] = it.image_url;
                });
            }
        } catch (e) {
            console.warn("Lỗi tải danh sách items:", e);
        }

        let arcanasMap = {};
        try {
            const arcanasRes = await fetch(`${_API_BASE}/arcanas`);
            if (arcanasRes.ok) {
                const arcanasData = await arcanasRes.json();
                arcanasData.data.forEach(ar => {
                    arcanasMap[ar.name.toLowerCase().trim()] = ar.image_url;
                });
            }
        } catch (e) { }

        let runesMap = {};
        try {
            const runesRes = await fetch(`${_API_BASE}/runes`);
            if (runesRes.ok) {
                const runesData = await runesRes.json();
                runesData.data.forEach(r => {
                    runesMap[r.name.toLowerCase().trim()] = r.image_url;
                });
            }
        } catch (e) { }
        
        // ---- BREADCRUMB ----
        document.getElementById('breadcrumb-name').textContent = hero.name;
        document.title = `${hero.name} - Hồ Sơ Tướng | Liên Quân Mobile`;
        
        // ---- NAME & AVATAR ----
        document.getElementById('hd-name').textContent = hero.name;
        
        // Render avatar directly here — don't rely on tier-list.js getHeroImg
        const avatarEl = document.getElementById('hd-avatar');
        if (hero.image_url && hero.image_url.trim() !== '') {
            avatarEl.innerHTML = `<img src="${hero.image_url}" alt="${hero.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';"><span style="display:none;font-size:60px;font-weight:900;color:#f39c12;">${hero.name.charAt(0)}</span>`;
        } else {
            avatarEl.innerHTML = `<span style="font-size:60px;font-weight:900;color:#f39c12;">${hero.name.charAt(0)}</span>`;
        }

        // ---- TIER BADGE ON AVATAR ----
        document.getElementById('hd-tier-badge').innerHTML = `
            <div class="tier-pill" style="background:${tier.gradient}">${tier.label}</div>
        `;

        // ---- ROLE TAGS ----
        const roles = [hero.primary_role];
        if (hero.secondary_role) roles.push(hero.secondary_role);
        
        document.getElementById('hd-tags').innerHTML = roles.map(role => {
            const r = ROLE_INFO[role] || ROLE_INFO['fighter'];
            return `<span class="hd-role-pill" style="background:${r.color};color:${r.textColor};border:1px solid ${r.border}">${r.icon} ${r.name}</span>`;
        }).join('');

        // ---- QUICK STATS ----
        const winRate = hero.win_rate || null;
        const pickRate = hero.pick_rate || null;
        const banRate = hero.ban_rate || null;

        const statsHTML = [
            winRate ? `<div class="hd-stat">
                <span class="stat-label">Win Rate</span>
                <span class="stat-value" style="color:${parseFloat(winRate) > 50 ? '#2ecc71' : '#e74c3c'}">${winRate}</span>
            </div>` : '',
            pickRate ? `<div class="hd-stat">
                <span class="stat-label">Pick Rate</span>
                <span class="stat-value">${pickRate}</span>
            </div>` : '',
            banRate ? `<div class="hd-stat">
                <span class="stat-label">Ban Rate</span>
                <span class="stat-value">${banRate}</span>
            </div>` : '',
            `<div class="hd-stat tier-stat">
                <span class="stat-label">Tier</span>
                <span class="stat-value" style="background:${tier.gradient};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;">${tier.label} · ${tier.desc}</span>
            </div>`
        ].join('');
        document.getElementById('hd-quick-stats').innerHTML = statsHTML;

        // ---- SIDEBAR: ROLES ----
        document.getElementById('sidebar-roles').innerHTML = roles.map((role, i) => {
            const r = ROLE_INFO[role] || ROLE_INFO['fighter'];
            return `
                <div class="sidebar-role-item">
                    <div class="role-icon">${r.icon}</div>
                    <span class="role-name">${r.name}</span>
                    <span class="role-type">${i === 0 ? 'Chính' : 'Phụ'}</span>
                </div>`;
        }).join('');

        // ---- SIDEBAR: TIER ----
        document.getElementById('sidebar-tier-info').innerHTML = `
            <div class="sidebar-tier-big" style="background:${tier.gradient}">${tier.label}</div>
            <p class="sidebar-tier-desc"><strong>${tier.desc}</strong><br>${tier.detail}</p>
        `;

        // ---- SIDEBAR: COUNTERS ----
        const countersContainer = document.getElementById('sidebar-counters-info');
        if (hero.counters && hero.counters.trim() !== "") {
            const counterNames = hero.counters.split(',').map(c => c.trim()).filter(c => c !== "");
            
            // Hàm tìm ID và Ảnh của tướng khắc chế từ danh sách HEROES (nếu có)
            const findCounterHero = (name) => {
                const nameLower = name.toLowerCase().replace(/['’\-\s]/g, '');
                return HEROES.find(h => h[0].toLowerCase().replace(/['’\-\s]/g, '') === nameLower);
            };

            // Nếu HEROES chưa kịp load, ta đợi 1 tí hoặc render tạm
            const renderCounters = () => {
                countersContainer.innerHTML = counterNames.map(name => {
                    const found = findCounterHero(name);
                    const heroId = found ? found[3] : null;
                    const heroImg = found ? found[4] : '';
                    const link = heroId ? `href="hero-detail.html?id=${heroId}"` : 'style="pointer-events:none; opacity:0.6;"';
                    
                    return `
                        <a ${link} class="counter-item">
                            <div class="counter-avatar">
                                ${heroImg ? `<img src="${heroImg}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
                            </div>
                            <span class="counter-name">${name}</span>
                        </a>
                    `;
                }).join('');
            };

            // Kiểm tra xem HEROES đã có chưa (từ tier-list.js)
            if (window.HEROES && window.HEROES.length > 0) {
                renderCounters();
            } else {
                // Nếu chưa có, đợi event custom hoặc check interval
                const checkInterval = setInterval(() => {
                    if (window.HEROES && window.HEROES.length > 0) {
                        renderCounters();
                        clearInterval(checkInterval);
                    }
                }, 100);
                // Timeout sau 3s nếu ko có data
                setTimeout(() => clearInterval(checkInterval), 3000);
                renderCounters(); // Render lần đầu (có thể chưa có ảnh)
            }
        } else {
            countersContainer.innerHTML = `<p style="color:#6b7280; font-size:12px; text-align:center;">Chưa có dữ liệu khắc chế.</p>`;
        }

        // ---- SKILLS ----

        const skillKeys = ['p', '1', '2', '3'];
        skillKeys.forEach(key => {
            const skillText = hero[`skill_${key}`];
            const skillImg  = hero[`skill_${key}_img`];
            
            if (skillText) {
                if (skillText.includes(':')) {
                    const parts = skillText.split(':');
                    document.getElementById(`skill-${key}-name`).textContent = parts[0].trim();
                    document.getElementById(`skill-${key}-desc`).textContent = parts.slice(1).join(':').trim();
                } else {
                    document.getElementById(`skill-${key}-desc`).textContent = skillText;
                }
            }

            const iconImg = document.getElementById(`skill-${key}-img`);
            const iconLbl = document.getElementById(`skill-${key}-label`);
            if (iconImg && iconLbl) {
                if (skillImg && skillImg.trim() !== "") {
                    iconImg.src = skillImg;
                    iconImg.style.display = 'block';
                    iconLbl.style.display = 'none';
                } else {
                    iconImg.style.display = 'none';
                    iconLbl.style.display = 'block';
                }
            }
        });

        // ---- STORY ----
        if (hero.story) document.getElementById('hd-story').textContent = hero.story;

        // ---- ITEMS & BUILDS ----
        const itemsContainer = document.getElementById('tab-items');
        let buildsData = [];

        // 1. Check for new structured builds data (JSON)
        if (hero.builds) {
            try {
                const parsed = JSON.parse(hero.builds);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    buildsData = parsed;
                }
            } catch(e) {
                console.warn("Lỗi parse builds JSON:", e);
            }
        }

        // 2. Fallback to legacy pipe-separated string if buildsData is empty
        if (buildsData.length === 0 && hero.items && hero.items.trim() !== "") {
            const legacyBuilds = hero.items.split('|').map(b => b.trim()).filter(b => b !== "");
            legacyBuilds.forEach((buildStr, buildIdx) => {
                let title = `Đề xuất ${buildIdx + 1}`;
                let items = buildStr;
                if (buildStr.includes(':')) {
                    const parts = buildStr.split(':');
                    title = parts[0].trim();
                    items = parts.slice(1).join(':').trim();
                }
                buildsData.push({ title, items });
            });
        }

        // 3. Render the builds
        if (buildsData.length > 0) {
            let html = `
                <h3 class="hd-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    Các Lối Lên Đồ Đề Cử
                </h3>
            `;

            buildsData.forEach((build, idx) => {
                const itemList = build.items.split(',').map(i => i.trim()).filter(i => i !== "");
                html += `
                    <div class="build-proposal">
                        <h4 class="build-title">${build.title || `Đề xuất ${idx + 1}`}</h4>
                        <div class="items-grid">
                            ${itemList.map((item, iIdx) => {
                                const itemImg = itemsMap[item.toLowerCase().trim()];
                                const iconHtml = itemImg 
                                    ? `<img src="${itemImg}" alt="${item}" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">` 
                                    : `<span class="item-initial">${item.charAt(0).toUpperCase()}</span>`;
                                return `
                                <div class="item-card" style="animation: fadeUp 0.4s ease ${iIdx * 0.05}s both">
                                    <div class="item-icon-box">
                                        ${iconHtml}
                                    </div>
                                    <span class="item-name">${item}</span>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <!-- Mini grid for Arcana & Runes in this build -->
                        ${(build.arcanas || build.runes) ? `
                        <div class="build-extras" style="margin-top:15px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); display:flex; gap:20px; flex-wrap:wrap;">
                            ${build.arcanas ? `
                            <div class="build-extra-group" style="flex:1; min-width:150px;">
                                <div style="font-size:11px; opacity:0.6; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">🎓 Ngọc bổ trợ</div>
                                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                    ${build.arcanas.split(',').map(a => a.trim()).filter(Boolean).map(arcana => {
                                        const img = arcanasMap[arcana.toLowerCase().replace(/ x10/g, '')];
                                        return `<div class="extra-icon-box" title="${arcana}" style="width:30px;height:30px;border-radius:50%;overflow:hidden;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);">
                                            ${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:10px;display:flex;justify-content:center;align-items:center;height:100%">${arcana.charAt(0)}</span>`}
                                        </div>`;
                                    }).join('')}
                                </div>
                            </div>` : ''}
                            
                            ${build.runes ? `
                            <div class="build-extra-group" style="flex:1; min-width:150px;">
                                <div style="font-size:11px; opacity:0.6; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">🧿 Phù hiệu</div>
                                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                    ${build.runes.split(',').map(r => r.trim()).filter(Boolean).map(rune => {
                                        const img = runesMap[rune.toLowerCase()];
                                        return `<div class="extra-icon-box" title="${rune}" style="width:30px;height:30px;border-radius:8px;overflow:hidden;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);">
                                            ${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:10px;display:flex;justify-content:center;align-items:center;height:100%">${rune.charAt(0)}</span>`}
                                        </div>`;
                                    }).join('')}
                                </div>
                            </div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `;
            });
            document.getElementById('hd-items').innerHTML = html;
        } else {
            document.getElementById('hd-items').innerHTML = `
                <p style="color:#6b7280; text-align:center; padding: 20px;">Chưa có trang bị gợi ý cho vị tướng này.</p>
            `;
        }
        const arcanasContainer = document.getElementById('hd-arcanas');
        if (hero.recommended_arcanas && hero.recommended_arcanas.trim() !== "") {
            const arcanaList = hero.recommended_arcanas.split(',').map(a => a.trim()).filter(a => a !== "");
            arcanasContainer.innerHTML = arcanaList.map((arcana, idx) => {
                const img = arcanasMap[arcana.toLowerCase()];
                const iconHtml = img ? `<img src="${img}" alt="${arcana}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` 
                                     : `<span class="item-initial" style="border-radius:50%;">${arcana.charAt(0).toUpperCase()}</span>`;
                return `
                <div class="item-card" style="animation: fadeUp 0.4s ease ${idx * 0.05}s both">
                    <div class="item-icon-box" style="border-radius:50%;">
                        ${iconHtml}
                    </div>
                    <span class="item-name">${arcana}</span>
                </div>
                `;
            }).join('');
            arcanasContainer.style.display = 'flex';
            arcanasContainer.style.flexWrap = 'wrap';
            arcanasContainer.style.gap = '15px';
        } else {
            arcanasContainer.innerHTML = `<p style="color:#6b7280; padding: 10px;">Chưa có gợi ý Ngọc cho vị tướng này.</p>`;
        }

        const runesContainer = document.getElementById('hd-runes');
        if (hero.recommended_runes && hero.recommended_runes.trim() !== "") {
            const runeList = hero.recommended_runes.split(',').map(r => r.trim()).filter(r => r !== "");
            runesContainer.innerHTML = runeList.map((rune, idx) => {
                const img = runesMap[rune.toLowerCase()];
                const iconHtml = img ? `<img src="${img}" alt="${rune}" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">` 
                                     : `<span class="item-initial">${rune.charAt(0).toUpperCase()}</span>`;
                return `
                <div class="item-card" style="animation: fadeUp 0.4s ease ${idx * 0.05}s both">
                    <div class="item-icon-box">
                        ${iconHtml}
                    </div>
                    <span class="item-name">${rune}</span>
                </div>
                `;
            }).join('');
            runesContainer.style.display = 'flex';
            runesContainer.style.flexWrap = 'wrap';
            runesContainer.style.gap = '15px';
        } else {
            runesContainer.innerHTML = `<p style="color:#6b7280; padding: 10px;">Chưa có gợi ý Phù hiệu cho vị tướng này.</p>`;
        }

        // ---- SKINS ----
        const skinsContainer = document.getElementById('skins-grid');
        if (hero.skins && hero.skins.trim() !== "") {
            const skinList = hero.skins.split(',').map(s => s.trim());
            
            skinsContainer.innerHTML = skinList.map((item, idx) => {
                let skinName = item;
                let skinImgUrl = "";

                if (item.includes('|')) {
                    const parts = item.split('|');
                    skinName = parts[0].trim();
                    skinImgUrl = parts[1].trim();
                } else if (item.startsWith('http') || item.startsWith('/')) {
                    skinName = "Trang Phục";
                    skinImgUrl = item;
                }

                const imgHTML = skinImgUrl
                    ? `<img src="${skinImgUrl}" alt="${skinName}" loading="lazy">`
                    : `<span style="color: rgba(255,255,255,0.06); font-size: 12px;">Chưa có ảnh</span>`;

                return `
                <div class="skin-card" data-hoverimg="${skinImgUrl}" style="animation: fadeUp 0.4s ease ${idx * 0.06}s both">
                    <div class="skin-img-placeholder">
                        ${imgHTML}
                    </div>
                    <span class="skin-name">${skinName}</span>
                    <span class="skin-rarity">Trang phục</span>
                </div>`;
            }).join('');

            // Hover skin → change avatar
            const avatarContainer = document.getElementById('hd-avatar');
            setTimeout(() => {
                const defaultAvatarHTML = avatarContainer.innerHTML;
                document.querySelectorAll('.skin-card').forEach(card => {
                    card.addEventListener('mouseenter', function() {
                        const url = this.getAttribute('data-hoverimg');
                        if (url) {
                            avatarContainer.innerHTML = `<img src="${url}" alt="Skin" style="width:100%;height:100%;object-fit:cover;">`;
                        }
                    });
                    card.addEventListener('mouseleave', function() {
                        avatarContainer.innerHTML = defaultAvatarHTML;
                    });
                });
            }, 100);
        } else {
            skinsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #6b7280;">
                <p>Vị tướng này hiện chỉ có trang phục mặc định.</p>
            </div>`;
        }
        
    } catch (e) {
        console.error(e);
        document.querySelector('.hero-overview').innerHTML = `
            <div style="text-align:center; padding:40px; width:100%;">
                <h2 style="color:#e74c3c; margin-bottom:10px;">⚠️ Lỗi tải dữ liệu</h2>
                <p style="color:#6b7280;">Hãy chắc chắn Server Backend đang chạy tại localhost:3000</p>
                <a href="tier-list.html" style="color:#f39c12; margin-top:15px; display:inline-block;">← Quay lại Tier List</a>
            </div>`;
    }
});
