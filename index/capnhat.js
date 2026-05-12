const patches = [
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
