/* =========================================================
   Bursdagsgave til Isabella
   ---------------------------------------------------------
   VIL DU ENDRE TEKSTEN? Gjør det her under. Emojiene kan
   fjernes eller byttes. Resten trenger du ikke røre.
   ========================================================= */
const TEKST = {
  skjerm1: "gratulerer med 21-årsdagen, isabella 🎂",
  skjerm2: "jeg har en liten overraskelse til deg... vil du se? 👀",
  skjerm3: "trykk på kaka for å åpne gaven din 🎁",
  skjerm4: "gå i kjelleren og let etter denne 📦",
  skjerm4_liten: "(den ekte gaven ligger gjemt inni 🤍)",
  brev: "Gratulerer med dagen, min kjære Isabella. " +
        "Du gjør verden min lysere bare ved å være i den. " +
        "Jeg er så utrolig heldig som har deg – nå, alltid og for alltid. 🤍",
  te: "ikke vær en så seriøs te ☕",
  te_drukket: "sånn ja. litt mindre seriøs allerede ☺️",
};

/* ---- PÅSKEEGG-tekster – bytt til dine egne ord ---- */
// Snoopy sier en tilfeldig av disse når man trykker på ham 2 ganger:
const SNOOPY_REPLIKKER = ["au!", "slutt då 🙄", "kos meg", "mer kake?", "hei isabella"];
// «en grunn til»-knappen på siste skjerm går gjennom disse, én per trykk:
const GRUNNER = [
  "fordi du alltid får meg til å le",
  "fordi du alltid holder ut med meg",
  "du gjør meg lykkelig",
  "du er en goofball",
  "du alltid er med på ting",
  "du er alltid der for meg",
  "du er vakker",
  "du lukter vondt hele tiden",
];

/* skrivehastighet i millisekunder per bokstav (lavere = raskere) */
const SKRIVEFART = 30;

/* ========================================================= */

// legg teksten inn i sidene
document.querySelector('[data-screen="1"] .line').dataset.text = TEKST.skjerm1;
document.querySelector('[data-screen="2"] .line').dataset.text = TEKST.skjerm2;
document.querySelector('[data-screen="3"] .line').dataset.text = TEKST.skjerm3;
document.querySelector('[data-screen="4"] .line').dataset.text = TEKST.skjerm4;
document.querySelector('[data-screen="4"] .subtle').textContent = TEKST.skjerm4_liten;
document.querySelector('[data-screen="5"] .line').dataset.text = TEKST.brev;
document.querySelector('#teaScreen .line').dataset.text = TEKST.te;

// te-skjermen er et påskeegg og teller ikke som en vanlig skjerm
const screens = [...document.querySelectorAll('.screen:not(#teaScreen)')];
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;

/* ---------- stjerner ---------- */
const starWrap = document.getElementById('stars');
(function lagStjerner() {
  const farger = ['#8fc3e6', '#f4c95d', '#c9a8e0', '#f2a4b4', '#a9d3a0'];
  const antall = window.innerWidth < 600 ? 22 : 40;
  let html = '';
  for (let i = 0; i < antall; i++) {
    const size = 12 + Math.random() * 24;
    let x = Math.random() * 96;
    let y = Math.random() * 96;
    const midX = x > 24 && x < 76;
    const midY = y > 12 && y < 82;
    if (midX && midY) {
      if (Math.random() < 0.5) x = Math.random() < 0.5 ? Math.random() * 22 : 78 + Math.random() * 18;
      else y = Math.random() < 0.5 ? Math.random() * 10 : 84 + Math.random() * 12;
    }
    const rot = Math.random() * 360;
    const col = farger[i % farger.length];
    const delay = (Math.random() * 4).toFixed(2);
    const outline = Math.random() < 0.3;
    const sparkle = Math.random() < 0.45;
    const star = outline
      ? `<path d="M12 1.5l2.9 6.6 7.1.7-5.3 4.8 1.5 7-6.2-3.6L5.8 21.6l1.5-7L2 9.8l7.1-.7z" fill="none" stroke="${col}" stroke-width="2"/>`
      : `<path d="M12 1.5l2.9 6.6 7.1.7-5.3 4.8 1.5 7-6.2-3.6L5.8 21.6l1.5-7L2 9.8l7.1-.7z" fill="${col}"/>`;
    const dot = sparkle ? `<circle cx="22" cy="3" r="1.6" fill="${col}"/>` : '';
    html += `<svg width="${size}" height="${size}" viewBox="0 0 26 26" data-star
      style="left:${x}vw;top:${y}vh;transform:rotate(${rot}deg);animation-delay:${delay}s">
      ${star}${dot}</svg>`;
  }
  starWrap.innerHTML = html;
})();

