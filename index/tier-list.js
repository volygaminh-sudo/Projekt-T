// ================================================
//  TIER LIST DATA — Liên Quân Mobile
//  Dữ liệu giờ đây chủ yếu được kéo từ Database Backend
// ================================================
const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
const API_BASE = isLocal ? 'http://127.0.0.1:3008/api' : '/api';

// Global State
let MAKER_MODE = false;
let HEROES = [];
let USER_CUSTOM_ORDER = null;

// Fallback gradient per role when image 404s
const ROLE_GRADIENT = {
  tank:     ["#1a3a5c","#2e86c1"],
  fighter:  ["#7a0000","#e53935"],
  assassin: ["#1a0033","#6a0dad"],
  marksman: ["#4a0080","#9c27b0"],
  mage:     ["#1a0533","#7b2fbe"],
  support:  ["#004d2e","#27ae60"],
};

const TIERS = [
  { id:"splus", label:"S+", desc:"Thống trị" },
  { id:"s",     label:"S",  desc:"Rất mạnh"  },
  { id:"a",     label:"A",  desc:"Mạnh"       },
  { id:"b",     label:"B",  desc:"Ổn định"    },
  { id:"c",     label:"C",  desc:"Bình thường"},
  { id:"d",     label:"D",  desc:"Cần buff"   },
];

// ================================================
//  RENDER ENGINE
// ================================================

function getHeroImg(name, primaryRole, imgUrl) {
  const initial = name.charAt(0).toUpperCase();
  const realImgUrl = imgUrl || '';
  const imgStyle = imgUrl ? "" : "display:none;";
  const spanStyle = imgUrl ? "display:none;" : "display:flex;";

  return `<img class="ha-img" src="${realImgUrl}" alt="${name}" loading="lazy" style="${imgStyle}" onerror="this.onerror=null; this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
          <span class="hero-icon-emoji" style="${spanStyle}">${initial}</span>`;
}

function buildCard(hero) {
  const [name, roles, tierStr, dbId, imgUrl, skinUrls, stats] = hero;
  const primaryRole = roles[0];
  const [g1, g2] = ROLE_GRADIENT[primaryRole];
  const safeId = name.replace(/[^a-zA-Z0-9]/g,"-");
  
  const clickAction = window.isDetailView ? "" : `onclick="window.location.href='hero-detail.html?id=${dbId}'" style="cursor:pointer;" title="Nhấn xem chi tiết tướng"`;
  const skinsAttr = (skinUrls && skinUrls.length > 0) ? `data-skins="${skinUrls.join(',')}" data-default="${imgUrl || ''}"` : '';

  return `
    <div class="hero-card tier-hero-card" data-id="${dbId}" data-roles="${roles.join(" ")}" id="hc-${safeId}" ${clickAction} ${skinsAttr}>
      <div class="hero-avatar" style="background:linear-gradient(135deg,${g1},${g2})">
        ${getHeroImg(name, primaryRole, imgUrl)}
      </div>
      <span class="hero-name">${name}</span>
    </div>`;
}

