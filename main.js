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
        // const currentPath = window.location.pathname;
        //! for github
        const currentPath = window.location.pathname.split("/").pop();
        links.forEach((link) => {
          const linkPath = link.getAttribute("href");

          if (linkPath === currentPath) {
            console.log("Matched:", linkPath);
            link.classList.add("active");
          }
        });

        // links.forEach((link) => {
        //   if (link.getAttribute("href") === currentPath) {
        //     console.log(link.getAttribute("href"));
        //     console.log(currentPath);
        //     link.classList.add("active");
        //   }
        // });

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

//! FAQ

let faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("faq-active");
  });
});

//! Toast
window.showToast = function (message, type = "success") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const color = type === "success" ? "text-green-700" : "text-red-700";

  const toast = document.createElement("div");
  toast.className = "mb-2";

  toast.innerHTML = `
    <div class="flex justify-between items-center bg-white  p-3 rounded shadow">
      <div class="mr-2  ${color}">${message}</div>
      <i class="fa-solid fa-xmark text-md cursor-pointer close-toast text-black"></i>
    </div>
  `;

  // add toast to page
  toastContainer.appendChild(toast);

  //  close button functionality
  toast.querySelector(".close-toast").addEventListener("click", () => {
    toast.remove();
  });

  setTimeout(() => toast.remove(), 4000);
};
