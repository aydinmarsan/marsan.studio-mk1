// Firebase konfigürasyonu ve başlatma
const firebaseConfig = {
    apiKey: "AIzaSyB-T7aB6-twopuefLz0sLg0Ti2HYy2hpiI",
    authDomain: "marsanstudio-7dc9b.firebaseapp.com",
    projectId: "marsanstudio-7dc9b",
    storageBucket: "marsanstudio-7dc9b.firebasestorage.app",
    messagingSenderId: "298325681308",
    appId: "1:298325681308:web:185dcba36010d59aae7959"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elemanları
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const addNoteBtn = document.getElementById('add-note-btn');
const addLinkBtn = document.getElementById('add-link-btn');
const addUserBtn = document.getElementById('add-user-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const saveLinkBtn = document.getElementById('save-link-btn');
const saveUserBtn = document.getElementById('save-user-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Sekme değiştirme işlevi
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === item.dataset.section + '-section') {
                section.classList.add('active');
            }
        });
    });
});

// Not ekleme işlevi
addNoteBtn.addEventListener('click', () => {
    document.querySelector('.note-form').classList.toggle('hidden');
});

saveNoteBtn.addEventListener('click', () => {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    
    db.collection('notes').add({
        title,
        content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('Not kaydedildi!');
        document.querySelector('.note-form').classList.add('hidden');
    }).catch(error => {
        console.error('Not kaydedilemedi:', error);
    });
});

// Link ekleme işlevi
addLinkBtn.addEventListener('click', () => {
    document.querySelector('.link-form').classList.toggle('hidden');
});

saveLinkBtn.addEventListener('click', () => {
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    const description = document.getElementById('link-description').value;
    
    db.collection('links').add({
        title,
        url,
        description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('Link kaydedildi!');
        document.querySelector('.link-form').classList.add('hidden');
    }).catch(error => {
        console.error('Link kaydedilemedi:', error);
    });
});

// Kullanıcı ekleme işlevi
addUserBtn.addEventListener('click', () => {
    document.querySelector('.user-form').classList.toggle('hidden');
});

saveUserBtn.addEventListener('click', () => {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            return db.collection('users').doc(userCredential.user.uid).set({
                email,
                role
            });
        })
        .then(() => {
            alert('Kullanıcı kaydedildi!');
            document.querySelector('.user-form').classList.add('hidden');
        })
        .catch(error => {
            console.error('Kullanıcı kaydedilemedi:', error);
        });
});

// Ayarları kaydetme işlevi
saveSettingsBtn.addEventListener('click', () => {
    const theme = document.getElementById('setting-theme').value;
    const sound = document.getElementById('setting-sound').checked;
    const animation = document.getElementById('setting-animation').checked;
    
    // Ayarları kaydetme işlemi (örneğin localStorage kullanarak)
    localStorage.setItem('theme', theme);
    localStorage.setItem('sound', sound);
    localStorage.setItem('animation', animation);
    
    alert('Ayarlar kaydedildi!');
}); 