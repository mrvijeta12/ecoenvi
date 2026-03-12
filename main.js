//! add navbar to all page
document.addEventListener("DOMContentLoaded", () => {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");

  if (navbarPlaceholder) {
    fetch("nav.html")
      .then((res) => res.text())
      .then((data) => {
        navbarPlaceholder.innerHTML = data;

        // 2. NOW look for the elements because they finally exist in the DOM
        const menu = document.getElementById("mobile-menu");
        const open = document.getElementById("open-icon");
        const close = document.getElementById("close-icon");
        const links = document.querySelectorAll(".nav-links");
        const currentPath = window.location.pathname;

        links.forEach((link) => {
          if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
          }
        });

        if (open && menu) {
          open.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("-translate-x-full");
            console.log("Menu toggled!");
          });
        }
        document.addEventListener("click", (e) => {
          if (!menu.contains(e.target) || !open.contains(e.target)) {
            menu.classList.add("-translate-x-full");
          }
        });

        // Optional: If you have a separate close button
        // if (close && menu) {
        //   close.addEventListener("click", () => {
        //     menu.classList.add("hidden");
        //   });
        // }
      })
      .catch((err) => console.error("Error:", err));
  }
});

//! add footer
//! add navbar to all page
document.addEventListener("DOMContentLoaded", () => {
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch("footer.html")
      .then((res) => res.text())
      .then((data) => {
        footerPlaceholder.innerHTML = data;
      })
      .catch((err) => console.error("Error:", err));
  }
});
