document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    });


    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach(el => observer.observe(el));

  
    const infoCards = document.querySelectorAll(".info-card");
    infoCards.forEach(el => observer.observe(el));


    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach(el => observer.observe(el));
});
