const patches = [
    {
        date: "29 Tháng 4, 2026",
        title: "ĐIỀU CHỈNH GIỮA MÙA PB LỄ HỘI 5v5 – 30.04.2026",
        changes: [
            { type: "adjust", text: "Hợp tác Attack on Titan: Chế độ Đấu Trường Sinh Tồn - Titan Xuất Kích." },
            { type: "adjust", text: "Cơ chế mùa mới: Triệu Hồi Titan tiến công khi trụ trong bị phá." },
            { type: "buff", text: "Annette: Tăng 20% tỷ lệ miễn thương." },
            { type: "buff", text: "Chaugnar, Nakroth, Lumburr, Celica, Baldum, Wisp, Dyadia, Goverra: Tăng 10% tỷ lệ miễn thương." },
            { type: "buff", text: "Kahlii, Aleister: Tăng 10% tỷ lệ sát thương gây ra." },
            { type: "nerf", text: "Butterfly, Murad: Giảm 10% tỷ lệ miễn thương và 10% sát thương gây ra." },
            { type: "nerf", text: "Hayate: Giảm 10% tỷ lệ sát thương gây ra." }
        ]
    },
    {
        date: "23 Tháng 4, 2026",
        title: "Điều Chỉnh Sức Mạnh Các Tướng Hỗ Trợ & Pháo Thủ",
        changes: [
            { type: "buff", text: "Rouie: Giảm thời gian hồi chiêu cuối từ 60s xuống 50s." },
            { type: "nerf", text: "Alice: Lớp lá chắn kỹ năng 2 giảm tương tác với sức mạnh phép thuật cốt lõi." },
            { type: "adjust", text: "Cresht: Tối ưu hóa mượt mà hoạt ảnh biến hình." }
        ]
    },
    {
        date: "15 Tháng 4, 2026",
        title: "Cân bằng Trang bị Đi Rừng",
        changes: [
            { type: "buff", text: "Kiếm truy hồn: Sát thương quái rừng tăng 15%." },
            { type: "nerf", text: "Rìu Leviathan: Giảm giáp cơ bản cung cấp từ 250 -> 200." }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('patch-container');
    if (container) {
        container.innerHTML = patches.map(p => `
            <div class="patch-card">
                <span class="patch-date">📅 ${p.date}</span>
                <h2 class="patch-title">${p.title}</h2>
                <ul class="change-list">
                    ${p.changes.map(c => `<li><span class="patch-change ${c.type}">[${c.type.toUpperCase()}]</span> ${c.text}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
});
