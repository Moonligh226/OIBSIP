
/* =========================================
   OMNIVERSE - MAIN ENTRY POINT
========================================= */

import "./animations.js";
import { translations } from "./translations.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// =========================================
// BACK TO TOP
// =========================================

const backToTop = document.querySelector("#back-to-top");

if (backToTop) {

    gsap.set(backToTop, {
        autoAlpha: 0,
        y: 20,
        pointerEvents: "none"
    });

    ScrollTrigger.create({
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        onLeave: () => {
            gsap.to(backToTop, {
                autoAlpha: 1,
                y: 0,
                duration: 0.35,
                pointerEvents: "auto",
                ease: "power2.out"
            });
        },
        onEnterBack: () => {
            gsap.to(backToTop, {
                autoAlpha: 0,
                y: 20,
                duration: 0.3,
                pointerEvents: "none",
                ease: "power2.in"
            });
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================
   LANGUAGE SWITCHER
========================================= */

const languageToggle = document.querySelector("#language-toggle");

function setLanguage(language) {

    const dictionary = translations[language];

    if (!dictionary) return;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }

    });

    languageToggle.querySelectorAll("[data-lang]").forEach(option => {
        option.classList.toggle(
            "active",
            option.dataset.lang === language
        );
    });

    localStorage.setItem("omniverse-language", language);
}

if (languageToggle) {

    languageToggle.addEventListener("click", () => {

        const currentLanguage = document.documentElement.lang;
        const nextLanguage = currentLanguage === "en" ? "fr" : "en";

        setLanguage(nextLanguage);

    });

    const savedLanguage =
        localStorage.getItem("omniverse-language") || "en";

    setLanguage(savedLanguage);
}

console.log("OMNIVERSE initialized 🚀");
