const BASE_URL = 'http://localhost:3000/api';
const API_URL = `${BASE_URL}/heroes`;

// Utility: HTML Escape to prevent XSS
const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Utility: Image preview setup
function setupPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function () {
            const prev = document.getElementById(previewId);
            if (this.value) {
                prev.src = this.value;
                prev.classList.remove('d-none');
                prev.onerror = () => prev.classList.add('d-none');
            } else {
                prev.classList.add('d-none');
            }
        });
    }
}

// Lưu toàn bộ dữ liệu tướng vào Map để tra cứu bằng ID (tránh bug dấu nháy đơn)
const heroMap = new Map();

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// State Management for Pagination and Filtering
let allHeroes = [];
let filteredHeroes = [];
let currentPage = 1;
let pageSize = 20;

// Global library maps for build cards
let libraryMaps = { items: [], arcanas: [], runes: [] };

// ===== LOAD HEROES =====
async function loadHeroes() {
    const tbody = document.getElementById('admin-tbody');
    tbody.innerHTML = `<tr><td colspan="7" class="loading-cell"><span class="spinner"></span> Đang tải dữ liệu...</td></tr>`;

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        const json = await res.json();

        allHeroes = json.data.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        applyFiltersAndRender();
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="error-cell">❌ Lỗi kết nối. Hãy chắc chắn <strong>Server Node.js đang chạy!</strong></td></tr>`;
    }
}

// ===== FILTER & RENDER LOGIC =====
function applyFiltersAndRender() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const roleFilter = document.getElementById('filter-role').value;
    const tierFilter = document.getElementById('filter-tier').value;

    filteredHeroes = allHeroes.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || h.primary_role === roleFilter || h.secondary_role === roleFilter;
        const matchesTier = !tierFilter || (h.tier || '').toLowerCase() === tierFilter;
        return matchesSearch && matchesRole && matchesTier;
    });

    currentPage = 1; // Reset to first page on filter change
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('admin-tbody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageHeroes = filteredHeroes.slice(start, end);

    document.getElementById('hero-count').textContent = `${filteredHeroes.length} tướng`;

    if (pageHeroes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">Không tìm thấy tướng nào.</td></tr>`;
        renderPagination();
        return;
    }

    // Refresh heroMap for edit/delete functions
    heroMap.clear();
    pageHeroes.forEach(h => heroMap.set(h.id, h));

    tbody.innerHTML = '';
    pageHeroes.forEach(hero => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-id">${hero.id}</td>
            <td class="td-img"><img src="${hero.image_url ? escapeHTML(hero.image_url) : '../img/unnamed.webp'}" onerror="this.src='../img/unnamed.webp'" alt=""></td>
            <td class="td-name">${escapeHTML(hero.name)}</td>
            <td>${escapeHTML(formatRole(hero.primary_role))}</td>
            <td>${hero.secondary_role ? escapeHTML(formatRole(hero.secondary_role)) : '<span class="no-data">—</span>'}</td>
            <td><span class="tier-badge tier-${escapeHTML(hero.tier)}">${escapeHTML((hero.tier || '').toUpperCase())}</span></td>
            <td class="td-actions">
                <button class="btn-edit" data-id="${hero.id}">✏️ Sửa</button>
                <button class="btn-del" data-id="${hero.id}" data-name="${escapeHTML(hero.name)}">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Re-attach event listeners
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const hero = heroMap.get(Number(btn.dataset.id));
            if (hero) editHero(hero);
        });
    });
    tbody.querySelectorAll('.btn-del').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteHero(Number(btn.dataset.id), btn.dataset.name);
        });
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredHeroes.length / pageSize) || 1;
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const pageNumbers = document.getElementById('page-numbers');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageNumbers.innerHTML = '';
    
    // Simple pagination: show first, current, last and dots
    let pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    pages.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            pageNumbers.appendChild(span);
        } else {
            const btn = document.createElement('button');
            btn.className = `page-num ${p === currentPage ? 'active' : ''}`;
            btn.textContent = p;
            btn.onclick = () => {
                currentPage = p;
                renderTable();
            };
            pageNumbers.appendChild(btn);
        }
    });
}

