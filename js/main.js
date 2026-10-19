document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Logo slots: show a text fallback until the logo files exist ---------- */
  document.querySelectorAll('.brand').forEach(brand => {
    const img = brand.querySelector('img');
    if (!img) return;
    const useFallback = () => brand.classList.add('no-logo');
    img.addEventListener('error', useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  /* ---------- Nav: border on scroll + active link ---------- */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('main section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 8);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    hamburger.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  }
  hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Work filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects   = document.querySelectorAll('.project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      projects.forEach(card => {
        card.hidden = !(filter === 'all' || card.dataset.cat === filter);
      });
    });
  });

  /* ---------- Contact form: opens the visitor's email app with the message ready ---------- */
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const TO     = 'eclipsebymjh@gmail.com';

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      status.textContent = '';

      let firstInvalid = null;
      form.querySelectorAll('[required]').forEach(field => {
        const empty = !field.value.trim() ||
          (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value.trim()));
        field.setAttribute('aria-invalid', String(empty));
        const err = document.getElementById(field.id + 'Error');
        if (err) err.textContent = empty ? (field.type === 'email' ? 'Enter a valid email address.' : 'This field is required.') : '';
        if (empty && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      const v = id => form.elements[id].value.trim();
      const service = v('service');
      const subject = 'Project enquiry' + (service ? ': ' + service : '');
      const body = v('message') + '\n\n' + v('firstName') + ' ' + v('lastName') + '\n' + v('email');

      window.location.href = 'mailto:' + TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      status.textContent = 'Your email app should open with the message ready to send. If it doesn\u2019t, write to ' + TO + '.';
    });

    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.setAttribute('aria-invalid', 'false');
        const err = document.getElementById(field.id + 'Error');
        if (err) err.textContent = '';
      });
    });
  }
});
