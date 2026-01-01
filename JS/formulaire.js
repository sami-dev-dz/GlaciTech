function initializeFormValidation() {
    const form = document.getElementById('technicianForm');
    const telegramInput = document.getElementById('telegram');
    const whatsappInput = document.getElementById('whatsapp');
    
    if (!form) return;
    
    if (telegramInput) {
        telegramInput.placeholder = 'https://t.me/username';
        telegramInput.addEventListener('blur', function() {
            validateTelegramField(this);
        });
    }
    
    if (whatsappInput) {
        whatsappInput.placeholder = 'https://wa.me/123456789';
        whatsappInput.addEventListener('blur', function() {
            validateWhatsAppField(this);
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
            console.log('Données du formulaire:', formData);
            showSuccessMessage();
            this.reset();
        }
    });
    
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    document.querySelectorAll('.required').forEach(label => {
        const inputId = label.getAttribute('for');
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '' && !this.classList.contains('error-input')) {
                    highlightRequired(this);
                }
            });
        }
    });
}

function validateForm() {
    let isValid = true;
    clearAllErrors();
    
    const validations = [
        { element: document.getElementById('country'), validate: (el) => el.value !== '', message: 'يرجى اختيار الدولة' },
        { element: document.getElementById('city'), validate: (el) => el.value.trim() !== '', message: 'يرجى إدخال المدينة' },
        { element: document.getElementById('address'), validate: (el) => el.value.trim() !== '', message: 'يرجى إدخال العنوان التفصيلي' }
    ];
    
    validations.forEach(({ element, validate, message }) => {
        if (element && !validate(element)) {
            showError(element, message);
            isValid = false;
        }
    });
    
    if (!validateContactFields()) {
        isValid = false;
    }
    
    if (!validateServices()) {
        isValid = false;
    }
    
    return isValid;
}

function validateContactFields() {
    const telegram = document.getElementById('telegram');
    const whatsapp = document.getElementById('whatsapp');
    let isValid = true;
    let contactProvided = false;
    
    if (telegram && telegram.value.trim() !== '') {
        if (!validateTelegramField(telegram)) {
            isValid = false;
        } else {
            contactProvided = true;
        }
    }
    
    if (whatsapp && whatsapp.value.trim() !== '') {
        if (!validateWhatsAppField(whatsapp)) {
            isValid = false;
        } else {
            contactProvided = true;
        }
    }
    
    if (!contactProvided) {
        if (telegram) showError(telegram, 'يرجى تقديم رابط Telegram أو رابط WhatsApp للتواصل');
        if (whatsapp) showError(whatsapp, 'يرجى تقديم رابط Telegram أو رابط WhatsApp للتواصل');
        isValid = false;
    }
    
    return isValid;
}

function validateTelegramField(element) {
    const value = element.value.trim();
    if (value !== '' && !value.startsWith('https://t.me/')) {
        showError(element, 'يجب أن يبدأ رابط تيليجرام بـ https://t.me/');
        return false;
    }
    return true;
}

function validateWhatsAppField(element) {
    const value = element.value.trim();
    if (value !== '' && !value.startsWith('https://wa.me/')) {
        showError(element, 'يجب أن يبدأ رابط واتساب بـ https://wa.me/');
        return false;
    }
    return true;
}

function validateServices() {
    const services = document.querySelectorAll('input[name="service"]:checked');
    if (services.length === 0) {
        showExternalError('services-container', 'يرجى اختيار نوع خدمة واحدة على الأقل');
        return false;
    }
    return true;
}

function collectFormData() {
    return {
        country: getFieldValue('country'),
        city: getFieldValue('city'),
        address: getFieldValue('address'),
        telegram: getFieldValue('telegram'),
        whatsapp: getFieldValue('whatsapp'),
        services: Array.from(document.querySelectorAll('input[name="service"]:checked')).map(el => el.value),
        experience: getFieldValue('experience')
    };
}

function getFieldValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function showError(inputElement, message) {
    if (!inputElement) return;
    
    inputElement.classList.add('error-input');
    
    let errorMessage = inputElement.parentElement.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        inputElement.parentElement.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    
    setTimeout(() => {
        clearFieldError(inputElement);
    }, 5000);
}

function showExternalError(containerId, message) {
    const container = document.querySelector('.' + containerId);
    if (!container) return;
    
    let errorElement = container.nextElementSibling;
    if (errorElement && errorElement.classList.contains('external-error-message')) {
        errorElement.textContent = message;
    } else {
        errorElement = document.createElement('div');
        errorElement.className = 'external-error-message';
        errorElement.textContent = message;
        container.parentNode.insertBefore(errorElement, container.nextSibling);
    }
    
    setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, 5000);
}

function clearFieldError(inputElement) {
    inputElement.classList.remove('error-input');
    const errorMessage = inputElement.parentElement.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

function clearAllErrors() {
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.external-error-message').forEach(el => el.remove());
}

function highlightRequired(element) {
    element.classList.add('highlight-required');
    setTimeout(() => element.classList.remove('highlight-required'), 500);
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.className = 'success-message show';
        setTimeout(() => {
            successMessage.className = 'success-message';
        }, 3000);
    }
}