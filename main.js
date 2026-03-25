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

//! contact form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact_form");
  const submitBtn = document.getElementById("submit");
  if (!form || !submitBtn) return;
  const email = form.querySelector('input[name="email"]');
  function isValid(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  function clearError() {
    document.getElementById("captcha-error").innerText = "";
  }

  // set email in localstorage along with time
  function setEmailCoolDown(email) {
    email = email.toLowerCase().trim();
    let coolDownData = {};
    try {
      coolDownData = JSON.parse(localStorage.getItem("ecoEmailCoolDown")) || {};
    } catch (error) {
      coolDownData = {};
    }
    coolDownData[email] = Date.now();
    localStorage.setItem("ecoEmailCoolDown", JSON.stringify(coolDownData));
  }
  // get email in localstorage along with time
  function isEmailCooldownActive(email) {
    email = email.toLowerCase().trim();

    let coolDownData = {};
    try {
      coolDownData = JSON.parse(localStorage.getItem("ecoEmailCoolDown")) || {};
    } catch (error) {
      coolDownData = {};
    }
    const lastSubmissionTime = coolDownData[email];
    if (!lastSubmissionTime) {
      return false;
    }
    const currentTime = Date.now();
    const coolDownPeriod = 24 * 60 * 60 * 1000; // 1000 is millisecond

    return currentTime - lastSubmissionTime < coolDownPeriod; // return true/false
  }

  //! submit form
  async function submitLead() {
    const formData = new FormData(form);
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    try {
      const res = await fetch("api/web-lead-submission.php", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Network response failed");
      }
      const text = await res.text();
      // console.log(text);
      const data = JSON.parse(text);

      if (data.error) {
        showToast(data.error, "error");
        submitBtn.disabled = false;
        return;
      }

      if (data.success) {
        let setEmailValue = email.value;
        setEmailCoolDown(setEmailValue);
        showToast("Your query has been submitted successfully!", "success");
        form.reset();
        grecaptcha.reset();
      } else {
        showToast(data.message || "Submission failed", "error");
      }
    } catch (error) {
      console.error(error.message);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();
    let getEmailValue = email.value;
    if (!isValid(getEmailValue)) {
      showToast("Please enter a valid email", "error");
      return;
    }

    if (isEmailCooldownActive(getEmailValue)) {
      showToast(
        "Your query is already submitted. We will reach out to you within 24 hours.",
        "error",
      );
      form.reset();
      grecaptcha.reset();
      return;
    }

    const captcha = grecaptcha.getResponse();
    if (!captcha) {
      document.getElementById("captcha-error").innerText =
        "Please complete the captcha.";
      return;
    }
    await submitLead();
  });
});
