
/* =========================================
   OMNIVERSE - ANIMATION ENGINE
========================================= */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

console.log("GSAP:", gsap.version);
console.log("ScrollTrigger loaded:", ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {

    // 1. PERMANENT ORBITAL ROTATION
    gsap.to(".ring-one", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none"
    });

    gsap.to(".ring-two", {
        rotation: -360,
        duration: 45,
        repeat: -1,
        ease: "none"
    });

    gsap.to(".ring-three", {
        rotation: 360,
        duration: 55,
        repeat: -1,
        ease: "none"
    });

    // 2. INTRO ANIMATION
    const intro = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    intro
        .from(".hero-eyebrow", {
            y: 25,
            opacity: 0,
            duration: 0.8
        })
        .from(".title-line", {
                y: 100,
                opacity: 0,
                duration: 1.1,
                stagger: 0.2,
                ease: "power4.out"
        }, "-=0.4")
        .from(".hero-description", {
            y: 30,
            opacity: 0,
            duration: 0.9
        }, "-=0.6")
        .from(".hero-actions", {
            y: 25,
            opacity: 0,
            duration: 0.8
        }, "-=0.5")
        .from(".hero-meta", {
            opacity: 0,
            duration: 0.8
        }, "-=0.4")
        .from(".hero-visual", {
            scale: 0.7,
            opacity: 0,
            duration: 1.5
        }, "-=1");

    // 3. CINEMATIC HERO SCROLL
    const mm = gsap.matchMedia();

    // Desktop experience
    mm.add("(min-width: 901px)", () => {

        const heroScroll = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "+=600",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

       
heroScroll
    // Text moves away
    .to(".hero-content", {
        y: -100,
        opacity: 0.2,
        duration: 1
    }, 0)

    // Orbital system moves forward
    .to(".orbital-system", {
        rotation: 80,
        scale: 1.3,
        duration: 1
    }, 0)

    // Background grid moves more slowly
    .to(".visual-grid", {
        y: -70,
        scale: 1.15,
        opacity: 0.5,
        duration: 1
    }, 0)

    // Central orb gets closer
    .to(".core-orb", {
        scale: 1.25,
        y: -25,
        duration: 1
    }, 0)

    // Caption fades away
    .to(".visual-caption", {
        opacity: 0,
        duration: 0.5
    }, 0);

    });

    // Mobile experience
    mm.add("(max-width: 900px)", () => {

        gsap.to(".orbital-system", {
            rotation: 35,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

    });


// 4. ABOUT SECTION - CINEMATIC REVEAL

const aboutReveal = gsap.timeline({
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});

// Top metadata
aboutReveal.from(".about-topline", {
    y: 25,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
});

// Small introductory label
aboutReveal.from(".about-kicker", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out"
}, "-=0.3");

// Main editorial headline
aboutReveal.from(".about-title", {
    y: 90,
    opacity: 0,
    duration: 1.1,
    ease: "power4.out"
}, "-=0.2");

// Index line
aboutReveal.from(".about-index", {
    x: -30,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
}, "-=0.5");

// Abstract visual frames
aboutReveal.from(".frame-back", {
    rotation: -25,
    scale: 0.7,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.7");

aboutReveal.from(".frame-front", {
    rotation: 15,
    scale: 0.75,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.8");

// Coordinates
aboutReveal.from(".visual-coordinate", {
    y: 15,
    opacity: 0,
    duration: 0.6
}, "-=0.4");

// Text content
aboutReveal.from(".about-copy .about-intro, .about-copy .about-description", {
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.18,
    ease: "power3.out"
}, "-=0.5");

// Focus areas
aboutReveal.from(".focus-item", {
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: "power3.out"
}, "-=0.3");


// 5. SKILLS SECTION REVEAL

gsap.from(".skill-card", {
    y: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.18,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});
// 6. SKILLS TECHNOLOGY ICONS REVEAL
gsap.from(".skill-technologies i, .skill-technologies .technology-logo, .minio-symbol", {
    opacity: 0,
    scale: 0.6,
    duration: 0.6,
    stagger: 0.12,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});
    
    // 7. CINEMATIC PROJECTS HORIZONTAL SCROLL

    mm.add("(min-width: 901px)", () => {

        const projectsSection = document.querySelector(".projects-section");
        const projectsTrack = document.querySelector(".projects-track");

        if (!projectsSection || !projectsTrack) return;

        // Calculate the actual available viewing width
        const getAvailableWidth = () => {
            const styles = getComputedStyle(projectsSection);

            const paddingLeft = parseFloat(styles.paddingLeft);
            const paddingRight = parseFloat(styles.paddingRight);

            return projectsSection.clientWidth - paddingLeft - paddingRight;
        };

        // Calculate the complete horizontal distance
        const getScrollDistance = () => {
            return Math.max(
                0,
                projectsTrack.scrollWidth - getAvailableWidth()
            );
        };

        gsap.to(projectsTrack, {

            x: () => -getScrollDistance(),

            ease: "none",

            scrollTrigger: {
                trigger: projectsSection,
                start: "top top",
                end: () => `+=${getScrollDistance()}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }

        });

    });

// =========================================
// 8. CONTACT SECTION REVEAL
// =========================================

const contactTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".contact-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});

contactTimeline
    .from(".contact-section .section-label", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out"
    })
    .from(".contact-title", {
        opacity: 0,
        y: 45,
        duration: 0.9,
        ease: "power3.out"
    }, "-=0.25")
    .from(".contact-description", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.4")
    .from(".contact-button", {
        opacity: 0,
        scale: 0.85,
        duration: 0.7,
        ease: "back.out(1.7)"
    }, "-=0.3")
    .from(".contact-footer span", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out"
    }, "-=0.2");



}
