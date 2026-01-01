document.addEventListener("DOMContentLoaded", () => {
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

//password et confirm password 
const erreurPassword = document.getElementById("password-error");
const passwordInput = document.getElementById("password");

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

// Afficher le mot de passe
const togglePassword = document.getElementById("togglePassword");
  const icon = togglePassword.querySelector("i");

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
  
    icon.classList.remove(isHidden ? "fa-eye-slash": "fa-eye" );
    icon.classList.add(isHidden ? "fa-eye" : "fa-eye-slash");
  });
});
  