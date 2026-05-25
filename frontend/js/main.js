/**
 * main.js — Frontend JavaScript for Portfolio Website
 * ====================================================
 * This file handles ALL interactive behaviour on the page.
 *
 * Sections:
 *  1. Navbar — scroll effect + mobile hamburger menu
 *  2. Typed Text Effect — animates the hero title
 *  3. Scroll Animations — fade-in elements using IntersectionObserver
 *  4. Skill Bars — animate progress bars when visible
 *  5. Active Nav Link — highlights the nav link for the current section
 *  6. Contact Form — validates + sends data to the backend API
 *  7. Footer Year — sets the current year automatically
 *
 * HOW THE FRONTEND CONNECTS TO THE BACKEND:
 *  The contact form (Section 6) uses the browser's built-in fetch() API
 *  to send a POST request to:
 *      POST /api/contact
 *  The backend (backend/routes/contact.js) handles this request,
 *  validates the data, and saves it to backend/data/messages.json.
 *  The backend returns a JSON response which is displayed to the user.
 */

/* ─── Wait for the DOM to fully load before running any JavaScript ─────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════
     1. NAVBAR — Scroll effect + Mobile hamburger toggle
  ══════════════════════════════════════════════════════════ */

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  /**
   * When user scrolls down more than 50px, add the 'scrolled' class
   * to the navbar. CSS then applies a blurred dark background.
   */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /**
   * Hamburger button toggles the mobile nav menu open/closed.
   * CSS uses the 'open' class to slide the menu in from the right.
   */
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  /**
   * Close the mobile menu when any nav link is clicked.
   */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });


  /* ══════════════════════════════════════════════════════════
     2. TYPED TEXT EFFECT — Cycles through job titles in the hero
  ══════════════════════════════════════════════════════════ */

  const typedTextEl = document.getElementById('typed-text');
  // List of titles to cycle through
  const titles = [
    'Electrical Engineering Student',
    'Beginner Web Developer',
    'IoT & Robotics Enthusiast',
    'B.Tech 3rd Year Student'
  ];

  let titleIndex  = 0;  // Which title we're currently typing
  let charIndex   = 0;  // Which character we're at
  let isDeleting  = false;

  /**
   * type()
   * Recursively types and deletes each title character by character.
   */
  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      // Remove one character
      typedTextEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typedTextEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine typing speed
    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
      // Finished typing — pause then start deleting
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next title
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  // Start the typing effect
  type();


  /* ══════════════════════════════════════════════════════════
     3. SCROLL ANIMATIONS — Fade elements in as they enter view
  ══════════════════════════════════════════════════════════ */

  /**
   * IntersectionObserver watches all elements with class 'fade-in'.
   * When they scroll into view (>15% visible), it adds 'visible' class.
   * CSS transitions handle the actual animation (opacity + translateY).
   */
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing after animating (no need to re-animate)
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15  // 15% of the element must be visible to trigger
  });

  fadeElements.forEach(el => fadeObserver.observe(el));


  /* ══════════════════════════════════════════════════════════
     4. SKILL BARS — Animate the width when skills section is visible
  ══════════════════════════════════════════════════════════ */

  const skillFills = document.querySelectorAll('.skill-fill');

  /**
   * Each .skill-fill element has a 'data-width' attribute (e.g. data-width="90").
   * When it becomes visible, we set its CSS width to that value,
   * triggering the CSS transition that animates the bar growing.
   */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        entry.target.style.width = targetWidth + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => skillObserver.observe(bar));


  /* ══════════════════════════════════════════════════════════
     5. ACTIVE NAV LINK — Highlights the correct nav link on scroll
  ══════════════════════════════════════════════════════════ */

  const sections = document.querySelectorAll('section[id]');

  /**
   * As the user scrolls, check which section is currently in view.
   * Add 'active' class to the matching nav link.
   */
  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;  // offset for fixed navbar
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });


  /* ══════════════════════════════════════════════════════════
     6. CONTACT FORM — Validate and send data to the backend API
  ══════════════════════════════════════════════════════════ */

  const contactForm    = document.getElementById('contact-form');
  const btnSubmit      = document.getElementById('btn-submit');
  const formResponse   = document.getElementById('form-response');

  // Field error elements
  const errorName      = document.getElementById('error-name');
  const errorEmail     = document.getElementById('error-email');
  const errorMessage   = document.getElementById('error-message');

  /**
   * validateForm()
   * Checks that all required fields are filled with valid values.
   * Returns true if valid, false otherwise.
   * Shows inline error messages next to each field.
   */
  function validateForm(name, email, message) {
    let isValid = true;

    // Clear previous errors
    errorName.textContent    = '';
    errorEmail.textContent   = '';
    errorMessage.textContent = '';

    if (!name.trim()) {
      errorName.textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errorEmail.textContent = 'Please enter your email.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errorEmail.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!message.trim()) {
      errorMessage.textContent = 'Please enter your message.';
      isValid = false;
    }

    return isValid;
  }

  /**
   * showResponse(message, type)
   * Shows the success or error message below the submit button.
   * type should be 'success' or 'error'.
   */
  function showResponse(message, type) {
    formResponse.textContent  = message;
    formResponse.className    = `form-response ${type}`;
    // Scroll to show the message
    formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Contact Form submit handler.
   *
   * HOW THIS CONNECTS TO THE BACKEND:
   *  1. We prevent the default HTML form submission.
   *  2. We collect the form values.
   *  3. We validate them on the frontend first.
   *  4. We call fetch('/api/contact') with a POST request.
   *     - The URL '/api/contact' is handled by backend/routes/contact.js
   *     - Express routes this to the POST handler there.
   *  5. If the backend responds with success, we clear the form.
   *  6. If something goes wrong, we show the error message.
   */
  contactForm.addEventListener('submit', async (event) => {
    // Prevent the browser from submitting the form the old-fashioned way
    event.preventDefault();

    // Collect field values
    const name    = document.getElementById('contact-name').value;
    const email   = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    // Frontend validation — stop if invalid
    if (!validateForm(name, email, message)) return;

    // Show loading state on the button
    btnSubmit.textContent = 'Sending... ⏳';
    btnSubmit.disabled    = true;
    formResponse.className = 'form-response'; // hide previous response

    try {
      /**
       * fetch() sends an HTTP POST request to the backend.
       * The body is a JSON string with the form data.
       * Content-Type header tells the backend to parse it as JSON.
       */
      const response = await fetch('/api/contact', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ name, email, subject, message })
      });

      // Parse the JSON response from the backend
      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Success: show success message and reset the form
        showResponse(data.message || 'Message sent successfully!', 'success');
        contactForm.reset();
      } else {
        // ❌ Server returned an error (e.g. validation failed)
        showResponse(data.error || 'Something went wrong. Please try again.', 'error');
      }

    } catch (networkError) {
      // ❌ Network error (e.g. server not running)
      console.error('Network error:', networkError);
      showResponse('Could not connect to the server. Please make sure the backend is running.', 'error');
    } finally {
      // Restore the button regardless of outcome
      btnSubmit.textContent = 'Send Message 🚀';
      btnSubmit.disabled    = false;
    }
  });


  /* ══════════════════════════════════════════════════════════
     7. FOOTER YEAR — Auto-update the copyright year
  ══════════════════════════════════════════════════════════ */

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

}); // end DOMContentLoaded
