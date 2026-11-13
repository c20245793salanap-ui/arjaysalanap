
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.from("#services", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: true
    }
});

gsap.fromTo("#progressBar", {
    scaleX: 0,
}, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
    }
});

ScrollTrigger.create({
    trigger: "#services",
    start: "top 80%",
    end: "top 30%",
    pin: true,
});

// Reveal the heading without shifting its final layout position.
gsap.from("h1", { y: -40, opacity: 0, duration: 1, ease: "power3.out" });
// //gsap.from("h1", { y: -60, opacity: 0, ease: "elastic.out(1, 0.5)" });
// //ease: "power2.out"});
// //ease: "back.out(2.5)"});
// //ease: "bounce.out"}); 
// //ease: "elastic.out"(1, 0.5)"});


// // 3 Stagger.
gsap.from("nav a", { y: -20, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.12, delay: 0.2 });


// // 4 Timeline.
const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });
// fromTo("h1", { y: -60, capacity: 0 }, { y: 0, capacity: 1 });
// forto("nav a", { y: 200, capacity: 0, stagger: 0.5 }, "<");
// form("main section", { y: 200, capacity: 0 }, "<");


const replayTimelineButton = document.querySelector("#replay-timeline");
const heading = document.querySelector("h1");
const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
const headingWalker = heading
    ? document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
    : null;
const headingTextNodes = [];

while (headingWalker?.nextNode()) {
    const node = headingWalker.currentNode;
    const originalText = node.textContent;
    if (originalText.trim()) {
        headingTextNodes.push({ node, originalText });
    }
}

let scrambleAnimationFrame;
function scrambleHeading(duration = 1200) {
    cancelAnimationFrame(scrambleAnimationFrame);
    const startTime = performance.now();

    function animate(now) {
        const progress = Math.min((now - startTime) / duration, 1);

        headingTextNodes.forEach(({ node, originalText }) => {
            const characters = [...originalText];
            const revealed = Math.floor(progress * characters.length);
            node.textContent = characters.map((character, index) => {
                if (character.trim() === "" || index < revealed) return character;
                return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
            }).join("");
        });

        if (progress < 1) {
            scrambleAnimationFrame = requestAnimationFrame(animate);
        } else {
            headingTextNodes.forEach(({ node, originalText }) => {
                node.textContent = originalText;
            });
        }
    }

    scrambleAnimationFrame = requestAnimationFrame(animate);
}

const pageTimeline = gsap.timeline({});
pageTimeline
    .fromTo("nav a", {
        y: -16,
        opacity: 0,
    }, {
        y: 0,
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
        ease: "bounce.out"
    })
    .fromTo("main section:not(#services)", {
        y: 24,
        opacity: 0,

    }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "bounce.out"
    }, "-=0.15");

if (heading) scrambleHeading();
replayTimelineButton?.addEventListener("click", () => {
    pageTimeline.restart();
    if (heading) scrambleHeading();
    replayTimelineButton.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
});


const toggleButton = document.querySelector("#toggle-dark");
toggleButton?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    toggleButton.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        { duration: 700, easing: "ease-in-out" }

    );
    const isDark = document.documentElement.classList.contains("dark");
    toggleButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});
// Demo form behavior only; this does not send an email.
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent =
        "Thanks for your message! Connect a backend to receive submissions.";
    if (formStatus) formStatus.style.color =
        document.documentElement.classList.contains("dark")
            ? "#EFF6FF"
            : "#1D4ED8";
    contactForm.reset();
});