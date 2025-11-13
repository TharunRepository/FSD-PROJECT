// set year
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile toggle */
(function(){
  const btn = document.getElementById('mobile-toggle');
  const menu = document.getElementById('primary-menu');
  btn.addEventListener('click', ()=> {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
})();

// hero.js — accessible slider with autoplay, controls, dots and pause-on-hover/offscreen
(function () {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.slider-control.prev');
  const nextBtn = slider.querySelector('.slider-control.next');
  let dotsWrap = slider.querySelector('.slider-dots');

  let current = slides.findIndex(s => s.getAttribute('aria-hidden') === 'false');
  if (current < 0) current = 0;

  const intervalMs = Math.max(0, Number(slider.dataset.interval) || 4000);
  let timer = null;
  let isPaused = false;
  let isVisible = true; // controlled by IntersectionObserver

  // create dots if not present or empty
  if (!dotsWrap) {
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'slider-dots';
    slider.appendChild(dotsWrap);
  }
  if (dotsWrap.children.length === 0) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.setAttribute('data-index', String(i));
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
  }

  const dots = Array.from(dotsWrap.children);

  function updateUI() {
    slides.forEach((s, i) => {
      const active = i === current;
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
      // add a helper class to animate content separately if needed
      s.classList.toggle('is-active', active);

      // reveal inner hero-content after slide becomes active for a nicer effect
      const content = s.querySelector('.hero-content');
      if (content) {
        content.classList.toggle('is-active', active);
        if (active) content.setAttribute('aria-hidden', 'false');
        else content.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goTo(index, userTriggered = false) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    updateUI();
    if (userTriggered) restartTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // autoplay
  function startTimer() {
    if (timer || intervalMs <= 0) return;
    timer = setInterval(() => {
      if (!isPaused && isVisible) next();
    }, intervalMs);
  }
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function restartTimer() { stopTimer(); startTimer(); }

  // controls
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartTimer(); });

  // pause on hover/focus
  slider.addEventListener('mouseenter', () => { isPaused = true; });
  slider.addEventListener('mouseleave', () => { isPaused = false; });
  slider.addEventListener('focusin', () => { isPaused = true; });
  slider.addEventListener('focusout', () => { isPaused = false; });

  // keyboard navigation (left/right)
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); restartTimer(); }
    if (e.key === 'ArrowRight') { next(); restartTimer(); }
  });

  // pause when not visible (saves CPU)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.target === slider) {
          isVisible = en.isIntersecting;
        }
      });
    }, { threshold: 0.15 });
    io.observe(slider);
  }

  // init
  updateUI();
  startTimer();

  // expose methods for debugging if needed
  slider._sliderAPI = { goTo, next, prev, startTimer, stopTimer, restartTimer };
})();


  // create dots
  slides.forEach((s,i)=>{
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label','Go to slide ' + (i+1));
    d.addEventListener('click', ()=> { reset(); goTo(i); });
    dotsWrap.appendChild(d);
  });

  // prev/next
  slider.querySelector('.prev')?.addEventListener('click', ()=> { reset(); goTo((current-1+slides.length)%slides.length); });
  slider.querySelector('.next')?.addEventListener('click', ()=> { reset(); goTo((current+1)%slides.length); });

  function start(){
    timer = setInterval(()=> {
      goTo((current+1)%slides.length);
    }, interval);
  }
  function reset(){
    clearInterval(timer);
    start();
  }

  // init
  goTo(0);
  start();

  // pause on hover/focus for accessibility
  [slider, ...slides].forEach(el => {
    el.addEventListener('mouseenter', ()=> clearInterval(timer));
    el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', ()=> clearInterval(timer));
    el.addEventListener('focusout', start);
  });

})();

/* Scroll reveal (simple) */
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

   // Reveal on scroll (IntersectionObserver)
    (function(){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            // optionally unobserve to avoid repeated triggers:
            io.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});

      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    })();

    // Optional: basic keyboard focus support for program cards (adds focus outline)
    (function(){
      document.addEventListener('keydown', (e)=>{
        if(e.key === 'Tab') document.body.classList.add('user-is-tabbing');
      });
    })();
  </script>