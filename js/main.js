(function () {
  'use strict';
  var CFG = window.NEOFLIP || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // contatos a partir do config.js
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = CFG[el.dataset.cfg] || '';
    if (!v || v.charAt(0) === '[') { el.textContent = v ? v.replace(/^\[|\]$/g, '') + ' (a definir)' : 'a definir'; el.classList.add('pl'); }
    else el.textContent = v;
  });
  document.getElementById('yr').textContent = new Date().getFullYear();

  // navegacao
  var nav = document.getElementById('nav'), burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // contadores
  function count(el) {
    var to = +el.dataset.count; if (reduce || to === 0) { el.textContent = to; return; }
    var t0 = null; el.textContent = '0';
    (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1100, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }); }, { threshold: 0.6 }) : null;
  document.querySelectorAll('[data-count]').forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.dataset.count); });

  // abas da plataforma
  var tabs = document.querySelectorAll('.tabs [role=tab]'), panels = document.querySelectorAll('.panel');
  function select(name) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.tab === name); });
    panels.forEach(function (p) { p.classList.toggle('on', p.id === 'p-' + name); });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.dataset.tab); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (n === null) return; n = (n + tabs.length) % tabs.length; tabs[n].focus(); select(tabs[n].dataset.tab);
    });
  });

  // rede animada (canvas)
  function network(canvas, density) {
    if (!canvas || reduce) return;
    var ctx = canvas.getContext('2d'), pts = [], W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), raf, vis = true;
    function size() {
      var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(W * H / density); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: 1 + Math.random() * 2 });
    }
    function draw() {
      if (vis) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var a = pts[i]; a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          for (var j = i + 1; j < pts.length; j++) {
            var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 150) { ctx.strokeStyle = 'rgba(160,210,255,' + (0.22 * (1 - d / 150)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
          ctx.fillStyle = 'rgba(200,235,255,.55)'; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(canvas);
  }
  network(document.getElementById('net'), 16000);
  network(document.getElementById('net2'), 20000);


  // seletor de necessidade
  (function () {
    var names = { finops: ['FinOps Performance', 'Gestão de FinOps em empresas', 'finops'], strategy: ['Cloud Strategy', 'Plano estratégico de cloud corporativa', 'strategy'], ccoe: ['CCoE Launchpad', 'Estruturação do Cloud Center of Excellence', 'ccoe'], resilience: ['Resilience by Design', 'Modelo de resiliência aplicacional', 'resilience'], okr: ['OKR & KPI Drive', 'Gestão ágil por indicadores', 'okr'], platform: ['NeoFlip FinOps Platform', 'Plataforma SaaS de FinOps multicloud (demo)', 'platform'] };
    var boxes = document.querySelectorAll('.opts input'), list = document.getElementById('resList'), empty = document.getElementById('resEmpty'), cta = document.getElementById('resCta');
    if (!boxes.length) return;
    function update() {
      var score = {};
      boxes.forEach(function (b) { if (b.checked) b.value.split(',').forEach(function (k) { score[k] = (score[k] || 0) + 1; }); });
      var keys = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
      list.innerHTML = '';
      keys.forEach(function (k) {
        var n = names[k], li = document.createElement('li');
        li.innerHTML = '<img src="img/ic-' + n[2] + '-w.png" alt="" width="38" height="38"><span>' + n[0] + '<small>' + n[1] + '</small></span>';
        list.appendChild(li);
      });
      empty.hidden = keys.length > 0; cta.hidden = keys.length === 0;
      document.querySelectorAll('.svc[data-s]').forEach(function (c) { c.classList.toggle('rec', !!score[c.dataset.s]); });
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
  })();

  // formulario: abre o e-mail do cliente (sem back-end)
  var form = document.getElementById('form'), msg = document.getElementById('fmsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.className = 'fmsg';
    var f = new FormData(form), nome = (f.get('nome') || '').trim(), email = (f.get('email') || '').trim();
    if (!nome || !/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = 'Informe seu nome e um e-mail válido.'; msg.className = 'fmsg err'; return; }
    var to = CFG.email || '';
    if (!to || to.charAt(0) === '[') { msg.textContent = 'Obrigado! O canal de e-mail da NeoFlip ainda está sendo configurado; tente novamente em breve.'; return; }
    var body = 'Nome: ' + nome + '\nEmpresa: ' + (f.get('empresa') || '') + '\nE-mail: ' + email + '\n\n' + (f.get('msg') || '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Demonstração NeoFlip') + '&body=' + encodeURIComponent(body);
    msg.textContent = 'Abrindo o seu aplicativo de e-mail para concluir o envio.';
  });
})();
