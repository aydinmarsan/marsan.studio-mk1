// Firebase konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyB-T7aB6-twopuefLz0sLg0Ti2HYy2hpiI",
    authDomain: "marsanstudio-7dc9b.firebaseapp.com",
    projectId: "marsanstudio-7dc9b",
    storageBucket: "marsanstudio-7dc9b.firebasestorage.app",
    messagingSenderId: "298325681308",
    appId: "1:298325681308:web:185dcba36010d59aae7959"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sabit kullanıcı bilgileri (yedek amaçlı)
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
    
    // Önce sabit kullanıcıyı kontrol et (yedek amaçlı)
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        loginSuccess();
        return;
    }
    
    // Kullanıcı adına göre Firestore'da kullanıcıyı ara
    db.collection('users').where('username', '==', username).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // Kullanıcı adı bulunamadı
                loginFailed("Kullanıcı adı bulunamadı.");
                return;
            }
            
            // Kullanıcı adı bulundu, e-posta adresini al
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const email = userData.email;
            
            // E-posta ve şifre ile giriş yap
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Başarılı giriş
                    loginSuccess();
                })
                .catch((error) => {
                    // Giriş hatası
                    console.error("Giriş hatası:", error);
                    loginFailed("Geçersiz şifre.");
                });
        })
        .catch((error) => {
            console.error("Sorgu hatası:", error);
            loginFailed("Giriş sırasında bir hata oluştu.");
        });
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

function loginFailed(message) {
    loginError.textContent = message || "Geçersiz kullanıcı adı veya şifre!";
    loginBtn.classList.add('shake-animation');
    setTimeout(() => loginBtn.classList.remove('shake-animation'), 500);
    
    // Hata sesi
    const errorSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
    errorSound.play();
}

// Giriş butonuna tıklama
loginBtn.addEventListener('click', attemptLogin);

// Enter tuşu ile giriş
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        attemptLogin();
    }
}); 