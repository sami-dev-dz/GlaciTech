//dark mode 
document.addEventListener('DOMContentLoaded', function() {
    const setupDarkMode = () => {
        const darkModeToggle = document.querySelector('.switch input'); // CORRIGÉ

        if (!darkModeToggle) return;

        const applyDarkMode = (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
            try {
                localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            } catch (e) {
                console.error("Failed to access localStorage for dark mode:", e);
            }
        };

        const savedMode = localStorage.getItem('darkMode') === 'enabled';
        applyDarkMode(savedMode);
        darkModeToggle.checked = savedMode;

        darkModeToggle.addEventListener('change', () => {
            applyDarkMode(darkModeToggle.checked);
        }, { passive: true });
    };

    setupDarkMode();
});

// Utilitaires pour localStorage avec gestion d'erreurs
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? item : defaultValue;
        } catch (e) {
            console.error(`Erreur localStorage GET ${key}:`, e);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error(`Erreur localStorage SET ${key}:`, e);
            return false;
        }
    }
};

// Fonction pour détecter le bon chemin selon l'environnement
function getLanguagePath(lang) {
    // Détecter si on est sur un serveur local (XAMPP) ou file://
    const isLocalServer = window.location.protocol === 'http:' || window.location.protocol === 'https:';
    const isFileProtocol = window.location.protocol === 'file:';
    
    console.log('🔍 Détection environnement:', {
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        pathname: window.location.pathname,
        isLocalServer: isLocalServer
    });
    
    if (isLocalServer && window.location.hostname === 'localhost') {
        // Pour XAMPP: chemin absolu depuis la racine
        return `/FROID/lang/${lang}.json`;
    } else {
        // Pour Live Server ou file://: chemin relatif
        return `../lang/${lang}.json`;
    }
}

