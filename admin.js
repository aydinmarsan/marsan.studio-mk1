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

// DOM elemanları
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const addNoteBtn = document.getElementById('add-note-btn');
const addLinkBtn = document.getElementById('add-link-btn');
const addUserBtn = document.getElementById('add-user-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const saveLinkBtn = document.getElementById('save-link-btn');
const saveUserBtn = document.getElementById('save-user-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const cancelNoteBtn = document.getElementById('cancel-note-btn');
const cancelLinkBtn = document.getElementById('cancel-link-btn');
const cancelUserBtn = document.getElementById('cancel-user-btn');
const notesList = document.getElementById('notes-list');
const linksList = document.getElementById('links-list');
const usersList = document.getElementById('users-list');

// Kullanıcı adını görüntüle
userDisplay.textContent = "ADMİN: MARSAN";

// Çıkış butonuna tıklama
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Çıkış yapılamadı:', error);
    });
});

// Sekme değiştirme
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Aktif sekmeyi değiştir
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // İlgili içeriği göster
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === item.dataset.section + '-section') {
                section.classList.add('active');
            }
        });

        // Sekme değiştiğinde içerikleri yükle
        if (item.dataset.section === 'notes') {
            fetchNotes();
        } else if (item.dataset.section === 'links') {
            fetchLinks();
        } else if (item.dataset.section === 'users') {
            fetchUsers();
        }
    });
});

// Global değişkenler - admin.js dosyanızın başında tanımlayın
let currentEditingId = null;
let isEditing = false;

// Not ekleme formunu göster/gizle
addNoteBtn.addEventListener('click', () => {
    resetNoteForm();
    document.querySelector('.note-form').classList.toggle('hidden');
});

cancelNoteBtn.addEventListener('click', () => {
    document.querySelector('.note-form').classList.add('hidden');
    resetNoteForm();
});

// Not kaydet
saveNoteBtn.addEventListener('click', () => {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    
    if (!title || !content) {
        alert('Lütfen başlık ve içerik alanlarını doldurun.');
        return;
    }
    
    if (isEditing && currentEditingId) {
        db.collection('notes').doc(currentEditingId).update({
            title,
            content,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Not güncellendi!');
            // Güncelleme işlemi başarılı olduğunda sayfayı yenile
            window.location.reload();
        }).catch(error => {
            console.error('Not güncellenemedi:', error);
            alert('Not güncellenemedi: ' + error.message);
        });
    } else {
        db.collection('notes').add({
            title,
            content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Not kaydedildi!');
            // Kaydetme işlemi başarılı olduğunda sayfayı yenile
            window.location.reload();
        }).catch(error => {
            console.error('Not kaydedilemedi:', error);
            alert('Not kaydedilemedi: ' + error.message);
        });
    }
});

// Link ekleme formunu göster/gizle
addLinkBtn.addEventListener('click', () => {
    resetLinkForm();
    document.querySelector('.link-form').classList.toggle('hidden');
});

cancelLinkBtn.addEventListener('click', () => {
    document.querySelector('.link-form').classList.add('hidden');
    resetLinkForm();
});

// Link kaydet
saveLinkBtn.addEventListener('click', () => {
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    const description = document.getElementById('link-description').value;
    
    if (!title || !url) {
        alert('Lütfen başlık ve URL alanlarını doldurun.');
        return;
    }
    
    if (isEditing && currentEditingId) {
        db.collection('links').doc(currentEditingId).update({
            title,
            url,
            description,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Link güncellendi!');
            // Güncelleme işlemi başarılı olduğunda sayfayı yenile
            window.location.reload();
        }).catch(error => {
            console.error('Link güncellenemedi:', error);
            alert('Link güncellenemedi: ' + error.message);
        });
    } else {
        db.collection('links').add({
            title,
            url,
            description,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Link kaydedildi!');
            // Kaydetme işlemi başarılı olduğunda sayfayı yenile
            window.location.reload();
        }).catch(error => {
            console.error('Link kaydedilemedi:', error);
            alert('Link kaydedilemedi: ' + error.message);
        });
    }
});

// Kullanıcı ekleme formunu göster/gizle
addUserBtn.addEventListener('click', () => {
    document.querySelector('.user-form').classList.toggle('hidden');
});

cancelUserBtn.addEventListener('click', () => {
    document.querySelector('.user-form').classList.add('hidden');
});

