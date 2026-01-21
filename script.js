// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth scroll for nav links
function smoothScrollTo(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

// NAV-LINKS
document.querySelectorAll(".scroll-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  });
});

// HERO BUTTONS
document.querySelectorAll(".scroll-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (target) smoothScrollTo(target);
  });
});

// (Optional) prevent real submit for now
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Multumim! Te vom contacta in curand.");
    form.reset();
  });
}

//PARTNERS LOGIC
  const items = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  setInterval(() => {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }, 3000);



// PROJECT PAGE
document.querySelectorAll(".project-slider").forEach((slider) => {
  const slides = slider.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  };

  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  }
});

// MOBILE NAV
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


// Certiface zoom

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("certificateModal");
  const modalImg = modal.querySelector(".certificate-modal-img");
  const closeBtn = modal.querySelector(".certificate-close");

  // Open modal on image click
  document.querySelectorAll(".zoomable-certificate").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // prevent background scroll
    });
  });

  // Close modal (X button)
  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("active");
    modalImg.src = "";
    document.body.style.overflow = "";
  }
});

// PROJECT MODAL

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  const modalImg = modal.querySelector(".project-modal-img");
  const closeBtn = modal.querySelector(".project-close");
  const nextBtn = modal.querySelector(".project-nav.next");
  const prevBtn = modal.querySelector(".project-nav.prev");

  const images = Array.from(document.querySelectorAll(".zoomable-project"));
  let currentIndex = 0;

  function openModal(index) {
    currentIndex = index;
    modalImg.src = images[currentIndex].src;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openModal(index));
  });

  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});