function render() {
  const board = document.getElementById("tier-board");
  const poolContainer = document.getElementById("tier-pool");
  if (!board) return;
  
  const tierMap = {};
  TIERS.forEach(t=>{ tierMap[t.id]=[]; });
  let poolHeroes = [];

  // Logic phân loại tướng
  if (MAKER_MODE) {
      if (USER_CUSTOM_ORDER && USER_CUSTOM_ORDER.length > 0) {
          USER_CUSTOM_ORDER.forEach(orderItem => {
              const hero = HEROES.find(h => h[3] == orderItem.hero_id);
              if (hero && tierMap[orderItem.tier]) {
                  const customHero = [...hero];
                  customHero[2] = orderItem.tier; 
                  tierMap[orderItem.tier].push(customHero);
              }
          });
          // Những tướng chưa nằm trong custom order sẽ vào Pool
          HEROES.forEach(h => {
              const inOrder = USER_CUSTOM_ORDER.some(o => o.hero_id == h[3] && o.tier !== 'pool');
              if (!inOrder) poolHeroes.push(h);
          });
      } else {
          // Chưa có custom order -> Tất cả vào Pool
          poolHeroes = [...HEROES];
      }
  } else {
      // Chế độ META (Mặc định)
      if (USER_CUSTOM_ORDER && USER_CUSTOM_ORDER.length > 0) {
          USER_CUSTOM_ORDER.forEach(orderItem => {
              const hero = HEROES.find(h => h[3] == orderItem.hero_id);
              if (hero && tierMap[orderItem.tier]) {
                  const customHero = [...hero];
                  customHero[2] = orderItem.tier; 
                  tierMap[orderItem.tier].push(customHero);
              }
          });
          HEROES.forEach(h => {
              if (!USER_CUSTOM_ORDER.find(o => o.hero_id == h[3])) {
                  if(tierMap[h[2]]) tierMap[h[2]].push(h);
              }
          });
      } else {
          HEROES.forEach(h=>{ if(tierMap[h[2]]) tierMap[h[2]].push(h); });
      }
      // Sort alphabetical trong chế độ Meta
      Object.keys(tierMap).forEach(key => {
          tierMap[key].sort((a, b) => a[0].localeCompare(b[0]));
      });
  }

  // Render Board
  board.innerHTML = TIERS.map(tier=>`
    <div class="tier-row" data-tier="${tier.id}">
      <div class="tier-label tier-${tier.id}">
        <span class="tier-letter">${tier.label}</span>
        <span class="tier-desc">${tier.desc}</span>
      </div>
      <div class="tier-heroes drag-container" id="tier-${tier.id}" data-tier="${tier.id}">
        ${tierMap[tier.id].map(buildCard).join("")}
      </div>
    </div>`).join("");

  // Render Pool
  if (poolContainer) {
      poolContainer.innerHTML = poolHeroes.map(buildCard).join("");
  }

  updateCounts();
  initHoverSkins();
  initDragAndDrop();
}

// ================================================
//  MODES & CONTROLLERS
// ================================================

function toggleMakerMode(enable) {
    MAKER_MODE = enable;
    const btnMeta = document.getElementById('btn-meta-view');
    const btnMaker = document.getElementById('btn-maker-mode');
    const poolSec = document.getElementById('pool-section');

    if (enable) {
        btnMaker.classList.add('active');
        btnMeta.classList.remove('active');
        poolSec.classList.remove('hidden');
        showToast("Đã bật Chế độ Tự tạo Tier List", "info");
    } else {
        btnMeta.classList.add('active');
        btnMaker.classList.remove('active');
        poolSec.classList.add('hidden');
        showToast("Đã quay lại Bảng Meta hệ thống", "info");
    }
    render();
}

function initMakerControls() {
    document.getElementById('btn-meta-view')?.addEventListener('click', () => toggleMakerMode(false));
    document.getElementById('btn-maker-mode')?.addEventListener('click', () => toggleMakerMode(true));
    
    document.getElementById('btn-save')?.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            showToast("Bạn cần đăng nhập để lưu bảng xếp hạng!", "error");
            return;
        }
        saveUserTiers(user.username);
    });

    document.getElementById('btn-reset')?.addEventListener('click', () => {
        if (confirm("Bạn có chắc muốn xóa bảng xếp hạng cá nhân và quay về mặc định?")) {
            resetToDefault();
        }
    });

    document.getElementById('btn-download')?.addEventListener('click', downloadTierList);
}

async function resetToDefault() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        try {
            await fetch(`${API_BASE}/user-tiers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, tiers: [] })
            });
        } catch (e) {}
    }
    USER_CUSTOM_ORDER = null;
    showToast("Đã reset về bảng mặc định", "success");
    render();
}

async function downloadTierList() {
    const board = document.getElementById('tier-board');
    if (!board) return;
    
    showToast("Đang chuẩn bị ảnh...", "info");
    
    try {
        const canvas = await html2canvas(board, {
            backgroundColor: "#0a0c13",
            scale: 2,
            logging: false,
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `tier-list-lien-quan-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        showToast("Tải ảnh thành công!", "success");
    } catch (err) {
        console.error(err);
        showToast("Lỗi khi tạo ảnh", "error");
    }
}