// Kullanıcı kaydet
saveUserBtn.addEventListener('click', () => {
    console.log('Kullanıcı kaydetme butonu tıklandı'); // Debug log
    
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const username = document.getElementById('user-username').value;
    
    if (!email || !password) {
        alert('Lütfen e-posta ve şifre alanlarını doldurun.');
        return;
    }
    
    if (!username) {
        alert('Lütfen kullanıcı adı alanını doldurun.');
        return;
    }
    
    // Loading durumunu göster
    saveUserBtn.textContent = 'KAYDEDILIYOR...';
    saveUserBtn.disabled = true;
    
    // Önce kullanıcı adının benzersiz olup olmadığını kontrol et
    db.collection('users').where('username', '==', username).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
            }
            
            // Authentication ile kullanıcı oluştur
            return auth.createUserWithEmailAndPassword(email, password);
        })
        .then(userCredential => {
            console.log('Kullanıcı Authentication ile oluşturuldu:', userCredential.user.uid);
            
            // Firestore'a kullanıcı bilgilerini kaydet
            return db.collection('users').doc(userCredential.user.uid).set({
                email,
                username,
                role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            console.log('Kullanıcı Firestore\'a kaydedildi');
            alert('Kullanıcı başarıyla kaydedildi!');
            
            // Formu temizle ve gizle
            document.querySelector('.user-form').classList.add('hidden');
            document.getElementById('user-email').value = '';
            document.getElementById('user-password').value = '';
            document.getElementById('user-username').value = '';
            document.getElementById('user-role').value = 'user';
            
            // Butonu normale döndür
            saveUserBtn.textContent = 'KAYDET';
            saveUserBtn.disabled = false;
            
            // Kullanıcı listesini güncelle
            fetchUsers();
        })
        .catch(error => {
            console.error('Kullanıcı kaydedilemedi:', error);
            
            let errorMessage = 'Kullanıcı kaydedilemedi: ';
            
            // Anlaşılır hata mesajları
            if (error.code === 'auth/email-already-in-use') {
                errorMessage += 'Bu e-posta adresi zaten kullanılıyor.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage += 'Geçersiz e-posta adresi.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage += 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage += 'E-posta/şifre girişi bu proje için etkinleştirilmemiş.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage += 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage += 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
            } else {
                errorMessage += error.message;
            }
            
            alert(errorMessage);
            
            // Butonu normale döndür
            saveUserBtn.textContent = 'KAYDET';
            saveUserBtn.disabled = false;
        });
});

// Ayarları kaydet
saveSettingsBtn.addEventListener('click', () => {
    const theme = document.getElementById('setting-theme').value;
    const sound = document.getElementById('setting-sound').checked;
    const animation = document.getElementById('setting-animation').checked;
    
    // Ayarları localStorage'a kaydet
    localStorage.setItem('theme', theme);
    localStorage.setItem('sound', sound);
    localStorage.setItem('animation', animation);
    
    // Temayı doğrudan uygula
    applyTheme(theme);
    
    // Animasyon durumunu uygula
    toggleAnimations(animation);
    
    // Ses efekti
    if (sound) {
        playSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
    }
    
    alert('Ayarlar kaydedildi!');
});

// Tema uygulama fonksiyonu
function applyTheme(theme) {
    // Temayı HTML element'ine uygula
    document.documentElement.setAttribute('data-theme', theme);
    
    console.log('Tema değiştirildi:', theme);
    
    // Eski tema sınıflarını kaldır
    document.body.classList.remove('theme-green', 'theme-amber', 'theme-blue');
    
    // Yeni tema sınıfını ekle
    document.body.classList.add('theme-' + theme);
    
    // Görsel geri bildirim
    const pipBoyScreen = document.querySelector('.pip-boy-screen');
    pipBoyScreen.style.transition = 'background-color 0.5s, box-shadow 0.5s';
    
    // Kısa bir parıldama efekti
    pipBoyScreen.style.filter = 'brightness(1.5)';
    setTimeout(() => {
        pipBoyScreen.style.filter = 'brightness(1)';
    }, 300);
}

// Animasyonları aç/kapat
function toggleAnimations(enabled) {
    const pipBoyScreen = document.querySelector('.pip-boy-screen');
    
    if (enabled) {
        pipBoyScreen.classList.add('animation-enabled');
        pipBoyScreen.classList.remove('animation-disabled');
    } else {
        pipBoyScreen.classList.add('animation-disabled');
        pipBoyScreen.classList.remove('animation-enabled');
    }
}

