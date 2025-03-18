// ... mevcut Firebase konfigürasyonu ...

// Sabit kullanıcı bilgileri
const ADMIN_USERNAME = "marsan";
const ADMIN_PASSWORD = "112263";

// DOM elemanları
const loginForm = document.querySelector('.login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Giriş fonksiyonu
function attemptLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Basit kullanıcı kontrolü
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        loginSuccess();
    } else {
        loginError.textContent = "Geçersiz kullanıcı adı veya şifre!";
        loginBtn.classList.add('shake-animation');
        setTimeout(() => loginBtn.classList.remove('shake-animation'), 500);
        
        // Hata sesi
        const errorSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
        errorSound.play();
    }
}

function loginSuccess() {
    loginBtn.textContent = "GİRİŞ BAŞARILI";
    document.querySelector('.pip-boy-screen').classList.add('success-animation');
    
    // Başarılı giriş sesi
    const successSound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
    successSound.play();
    
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1500);
}

// Giriş butonuna tıklama
loginBtn.addEventListener('click', attemptLogin);

// Enter tuşu ile giriş
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        attemptLogin();
    }
}); 