/* #5 – trykk på en stjerne: den sprekker og en ny dukker opp. */
document.addEventListener('click', e => {
  if (lightbox && !lightbox.hidden) return;
  const stars = starWrap.querySelectorAll('svg[data-star]');
  for (const st of stars) {
    if (st.dataset.done) continue;
    const r = st.getBoundingClientRect();
    if (e.clientX >= r.left - 6 && e.clientX <= r.right + 6 &&
        e.clientY >= r.top - 6 && e.clientY <= r.bottom + 6) {
      popStar(st);
      break;
    }
  }
});

function popStar(st) {
  st.dataset.done = '1';
  st.style.animation = 'none';
  requestAnimationFrame(() => {
    st.style.transformOrigin = 'center';
    st.style.animation = 'star-pop 0.55s ease forwards';
  });
  setTimeout(() => respawnStar(st), 600);
}

function respawnStar(st) {
  let x = Math.random() * 92, y = Math.random() * 92;
  if (x > 24 && x < 76 && y > 12 && y < 82) y = Math.random() < 0.5 ? Math.random() * 10 : 84 + Math.random() * 12;
  st.style.animation = '';
  st.style.left = x + 'vw';
  st.style.top = y + 'vh';
  st.style.transform = `rotate(${Math.random() * 360}deg)`;
  delete st.dataset.done;
}

/* ---------- skrivemaskin ---------- */
function typeLine(el, done) {
  const text = el.dataset.text || '';
  el.textContent = '';
  el.classList.remove('done');
  if (prefersReduced) {
    el.textContent = text;
    el.classList.add('done');
    if (done) done();
    return;
  }
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, SKRIVEFART);
    } else {
      el.classList.add('done');
      if (done) done();
    }
  })();
}

/* ---------- bytte skjerm ---------- */
function goTo(index) {
  if (index < 0 || index >= screens.length) return;
  screens[current].classList.remove('is-active');
  current = index;
  const screen = screens[current];
  screen.classList.add('is-active');

  if (current === 1 && typeof resetShy === 'function') resetShy();

  const line = screen.querySelector('.line');
  const revealAfter = screen.querySelectorAll('.btn, .choices, .cake-btn, .box, .subtle');
  revealAfter.forEach(n => (n.style.visibility = 'hidden'));

  if (line) {
    typeLine(line, () => revealAfter.forEach(n => (n.style.visibility = 'visible')));
  } else {
    revealAfter.forEach(n => (n.style.visibility = 'visible'));
  }

  if (current === screens.length - 1) startFinale();
}

/* «neste»-knapper */
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => goTo(current + 1));
});

/* kake-knapp på skjerm 3 */
document.getElementById('cakeBtn').addEventListener('click', () => {
  burstConfetti(18);
  setTimeout(() => goTo(current + 1), 350);
});

/* ---------- te-skjerm (påskeegg hvis man virkelig sier nei) ---------- */
const teaScreen = document.getElementById('teaScreen');

function showTea() {
  screens[current].classList.remove('is-active');
  teaScreen.classList.add('is-active');
  const line = teaScreen.querySelector('.line');
  const after = teaScreen.querySelectorAll('.btn, .teacup');
  after.forEach(n => (n.style.visibility = 'hidden'));
  typeLine(line, () => after.forEach(n => (n.style.visibility = 'visible')));
}

teaScreen.querySelector('[data-tea-continue]').addEventListener('click', () => {
  teaScreen.classList.remove('is-active');
  goTo(2); // videre til overraskelsen likevel (skjerm 3)
});

