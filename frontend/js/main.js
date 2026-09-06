/**
 * main.js — Substation Control System Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 0. BOOT SCREEN LOGIC ─── */
  const bootScreen = document.getElementById('boot-screen');
  const termTexts = document.querySelectorAll('.term-text');
  
  if (bootScreen) {
    // Animate terminal texts sequentially
    termTexts.forEach((text, index) => {
      setTimeout(() => {
        text.style.opacity = '1';
      }, index * 400 + 500); // 500ms delay before starting, 400ms between each
    });

    // Hide loader after texts finish (total ~2.5s)
    setTimeout(() => {
      bootScreen.classList.add('fade-out');
      setTimeout(() => {
        bootScreen.style.display = 'none';
      }, 1000); // Wait for CSS transition
    }, 3500); 
  }

  /* ─── 1. NAVBAR (Hamburger) ─── */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  /* ─── 2. TYPED TEXT EFFECT (Terminal Booting) ─── */
  const typedTextEl = document.getElementById('typed-text');
  const titles = [
    'ELECTRICAL ENGINEER',
    'WEB DEVELOPER',
    'ROBOTICS ENTHUSIAST',
    'SYSTEM INTEGRATOR'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if(!typedTextEl) return;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  setTimeout(type, 1000); // Start after 1s delay

  /* ─── 3. LIVE GRID FREQUENCY SIMULATOR ─── */
  const liveFreqEl = document.getElementById('live-freq');
  if(liveFreqEl) {
    setInterval(() => {
      // Fluctuate around 50.00 Hz (e.g. 49.95 to 50.05)
      const fluctuation = (Math.random() * 0.1) - 0.05;
      const freq = (50.00 + fluctuation).toFixed(2);
      liveFreqEl.textContent = `${freq} Hz`;
    }, 2000);
  }

  /* ─── 4. ELECTRICAL ARC CANVAS (Hero Section) ─── */
  const arcCanvas = document.getElementById('arc-canvas');
  if (arcCanvas) {
    const ctx = arcCanvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
      width = arcCanvas.width = arcCanvas.offsetWidth;
      height = arcCanvas.height = arcCanvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawLightning() {
      // Fade previous frames slightly instead of fully clearing for a glowing trail
      ctx.fillStyle = 'rgba(0, 5, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      // Only draw lightning 2.5% of the frames for slightly faster intermittent lightning
      if (Math.random() > 0.975) {
        
        // Straight jagged lightning (Reverted style but bolder)
        ctx.beginPath();
        let x = Math.random() * width;
        let y = 0;
        ctx.moveTo(x, y);

        while (y < height) {
          x += (Math.random() - 0.5) * 80;
          y += Math.random() * 50 + 20;
          ctx.lineTo(x, y);
        }
        
        // Outer Glow (Fast GPU simulated glow)
        ctx.strokeStyle = `rgba(0, 243, 255, 0.15)`;
        ctx.lineWidth = 15;
        ctx.stroke();

        // Mid Core
        ctx.strokeStyle = `rgba(0, 243, 255, 0.8)`;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Bright Inner Core
        ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      requestAnimationFrame(drawLightning);
    }
    drawLightning();
  }

  /* ─── 5. OSCILLOSCOPE CANVAS (Projects Section) ─── */
  const oscCanvases = document.querySelectorAll('.oscilloscope-canvas');
  oscCanvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let offset = Math.random() * 100;
    const freq = Math.random() * 0.05 + 0.02;
    const amp = canvas.height / 3;
    const midY = canvas.height / 2;

    function drawWave() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for (let i = 0; i < canvas.width; i += 5) {
        ctx.lineTo(i, midY + Math.sin(i * freq + offset) * amp);
      }
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      offset += 0.1;
      requestAnimationFrame(drawWave);
    }
    drawWave();
  });

  /* ─── 6. CONTACT FORM SUBMISSION ─── */
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;
      const btn = document.getElementById('btn-submit');

      // Basic validation
      if (!name || !email || !message) {
        formResponse.innerHTML = '<span class="response-error">> ERROR: MISSING_DATA_PAYLOAD</span>';
        return;
      }

      btn.textContent = 'TRANSMITTING...';
      btn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, subject: 'Grid Comm Link' })
        });

        const data = await response.json();

        if (response.ok) {
          formResponse.innerHTML = '<span class="response-success">> SUCCESS: SIGNAL_RECEIVED. AWAIT_REPLY.</span>';
          contactForm.reset();
        } else {
          formResponse.innerHTML = `<span class="response-error">> ERROR: ${data.error || 'TRANSMISSION_FAILED'}</span>`;
        }
      } catch (err) {
        console.error(err);
        formResponse.innerHTML = '<span class="response-error">> CRITICAL: CONNECTION_LOST</span>';
      } finally {
        btn.textContent = 'DISPATCH SIGNAL ⚡';
        btn.disabled = false;
      }
    });
  }

  /* ─── 7. FOOTER YEAR ─── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ─── 9. ELECTRIC CURSOR LOGIC ─── */
  // Only add custom cursor on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('electric-cursor');
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.classList.add('electric-cursor-follower');
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let lastSparkTime = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Throttle spark creation to maintain 120 FPS
      const now = performance.now();
      if (now - lastSparkTime > 50 && Math.random() > 0.5) { // Max 20 sparks/sec
        createSpark(mouseX, mouseY);
        lastSparkTime = now;
      }
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.2;
      followerY += (mouseY - followerY) * 0.2;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactives = document.querySelectorAll('a, button, input, textarea, .breaker-switch');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
    });

    function createSpark(x, y) {
      const spark = document.createElement('div');
      spark.classList.add('spark');
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);
      document.body.appendChild(spark);
      
      setTimeout(() => spark.remove(), 500);
    }

    document.addEventListener('click', (e) => {
      for(let i=0; i<8; i++) {
        createSpark(e.clientX, e.clientY);
      }
    });
  }
});

/* ─── 8. CIRCUIT BREAKER TOGGLE LOGIC ─── */
// Global function to be called from inline onclick in HTML
window.toggleBreaker = function(element) {
  element.classList.toggle('active');
  const mainBus = document.getElementById('main-bus');
  
  // Optional logic: if all breakers are off, power down the bus
  const activeBreakers = document.querySelectorAll('.breaker-unit.active');
  if(activeBreakers.length === 0) {
    mainBus.classList.remove('live');
  } else {
    mainBus.classList.add('live');
  }
};