// Ses çalma fonksiyonu
function playSound(url) {
    if (localStorage.getItem('sound') !== 'false') {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play();
    }
}

// Notları Firestore'dan çek ve görüntüle
function fetchNotes() {
    notesList.innerHTML = '<div class="loading">Notlar yükleniyor...</div>';
    
    db.collection('notes').orderBy('timestamp', 'desc').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                notesList.innerHTML = '<div class="empty-message">Henüz not eklenmemiş.</div>';
                return;
            }
            
            notesList.innerHTML = '';
            querySnapshot.forEach(doc => {
                const note = doc.data();
                const timestamp = note.timestamp ? note.timestamp.toDate() : new Date();
                
                const noteItem = document.createElement('div');
                noteItem.classList.add('item-card');
                noteItem.innerHTML = `
                    <div class="item-title">${note.title}</div>
                    <div class="item-content">${note.content}</div>
                    <div class="item-meta">${timestamp.toLocaleString()}</div>
                    <div class="item-actions">
                        <button class="action-btn edit-btn" data-id="${doc.id}">Düzenle</button>
                        <button class="action-btn delete-btn" data-id="${doc.id}">Sil</button>
                    </div>
                `;
                notesList.appendChild(noteItem);
                
                // Düzenle butonuna tıklama
                const editBtn = noteItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    // Not verilerini form alanlarına yükle
                    document.getElementById('note-title').value = note.title;
                    document.getElementById('note-content').value = note.content;
                    
                    // Düzenleme modunu etkinleştir
                    currentEditingId = doc.id;
                    isEditing = true;
                    
                    // Form başlığını güncelle
                    const formTitle = document.createElement('div');
                    formTitle.classList.add('form-title');
                    formTitle.textContent = 'NOTU DÜZENLE';
                    
                    // Mevcut formu göster
                    const noteForm = document.querySelector('.note-form');
                    noteForm.classList.remove('hidden');
                    
                    // Kaydet butonunun metnini güncelle
                    saveNoteBtn.textContent = 'GÜNCELLE';
                    
                    // Formun başına kaydırma
                    noteForm.scrollIntoView({ behavior: 'smooth' });
                });
                
                // Silme butonuna tıklama
                const deleteBtn = noteItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteNote(doc.id);
                });
            });
        })
        .catch(error => {
            console.error('Notlar alınamadı:', error);
            notesList.innerHTML = `<div class="error-message">Notlar yüklenemedi: ${error.message}</div>`;
        });
}

// Linkleri Firestore'dan çek ve görüntüle
function fetchLinks() {
    linksList.innerHTML = '<div class="loading">Linkler yükleniyor...</div>';
    
    db.collection('links').orderBy('timestamp', 'desc').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                linksList.innerHTML = '<div class="empty-message">Henüz link eklenmemiş.</div>';
                return;
            }
            
            linksList.innerHTML = '';
            querySnapshot.forEach(doc => {
                const link = doc.data();
                const timestamp = link.timestamp ? link.timestamp.toDate() : new Date();
                
                const linkItem = document.createElement('div');
                linkItem.classList.add('item-card');
                linkItem.innerHTML = `
                    <div class="item-title">${link.title}</div>
                    <div class="item-content"><a href="${link.url}" target="_blank">${link.url}</a></div>
                    <div class="item-description">${link.description || ''}</div>
                    <div class="item-meta">${timestamp.toLocaleString()}</div>
                    <div class="item-actions">
                        <button class="action-btn edit-btn" data-id="${doc.id}">Düzenle</button>
                        <button class="action-btn delete-btn" data-id="${doc.id}">Sil</button>
                    </div>
                `;
                linksList.appendChild(linkItem);
                
                // Düzenle butonuna tıklama
                const editBtn = linkItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    // Link verilerini form alanlarına yükle
                    document.getElementById('link-title').value = link.title;
                    document.getElementById('link-url').value = link.url;
                    document.getElementById('link-description').value = link.description || '';
                    
                    // Düzenleme modunu etkinleştir
                    currentEditingId = doc.id;
                    isEditing = true;
                    
                    // Mevcut formu göster
                    const linkForm = document.querySelector('.link-form');
                    linkForm.classList.remove('hidden');
                    
                    // Kaydet butonunun metnini güncelle
                    saveLinkBtn.textContent = 'GÜNCELLE';
                    
                    // Formun başına kaydırma
                    linkForm.scrollIntoView({ behavior: 'smooth' });
                });
                
                // Silme butonuna tıklama
                const deleteBtn = linkItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteLink(doc.id);
                });
            });
        })
        .catch(error => {
            console.error('Linkler alınamadı:', error);
            linksList.innerHTML = `<div class="error-message">Linkler yüklenemedi: ${error.message}</div>`;
        });
}

