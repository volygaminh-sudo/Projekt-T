// Danh sách nhạc (Playlist)
const PLAYLIST = [
    "../img/nhac.mp3",
    "../img/nhac2.mp3" // Bài nhạc từ YouTube (người dùng tự thêm file)
];

// Quản lý âm thanh nền
const audio = new Audio();
audio.volume = 0.4;
let currentTrackIndex = -1;

// Trạng thái nhạc
let isPlaying = false;

// Kiểm tra trạng thái đã lưu từ localStorage (Bật/Tắt vĩnh viễn)
const musicEnabled = localStorage.getItem("bgMusicEnabled") !== "false";

function getRandomIndex() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * PLAYLIST.length);
    } while (nextIndex === currentTrackIndex && PLAYLIST.length > 1);
    return nextIndex;
}

function loadRandomTrack() {
    currentTrackIndex = getRandomIndex();
    audio.src = PLAYLIST[currentTrackIndex];
    console.log("Đang phát bản nhạc ngẫu nhiên:", PLAYLIST[currentTrackIndex]);
}

// Khi nhạc kết thúc -> Tự động chuyển bài ngẫu nhiên
audio.addEventListener("ended", () => {
    playNextRandom();
});

function playNextRandom() {
    loadRandomTrack();
    audio.play().then(() => {
        updateUI(true);
    }).catch(err => console.log("Không thể chuyển bài:", err));
}

function initMusic() {
    const musicBtn = document.getElementById("music-toggle");
    const introOverlay = document.getElementById("intro-overlay");
    const enterBtn = document.getElementById("btn-enter");

    // Khởi tạo track đầu tiên (chưa phát)
    loadRandomTrack();

    // Kiểm tra xem đã qua màn hình chào chưa (Dùng localStorage để nhớ kể cả khi F5)
    const hasVisited = localStorage.getItem("hasVisitedIntro");

    if (introOverlay) {
        if (hasVisited) {
            // Nếu đã qua rùi thì ẩn luôn
            introOverlay.classList.add("hide");
            if (musicEnabled) tryAutoplay();
        } else {
            // Nếu chưa thì đợi click nút Enter
            if (enterBtn) {
                enterBtn.addEventListener("click", () => {
                    introOverlay.classList.add("hide");
                    localStorage.setItem("hasVisitedIntro", "true");
                    if (musicEnabled) startPlayback();
                });
            }
        }
    } else {
        // Nếu không có overlay (ở các trang con)
        if (musicEnabled) tryAutoplay();
    }

    // Thiết lập nút toggle manual
    if (musicBtn) {
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }
}

function tryAutoplay() {
    audio.play().then(() => {
        updateUI(true);
    }).catch(() => {
        // Nếu bị chặn, đợi tương tác đầu tiên
        const handleFirstInteraction = () => {
            startPlayback();
            document.removeEventListener("click", handleFirstInteraction);
        };
        document.addEventListener("click", handleFirstInteraction);
    });
}

function startPlayback() {
    audio.play().then(() => {
        updateUI(true);
    }).catch(err => console.log("Playback failed:", err));
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        updateUI(false);
        localStorage.setItem("bgMusicEnabled", "false");
    } else {
        // Nếu audio.src chưa được load (ít khả năng nhưng an toàn)
        if (!audio.src) loadRandomTrack();
        
        audio.play().then(() => {
            updateUI(true);
            localStorage.setItem("bgMusicEnabled", "true");
        });
    }
}

function updateUI(playing) {
    isPlaying = playing;
    const musicBtn = document.getElementById("music-toggle");
    if (musicBtn) {
        if (playing) {
            musicBtn.classList.add("playing");
        } else {
            musicBtn.classList.remove("playing");
        }
    }
}

// Khởi tạo
window.addEventListener("DOMContentLoaded", initMusic);