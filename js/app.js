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

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initScrollspy();
  initAcademicFilters();
});
