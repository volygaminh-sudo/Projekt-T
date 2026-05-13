/**
 * Shared Auth Logic for Projekt-T
 */
function checkAuth() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch (e) {
        return null;
    }
}

function isAdmin() {
    const user = checkAuth();
    return user && user.username === 'admin';
}

function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Auto-run for pages that need protection
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    
    // Header Logic
    const navLogin = document.getElementById('nav-login');
    const navUser = document.getElementById('nav-user');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        if (navLogin) navLogin.classList.add('nav-hidden');
        if (navUser) {
            navUser.classList.remove('nav-hidden');
            if (usernameDisplay) usernameDisplay.textContent = user.display_name || user.username;
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    }

    // Protection Logic
    const path = window.location.pathname;
    if (path.includes('admin.html') && !isAdmin()) {
        alert('Vui lòng đăng nhập quyền Admin để truy cập trang này!');
        window.location.href = 'login.html';
    }
});
