
// وظائف مساعدة
function $(selector) {
return document.querySelector(selector);
}

function $$(selector) {
return document.querySelectorAll(selector);
}

// تهيئة الوضع المظلم
document.addEventListener('DOMContentLoaded', function() {
// تهيئة أزرار التصفية
const filterButtons = $$('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// تهيئة خيارات العرض
const viewOptions = $$('.view-option');
viewOptions.forEach(option => {
    option.addEventListener('click', () => {
        viewOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// زر تحميل المزيد
const loadMoreButton = $('.load-more');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        
        setTimeout(() => {
            this.innerHTML = 'عرض المزيد من التقنيين';
            alert('تم تحميل المزيد من التقنيين');
        }, 1500);
    });
}

// تهيئة البحث
const searchBar = $('.search-bar input');
const searchButton = $('.search-bar button');

if (searchBar && searchButton) {
    searchButton.addEventListener('click', () => {
        const searchTerm = searchBar.value.trim();
        if(searchTerm) {
            alert(`جاري البحث عن: ${searchTerm}`);
        }
    });
}

// إعداد بطاقة الاتصال
setupContactCard();
});


// إعداد بطاقة الاتصال
function setupContactCard() {
const contactButtons = $$('.contact-btn');
const contactCard = $('#contactCard');
const overlay = $('#overlay');
const closeBtn = $('.close-btn');

// إضافة مستمعي أحداث لأزرار الاتصال
contactButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // الحصول على معلومات التقني
        const technicianCard = this.closest('.technician-card');
        const technicianName = technicianCard.querySelector('.technician-name h3').textContent;
        const technicianSpecialty = technicianCard.querySelector('.specialty').textContent;
        const technicianPhone = technicianCard.querySelector('.info-item:nth-child(1) span').textContent;
        const technicianEmail = technicianCard.querySelector('.info-item:nth-child(2) span').textContent;
        
        // تحديث معلومات الاتصال
        updateContactInfo(technicianName, technicianSpecialty, technicianPhone, technicianEmail);
        
        // عرض البطاقة
        showContactCard();
    });
});

// إضافة مستمع حدث لزر الإغلاق
if (closeBtn) {
    closeBtn.addEventListener('click', hideContactCard);
}

// إغلاق البطاقة عند النقر على الخلفية
if (overlay) {
    overlay.addEventListener('click', hideContactCard);
}

// إضافة مستمع للضغط على زر ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactCard && contactCard.style.display === 'block') {
        hideContactCard();
    }
});

// تحديث معلومات الاتصال
function updateContactInfo(name, specialty, phone, email) {
    const headerTitle = contactCard.querySelector('.contact-card-header h2');
    const technicianInfo = contactCard.querySelector('.technician-info');
    const whatsappLink = contactCard.querySelector('.whatsapp');
    const telegramLink = contactCard.querySelector('.telegram');
    const phoneLink = contactCard.querySelector('.phone');
    
    // تحديث العنوان ومعلومات التقني
    headerTitle.textContent = `${name}`;
    technicianInfo.textContent = specialty;
    
    // تنظيف رقم الهاتف
    const cleanPhone = phone.replace(/\D/g, '');
    
    // تحديث روابط الاتصال
    whatsappLink.href = `https://wa.me/${cleanPhone}`;
    telegramLink.href = `https://t.me/${email.split('@')[0]}`;
    phoneLink.href = `tel:${cleanPhone}`;
    
    // تحديث نص الاتصال
    phoneLink.querySelector('span').textContent = `اتصال مباشر (${phone})`;
}

// عرض بطاقة الاتصال
function showContactCard() {
    overlay.style.display = 'block';
    contactCard.style.display = 'block';
    
    setTimeout(() => {
        overlay.classList.add('active');
        contactCard.classList.add('active');
    }, 10);
}

// إخفاء بطاقة الاتصال
function hideContactCard() {
    overlay.classList.remove('active');
    contactCard.classList.remove('active');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        contactCard.style.display = 'none';
    }, 300);
}
}