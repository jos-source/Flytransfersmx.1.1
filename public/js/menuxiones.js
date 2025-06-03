document.addEventListener("DOMContentLoaded", function () {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById("mobile-menu-button");
        const mobileMenu = document.getElementById("mobile-menu");
        mobileMenuButton.addEventListener("click", function () {
          mobileMenu.classList.toggle("hidden");
          const icon = mobileMenuButton.querySelector("i");
          if (mobileMenu.classList.contains("hidden")) {
            icon.classList.remove("ri-close-line");
            icon.classList.add("ri-menu-line");
          } else {
            icon.classList.remove("ri-menu-line");
            icon.classList.add("ri-close-line");
          }
        });
        // FAQ toggles
        const faqButtons = document.querySelectorAll('[id^="faq-"][id$="-btn"]');
        faqButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const contentId = this.id.replace("-btn", "-content");
            const iconId = this.id.replace("-btn", "-icon");
            const content = document.getElementById(contentId);
            const icon = document.getElementById(iconId);
            content.classList.toggle("hidden");
            if (content.classList.contains("hidden")) {
              icon.classList.remove("ri-subtract-line");
              icon.classList.add("ri-add-line");
            } else {
              icon.classList.remove("ri-add-line");
              icon.classList.add("ri-subtract-line");
            }
          });
        });
      });
      document.addEventListener("DOMContentLoaded", function () {
        const nextSlideBtn = document.getElementById("next-slide");
        const prevSlideBtn = document.getElementById("prev-slide");
        const slides = document.querySelectorAll(".car-slide");
        const slideIndicators = document.querySelectorAll("[data-slide]");
        const currentSlideText = document.getElementById("current-slide");
        const currentCarName = document.getElementById("current-car-name");
        let currentSlide = 0;
        const totalSlides = slides.length;
        const carNames = ["NISSAN VERS", "van", "Transportación de Lujo", " grupos pequeños", 
                          "Limosina de lujo"];
        function updateSlide() {
          slides.forEach((slide, index) => {
            if (index === currentSlide) {
              slide.style.transform = "translateX(0)";
              slide.style.opacity = "1";
            } else if (index < currentSlide) {
              slide.style.transform = "translateX(-100%)";
              slide.style.opacity = "0";
            } else {
              slide.style.transform = "translateX(100%)";
              slide.style.opacity = "0";
            }
          });
          slideIndicators.forEach((indicator, index) => {
            if (index === currentSlide) {
              indicator.classList.add("bg-primary");
              indicator.classList.remove("bg-gray-300");
            } else {
              indicator.classList.remove("bg-primary");
              indicator.classList.add("bg-gray-300");
            }
          });
          currentSlideText.textContent = (currentSlide + 1)
            .toString()
            .padStart(2, "0");
          currentCarName.textContent = carNames[currentSlide];
        }
        nextSlideBtn.addEventListener("click", function () {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateSlide();
        });
        prevSlideBtn.addEventListener("click", function () {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateSlide();
        });
        slideIndicators.forEach((indicator, index) => {
          indicator.addEventListener("click", function () {
            currentSlide = index;
            updateSlide();
          });
        });
        // Hero slider animation
        const heroSliderIndicators = document.querySelectorAll(".slider-indicator");
        let currentHeroSlide = 0;
        function updateHeroSlider() {
          heroSliderIndicators.forEach((indicator, index) => {
            if (index === currentHeroSlide) {
              indicator.classList.add("active");
            } else {
              indicator.classList.remove("active");
            }
          });
        }
        setInterval(function () {
          currentHeroSlide = (currentHeroSlide + 1) % heroSliderIndicators.length;
          updateHeroSlider();
        }, 5000);
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              // Close mobile menu if open
              if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.add("hidden");
                const icon = mobileMenuButton.querySelector("i");
                icon.classList.remove("ri-close-line");
                icon.classList.add("ri-menu-line");
              }
              window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: "smooth",
              });
            }
          });
        });
      });