// ===== FORMAT ROLE =====
function formatRole(role) {
    const map = {
        assassin: '🗡️ Sát Thủ',
        fighter: '⚔️ Đấu Sĩ',
        marksman: '🏹 Xạ Thủ',
        mage: '🔮 Pháp Sư',
        tank: '🛡️ Đỡ Đòn',
        support: '💚 Trợ Thủ'
    };
    return map[role] || role;
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    loadHeroes();

    const addBtn = document.getElementById('btn-add');
    const importBtn = document.getElementById('btn-import');
    const importFileInput = document.getElementById('import-json');
    const modal = document.getElementById('hero-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('hero-form');
    const searchInput = document.getElementById('search-input');

    // Mở cửa sổ chọn file
    if (importBtn && importFileInput) {
        importBtn.onclick = () => importFileInput.click();
        importFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (!Array.isArray(data)) {
                        showToast('❌ File JSON không hợp lệ. Hãy đảm bảo nội dung là một mảng (Array).', 'error');
                        importFileInput.value = '';
                        return;
                    }

                    showToast(`⏳ Đang xử lý ${data.length} tướng, xin chờ...`, 'success');
                    let successCount = 0;
                    
                    // Lặp gửi từng tướng lên API
                    for (const hero of data) {
                        try {
                            const res = await fetch(API_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(hero)
                            });
                            if (res.ok) successCount++;
                        } catch (err) {
                            console.error('Lỗi khi thêm data:', hero.name);
                        }
                    }

                    showToast(`✅ Đã nhập thành công ${successCount}/${data.length} tướng!`, 'success');
                    importFileInput.value = ''; // Reset input
                    loadHeroes(searchInput.value); // Load lại giao diện
                } catch (error) {
                    showToast('❌ Cú pháp JSON bị sai! Không thể phân tích.', 'error');
                    importFileInput.value = '';
                }
            };
            reader.readAsText(file);
        };
    }

    // Tìm kiếm & Lọc
    searchInput.addEventListener('input', applyFiltersAndRender);
    document.getElementById('filter-role').addEventListener('change', applyFiltersAndRender);
    document.getElementById('filter-tier').addEventListener('change', applyFiltersAndRender);

    // Pagination controls
    document.getElementById('btn-prev').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    };
    document.getElementById('btn-next').onclick = () => {
        const totalPages = Math.ceil(filteredHeroes.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    };
    document.getElementById('page-size').onchange = (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    };

    // Mở modal thêm mới
    addBtn.onclick = () => {
        document.getElementById('modal-title').textContent = '➕ Thêm Tướng Mới';
        form.reset();
        document.getElementById('hero-id').value = '';
        document.getElementById('img-preview').src = '';
        document.getElementById('img-preview').style.display = 'none';
        document.getElementById('hero-builds-hidden').value = '';
        document.getElementById('multi-builds-container').innerHTML = '';
        
        // Add one default build card for new hero
        document.getElementById('multi-builds-container').appendChild(window.createBuildCard('Đề cử 1'));
        
        modal.classList.add('active');
    };

    // Đóng modal
    closeBtn.onclick = () => modal.classList.remove('active');
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

    // Setup all previews using utility
    setupPreview('hero-image', 'img-preview');
    ['p', '1', '2', '3'].forEach(key => setupPreview(`skill-${key}-img`, `prev-skill-${key}`));

    // === DRAG AND DROP BUILDER INITIALIZATION ===
    const multiBuildsContainer = document.getElementById('multi-builds-container');
    
    // Tab switching
    document.querySelectorAll('.lib-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.lib-pane').forEach(p => p.classList.add('d-none'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.remove('d-none');
        };
    });

    // Add search listener for lib-search
    document.getElementById('lib-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.draggable-item').forEach(el => {
            if (el.dataset.name.toLowerCase().includes(query)) el.style.display = 'inline-block';
            else el.style.display = 'none';
        });
    });

    // Library Data Loading
    async function loadLibraryData() {
        const renderLib = (url, containerId, type) => {
            fetch(url).then(r => r.json()).then(json => {
                libraryMaps[type === 'arcana' ? 'arcanas' : (type === 'rune' ? 'runes' : 'items')] = json.data;
                const con = document.getElementById(containerId);
                con.innerHTML = json.data.map(item => `<img src="${item.image_url}" data-name="${item.name}" data-type="${type}" class="draggable-item" draggable="true" title="${item.name}">`).join('');
                con.querySelectorAll('.draggable-item').forEach(el => {
                    el.addEventListener('dragstart', (ev) => {
                        ev.dataTransfer.setData('text/plain', JSON.stringify({name: el.dataset.name, type: el.dataset.type, img: el.src}));
                    });
                });
            }).catch(() => {});
        };
        renderLib(API_URL.replace('/heroes', '/items'), 'lib-items', 'item');
        renderLib(API_URL.replace('/heroes', '/arcanas'), 'lib-arcanas', 'arcana');
        renderLib(API_URL.replace('/heroes', '/runes'), 'lib-runes', 'rune');
    }
    loadLibraryData();



    // Helper to setup dropzone events
    const setupDropzone = (dz) => {
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', e => { dz.classList.remove('dragover'); });
        dz.addEventListener('drop', e => {
            e.preventDefault();
            dz.classList.remove('dragover');
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (dz.dataset.type !== data.type) return showToast('❌ Thả sai khu vực loại!', 'error');

            const itemWrap = document.createElement('div');
            itemWrap.className = 'dropped-item-wrapper';
            itemWrap.innerHTML = `<img src="${data.img}" class="dropped-item" data-name="${data.name}" title="${data.name}">
                                  <button type="button" class="remove-dropped-btn">x</button>`;
            if (data.type === 'arcana') itemWrap.innerHTML += `<span class="arcana-quantity">x10</span>`;
            
            itemWrap.querySelector('.remove-dropped-btn').onclick = () => itemWrap.remove();
            dz.appendChild(itemWrap);
        });
    };

    // BUILD CARD CREATION (Integrated Loadout)
    window.createBuildCard = (title = '', itemsStr = '', arcanasStr = '', runesStr = '', maps = null) => {
        const currentMaps = maps || libraryMaps;
        const card = document.createElement('div');
        card.className = 'build-card';
        card.innerHTML = `
            <div class="build-card-header">
                <input type="text" class="build-card-title" value="${title || 'Lối đồ mới'}" placeholder="Tên lối đồ...">
                <button type="button" class="btn-remove-card">Xóa</button>
            </div>
            <div class="build-card-content">
                <div class="dropzone-wrapper">
                    <label class="dropzone-label">🎒 Trang bị:</label>
                    <div class="dropzone sub-dz" data-type="item"></div>
                </div>
                <div class="build-dz-row">
                    <div class="dropzone-wrapper">
                        <label class="dropzone-label">🔮 Ngọc:</label>
                        <div class="dropzone sub-dz" data-type="arcana"></div>
                    </div>
                    <div class="dropzone-wrapper">
                        <label class="dropzone-label">🧿 Phù hiệu:</label>
                        <div class="dropzone sub-dz" data-type="rune"></div>
                    </div>
                </div>
            </div>
        `;
        
        const dzItems = card.querySelector('[data-type="item"]');
        const dzArcanas = card.querySelector('[data-type="arcana"]');
        const dzRunes = card.querySelector('[data-type="rune"]');
        
        [dzItems, dzArcanas, dzRunes].forEach(setupDropzone);
        card.querySelector('.btn-remove-card').onclick = () => card.remove();
        
        // Populate items
        const populate = (dz, str, mapData) => {
            if (!str || !mapData) return;
            const names = str.split(',').map(s => s.trim().replace(/ x10/g, '')).filter(Boolean);
            names.forEach(name => {
                const item = mapData.find(m => m.name === name);
                const imgUrl = item ? item.image_url : '../img/unnamed.webp';
                const itemWrap = document.createElement('div');
                itemWrap.className = 'dropped-item-wrapper';
                itemWrap.innerHTML = `<img src="${imgUrl}" class="dropped-item" data-name="${name}" title="${name}">
                                      <button type="button" class="remove-dropped-btn">x</button>`;
                if (dz.dataset.type === 'arcana') itemWrap.innerHTML += `<span class="arcana-quantity">x10</span>`;
                itemWrap.querySelector('.remove-dropped-btn').onclick = () => itemWrap.remove();
                dz.appendChild(itemWrap);
            });
        };

        populate(dzItems, itemsStr, currentMaps.items);
        populate(dzArcanas, arcanasStr, currentMaps.arcanas);
        populate(dzRunes, runesStr, currentMaps.runes);
        
        return card;
    };

    // Add Build Card Button
    document.getElementById('btn-add-drag-build').onclick = () => {
        multiBuildsContainer.appendChild(window.createBuildCard('Lối đồ mới'));
    };



    // Submit form (Thêm hoặc Sửa)
    form.onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = form.querySelector('.btn-save');
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Đang lưu...';

        const buildSkill = (key) => {
            const name = document.getElementById(`hero-skill-${key}-name`).value.trim();
            const desc = document.getElementById(`hero-skill-${key}`).value.trim();
            if (name && desc) return `${name}: ${desc}`;
            if (name) return name;
            return desc;
        };

        const id = document.getElementById('hero-id').value;
        
        // Thu thập dữ liệu dropzones
        const getNamesFromDz = (dz, isArcana) => {
            if (!dz) return "";
            const els = Array.from(dz.querySelectorAll('.dropped-item'));
            return els.map(el => isArcana ? `${el.dataset.name} x10` : el.dataset.name).join(', ');
        };

        const builds = [];
        multiBuildsContainer.querySelectorAll('.build-card').forEach(card => {
            const title = card.querySelector('.build-card-title').value.trim();
            const items = getNamesFromDz(card.querySelector('[data-type="item"]'), false);
            const arcanas = getNamesFromDz(card.querySelector('[data-type="arcana"]'), true);
            const runes = getNamesFromDz(card.querySelector('[data-type="rune"]'), false);
            if (title || items) builds.push({ title, items, arcanas, runes });
        });

        const data = {
            name: document.getElementById('hero-name').value.trim(),
            primary_role: document.getElementById('hero-role1').value,
            secondary_role: document.getElementById('hero-role2').value || null,
            tier: document.getElementById('hero-tier').value,
            story: document.getElementById('hero-story').value.trim(),
            skill_p: buildSkill('p'),
            skill_1: buildSkill('1'),
            skill_2: buildSkill('2'),
            skill_3: buildSkill('3'),
            builds: JSON.stringify(builds),
            items: builds.length > 0 ? builds[0].items : '', // Fallback cho cột cũ
            image_url: document.getElementById('hero-image').value.trim(),
            skins: document.getElementById('hero-skins').value.trim(),
            skill_p_img: document.getElementById('skill-p-img').value.trim(),
            skill_1_img: document.getElementById('skill-1-img').value.trim(),
            skill_2_img: document.getElementById('skill-2-img').value.trim(),
            skill_3_img: document.getElementById('skill-3-img').value.trim(),
            win_rate: document.getElementById('hero-win-rate').value.trim(),
            pick_rate: document.getElementById('hero-pick-rate').value.trim(),
            ban_rate: document.getElementById('hero-ban-rate').value.trim(),
            counters: document.getElementById('hero-counters').value.trim(),
            recommended_arcanas: builds.length > 0 ? (builds[0].arcanas || "") : "",
            recommended_runes: builds.length > 0 ? (builds[0].runes || "") : "",
        };

        try {
            const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error();

            modal.classList.remove('active');
            multiBuildsContainer.innerHTML = ''; // Clear builds UI
            showToast(id ? `✅ Đã cập nhật ${data.name}!` : `✅ Đã thêm ${data.name} thành công!`);
            
            // Reload from API and update local state
            await loadHeroes();
        } catch (error) {
            showToast(`❌ Lỗi! ${error.message || 'Hãy kiểm tra Server Node.js.'}`, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Lưu Lại';
        }
    };
});