// Kullanıcıları Firestore'dan çek ve görüntüle
function fetchUsers() {
    usersList.innerHTML = '<div class="loading">Kullanıcılar yükleniyor...</div>';
    
    db.collection('users').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                usersList.innerHTML = '<div class="empty-message">Henüz kullanıcı eklenmemiş.</div>';
                return;
            }
            
            usersList.innerHTML = '';
            querySnapshot.forEach(doc => {
                const user = doc.data();
                
                const userItem = document.createElement('div');
                userItem.classList.add('item-card');
                userItem.innerHTML = `
                    <div class="item-title">${user.username || 'İsimsiz Kullanıcı'}</div>
                    <div class="item-content">E-posta: ${user.email}</div>
                    <div class="item-content">Rol: ${user.role === 'admin' ? 'Admin' : 'Normal Kullanıcı'}</div>
                    <div class="item-meta">${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleString() : 'Bilinmeyen tarih'}</div>
                    <div class="item-actions">
                        <button class="action-btn edit-btn" data-id="${doc.id}">Düzenle</button>
                        <button class="action-btn delete-btn" data-id="${doc.id}">Sil</button>
                    </div>
                `;
                usersList.appendChild(userItem);
                
                // Düzenle butonuna tıklama
                const editBtn = userItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    // Kullanıcı verilerini form alanlarına yükle
                    document.getElementById('user-email').value = user.email;
                    document.getElementById('user-role').value = user.role;
                    document.getElementById('user-username').value = user.username || '';
                    
                    // Düzenleme modunu etkinleştir
                    currentEditingId = doc.id;
                    isEditing = true;
                    
                    // Mevcut formu göster
                    const userForm = document.querySelector('.user-form');
                    userForm.classList.remove('hidden');
                    
                    // Kaydet butonunun metnini güncelle
                    saveUserBtn.textContent = 'GÜNCELLE';
                    
                    // Formun başına kaydırma
                    userForm.scrollIntoView({ behavior: 'smooth' });
                });
                
                // Silme butonuna tıklama
                const deleteBtn = userItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteUser(doc.id);
                });
            });
        })
        .catch(error => {
            console.error('Kullanıcılar alınamadı:', error);
            usersList.innerHTML = `<div class="error-message">Kullanıcılar yüklenemedi: ${error.message}</div>`;
        });
}

// Test fonksiyonu - butonlara tıklandığında konsola bilgi yazdır
function addClickTest() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Butona tıklandı:', button.textContent || button.innerText);
        });
    });
}

// Sayfa yüklendiğinde ayarları uygula
document.addEventListener('DOMContentLoaded', () => {
    // Mevcut kodlar...
    
    // Tema ayarını yükle ve uygula
    const savedTheme = localStorage.getItem('theme') || 'green';
    document.getElementById('setting-theme').value = savedTheme;
    applyTheme(savedTheme);
    
    // Animasyon ayarını yükle ve uygula
    const animationEnabled = localStorage.getItem('animation') !== 'false';
    document.getElementById('setting-animation').checked = animationEnabled;
    toggleAnimations(animationEnabled);
    
    // Ses ayarını yükle
    const soundEnabled = localStorage.getItem('sound') !== 'false';
    document.getElementById('setting-sound').checked = soundEnabled;
    
    // İlk sekmenin içeriğini yükle
    fetchNotes();

    // Butonlara ses efekti eklemek için fonksiyon
    function addSoundToButtons() {
        document.querySelectorAll('.pip-boy-btn, .small-btn, .action-btn').forEach(button => {
            // Önceden bir event listener eklenmişse tekrar eklemeyi önle
            if (!button.hasAttribute('data-sound-added')) {
                button.setAttribute('data-sound-added', 'true');
                button.addEventListener('click', () => {
                    playSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                });
            }
        });
    }

    // Sayfa yüklendiğinde mevcut butonlara ses ekle
    addSoundToButtons();

    // Notlar ve linkler yüklendiğinde yeni eklenen butonlara ses ekle
    const observer = new MutationObserver(() => {
        addSoundToButtons();
    });

    // Gözlemlenecek elementler
    const targetNodes = [notesList, linksList, usersList];
    const config = { childList: true, subtree: true };

    // Her hedef elementi gözlemle
    targetNodes.forEach(node => {
        if (node) observer.observe(node, config);
    });

    // addClickTest(); // Gerekirse aktifleştirin
});

