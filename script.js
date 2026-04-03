
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Reveal animations
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          const delay = Number(el.getAttribute("data-delay") || 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("in");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Smooth scroll for in-page links (non-reduced motion)
  if (!prefersReduced) {
    document.addEventListener("click", (e) => {
      const a = e.target instanceof Element ? e.target.closest("a[href^='#']") : null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!(target instanceof HTMLElement)) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // close mobile nav if open
      const nav = document.getElementById("navLinks");
      if (nav && nav.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler instanceof HTMLElement) toggler.click();
      }
    });
  }

  // Demo form validation (no backend)
  const form = document.getElementById("estimateForm");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) return;

      const btn = form.querySelector("button[type='submit']");
      if (btn instanceof HTMLButtonElement) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      window.setTimeout(() => {
        alert("Request sent (demo). If you want this to email you, tell me which service to use (Formspree / Netlify Forms / custom).");
        form.reset();
        form.classList.remove("was-validated");
        if (btn instanceof HTMLButtonElement) {
          btn.disabled = false;
          btn.textContent = "Send request";
        }
      }, 600);
    });
  }
})();