// ===== EDIT HERO =====
window.editHero = (hero) => {
    document.getElementById('modal-title').textContent = '✏️ Chỉnh Sửa Tướng';
    document.getElementById('hero-id').value = hero.id;
    document.getElementById('hero-name').value = hero.name;
    document.getElementById('hero-role1').value = hero.primary_role;
    document.getElementById('hero-role2').value = hero.secondary_role || '';
    document.getElementById('hero-tier').value = hero.tier;
    document.getElementById('hero-win-rate').value = hero.win_rate || '';
    document.getElementById('hero-pick-rate').value = hero.pick_rate || '';
    document.getElementById('hero-ban-rate').value = hero.ban_rate || '';
    document.getElementById('hero-counters').value = hero.counters || '';
    // Load from DB to populate Dropzones
    Promise.all([
        fetch(API_URL.replace('/heroes', '/items')).then(r => r.json()),
        fetch(API_URL.replace('/heroes', '/arcanas')).then(r => r.json()),
        fetch(API_URL.replace('/heroes', '/runes')).then(r => r.json())
    ]).then(([itemsData, arcanasData, runesData]) => {
        multiBuildsContainer.innerHTML = '';
        const maps = { items: itemsData.data || [], arcanas: arcanasData.data || [], runes: runesData.data || [] };

        if (hero.builds) {
            try { 
                const bArr = JSON.parse(hero.builds); 
                if(bArr.length) {
                    bArr.forEach((b, idx) => {
                        // Patch built-in arcanas/runes into the first build if they are missing
                        if (idx === 0) {
                            b.arcanas = b.arcanas || hero.recommended_arcanas;
                            b.runes = b.runes || hero.recommended_runes;
                        }
                        multiBuildsContainer.appendChild(window.createBuildCard(b.title, b.items, b.arcanas, b.runes, maps));
                    });
                } else {
                    multiBuildsContainer.appendChild(window.createBuildCard('Đề cử', hero.items, hero.recommended_arcanas, hero.recommended_runes, maps));
                }
            } catch(e){
                multiBuildsContainer.appendChild(window.createBuildCard('Đề cử', hero.items, hero.recommended_arcanas, hero.recommended_runes, maps));
            }
        } else {
            multiBuildsContainer.appendChild(window.createBuildCard('Đề cử', hero.items, hero.recommended_arcanas, hero.recommended_runes, maps));
        }
    });

    // Previews and values for hero image and skins
    document.getElementById('hero-image').value = hero.image_url || '';
    document.getElementById('hero-skins').value = hero.skins || '';
    
    // Trigger preview for hero image
    const imgPrev = document.getElementById('img-preview');
    if (hero.image_url) {
        imgPrev.src = hero.image_url;
        imgPrev.classList.remove('d-none');
    } else {
        imgPrev.classList.add('d-none');
    }

    // Skill Names, Desc & Image Previews
    ['p', '1', '2', '3'].forEach(key => {
        // Text values
        const skillText = hero[`skill_${key}`] || '';
        if (skillText.includes(':')) {
            const parts = skillText.split(':');
            document.getElementById(`hero-skill-${key}-name`).value = parts[0].trim();
            document.getElementById(`hero-skill-${key}`).value = parts.slice(1).join(':').trim();
        } else {
            document.getElementById(`hero-skill-${key}-name`).value = '';
            document.getElementById(`hero-skill-${key}`).value = skillText;
        }

        // Image values and previews
        const img = hero[`skill_${key}_img`];
        const input = document.getElementById(`skill-${key}-img`);
        const prev = document.getElementById(`prev-skill-${key}`);
        if (input) input.value = img || '';
        if (prev) {
            if (img) {
                prev.src = img;
                prev.style.display = 'block';
            } else {
                prev.style.display = 'none';
            }
        }
    });

    document.getElementById('hero-modal').classList.add('active');
};

