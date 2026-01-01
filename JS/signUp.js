document.addEventListener("DOMContentLoaded", () => {
    // Changer de pays
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const countryCode = this.dataset.value;
            const flagSrc = this.querySelector('.flag-img').src;

            selectedOption.querySelector('.country-code').textContent = countryCode;
            selectedOption.querySelector('.flag-img').src = flagSrc;

            document.getElementById('countryCode').value = countryCode;
            dropdownOptions.style.display = 'none';
            selectedOption.setAttribute('aria-expanded', 'false');
        });
    });
  

  const selectedOption = document.getElementById('selectedCountry');
  const dropdownOptions = document.getElementById('countryOptions');

  // Toggle dropdown
  selectedOption.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      dropdownOptions.style.display = expanded ? 'none' : 'block';
  });

  // Fermer le dropdown si clic à l'extérieur
  document.addEventListener('click', function (e) {
      if (!selectedOption.contains(e.target) && !dropdownOptions.contains(e.target)) {
          dropdownOptions.style.display = 'none';
          selectedOption.setAttribute('aria-expanded', 'false');
      }
  });

  
  //email 
  const emailInput = document.querySelector("#email");
  const errorMessage = document.querySelector("#email-error");

if (!emailInput || !errorMessage) {
  console.error("Éléments introuvables !");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener("blur", () => {
  const emailValue = emailInput.value.trim();
  const emailCom = emailValue.slice(-3);

  if (emailValue === "") {
    errorMessage.textContent = "يرجى إدخال البريد الإلكتروني";
    errorMessage.style.cssText = `
      opacity: 1;
      max-height: 50px;
    `;
  } else if (!emailRegex.test(emailValue) || emailCom !== "com") {
    errorMessage.textContent = "البريد الإلكتروني غير صالح";
    errorMessage.style.cssText = `
      opacity: 1;
      max-height: 50px;
    `;
  } else {
    errorMessage.style.cssText = `
      opacity: 0;
      max-height: 0;
    `;
  }
});
  
  emailInput.addEventListener("focus", () => {
    if (errorMessage.style.opacity === "1") {
      errorMessage.style.opacity = "0";
    }
  });

const erreur_nom = document.getElementById("firstName-error");
const erreur_prenom = document.getElementById("lastName-error");
const nomInput = document.getElementById("firstName");
const prenomInput = document.getElementById("lastName");

nomInput.addEventListener('blur', () => {
  if (nomInput.value.trim() === "") {
    erreur_nom.textContent = "يرجى إدخال الاسم العائلي";
    erreur_nom.style.cssText = `
      opacity: 1;
      max-height: 50px;
    `;
  } else {
    erreur_nom.style.cssText = `
      opacity: 0;
      max-height: 0;
    `;
  }
});
  
nomInput.addEventListener("focus", () => {
  if (erreur_nom.style.opacity === "1") {
    erreur_nom.style.opacity = "0";
  }
});


prenomInput.addEventListener('blur', () => {
  if (prenomInput.value.trim() === "") {
    erreur_prenom.textContent = "يرجى إدخال الاسم الشخصي";
    erreur_prenom.style.cssText = `
      opacity: 1;
      max-height: 50px;
    `;
  } else {
    erreur_prenom.style.cssText = `
      opacity: 0;
      max-height: 0;
    `;
  }
});
  
prenomInput.addEventListener("focus", () => {
  if (erreur_prenom.style.opacity === "1") {
    erreur_prenom.style.opacity = "0";
  }
});
  
  //numero telephone
const erreur_phone = document.getElementById("phone-error");
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("blur", () => {
  if (phoneInput.value.trim() === "") {
    erreur_phone.textContent = "يرجى إدخال رقم الهاتف";
    erreur_phone.style.cssText = `
    opacity: 1;
    max-height: 50px;
  `;
  }
    else if (isNaN(phoneInput.value.trim())) {
      erreur_phone.textContent = "رقم الهاتف غير صالح";
    erreur_phone.style.cssText = `
    opacity: 1;
    max-height: 50px;
  `;
    }
  else {
    erreur_phone.style.cssText = `
    opacity: 0;
    max-height: 0;
  `;
   }
});
  
phoneInput.addEventListener("focus", () => {
  if (erreur_phone.style.opacity === "1") {
    erreur_phone.style.opacity = "0";
  }

});
  
  //password et confirm password 
  const erreurPassword = document.getElementById("password-error");
  const erreurConfirmPassword = document.getElementById("confirmPassword-error");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("confirmPassword");

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.trim() === "") {
      erreurPassword.textContent = "يرجى إدخال كلمة السر";
      erreurPassword.style.cssText = `
        opacity: 1;
        max-height: 50px;
      `;
    }

    else {
      erreurPassword.style.cssText = `
      opacity: 0;
      max-height: 0;
    `;
     }
  });

  passwordInput.addEventListener("focus", () => {
    if (erreurPassword.style.opacity === "1") {
      erreurPassword.style.opacity = "0";
    }

  });

    passwordConfirmInput.addEventListener("blur", () => {
    if (passwordConfirmInput.value.trim() === "") {
      erreurConfirmPassword.textContent = "يرجى إدخال تأكيد كلمة المرور";
      erreurConfirmPassword.style.cssText = `
        opacity: 1;
        max-height: 50px;
      `;
      }
      else if (passwordConfirmInput.value.trim() !== passwordInput.value.trim()) {
        erreurConfirmPassword.textContent = "يرجى تأكيد كلمة المرور بشكل صحيح";
        erreurConfirmPassword.style.cssText = `
          opacity: 1;
          max-height: 50px;
        `;
      } else {
        erreurConfirmPassword.style.cssText = `
          opacity: 0;
          max-height: 0;
        `;
      }
    });

  passwordConfirmInput.addEventListener("focus", () => {
    if (erreurConfirmPassword.style.opacity === "1") {
      erreurConfirmPassword.style.opacity = "0"; 
    }
  

});

