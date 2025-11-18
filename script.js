// script.js - Interactions for MilkUX portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  window.setTimeout(() => {
    if (preloader) preloader.style.opacity = 0;
    window.setTimeout(()=> preloader && preloader.remove(), 600);
  }, 800);

  // Set year in footers
  document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

  // Navbar toggle on small screens
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const navList = btn.closest('.nav').querySelector('.nav-list');
      navList.style.display = navList.style.display === 'flex' ? '' : 'flex';
    });
  });

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Theme toggle + persist
  const themeToggleButtons = document.querySelectorAll('#theme-toggle');
  const current = localStorage.getItem('milkux-theme') || 'dark';
  setTheme(current);
  themeToggleButtons.forEach(btn => btn.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    setTheme(next);
  }));

  function setTheme(mode){
    if (mode === 'light'){
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      localStorage.setItem('milkux-theme','light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      localStorage.setItem('milkux-theme','dark');
    }
  }

  // Intersection Observer for reveal animations
  const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => obs.observe(r));

  // Typing effect
  document.querySelectorAll('.typing').forEach(el => {
    const words = JSON.parse(el.getAttribute('data-words'));
    typingEffect(el, words, 1200);
  });

  function typingEffect(el, words, delay = 1500){
    let idx = 0, ch = 0, forward = true;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.style.marginLeft = '6px';
    cursor.style.color = 'var(--neon)';
    cursor.textContent = '|';
    el.appendChild(cursor);

    function step(){
      const word = words[idx];
      if (forward){
        ch++;
        el.childNodes[0] ? el.childNodes[0].nodeValue = word.slice(0,ch) : el.textContent = word.slice(0,ch);
        if (ch === word.length){
          forward = false;
          setTimeout(step, delay);
          return;
        }
      } else {
        ch--;
        el.childNodes[0] ? el.childNodes[0].nodeValue = word.slice(0,ch) : el.textContent = word.slice(0,ch);
        if (ch === 0){
          forward = true;
          idx = (idx + 1) % words.length;
        }
      }
      setTimeout(step, forward ? 80 : 40);
    }
    // initialize text node
    el.insertBefore(document.createTextNode(''), cursor);
    step();
  }

  // Carousel (projects)
  const carousel = document.getElementById('project-carousel');
  if (carousel){
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    let index = 0;
    const itemWidth = items[0].getBoundingClientRect().width + 16;

    function update(){
      track.style.transform = `translateX(-${index * itemWidth}px)`;
    }
    prev.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); });
    next.addEventListener('click', ()=>{ index = Math.min(items.length-1, index+1); update(); });

    // autoplay
    let auto = setInterval(()=>{ index = (index+1)%items.length; update(); }, 4500);
    carousel.addEventListener('mouseenter', ()=> clearInterval(auto));
    carousel.addEventListener('mouseleave', ()=> auto = setInterval(()=>{ index = (index+1)%items.length; update(); }, 4500));
    // responsive recalculation
    window.addEventListener('resize', ()=> window.location.reload());
  }

  // Contact form validation
  const form = document.getElementById('contact-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message){
        alert('Please complete all fields.');
        return;
      }
      if (!emailRE.test(email)){
        alert('Please provide a valid email address.');
        return;
      }

      // Simulate send
      setTimeout(()=> {
        alert('Terima kasih! Pesan telah terkirim.');
        form.reset();
      }, 450);
    });

    // input glow animation
    form.querySelectorAll('input,textarea').forEach(inp => {
      inp.addEventListener('focus', ()=> inp.style.boxShadow = '0 12px 40px rgba(155,77,255,0.12)');
      inp.addEventListener('blur', ()=> inp.style.boxShadow = '');
    });
  }

  // Smooth anchor behavior for nav (already via css) + offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // default smooth
    });
  });

  // Optional: keyboard accessibility for carousel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') document.querySelector('.carousel .prev')?.click();
    if (e.key === 'ArrowRight') document.querySelector('.carousel .next')?.click();
  });
});