// ===== DELETE HERO =====
window.deleteHero = async (id, name) => {
    if (!confirm(`⚠️ Xóa tướng "${name}"?\nHành động này không thể hoàn tác!`)) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            heroMap.delete(id);
            showToast(`🗑️ Đã xóa ${name}!`, 'warning');
            allHeroes = allHeroes.filter(h => h.id !== id);
            applyFiltersAndRender();
        }
    } catch (e) {
        showToast('❌ Xóa thất bại!', 'error');
    }
};

// ================================================
//  ITEMS MANAGEMENT
// ================================================
const ITEMS_API = `${BASE_URL}/items`;
const itemMap = new Map();

const TYPE_LABEL = {
    attack: '⚔️ Tấn Công', defense: '🛡️ Phòng Thủ',
    magic: '🔮 Phép Thuật', jungle: '🌿 Rừng',
    support: '💚 Hỗ Trợ', boots: '👟 Giày'
};

// --- API ENDPOINTS ---
const ARCANAS_API = `${BASE_URL}/arcanas`;
const RUNES_API = `${BASE_URL}/runes`;
const arcanaMap = new Map();
const runeMap = new Map();

// --- TAB SWITCHING ---
document.addEventListener('DOMContentLoaded', () => {
    const heroesMain  = document.querySelector('.admin-main:not(#items-section):not(#arcanas-section):not(#runes-section)');
    const itemsMain   = document.getElementById('items-section');
    const arcanasMain = document.getElementById('arcanas-section');
    const runesMain   = document.getElementById('runes-section');
    const tierlistMain = document.getElementById('tierlist-section');

    const hideAll = () => {
        [heroesMain, itemsMain, arcanasMain, runesMain, tierlistMain].forEach(el => {
            if (el) el.classList.add('d-none');
        });
    };

    document.querySelectorAll('.btn-tab-heroes').forEach(btn => btn.onclick = () => {
        hideAll();
        if (heroesMain) heroesMain.classList.remove('d-none');
        loadHeroes();
    });

    document.querySelectorAll('.btn-tab-items').forEach(btn => btn.onclick = () => {
        hideAll();
        if (itemsMain) itemsMain.classList.remove('d-none');
        loadItems();
    });

    document.querySelectorAll('.btn-tab-arcanas').forEach(btn => btn.onclick = () => {
        hideAll();
        if (arcanasMain) arcanasMain.classList.remove('d-none');
        loadArcanas();
    });

    document.querySelectorAll('.btn-tab-runes').forEach(btn => btn.onclick = () => {
        hideAll();
        if (runesMain) runesMain.classList.remove('d-none');
        loadRunes();
    });

    document.querySelectorAll('.btn-tab-tierlist').forEach(btn => btn.onclick = () => {
        hideAll();
        if (tierlistMain) tierlistMain.classList.remove('d-none');
        initTierManagement();
    });

    // Add/close item modal
    const itemModal    = document.getElementById('item-modal');
    const btnAddItem   = document.getElementById('btn-add-item');
    const closeItemBtn = document.getElementById('close-item-modal');
    const itemForm     = document.getElementById('item-form');

    if (btnAddItem) {
        btnAddItem.onclick = () => {
            document.getElementById('item-modal-title').textContent = '➕ Thêm Trang Bị';
            itemForm.reset();
            document.getElementById('item-id').value = '';
            document.getElementById('item-img-preview').classList.add('d-none');
            itemModal.classList.add('active');
        };
    }
    if (closeItemBtn) closeItemBtn.onclick = () => itemModal.classList.remove('active');

    // Add/close arcana modal
    const arcanaModal    = document.getElementById('arcana-modal');
    const btnAddArcana   = document.getElementById('btn-add-arcana');
    const closeArcanaBtn = document.getElementById('close-arcana-modal');
    const arcanaForm     = document.getElementById('arcana-form');

    if (btnAddArcana) {
        btnAddArcana.onclick = () => {
            document.getElementById('arcana-modal-title').textContent = '➕ Thêm Ngọc';
            arcanaForm.reset();
            document.getElementById('arcana-id').value = '';
            document.getElementById('arcana-img-preview').classList.add('d-none');
            arcanaModal.classList.add('active');
        };
    }
    if (closeArcanaBtn) closeArcanaBtn.onclick = () => arcanaModal.classList.remove('active');

    // Add/close rune modal
    const runeModal    = document.getElementById('rune-modal');
    const btnAddRune   = document.getElementById('btn-add-rune');
    const closeRuneBtn = document.getElementById('close-rune-modal');
    const runeForm     = document.getElementById('rune-form');

    if (btnAddRune) {
        btnAddRune.onclick = () => {
            document.getElementById('rune-modal-title').textContent = '➕ Thêm Phù Hiệu';
            runeForm.reset();
            document.getElementById('rune-id').value = '';
            document.getElementById('rune-img-preview').classList.add('d-none');
            runeModal.classList.add('active');
        };
    }
    if (closeRuneBtn) closeRuneBtn.onclick = () => runeModal.classList.remove('active');

    // Shortcut buttons from heroes main toolbar
    const btnAddArcanaMain = document.getElementById('btn-add-arcana-main');
    const btnAddRuneMain = document.getElementById('btn-add-rune-main');
    const btnAddItemMain = document.getElementById('btn-add-item-main');

    if (btnAddArcanaMain) btnAddArcanaMain.onclick = () => {
        document.querySelector('.btn-tab-arcanas').click();
        btnAddArcana.click();
    };
    if (btnAddRuneMain) btnAddRuneMain.onclick = () => {
        document.querySelector('.btn-tab-runes').click();
        btnAddRune.click();
    };
    if (btnAddItemMain) btnAddItemMain.onclick = () => {
        document.querySelector('.btn-tab-items').click();
        btnAddItem.click();
    };

    window.addEventListener('click', (e) => {
        if (e.target === itemModal) itemModal.classList.remove('active');
        if (e.target === arcanaModal) arcanaModal.classList.remove('active');
        if (e.target === runeModal) runeModal.classList.remove('active');
    });

    // Image previews setup moved to global scope
    setupPreview('item-image', 'item-img-preview');
    setupPreview('arcana-image', 'arcana-img-preview');
    setupPreview('rune-image', 'rune-img-preview');

    // Search handlers
    const itemSearchInput = document.getElementById('item-search-input');
    if (itemSearchInput) itemSearchInput.addEventListener('input', () => loadItems(itemSearchInput.value));

    const arcanaSearchInput = document.getElementById('arcana-search-input');
    if (arcanaSearchInput) arcanaSearchInput.addEventListener('input', () => loadArcanas(arcanaSearchInput.value));

    const runeSearchInput = document.getElementById('rune-search-input');
    if (runeSearchInput) runeSearchInput.addEventListener('input', () => loadRunes(runeSearchInput.value));

    // Item form submit
    if (itemForm) {
        itemForm.onsubmit = async (e) => {
            e.preventDefault();
            const saveBtn = itemForm.querySelector('.btn-save');
            saveBtn.disabled = true;
            saveBtn.textContent = '⏳ Đang lưu...';

            const id = document.getElementById('item-id').value;
            const data = {
                name:        document.getElementById('item-name').value.trim(),
                type:        document.getElementById('item-type').value,
                stat_atk:    document.getElementById('item-stat-atk').value.trim(),
                stat_def:    document.getElementById('item-stat-def').value.trim(),
                stat_other:  document.getElementById('item-stat-other').value.trim(),
                description: document.getElementById('item-description').value.trim(),
                image_url:   document.getElementById('item-image').value.trim(),
                price:       parseInt(document.getElementById('item-price').value) || 0,
            };

            try {
                const res = await fetch(id ? `${ITEMS_API}/${id}` : ITEMS_API, {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error();
                itemModal.classList.remove('active');
                showToast(id ? `✅ Đã cập nhật ${data.name}!` : `✅ Đã thêm ${data.name}!`);
                loadItems(document.getElementById('item-search-input').value);
            } catch (err) {
                showToast(`❌ Lỗi! ${err.message || 'Hãy kiểm tra Server.'}`, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Lưu Trang Bị';
            }
        };
    }

    // Arcana form submit
    if (arcanaForm) {
        arcanaForm.onsubmit = async (e) => {
            e.preventDefault();
            const saveBtn = arcanaForm.querySelector('.btn-save');
            saveBtn.disabled = true;
            saveBtn.textContent = '⏳ Đang lưu...';

            const id = document.getElementById('arcana-id').value;
            const data = {
                name:      document.getElementById('arcana-name').value.trim(),
                color:     document.getElementById('arcana-color').value,
                level:     parseInt(document.getElementById('arcana-level').value) || null,
                stats:     document.getElementById('arcana-stats').value.trim(),
                image_url: document.getElementById('arcana-image').value.trim(),
            };

            try {
                const res = await fetch(id ? `${ARCANAS_API}/${id}` : ARCANAS_API, {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error();
                arcanaModal.classList.remove('active');
                showToast(id ? `✅ Đã cập nhật ${data.name}!` : `✅ Đã thêm ${data.name}!`);
                loadArcanas(document.getElementById('arcana-search-input').value);
            } catch (err) {
                showToast(`❌ Lỗi! ${err.message || 'Hãy kiểm tra Server.'}`, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Lưu Ngọc';
            }
        };
    }

    // Rune form submit
    if (runeForm) {
        runeForm.onsubmit = async (e) => {
            e.preventDefault();
            const saveBtn = runeForm.querySelector('.btn-save');
            saveBtn.disabled = true;
            saveBtn.textContent = '⏳ Đang lưu...';

            const id = document.getElementById('rune-id').value;
            const data = {
                name:        document.getElementById('rune-name').value.trim(),
                branch:      document.getElementById('rune-branch').value,
                tier:        parseInt(document.getElementById('rune-tier').value) || null,
                description: document.getElementById('rune-description').value.trim(),
                image_url:   document.getElementById('rune-image').value.trim(),
            };

            try {
                const res = await fetch(id ? `${RUNES_API}/${id}` : RUNES_API, {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error();
                runeModal.classList.remove('active');
                showToast(id ? `✅ Đã cập nhật ${data.name}!` : `✅ Đã thêm ${data.name}!`);
                loadRunes(document.getElementById('rune-search-input').value);
            } catch (err) {
                showToast(`❌ Lỗi! ${err.message || 'Hãy kiểm tra Server.'}`, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Lưu Phù Hiệu';
            }
        };
    }
});

// --- LOAD ITEMS ---
async function loadItems(filter = '') {
    const tbody = document.getElementById('items-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="loading-cell"><span class="spinner"></span> Đang tải...</td></tr>`;

    try {
        const res = await fetch(ITEMS_API);
        if (!res.ok) throw new Error();
        const json = await res.json();

        let items = json.data;
        if (filter) {
            const f = filter.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(f) ||
                (i.type || '').toLowerCase().includes(f)
            );
        }

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">Chưa có trang bị nào.</td></tr>`;
            document.getElementById('item-count').textContent = '0 trang bị';
            return;
        }

        itemMap.clear();
        items.forEach(i => itemMap.set(i.id, i));
        document.getElementById('item-count').textContent = `${items.length} trang bị`;

        tbody.innerHTML = '';
        items.forEach(item => {
            const tr = document.createElement('tr');
            const stats = [item.stat_atk, item.stat_def, item.stat_other]
                .filter(Boolean)
                .map(s => escapeHTML(s))
                .join(' · ') || '<span class="no-data">—</span>';
            tr.innerHTML = `
                <td class="td-id">${item.id}</td>
                <td class="td-img"><img src="${item.image_url ? escapeHTML(item.image_url) : '../img/unnamed.webp'}" onerror="this.src='../img/unnamed.webp'" alt="" style="border-radius:6px;"></td>
                <td class="td-name">${escapeHTML(item.name)}</td>
                <td>${escapeHTML(TYPE_LABEL[item.type] || item.type || '') || '<span class="no-data">—</span>'}</td>
                <td style="font-size:12px;max-width:200px;">${stats}</td>
                <td>${item.price ? escapeHTML(item.price) + ' 🪙' : '<span class="no-data">—</span>'}</td>
                <td class="td-actions">
                    <button class="btn-edit" data-item-id="${item.id}">✏️ Sửa</button>
                    <button class="btn-del" data-item-id="${item.id}" data-item-name="${escapeHTML(item.name)}">🗑️ Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = itemMap.get(Number(btn.dataset.itemId));
                if (item) editItem(item);
            });
        });
        tbody.querySelectorAll('.btn-del').forEach(btn => {
            btn.addEventListener('click', () => deleteItem(Number(btn.dataset.itemId), btn.dataset.itemName));
        });

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="error-cell">❌ Lỗi kết nối Server.</td></tr>`;
    }
}

// --- EDIT ITEM ---
window.editItem = (item) => {
    document.getElementById('item-modal-title').textContent = '✏️ Chỉnh Sửa Trang Bị';
    document.getElementById('item-id').value          = item.id;
    document.getElementById('item-name').value        = item.name;
    document.getElementById('item-type').value        = item.type || '';
    document.getElementById('item-price').value       = item.price || '';
    document.getElementById('item-stat-atk').value   = item.stat_atk || '';
    document.getElementById('item-stat-def').value   = item.stat_def || '';
    document.getElementById('item-stat-other').value = item.stat_other || '';
    document.getElementById('item-description').value= item.description || '';
    document.getElementById('item-image').value       = item.image_url || '';

    // Trigger preview
    document.getElementById('item-image').dispatchEvent(new Event('input'));
    document.getElementById('item-modal').classList.add('active');
};

// --- DELETE ITEM ---
window.deleteItem = async (id, name) => {
    if (!confirm(`⚠️ Xóa trang bị "${name}"?\nKhông thể hoàn tác!`)) return;
    try {
        const res = await fetch(`${ITEMS_API}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            itemMap.delete(id);
            showToast(`🗑️ Đã xóa ${name}!`, 'warning');
            loadItems(document.getElementById('item-search-input').value);
        }
    } catch (err) {
        showToast(`❌ Lỗi! ${err.message || 'Xóa thất bại.'}`, 'error');
    }
};

// ================================================
//  ARCANAS (NGỌC) MANAGEMENT
// ================================================
async function loadArcanas(filter = '') {
    const tbody = document.getElementById('arcanas-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="loading-cell"><span class="spinner"></span> Đang tải...</td></tr>`;

    try {
        const res = await fetch(ARCANAS_API);
        if (!res.ok) throw new Error();
        const json = await res.json();

        let arcanas = json.data;
        if (filter) {
            const f = filter.toLowerCase();
            arcanas = arcanas.filter(a =>
                a.name.toLowerCase().includes(f) ||
                (a.color || '').toLowerCase().includes(f)
            );
        }

        if (arcanas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">Chưa có ngọc nào.</td></tr>`;
            document.getElementById('arcana-count').textContent = '0 ngọc';
            return;
        }

        arcanaMap.clear();
        arcanas.forEach(a => arcanaMap.set(a.id, a));
        document.getElementById('arcana-count').textContent = `${arcanas.length} ngọc`;

        tbody.innerHTML = '';
        arcanas.forEach(arcana => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${arcana.id}</td>
                <td class="td-img"><img src="${arcana.image_url ? escapeHTML(arcana.image_url) : '../img/unnamed.webp'}" onerror="this.src='../img/unnamed.webp'" alt="" style="border-radius:50%;border:2px solid ${arcana.color==='Đỏ'?'#e74c3c':arcana.color==='Tím'?'#9b59b6':arcana.color==='Xanh lục'?'#2ecc71':'#555'};"></td>
                <td class="td-name">${escapeHTML(arcana.name)}</td>
                <td><span style="color:${arcana.color==='Đỏ'?'#e74c3c':arcana.color==='Tím'?'#d7a8f0':arcana.color==='Xanh lục'?'#2ecc71':'#fff'};font-weight:bold;">${escapeHTML(arcana.color) || '—'}</span></td>
                <td>Cấp ${escapeHTML(arcana.level) || '—'}</td>
                <td style="font-size:12px;max-width:200px;">${escapeHTML(arcana.stats) || '<span class="no-data">—</span>'}</td>
                <td class="td-actions">
                    <button class="btn-edit" data-arcana-id="${arcana.id}">✏️ Sửa</button>
                    <button class="btn-del" data-arcana-id="${arcana.id}" data-arcana-name="${escapeHTML(arcana.name)}">🗑️ Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const a = arcanaMap.get(Number(btn.dataset.arcanaId));
                if (a) editArcana(a);
            });
        });
        tbody.querySelectorAll('.btn-del').forEach(btn => {
            btn.addEventListener('click', () => deleteArcana(Number(btn.dataset.arcanaId), btn.dataset.arcanaName));
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="error-cell">❌ Lỗi kết nối Server.</td></tr>`;
    }
}

window.editArcana = (arcana) => {
    document.getElementById('arcana-modal-title').textContent = '✏️ Chỉnh Sửa Ngọc';
    document.getElementById('arcana-id').value    = arcana.id;
    document.getElementById('arcana-name').value  = arcana.name;
    document.getElementById('arcana-color').value = arcana.color || '';
    document.getElementById('arcana-level').value = arcana.level || '';
    document.getElementById('arcana-stats').value = arcana.stats || '';
    document.getElementById('arcana-image').value = arcana.image_url || '';
    // Trigger preview
    document.getElementById('arcana-image').dispatchEvent(new Event('input'));
    document.getElementById('arcana-modal').classList.add('active');
};

window.deleteArcana = async (id, name) => {
    if (!confirm(`⚠️ Xóa ngọc "${name}"?\nKhông thể hoàn tác!`)) return;
    try {
        const res = await fetch(`${ARCANAS_API}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            arcanaMap.delete(id);
            showToast(`🗑️ Đã xóa ${name}!`, 'warning');
            loadArcanas(document.getElementById('arcana-search-input').value);
        }
    } catch (err) {
        showToast(`❌ Lỗi! ${err.message || 'Xóa thất bại.'}`, 'error');
    }
};

// ================================================
//  RUNES (PHÙ HIỆU) MANAGEMENT
// ================================================
async function loadRunes(filter = '') {
    const tbody = document.getElementById('runes-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="loading-cell"><span class="spinner"></span> Đang tải...</td></tr>`;

    try {
        const res = await fetch(RUNES_API);
        if (!res.ok) throw new Error();
        const json = await res.json();

        let runes = json.data;
        if (filter) {
            const f = filter.toLowerCase();
            runes = runes.filter(r =>
                r.name.toLowerCase().includes(f) ||
                (r.branch || '').toLowerCase().includes(f)
            );
        }

        if (runes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">Chưa có phù hiệu nào.</td></tr>`;
            document.getElementById('rune-count').textContent = '0 phù hiệu';
            return;
        }

        runeMap.clear();
        runes.forEach(r => runeMap.set(r.id, r));
        document.getElementById('rune-count').textContent = `${runes.length} phù hiệu`;

        tbody.innerHTML = '';
        runes.forEach(rune => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${rune.id}</td>
                <td class="td-img"><img src="${rune.image_url ? escapeHTML(rune.image_url) : '../img/unnamed.webp'}" onerror="this.src='../img/unnamed.webp'" alt="" style="border-radius:8px;"></td>
                <td class="td-name" style="color:#2ecc71;">${escapeHTML(rune.name)}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;">${escapeHTML(rune.branch) || '—'}</span></td>
                <td>Tier ${escapeHTML(rune.tier) || '—'}</td>
                <td style="font-size:12px;max-width:200px;">${escapeHTML(rune.description) || '<span class="no-data">—</span>'}</td>
                <td class="td-actions">
                    <button class="btn-edit" data-rune-id="${rune.id}">✏️ Sửa</button>
                    <button class="btn-del" data-rune-id="${rune.id}" data-rune-name="${escapeHTML(rune.name)}">🗑️ Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = runeMap.get(Number(btn.dataset.runeId));
                if (r) editRune(r);
            });
        });
        tbody.querySelectorAll('.btn-del').forEach(btn => {
            btn.addEventListener('click', () => deleteRune(Number(btn.dataset.runeId), btn.dataset.runeName));
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="error-cell">❌ Lỗi kết nối Server.</td></tr>`;
    }
}

window.editRune = (rune) => {
    document.getElementById('rune-modal-title').textContent = '✏️ Chỉnh Sửa Phù Hiệu';
    document.getElementById('rune-id').value         = rune.id;
    document.getElementById('rune-name').value       = rune.name;
    document.getElementById('rune-branch').value     = rune.branch || '';
    document.getElementById('rune-tier').value       = rune.tier || '';
    document.getElementById('rune-description').value= rune.description || '';
    document.getElementById('rune-image').value      = rune.image_url || '';
    // Trigger preview
    document.getElementById('rune-image').dispatchEvent(new Event('input'));
    document.getElementById('rune-modal').classList.add('active');
};

window.deleteRune = async (id, name) => {
    if (!confirm(`⚠️ Xóa phù hiệu "${name}"?\nKhông thể hoàn tác!`)) return;
    try {
        const res = await fetch(`${RUNES_API}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            runeMap.delete(id);
            showToast(`🗑️ Đã xóa ${name}!`, 'warning');
            loadRunes(document.getElementById('rune-search-input').value);
        }
    } catch (err) {
        showToast(`❌ Lỗi! ${err.message || 'Xóa thất bại.'}`, 'error');
    }
};

// ================================================
//  TIER MANAGEMENT LOGIC
// ================================================
const TIER_CONFIG = [
    { id: 'splus', label: 'S+' },
    { id: 's',     label: 'S'  },
    { id: 'a',     label: 'A'  },
    { id: 'b',     label: 'B'  },
    { id: 'c',     label: 'C'  },
    { id: 'd',     label: 'D'  }
];

async function initTierManagement() {
    const board = document.getElementById('tier-mgmt-board');
    if (!board) return;
    
    board.innerHTML = `<div class="loading-cell"><span class="spinner"></span> Đang tải dữ liệu...</div>`;
    
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const heroes = json.data;

        board.innerHTML = '';
        TIER_CONFIG.forEach(tier => {
            const row = document.createElement('div');
            row.className = 'tier-mgmt-row';
            row.innerHTML = `
                <div class="tier-mgmt-label tier-${tier.id}">${tier.label}</div>
                <div class="tier-mgmt-heroes" id="mgmt-tier-${tier.id}"></div>
            `;
            board.appendChild(row);

            const container = row.querySelector('.tier-mgmt-heroes');
            const tierHeroes = heroes.filter(h => (h.tier || 'c').toLowerCase() === tier.id);
            
            tierHeroes.sort((a,b) => a.name.localeCompare(b.name)).forEach(hero => {
                const item = document.createElement('div');
                item.className = 'tier-hero-item';
                item.dataset.id = hero.id;
                item.dataset.name = hero.name;
                item.title = `${hero.name} (Nhấn để chuyển Tier)`;
                item.innerHTML = `<img src="${hero.image_url ? escapeHTML(hero.image_url) : '../img/unnamed.webp'}" onerror="this.src='../img/unnamed.webp'">`;
                
                item.onclick = () => cycleTier(hero);
                container.appendChild(item);
            });
        });
    } catch (err) {
        board.innerHTML = `<div class="error-cell">❌ Lỗi tải dữ liệu.</div>`;
    }
}

async function cycleTier(hero) {
    const tiers = TIER_CONFIG.map(t => t.id);
    const currentIdx = tiers.indexOf((hero.tier || 'c').toLowerCase());
    const nextIdx = (currentIdx + 1) % tiers.length;
    const nextTier = tiers[nextIdx];

    if (!confirm(`Chuyển ${hero.name} sang Tier ${nextTier.toUpperCase()}?`)) return;

    try {
        const res = await fetch(`${API_URL}/${hero.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...hero, tier: nextTier })
        });

        if (res.ok) {
            showToast(`⭐ Đã cập nhật ${hero.name} lên Tier ${nextTier.toUpperCase()}`);
            initTierManagement();
            loadHeroes(); // Refresh list in main tab too
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('❌ Lỗi cập nhật Tier!', 'error');
    }
}