// Afficher le mot de passe
const togglePassword = document.getElementById("togglePassword");
  const icon = togglePassword.querySelector("i");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const iconConfirm = toggleConfirmPassword.querySelector("i");

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
  
    icon.classList.remove(isHidden ? "fa-eye-slash": "fa-eye" );
    icon.classList.add(isHidden ? "fa-eye" : "fa-eye-slash");
  });
  
  // Toggle confirmation mot de passe
  toggleConfirmPassword.addEventListener("click", () => {
    const isHiddenConfirm = passwordConfirmInput.type === "password";
    passwordConfirmInput.type = isHiddenConfirm ? "text" : "password";
  
    iconConfirm.classList.remove(isHiddenConfirm ? "fa-eye-slash": "fa-eye" );
    iconConfirm.classList.add(isHiddenConfirm ? "fa-eye" : "fa-eye-slash");
  });

  //diplome
  const diplomeInput = document.getElementById("diplome");
  const fileList = document.getElementById("fileList");
  const maxFileSizeMB = 5;
  const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
  
  diplomeInput.addEventListener("change", () => {
    fileList.innerHTML = ""; // vider la liste précédente
    const file = diplomeInput.files[0];
  
    if (file) {
      const fileName = file.name;
      const fileSizeMB = file.size / (1024 * 1024);
      const fileExtension = fileName.split(".").pop().toLowerCase();
  
      if (!allowedExtensions.includes(fileExtension)) {
        const li = document.createElement("li");
        li.textContent = "❌ نوع الملف غير مدعوم";
        li.style.color = "red";
        fileList.appendChild(li);
        diplomeInput.value = ""; // réinitialiser le champ
        return;
      }
  
      if (fileSizeMB > maxFileSizeMB) {
        const li = document.createElement("li");
        li.textContent = "❌ حجم الملف يتجاوز 5MB";
        li.style.color = "red";
        fileList.appendChild(li);
        diplomeInput.value = "";
        return;
      }
  
      const li = document.createElement("li");
      li.textContent = `✅ ${fileName} (${fileSizeMB.toFixed(2)} MB)`;
      fileList.appendChild(li);
    }
  });
  

});