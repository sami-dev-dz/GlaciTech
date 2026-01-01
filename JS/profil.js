// Traductions des messages photo
const photoTranslations = {
    ar: {
        'change_photo': 'تغيير الصورة',
        'add_photo': 'أضف صورة',
        'upload_success': 'تم رفع الصورة بنجاح',
        'delete_success': 'تم حذف الصورة بنجاح',
        'delete_photo': 'حذف الصورة'
    },
    fr: {
        'change_photo': 'Changer la photo',
        'add_photo': 'Ajouter une photo',
        'upload_success': 'Photo téléchargée avec succès',
        'delete_success': 'Photo supprimée avec succès',
        'delete_photo': 'Supprimer la photo'
    }
};

// Fonction pour obtenir la traduction selon la langue actuelle
function getPhotoTranslation(key, lang = 'ar') {
    return photoTranslations[lang]?.[key] || photoTranslations.ar[key];
}

// Fonction pour afficher les notifications traduites
function showPhotoNotification(messageKey) {
    const currentLang = localStorage.getItem('lang') || 'ar';
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = getPhotoTranslation(messageKey, currentLang);
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Fonction pour mettre à jour les textes des boutons photo
function updatePhotoButtons(lang) {
    const buttonText = document.getElementById('button-text');
    const uploadText = document.getElementById('upload-text');
    const deletePhotoBtn = document.querySelector('#delete-photo-btn span');
    const profileImage = document.getElementById('profile-image');
    
    if (buttonText) {
        // Si une image est déjà affichée, utiliser "changer", sinon "ajouter"
        if (profileImage && profileImage.style.display !== 'none') {
            buttonText.textContent = getPhotoTranslation('change_photo', lang);
        } else {
            buttonText.textContent = getPhotoTranslation('add_photo', lang);
        }
    }
    
    if (uploadText) {
        uploadText.textContent = getPhotoTranslation('add_photo', lang);
    }
    
    if (deletePhotoBtn) {
        deletePhotoBtn.textContent = getPhotoTranslation('delete_photo', lang);
    }
}

// Fonction pour gérer l'affichage/masquage des éléments photo
function togglePhotoDisplay(hasPhoto) {
    const profileDefault = document.getElementById('profile-default');
    const profileImage = document.getElementById('profile-image');
    const deletePhotoBtn = document.getElementById('delete-photo-btn');
    const buttonText = document.getElementById('button-text');
    const currentLang = localStorage.getItem('lang') || 'ar';
    
    if (hasPhoto) {
        // Afficher l'image, masquer l'icône par défaut
        if (profileDefault) profileDefault.style.display = 'none';
        if (profileImage) profileImage.style.display = 'block';
        if (deletePhotoBtn) deletePhotoBtn.style.display = 'block';
        if (buttonText) buttonText.textContent = getPhotoTranslation('change_photo', currentLang);
    } else {
        // Masquer l'image, afficher l'icône par défaut
        if (profileDefault) profileDefault.style.display = 'flex';
        if (profileImage) profileImage.style.display = 'none';
        if (deletePhotoBtn) deletePhotoBtn.style.display = 'none';
        if (buttonText) buttonText.textContent = getPhotoTranslation('add_photo', currentLang);
    }
}

// Gestion des événements photo
document.addEventListener('DOMContentLoaded', function() {
    const profileUpload = document.getElementById('profile-upload');
    const changePhotoBtn = document.getElementById('change-photo-btn');
    const deletePhotoBtn = document.getElementById('delete-photo-btn');
    const profileImage = document.getElementById('profile-image');
    
    // Initialiser l'affichage selon l'état actuel
    const hasExistingPhoto = profileImage && profileImage.src && profileImage.src !== '';
    togglePhotoDisplay(hasExistingPhoto);
    
    // Événement de clic sur le bouton "Ajouter/Changer photo"
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            profileUpload.click();
        });
    }
    
    // Événement de changement de fichier
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Vérifier le type de fichier
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImage.src = e.target.result;
                        togglePhotoDisplay(true);
                        showPhotoNotification('upload_success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Veuillez sélectionner un fichier image valide.');
                }
            }
        });
    }
    
    // Événement de suppression de photo
    if (deletePhotoBtn) {
        deletePhotoBtn.addEventListener('click', function() {
            profileImage.src = '';
            profileUpload.value = '';
            togglePhotoDisplay(false);
            showPhotoNotification('delete_success');
        });
    }
    
    // Mettre à jour les traductions initiales
    const currentLang = localStorage.getItem('lang') || 'ar';
    updatePhotoButtons(currentLang);
});

// Modifier la fonction loadLanguage existante pour inclure les traductions photo
const originalLoadLanguage = window.loadLanguage;
window.loadLanguage = async function(lang) {
    // Appeler la fonction originale
    if (originalLoadLanguage) {
        await originalLoadLanguage(lang);
    }
    
    // Mettre à jour les traductions des boutons photo
    updatePhotoButtons(lang);
};

// Si la fonction loadLanguage n'existe pas encore, créer une version complète
if (!window.loadLanguage) {
    window.loadLanguage = async function(lang) {
        try {
            const res = await fetch(`../../lang/${lang}.json`);
            const translations = await res.json();
            
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
            
            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (translations[key]) {
                    el.textContent = translations[key];
                }
            });
            
            document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
                const key = el.getAttribute("data-i18n-placeholder");
                if (translations[key]) {
                    el.placeholder = translations[key];
                }
            });
            
            // Mettre à jour les traductions des boutons photo
            updatePhotoButtons(lang);
            
        } catch (err) {
            console.error("Erreur lors du chargement des traductions:", err);
        }
    };
}