// ================================================
//  DRAG & DROP
// ================================================

function initDragAndDrop() {
    const containers = document.querySelectorAll('.drag-container');
    
    containers.forEach(el => {
        new Sortable(el, {
            group: 'shared',
            animation: 150,
            ghostClass: 'ghost-card',
            onEnd: function () {
                updateCounts();
            }
        });
    });
}

async function saveUserTiers(username) {
    const tiersData = [];
    document.querySelectorAll('.drag-container').forEach(container => {
        const tierId = container.dataset.tier;
        const cards = container.querySelectorAll('.hero-card');
        cards.forEach((card, index) => {
            tiersData.push({
                hero_id: card.dataset.id,
                tier: tierId,
                sort_order: index
            });
        });
    });

    try {
        const res = await fetch(`${API_BASE}/user-tiers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, tiers: tiersData })
        });
        const json = await res.json();
        if (json.message === "success") {
            showToast("Đã lưu bảng xếp hạng cá nhân!", "success");
            USER_CUSTOM_ORDER = tiersData;
        }
    } catch (err) {
        console.error("Lỗi khi lưu sắp xếp:", err);
        showToast("Lỗi khi kết nối máy chủ", "error");
    }
}

async function loadUserTiers(username) {
    try {
        const response = await fetch(`${API_BASE}/user-tiers/${username}`);
        const json = await response.json();
        if (json.message === "success") {
            USER_CUSTOM_ORDER = json.data;
        }
    } catch (err) {
        console.error("Lỗi khi tải sắp xếp:", err);
    }
}

// ================================================
//  UTILITIES
// ================================================

function showToast(message, type = "info") {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

let slideIntervalId = null;
let activeSlideCard = null;

function initHoverSkins() {
  const board = document.getElementById("tier-board");
  if (!board) return;

  const handleMouseOver = (e) => {
      const card = e.target.closest('.tier-hero-card');
      if (!card || activeSlideCard === card) return;
      
      const skinsData = card.getAttribute('data-skins');
      if (!skinsData) return;
      
      activeSlideCard = card;
      const skinUrls = skinsData.split(',');
      const avatarDiv = card.querySelector('.hero-avatar');
      
      if (slideIntervalId) clearInterval(slideIntervalId);

      let fdr1 = card.querySelector('.dyn-fdr-1');
      let fdr2 = card.querySelector('.dyn-fdr-2');

      if (!fdr1) {
          fdr1 = document.createElement('img');
          fdr2 = document.createElement('img');
          fdr1.className = 'dyn-fdr-1'; fdr2.className = 'dyn-fdr-2';
          
          [fdr1, fdr2].forEach(fd => {
              fd.style.position = 'absolute'; fd.style.inset = '0';
              fd.style.width = '100%'; fd.style.height = '100%';
              fd.style.objectFit = 'cover'; fd.style.borderRadius = '50%';
              fd.style.aspectRatio = '1 / 1';
              fd.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              fd.style.zIndex = '5'; fd.style.opacity = '0';
              fd.style.pointerEvents = 'none';
              avatarDiv.appendChild(fd);
          });
      }

      let currentIdx = Math.floor(Math.random() * skinUrls.length);
      card.faderCtx = { fdr1, fdr2, useFader1: true, currentIdx };

      setTimeout(() => {
          fdr1.src = skinUrls[currentIdx];
          fdr1.style.opacity = '1';
          fdr1.style.transform = 'scale(1.05)';
      }, 10);

      if (skinUrls.length > 1) {
          slideIntervalId = setInterval(() => {
              let nextIdx;
              do {
                  nextIdx = Math.floor(Math.random() * skinUrls.length);
              } while (nextIdx === card.faderCtx.currentIdx);
              
              card.faderCtx.currentIdx = nextIdx;
              const nextUrl = skinUrls[nextIdx];
              
              if (card.faderCtx.useFader1) {
                  fdr2.src = nextUrl;
                  fdr2.style.opacity = '1'; fdr2.style.transform = 'scale(1.05)';
                  fdr1.style.opacity = '0'; fdr1.style.transform = 'scale(1)';
              } else {
                  fdr1.src = nextUrl;
                  fdr1.style.opacity = '1'; fdr1.style.transform = 'scale(1.05)';
                  fdr2.style.opacity = '0'; fdr2.style.transform = 'scale(1)';
              }
              card.faderCtx.useFader1 = !card.faderCtx.useFader1;
          }, 800);
      }
  };

  const handleMouseOut = (e) => {
      const card = e.target.closest('.tier-hero-card');
      if (!card || card.contains(e.relatedTarget)) return;

      if (activeSlideCard === card) {
           clearInterval(slideIntervalId);
           slideIntervalId = null;
           activeSlideCard = null;
      }
      
      const ctx = card.faderCtx;
      if (ctx) {
          ctx.fdr1.style.opacity = '0'; ctx.fdr1.style.transform = 'scale(1)';
          ctx.fdr2.style.opacity = '0'; ctx.fdr2.style.transform = 'scale(1)';
          setTimeout(() => {
              if (activeSlideCard !== card) { 
                  if(ctx.fdr1.parentNode) ctx.fdr1.parentNode.removeChild(ctx.fdr1);
                  if(ctx.fdr2.parentNode) ctx.fdr2.parentNode.removeChild(ctx.fdr2);
                  card.faderCtx = null;
              }
          }, 350);
      }
  };

  board.addEventListener('mouseover', handleMouseOver);
  board.addEventListener('mouseout', handleMouseOut);
  const pool = document.getElementById("tier-pool");
  if(pool) {
      pool.addEventListener('mouseover', handleMouseOver);
      pool.addEventListener('mouseout', handleMouseOut);
  }
}

function updateCounts() {
  const tEl = document.getElementById("total-count");
  const vEl = document.getElementById("visible-count");
  const all  = document.querySelectorAll("#tier-board .hero-card");
  const show = document.querySelectorAll("#tier-board .hero-card:not(.hidden)");
  if (tEl) tEl.textContent = all.length;
  if (vEl) vEl.textContent = show.length;
}

function applyFilters() {
  const searchInput = document.getElementById("hero-search");
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const activeRoleBtn = document.querySelector(".filter-btn.active");
  const activeRole = activeRoleBtn ? activeRoleBtn.dataset.role : "all";

  document.querySelectorAll(".hero-card").forEach(card => {
    const roles = card.dataset.roles.split(" ");
    const name = card.querySelector(".hero-name").textContent.toLowerCase();
    const matchRole = (activeRole === "all" || roles.includes(activeRole));
    const matchName = name.includes(searchVal);
    card.classList.toggle("hidden", !(matchRole && matchName));
  });
  updateCounts();
}

function initFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  const searchInput = document.getElementById("hero-search");
  if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
  }
}

async function fetchHeroes() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            await loadUserTiers(user.username);
        }

        const response = await fetch(`${API_BASE}/heroes`);

        const json = await response.json();
        
        HEROES = json.data.map(hero => {
            const roles = hero.secondary_role ? [hero.primary_role, hero.secondary_role] : [hero.primary_role];
            let skinUrls = [];
            if (hero.skins && hero.skins.trim() !== "") {
                const skinList = hero.skins.split(',');
                skinList.forEach(item => {
                    let url = item.includes('|') ? item.split('|')[1] : item;
                    url = url.trim();
                    if (url.startsWith('http') || url.startsWith('/')) skinUrls.push(url);
                });
            }
            const stats = { winRate: hero.win_rate, pickRate: hero.pick_rate, banRate: hero.ban_rate };
            return [hero.name, roles, hero.tier, hero.id, hero.image_url, skinUrls, stats];
        });

        render();
        initFilters();
        initMakerControls();
        
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("tier-board");
    if (board) board.innerHTML = `<div class="tier-loading">Đang tải dữ liệu tướng...</div>`;
    fetchHeroes().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'maker') {
            toggleMakerMode(true);
        }
    });
});