// Fonction pour charger les langues avec gestion d'erreurs robuste
async function loadLanguage(lang) {
    const paths = [
        getLanguagePath(lang),
        `../../lang/${lang}.json`, // Votre chemin actuel
        `../lang/${lang}.json`,    // Chemin relatif standard
        `/FROID/lang/${lang}.json`, // Chemin absolu XAMPP
        `./lang/${lang}.json`      // Chemin relatif alternatif
    ];
    
    for (const path of paths) {
        try {
            console.log(`🔍 Tentative de chargement: ${path}`);
            const res = await fetch(path);
            
            if (!res.ok) {
                console.warn(`❌ Échec ${res.status} pour: ${path}`);
                continue; // Essayer le chemin suivant
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Réponse reçue (pas JSON):", text.substring(0, 200));
                continue; // Essayer le chemin suivant
            }
            
            const translations = await res.json();
            
            if (!translations || typeof translations !== 'object') {
                console.warn("Le fichier JSON ne contient pas un objet valide");
                continue; // Essayer le chemin suivant
            }
            
            // Succès ! Appliquer les traductions
            applyTranslations(translations, lang);
            console.log(`✅ Langue ${lang} chargée avec succès depuis: ${path}`);
            return; // Sortir de la fonction
            
        } catch (err) {
            console.warn(`❌ Erreur pour ${path}:`, err.message);
            continue; // Essayer le chemin suivant
        }
    }
    
    // Si aucun chemin n'a fonctionné
    console.error("❌ Impossible de charger la langue:", lang);
    console.error("Chemins tentés:", paths);
    
    // Fallback silencieux - on continue avec les textes par défaut
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

// Fonction séparée pour appliquer les traductions
function applyTranslations(translations, lang) {
    // Définir la langue et direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Traductions par attributs data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
    
    // Traductions pour les placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });
    
    // Traductions spécifiques
    if (translations["email_label"]) {
        const emailLabel = document.querySelector("label[for='email']");
        if (emailLabel) emailLabel.textContent = translations["email_label"];
    }
    
    if (translations["password_label"]) {
        const passwordLabel = document.querySelector("label[for='password']");
        if (passwordLabel) passwordLabel.textContent = translations["password_label"];
    }
    
    if (translations["remember_me"]) {
        const rememberLabel = document.querySelector("label[for='rememberMe']");
        if (rememberLabel) rememberLabel.textContent = translations["remember_me"];
    }
    
    if (translations["forgot_password"]) {
        const forgotLink = document.querySelector(".form-link a");
        if (forgotLink) forgotLink.textContent = translations["forgot_password"];
    }
    
    if (translations["create_account_button"]) {
        const submitBtn = document.querySelector(".submit-btn .btn-text");
        if (submitBtn) submitBtn.textContent = translations["create_account_button"];
    }
    
    if (translations["no_account"] && translations["login_link"]) {
        const authFooter = document.querySelector(".auth-footer");
        if (authFooter) {
            authFooter.innerHTML = `
                <span>${translations["no_account"]}</span> 
                <a href="login.html">${translations["login_link"]}</a>
            `;
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CONFIGURATION DU MODE SOMBRE =====
    const setupDarkMode = () => {
        const darkModeToggle = document.querySelector('.switch input');
        
        if (!darkModeToggle) {
            console.warn("⚠️ Bouton dark mode non trouvé (.switch input)");
            return;
        }
        
        const applyDarkMode = (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
            storage.set('darkMode', isDark ? 'enabled' : 'disabled');
        };
        
        // Charger le mode sauvegardé
        const savedMode = storage.get('darkMode') === 'enabled';
        applyDarkMode(savedMode);
        darkModeToggle.checked = savedMode;
        
        // Écouter les changements
        darkModeToggle.addEventListener('change', () => {
            applyDarkMode(darkModeToggle.checked);
        }, { passive: true });
    };
    
    // ===== CONFIGURATION DU SÉLECTEUR DE LANGUE =====
    const setupLanguageSelector = () => {
        const languageButton = document.getElementById("languageButton");
        const languageDropdown = document.getElementById("languageDropdown");
        const languageOptions = document.querySelectorAll(".language-option");
        const currentLangSpan = document.getElementById("currentLanguage");
        
        // Vérifier que tous les éléments existent
        if (!languageButton || !languageDropdown || !languageOptions.length || !currentLangSpan) {
            console.warn("⚠️ Éléments du sélecteur de langue manquants");
            return;
        }
        
        // Langue actuelle
        let currentLang = storage.get("lang", "ar");
        
        // Charger la langue initiale
        loadLanguage(currentLang);
        
        // Fonction pour fermer le dropdown
        const closeDropdown = () => {
            languageButton.setAttribute("aria-expanded", "false");
            languageDropdown.hidden = true;
            languageDropdown.classList.remove("active");
        };
        
        // Fonction pour ouvrir le dropdown
        const openDropdown = () => {
            languageButton.setAttribute("aria-expanded", "true");
            languageDropdown.hidden = false;
            languageDropdown.classList.add("active");
        };
        
        // Fonction pour basculer le dropdown
        const toggleDropdown = () => {
            const isOpen = languageButton.getAttribute("aria-expanded") === "true";
            isOpen ? closeDropdown() : openDropdown();
        };
        
        // Mettre à jour la sélection visuelle
        const updateCurrentLanguageSelection = () => {
            languageOptions.forEach(option => {
                option.classList.toggle("selected", option.dataset.lang === currentLang);
            });
            currentLangSpan.textContent = currentLang.toUpperCase();
        };
        
        // Événement clic sur le bouton
        languageButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
        
        // Fermer en cliquant ailleurs
        document.addEventListener("click", (e) => {
            if (!languageButton.contains(e.target) && !languageDropdown.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Fermer avec Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeDropdown();
            }
        });
        
        // Événements sur les options de langue
        languageOptions.forEach(option => {
            option.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const selectedLang = option.dataset.lang;
                
                if (selectedLang && selectedLang !== currentLang) {
                    // Retirer la sélection précédente
                    languageOptions.forEach(opt => opt.classList.remove("selected"));
                    
                    // Ajouter la nouvelle sélection
                    option.classList.add("selected");
                    
                    // Mettre à jour la langue courante
                    currentLang = selectedLang;
                    storage.set("lang", selectedLang);
                    currentLangSpan.textContent = selectedLang.toUpperCase();
                    
                    // Fermer le dropdown
                    closeDropdown();
                    
                    // Charger la nouvelle langue
                    loadLanguage(selectedLang);
                }
            });
            
            // Support clavier
            option.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    option.click();
                }
            });
        });
        
        // Initialiser la sélection
        updateCurrentLanguageSelection();
    };
    
    // ===== INITIALISATION =====
    setupDarkMode();
    setupLanguageSelector();
    
    console.log("🚀 langueDark.js initialisé avec succès");
});