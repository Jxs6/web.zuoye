// 全站交互脚本：负责首页轮播、固定页头滚动态和移动端导航菜单。

// 通过透明度切换轮播画面，所有轮播按钮共享同一套状态。
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".carousel-dot");
const previousButton = document.querySelector(".carousel-arrow--previous");
const nextButton = document.querySelector(".carousel-arrow--next");
let activeSlide = 0;

// 切换到指定图片，并同步更新圆点的视觉状态与无障碍状态。
function showSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeSlide));
    dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeSlide);
        dot.setAttribute("aria-pressed", String(i === activeSlide));
    });
}

// 为每个圆点绑定对应的轮播画面。
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
});

// 左右箭头按循环顺序切换图片；箭头只会在首页轮播区域存在时绑定。
if (previousButton) {
    previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
}

if (nextButton) {
    nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
}

// 自动轮播只在存在多张图片时启动，用户偏好减少动态效果时不自动播放。
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (slides.length > 1 && !prefersReducedMotion.matches) {
    window.setInterval(() => showSlide(activeSlide + 1), 5500);
}

// 固定页头滚动后增加背景不透明度与阴影，提高导航文字可读性。
const siteHeader = document.querySelector(".site-header");

function updateHeaderOnScroll() {
    if (siteHeader) {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    }
}

window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

// 手机端展开或收起导航，并在访问栏目后自动关闭菜单。
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
        menuToggle.textContent = isOpen ? "×" : "☰";
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "打开导航菜单");
            menuToggle.textContent = "☰";
        });
    });
}