// Not formunu sıfırlama fonksiyonu
function resetNoteForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    saveNoteBtn.textContent = 'KAYDET';
    isEditing = false;
    currentEditingId = null;
}

// Link formunu sıfırlama fonksiyonu
function resetLinkForm() {
    document.getElementById('link-title').value = '';
    document.getElementById('link-url').value = '';
    document.getElementById('link-description').value = '';
    saveLinkBtn.textContent = 'KAYDET';
    isEditing = false;
    currentEditingId = null;
}

// Tema değişikliğini önizleme
document.getElementById('setting-theme').addEventListener('change', function() {
    // Geçici olarak temayı uygula (preview için)
    applyTheme(this.value);
    
    // Ufak bir bilgi mesajı göster
    const statusText = document.getElementById('status-text');
    const originalText = statusText.textContent;
    statusText.textContent = "TEMA ÖNİZLEME: Kaydetmek için AYARLARI KAYDET butonuna tıklayın";
    
    setTimeout(() => {
        statusText.textContent = originalText;
    }, 3000);
});

// Özel onay dialogu fonksiyonu
function showPipBoyConfirm(message) {
    return new Promise((resolve) => {
        // Mevcut dialog varsa kaldır
        const existingDialog = document.querySelector('.pip-boy-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Dialog oluştur
        const dialog = document.createElement('div');
        dialog.className = 'pip-boy-dialog';
        dialog.innerHTML = `
            <div class="pip-boy-dialog-content">
                <div class="dialog-message">${message}</div>
                <div class="dialog-buttons">
                    <button class="pip-boy-btn confirm-btn">EVET</button>
                    <button class="pip-boy-btn cancel-btn">HAYIR</button>
                </div>
            </div>
        `;

        // Dialog'u sayfaya ekle
        document.body.appendChild(dialog);

        // Butonlara tıklama olayları ekle
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            dialog.remove();
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            dialog.remove();
            resolve(false);
        });

        // Dialog'u göster
        setTimeout(() => dialog.classList.add('show'), 10);
    });
}

// Not silme fonksiyonunu güncelle
async function deleteNote(noteId) {
    const confirmed = await showPipBoyConfirm('Bu notu silmek istediğinize emin misiniz?');
    
    if (confirmed) {
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            noteElement.style.opacity = '0.5';
        }

        db.collection('notes').doc(noteId).delete()
            .then(() => {
                playSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                // Silme işlemi başarılı olduğunda sayfayı yenile
                window.location.reload();
            })
            .catch(error => {
                console.error('Not silinemedi:', error);
                if (noteElement) {
                    noteElement.style.opacity = '1';
                }
                alert('Not silinemedi: ' + error.message);
            });
    }
}

// Link silme fonksiyonunu güncelle
function deleteLink(linkId) {
    const confirmed = showPipBoyConfirm('Bu linki silmek istediğinize emin misiniz?');
    
    confirmed.then(result => {
        if (result) {
            const linkElement = document.querySelector(`[data-link-id="${linkId}"]`);
            if (linkElement) {
                linkElement.style.opacity = '0.5';
            }

            db.collection('links').doc(linkId).delete()
                .then(() => {
                    playSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                    // Silme işlemi başarılı olduğunda sayfayı yenile
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Link silinemedi:', error);
                    if (linkElement) {
                        linkElement.style.opacity = '1';
                    }
                    alert('Link silinemedi: ' + error.message);
                });
        }
    });
}

// Kullanıcı silme fonksiyonunu güncelle
function deleteUser(userId) {
    const confirmed = showPipBoyConfirm('Bu kullanıcıyı silmek istediğinize emin misiniz?');
    
    confirmed.then(result => {
        if (result) {
            const userElement = document.querySelector(`[data-user-id="${userId}"]`);
            if (userElement) {
                userElement.style.opacity = '0.5';
            }

            db.collection('users').doc(userId).delete()
                .then(() => {
                    playSound('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                    // Silme işlemi başarılı olduğunda sayfayı yenile
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Kullanıcı silinemedi:', error);
                    if (userElement) {
                        userElement.style.opacity = '1';
                    }
                    alert('Kullanıcı silinemedi: ' + error.message);
                });
        }
    });
} 