/* ---------- sky «nei takk»-knapp ---------- */
let resetShy;
(function shyButton() {
  const btn = document.getElementById('shyBtn');
  const MAX = 3;
  let dodges = 0;

  resetShy = function () {
    dodges = 0;
    btn.style.transform = '';
    btn.textContent = 'nei takk.';
  };

  function flee() {
    dodges++;
    const dx = (Math.random() - 0.5) * 200;
    const dy = Math.random() * 70 + 6;
    btn.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 22}deg)`;
    if (dodges === 2) btn.textContent = 'nei da...';
    if (dodges === 3) btn.textContent = 'er du sikker? :(';
    if (dodges > MAX) { btn.style.transform = 'rotate(-2deg)'; btn.textContent = '...greit. trykk igjen'; }
  }

  btn.addEventListener('mouseenter', () => { if (dodges <= MAX) flee(); });
  btn.addEventListener('click', e => {
    if (dodges <= MAX) { e.preventDefault(); flee(); }
    else { showTea(); }
  });
})();

/* ---------- finale: brev + konfetti ---------- */
let finaleStarted = false;
let finaleWired = false;
function startFinale() {
  if (finaleStarted) return;
  finaleStarted = true;
  const replay = document.getElementById('replayBtn');
  const btns = document.querySelector('.finale-btns');
  const hint = document.getElementById('confettiHint');
  const letterText = document.querySelector('[data-screen="5"] .line');

  // vent til skrivemaskinen er ferdig (den starter i goTo)
  const check = setInterval(() => {
    if (letterText.classList.contains('done')) {
      clearInterval(check);
      burstConfetti(60);
      gjorHjerteKlikkbart(letterText); // #4
      btns.hidden = false;
      hint.hidden = false;
    }
  }, 200);

  if (finaleWired) return;
  finaleWired = true;

  replay.addEventListener('click', () => {
    finaleStarted = false;
    document.getElementById('reasonText').hidden = true;
    grunnIdx = 0;
    goTo(0);
  });

  // #7 – «en grunn til»
  document.getElementById('reasonBtn').addEventListener('click', visNesteGrunn);

  document.addEventListener('click', e => {
    if (current === screens.length - 1 && !e.target.closest('button, .photo, .heart-btn, svg[data-star], .deco')) {
      burstConfetti(20, e.clientX, e.clientY);
    }
  });
}

/* #7 – vis neste grunn */
let grunnIdx = 0;
function visNesteGrunn() {
  const el = document.getElementById('reasonText');
  el.hidden = false;
  el.textContent = GRUNNER[grunnIdx % GRUNNER.length];
  el.style.animation = 'none';
  requestAnimationFrame(() => (el.style.animation = 'fade-in-soft 0.25s ease both'));
  grunnIdx++;
  document.getElementById('reasonBtn').textContent =
    grunnIdx >= GRUNNER.length ? 'en gang til 🤍' : 'en grunn til 🤍';
}

/* #4 – gjør 🤍 i brevet klikkbart: banker + hjerter flyter opp */
function gjorHjerteKlikkbart(letterEl) {
  if (letterEl.querySelector('.heart-btn')) return;
  const txt = letterEl.textContent;
  const m = txt.match(/(\s*[🤍❤️💗💛]+\s*)$/u);
  if (!m) return;
  letterEl.textContent = txt.slice(0, m.index);
  const span = document.createElement('span');
  span.className = 'heart-btn';
  span.textContent = m[1].trim();
  letterEl.appendChild(span);
  span.addEventListener('click', () => {
    span.classList.remove('beat');
    void span.offsetWidth;
    span.classList.add('beat');
    const r = span.getBoundingClientRect();
    for (let i = 0; i < 8; i++) flytHjerte(r.left + r.width / 2, r.top + r.height / 2);
  });
}

function flytHjerte(x, y) {
  const h = document.createElement('div');
  h.className = 'float-heart';
  h.textContent = ['🤍', '💗', '💛'][Math.floor(Math.random() * 3)];
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  document.body.appendChild(h);
  const dx = (Math.random() - 0.5) * 120;
  const dy = -(120 + Math.random() * 160);
  h.animate(
    [
      { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0 },
      { transform: `translate(calc(-50% + ${dx * 0.4}px), ${dy * 0.4}px) scale(1)`, opacity: 1, offset: 0.3 },
      { transform: `translate(calc(-50% + ${dx}px), ${dy}px) scale(0.8)`, opacity: 0 },
    ],
    { duration: 1500 + Math.random() * 700, easing: 'ease-out' }
  ).onfinish = () => h.remove();
}

/* ---------- konfetti ---------- */
function burstConfetti(n, originX, originY) {
  const farger = ['#e79a92', '#8fc7e8', '#f4c95d', '#9ccf9e', '#c9a3e0', '#f7a8c4'];
  for (let i = 0; i < n; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti';
    bit.style.background = farger[Math.floor(Math.random() * farger.length)];
    const startX = originX ?? Math.random() * window.innerWidth;
    const startY = originY ?? -12;
    bit.style.left = startX + 'px';
    bit.style.top = startY + 'px';
    bit.style.borderRadius = Math.random() < 0.5 ? '2px' : '50%';
    document.body.appendChild(bit);

    const dx = (Math.random() - 0.5) * 240;
    const dy = window.innerHeight * (0.6 + Math.random() * 0.5);
    const rot = (Math.random() - 0.5) * 720;
    bit.animate(
      [
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 1400 + Math.random() * 900, easing: 'cubic-bezier(.2,.6,.3,1)' }
    ).onfinish = () => bit.remove();
  }
}

/* ---------- #2 + #3: trykk på Snoopy / party-hatten ---------- */
document.querySelectorAll('.snoopy').forEach(sn => {
  let klikk = 0;
  sn.addEventListener('click', e => {
    const r = sn.getBoundingClientRect();
    const rx = (e.clientX - r.left) / r.width;
    const ry = (e.clientY - r.top) / r.height;
    // øvre venstre del = hatten → konfetti spretter ut
    if (ry < 0.30 && rx > 0.22 && rx < 0.60) {
      hattKonfetti(e.clientX, e.clientY);
      return;
    }
    // ellers teller vi klikk – 2 gir en snakkeboble
    klikk++;
    if (klikk >= 2) {
      klikk = 0;
      visSnakkeboble(sn);
    }
  });
});

function visSnakkeboble(sn) {
  const art = sn.closest('.art') || sn.parentElement;
  art.querySelectorAll('.speech').forEach(s => s.remove());
  const b = document.createElement('div');
  b.className = 'speech';
  b.textContent = SNOOPY_REPLIKKER[Math.floor(Math.random() * SNOOPY_REPLIKKER.length)];
  art.appendChild(b);
  setTimeout(() => { b.style.transition = 'opacity .3s'; b.style.opacity = '0'; }, 1800);
  setTimeout(() => b.remove(), 2200);
}

function hattKonfetti(x, y) {
  const farger = ['#8fc3e6', '#f4b6c6', '#f4c95d', '#a9d3a0', '#c9a8e0'];
  for (let i = 0; i < 16; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti';
    bit.style.background = farger[i % farger.length];
    bit.style.left = x + 'px';
    bit.style.top = y + 'px';
    bit.style.borderRadius = Math.random() < 0.5 ? '2px' : '50%';
    document.body.appendChild(bit);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const dist = 70 + Math.random() * 90;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    bit.animate(
      [
        { transform: 'translate(0,0)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.2}px, ${dy + 120}px)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
    ).onfinish = () => bit.remove();
  }
}

/* ---------- #8: forstørr bildene på skjerm 5 ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
document.querySelectorAll('.letter .photo').forEach(img => {
  img.addEventListener('click', ev => {
    ev.stopPropagation();
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.dataset.caption || '';
    lightbox.hidden = false;
  });
});
function lukkLightbox() { lightbox.hidden = true; lightboxImg.src = ''; }
document.getElementById('lightboxClose').addEventListener('click', lukkLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.tagName === 'FIGURE') lukkLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) lukkLightbox(); });

/* ---------- #10: drikk av te-koppen ---------- */
(function drikkTe() {
  const cup = document.getElementById('teacupSvg');
  const level = document.getElementById('teaLevel');
  const surface = document.getElementById('teaSurface');
  const steam = document.getElementById('teaSteam');
  const line = teaScreen.querySelector('.line');
  let sips = 0;
  function drikk() {
    if (sips >= 3) return;
    sips++;
    const y = sips >= 3 ? 150 : 52 + sips * 30;
    level.setAttribute('y', y);
    surface.setAttribute('cy', Math.max(57, y));
    surface.setAttribute('rx', Math.max(20, 52 - sips * 12));
    if (sips >= 3) {
      surface.style.opacity = '0';
      if (steam) steam.style.opacity = '0';
      line.textContent = TEKST.te_drukket;
      line.classList.add('done');
    }
  }
  cup.addEventListener('click', drikk);
  cup.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drikk(); } });
})();

/* ---------- start ---------- */
goTo(0);
