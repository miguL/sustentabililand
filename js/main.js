(function () {
  var b = document.querySelector('.burger'), n = document.getElementById('nav'), h = document.querySelector('.topbar');
  b.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    b.setAttribute('aria-expanded', open);
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('menu-open'); b.setAttribute('aria-expanded', false); }
  });
  var onScroll = function () { h.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.getElementById('ano').textContent = new Date().getFullYear();
  // Validação do formulário de orçamento
  var EN = document.documentElement.lang.indexOf('en') === 0;
  var T = EN ? {
    nome: 'Please enter your name.', telVazio: 'Please enter a phone number.',
    tel: 'Invalid number (e.g. 912 345 678 or +44 7700 900123).', email: 'Invalid email (e.g. name@example.com).', envio: 'Sending…'
  } : {
    nome: 'Indique o seu nome.', telVazio: 'Indique um número de telefone.',
    tel: 'Número inválido (ex.: 912 345 678 ou +44 7700 900123).', email: 'Email inválido (ex.: nome@exemplo.pt).', envio: 'A enviar…'
  };
  var f = document.getElementById('form-orcamento');
  if (f) {
    var nome = f.querySelector('#f-nome'), tel = f.querySelector('#f-tel'), mail = f.querySelector('#f-email');
    var emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    var normTel = function (v) { return v.replace(/[\s.\-()]/g, '').replace(/^00/, '+'); };
    var rules = {
      'f-nome': function (v) { return v.trim().length >= 2 ? '' : T.nome; },
      'f-tel': function (v) {
        var t = normTel(v);
        if (!t) return T.telVazio;
        if (/^(\+351)?[29]\d{8}$/.test(t)) return '';
        if (/^\+(?!351)\d{7,14}$/.test(t)) return '';
        return T.tel;
      },
      'f-email': function (v) { v = v.trim(); return !v || emailRe.test(v) ? '' : T.email; }
    };
    var check = function (el) {
      var msg = rules[el.id](el.value);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      el.closest('.field').classList.toggle('has-error', !!msg);
      document.getElementById(el.getAttribute('aria-describedby')).textContent = msg;
      return !msg;
    };
    [nome, tel, mail].forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    });
    f.addEventListener('submit', function (e) {
      var ok = [nome, tel, mail].map(check).every(Boolean);
      if (!ok) { e.preventDefault(); f.querySelector('[aria-invalid="true"]').focus(); return; }
      tel.value = normTel(tel.value);
      mail.value = mail.value.trim();
      var btn = f.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = T.envio;
    });
  }
  // Mapa: só carrega o Google Maps depois de um clique (sem cookies antes disso)
  var mapa = document.getElementById('mapa'), mapaBtn = document.getElementById('mapa-btn');
  if (mapa && mapaBtn) {
    mapaBtn.addEventListener('click', function () {
      var i = document.createElement('iframe');
      i.src = mapa.getAttribute('data-src'); i.title = mapa.getAttribute('data-title');
      i.loading = 'lazy'; i.allowFullscreen = true; i.referrerPolicy = 'no-referrer-when-downgrade';
      mapa.innerHTML = ''; mapa.appendChild(i);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.section__head, .card, .step, .gallery__item, .about__text, .about__media, .zone > *, .contact > *, .faq__item').forEach(function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }
})();
