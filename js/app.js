/**
 * St. Catherine's College Main Application Controller
 * Handles Navigation, Mobile Drawer, Academic Filters & Modal Workflows
 */

// Mobile Navigation Toggle
function initNavigation() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  const drawerLinks = document.querySelectorAll(".mobile-drawer-link");

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      drawer.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      drawer.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Close drawer when a link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Scrollspy for Active Navigation Link Highlighting
function initScrollspy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// Academic Filter Handler
function initAcademicFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const programCards = document.querySelectorAll(".academic-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      programCards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Modal Controller for Facility Image Detail
function openFacilityModal(title, description, detailList) {
  const modal = document.getElementById("facility-detail-modal");
  const modalTitle = document.getElementById("modal-facility-title");
  const modalDesc = document.getElementById("modal-facility-desc");
  const modalList = document.getElementById("modal-facility-list");

  if (!modal || !modalTitle) return;

  modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = description;

  if (modalList && detailList) {
    modalList.innerHTML = detailList.map(item => `<li>${item}</li>`).join("");
  }

  modal.showModal();
}

function closeFacilityModal() {
  const modal = document.getElementById("facility-detail-modal");
  if (modal) modal.close();
}

// High-Resolution Image Lightbox Gallery Controller
let lightboxGallery = [];
let currentLightboxIndex = 0;
let lastFocusedElement = null;

function initImageLightbox() {
  const triggers = document.querySelectorAll(".lightbox-trigger");
  if (!triggers.length) return;

  // Build lightbox collection from all trigger elements
  lightboxGallery = Array.from(triggers).map((el, index) => {
    el.setAttribute("data-lightbox-index", index);
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");

    const title = el.getAttribute("data-title") || 
                  el.querySelector(".gallery-caption h4, .tryout-header h4, h4, h3")?.textContent?.trim() || 
                  `Campus Photo ${index + 1}`;
    el.setAttribute("aria-label", `View ${title} in high resolution`);

    const img = el.querySelector("img");
    const src = el.getAttribute("data-src") || (img ? img.getAttribute("src") : "");
    const caption = el.getAttribute("data-caption") || 
                    el.querySelector(".gallery-caption p, .tryout-meta p, p")?.textContent?.trim() || 
                    "";
    const category = el.getAttribute("data-category") || "";

    return {
      src,
      title,
      caption,
      category,
      triggerElement: el
    };
  });

  triggers.forEach((trigger, idx) => {
    trigger.addEventListener("click", (e) => {
      // Don't trigger if user clicked an anchor inside the card
      if (e.target.closest("a")) return;
      e.preventDefault();
      openImageLightbox(idx);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openImageLightbox(idx);
      }
    });
  });

  const modal = document.getElementById("image-lightbox-modal");
  if (!modal) return;

  const closeBtn = document.getElementById("lightbox-close-btn");
  const prevBtn = document.getElementById("lightbox-prev-btn");
  const nextBtn = document.getElementById("lightbox-next-btn");
  const backdrop = modal.querySelector(".lightbox-backdrop");

  if (closeBtn) closeBtn.addEventListener("click", closeImageLightbox);
  if (backdrop) backdrop.addEventListener("click", closeImageLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateLightbox(1));

  // Keyboard navigation & accessibility trap
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeImageLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigateLightbox(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      navigateLightbox(1);
    }
  });
}

function openImageLightbox(index) {
  if (index < 0 || index >= lightboxGallery.length) return;
  const modal = document.getElementById("image-lightbox-modal");
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  currentLightboxIndex = index;
  updateLightboxContent();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const closeBtn = document.getElementById("lightbox-close-btn");
  if (closeBtn) closeBtn.focus();
}

function updateLightboxContent() {
  const item = lightboxGallery[currentLightboxIndex];
  if (!item) return;

  const imgEl = document.getElementById("lightbox-image");
  const titleEl = document.getElementById("lightbox-title");
  const counterEl = document.getElementById("lightbox-counter");
  const captionEl = document.getElementById("lightbox-caption-text");
  const categoryEl = document.getElementById("lightbox-category");

  if (imgEl) {
    imgEl.src = item.src;
    imgEl.alt = item.title;
  }
  if (titleEl) titleEl.textContent = item.title;
  if (counterEl) counterEl.textContent = `${currentLightboxIndex + 1} / ${lightboxGallery.length}`;
  if (captionEl) captionEl.textContent = item.caption;
  if (categoryEl) {
    if (item.category) {
      categoryEl.textContent = item.category;
      categoryEl.style.display = "inline-block";
    } else {
      categoryEl.style.display = "none";
    }
  }
}

function navigateLightbox(direction) {
  if (!lightboxGallery.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + lightboxGallery.length) % lightboxGallery.length;
  updateLightboxContent();
}

function closeImageLightbox() {
  const modal = document.getElementById("image-lightbox-modal");
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

// Hero Section Campus Life Video Player Controller
function initHeroVideoPlayer() {
  const video = document.getElementById("hero-campus-video");
  const playBtn = document.getElementById("hero-video-play-btn");
  const soundBtn = document.getElementById("hero-video-sound-btn");
  const fullscreenBtn = document.getElementById("hero-video-fullscreen-btn");

  if (!video) return;

  const playIcon = document.getElementById("hero-play-icon");
  const pauseIcon = document.getElementById("hero-pause-icon");
  const soundMutedIcon = document.getElementById("hero-sound-muted-icon");
  const soundOnIcon = document.getElementById("hero-sound-on-icon");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        if (playIcon) playIcon.style.display = "none";
        if (pauseIcon) pauseIcon.style.display = "block";
        playBtn.setAttribute("aria-label", "Pause campus video");
      } else {
        video.pause();
        if (playIcon) playIcon.style.display = "block";
        if (pauseIcon) pauseIcon.style.display = "none";
        playBtn.setAttribute("aria-label", "Play campus video");
      }
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (video.muted) {
        if (soundMutedIcon) soundMutedIcon.style.display = "block";
        if (soundOnIcon) soundOnIcon.style.display = "none";
        soundBtn.setAttribute("aria-label", "Unmute campus video sound");
      } else {
        if (soundMutedIcon) soundMutedIcon.style.display = "none";
        if (soundOnIcon) soundOnIcon.style.display = "block";
        soundBtn.setAttribute("aria-label", "Mute campus video sound");
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });
  }

  video.addEventListener("play", () => {
    if (playIcon) playIcon.style.display = "none";
    if (pauseIcon) pauseIcon.style.display = "block";
  });

  video.addEventListener("pause", () => {
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
  });
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initScrollspy();
  initAcademicFilters();
  initImageLightbox();
  initHeroVideoPlayer();
});
