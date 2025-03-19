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

// Notları Firestore'dan çek ve görüntüle
function fetchNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '<div class="loading">Notlar yükleniyor...</div>';

    db.collection('notes').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            notesList.innerHTML = ''; // Yükleniyor mesajını temizle
            querySnapshot.forEach((doc) => {
                const note = doc.data();
                const noteItem = document.createElement('div');
                noteItem.classList.add('item-card');
                noteItem.innerHTML = `
                    <div class="item-title">${note.title}</div>
                    <div class="item-content">${note.content}</div>
                    <div class="item-meta">${new Date(note.timestamp.toDate()).toLocaleString()}</div>
                `;
                notesList.appendChild(noteItem);
            });
        })
        .catch((error) => {
            console.error("Notlar alınamadı:", error);
            notesList.innerHTML = '<div class="error-message">Notlar yüklenemedi. Lütfen tekrar deneyin.</div>';
        });
}

// Sayfa yüklendiğinde notları çek
document.addEventListener('DOMContentLoaded', fetchNotes); 