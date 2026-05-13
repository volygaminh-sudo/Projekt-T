// ================================================
//  TIER LIST DATA — Liên Quân Mobile
//  Dữ liệu giờ đây chủ yếu được kéo từ Database Backend
// ================================================

// Fallback gradient per role when image 404s hoặc không có ảnh
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

// Biến chứa dữ liệu toàn cục tải từ Backend
let HEROES = [];

// ================================================
//  RENDER ENGINE
// ================================================

const ROLE_LABELS = {
  tank:     `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/do-don.png" class="role-icon-img" alt="Đỡ đòn"> Đỡ đòn`,
  fighter:  `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/dau-si.png" class="role-icon-img" alt="Đấu sĩ"> Đấu sĩ`,
  assassin: `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/sat-thu.png" class="role-icon-img" alt="Sát thủ"> Sát thủ`,
  marksman: `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/xa-thu.png" class="role-icon-img" alt="Xạ thủ"> Xạ thủ`,
  mage:     `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/phap-su.png" class="role-icon-img" alt="Pháp sư"> Pháp sư`,
  support:  `<img src="https://lienquan.garena.vn/wp-content/uploads/2024/05/tro-thu.png" class="role-icon-img" alt="Trợ thủ"> Trợ thủ`,
};

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
  
  // click chuyển trang nếu không phải đang ở trang chi tiết
  const clickAction = window.isDetailView ? "" : `onclick="window.location.href='hero-detail.html?id=${dbId}'" style="cursor:pointer;" title="Nhấn xem chi tiết tướng"`;

  const skinsAttr = (skinUrls && skinUrls.length > 0) ? `data-skins="${skinUrls.join(',')}" data-default="${imgUrl || ''}"` : '';

  const winRate = stats.winRate;
  const wrColor = parseFloat(winRate) > 51 ? '#2ecc71' : (parseFloat(winRate) < 49 ? '#e74c3c' : '#f1c40f');

  return `
    <div class="hero-card tier-hero-card" data-roles="${roles.join(" ")}" id="hc-${safeId}" ${clickAction} ${skinsAttr}>
      <div class="hero-avatar" style="background:linear-gradient(135deg,${g1},${g2})">
        ${getHeroImg(name, primaryRole, imgUrl)}
        ${winRate ? `<div class="hero-wr" style="color:${wrColor}">${winRate}</div>` : ''}
      </div>
      <span class="hero-name">${name}</span>
    </div>`;
}

function render() {
  const board = document.getElementById("tier-board");
  if (!board) return;
  const tierMap = {};
  TIERS.forEach(t=>{ tierMap[t.id]=[]; });
  HEROES.forEach(h=>{ if(tierMap[h[2]]) tierMap[h[2]].push(h); });
  board.innerHTML = TIERS.map(tier=>`
    <div class="tier-row" data-tier="${tier.id}">
      <div class="tier-label tier-${tier.id}">
        <span class="tier-letter">${tier.label}</span>
        <span class="tier-desc">${tier.desc}</span>
      </div>
      <div class="tier-heroes" id="tier-${tier.id}">
        ${tierMap[tier.id]
            .sort((a, b) => a[0].localeCompare(b[0])) // Sắp xếp A-Z theo tên (index 0)
            .map(buildCard).join("")}
      </div>
    </div>`).join("");
  updateCounts();
  initHoverSkins();
}

let slideIntervalId = null;
let activeSlideCard = null;

function initHoverSkins() {
  if (window.isDetailView) return;

  const board = document.getElementById("tier-board");
  if (!board) return;

  board.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.tier-hero-card');
      if (!card || activeSlideCard === card) return;
      
      const skinsData = card.getAttribute('data-skins');
      if (!skinsData) return;
      
      activeSlideCard = card;
      const skinUrls = skinsData.split(',');
      const avatarDiv = card.querySelector('.hero-avatar');
      
      if (slideIntervalId) clearInterval(slideIntervalId);

      // Cấp phát DOM động (Dynamic Allocation) thay vì load sẵn hàng chục Element cho mọi thẻ
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

      // Chờ nhỏ đảm bảo browser parse DOM để hiệu ứng opacity xảy ra mượt mà
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
  });

  board.addEventListener('mouseout', (e) => {
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

          // Giải phóng bộ nhớ & Garbage Collection dọn DOM hoàn toàn sạch sẽ sau 350ms
          setTimeout(() => {
              if (activeSlideCard !== card) { 
                  if(ctx.fdr1.parentNode) ctx.fdr1.parentNode.removeChild(ctx.fdr1);
                  if(ctx.fdr2.parentNode) ctx.fdr2.parentNode.removeChild(ctx.fdr2);
                  card.faderCtx = null; // Trả thẻ nhớ về RAM
              }
          }, 350);
      }
  });
}

function updateCounts() {
  const tEl = document.getElementById("total-count");
  const vEl = document.getElementById("visible-count");
  const all  = document.querySelectorAll(".hero-card");
  const show = document.querySelectorAll(".hero-card:not(.hidden)");
  if (tEl) tEl.textContent = all.length;
  if (vEl) vEl.textContent = show.length;
}

// Logic tổng hợp Lọc (Role) + Tìm kiếm (Search)
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

// Tích hợp Fetch API gọi từ Node.js Server
async function fetchHeroes() {
    try {
        const response = await fetch('http://localhost:3000/api/heroes');
        if (!response.ok) throw new Error("Mạng hoặc Server lỗi");
        
        const json = await response.json();
        
        // Chuyển Data DB {id, name, primary_role, secondary_role, tier, image_url, skins} thành mảng
        HEROES = json.data.map(hero => {
            const roles = hero.secondary_role ? [hero.primary_role, hero.secondary_role] : [hero.primary_role];
            
            let skinUrls = [];
            if (hero.skins && hero.skins.trim() !== "") {
                const skinList = hero.skins.split(',');
                skinList.forEach(item => {
                    let url = item;
                    if (item.includes('|')) {
                        url = item.split('|')[1];
                    }
                    url = url.trim();
                    if (url.startsWith('http') || url.startsWith('/')) {
                        skinUrls.push(url);
                    }
                });
            }
            const stats = {
                winRate: hero.win_rate,
                pickRate: hero.pick_rate,
                banRate: hero.ban_rate
            };

            return [hero.name, roles, hero.tier, hero.id, hero.image_url, skinUrls, stats];
        });

        // Xóa thông báo Loading và Render
        render();
        initFilters();
        
    } catch (error) {
        console.error("Không thể kết nối đến Backend SQLite:", error);
        document.getElementById("tier-board").innerHTML =
            `<div style="
                color:#ff6b6b;
                text-align:center;
                font-family:'Outfit',sans-serif;
                padding:60px 30px;
                font-size:17px;
                font-weight:600;
                letter-spacing:0.3px;
                background:rgba(255,50,50,0.04);
                border:1px solid rgba(255,100,100,0.12);
                border-radius:16px;
                margin:20px auto;
                max-width:600px;
            ">
                ⚠️ Không thể kết nối tới máy chủ Backend.<br>
                <span style="font-size:13px;color:#5a6475;display:block;margin-top:10px;font-weight:500;">
                    Hãy chắc chắn Node.js đang chạy: <code style="color:#f39c12;background:rgba(243,156,18,0.12);padding:2px 8px;border-radius:5px;">npm run start</code> tại localhost:3000
                </span>
            </div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("tier-board");
    if (board) board.innerHTML = `<div class="tier-loading">Đang tải dữ liệu tướng...</div>`;
    fetchHeroes();
});
