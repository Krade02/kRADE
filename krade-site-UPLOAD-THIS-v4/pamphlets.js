/* =====================================================================
   KRADE portfolio, part 2: the "Extra reading" pamphlets and their viewer.
   Plain JavaScript, no build step, no libraries.

   TO EDIT THE CONTENT: change the PAMPHLETS list just below.
   Rule used here: only claim what a visitor can check on this site. Each
   pamphlet has an `evidence` line saying exactly what exists. Update it
   when you publish a workbook, SQL file or notebook.
   Statuses: 'live', 'practising', 'learning', 'next'.
   ===================================================================== */
(() => {
  'use strict';

  const STATUS = { live: 'Live', practising: 'Practising', learning: 'Learning', next: 'Up next' };
  const LIST_LABEL = {
    live: 'WHAT THIS STAGE INVOLVES',
    practising: 'WHAT THIS STAGE INVOLVES',
    learning: 'WHAT THIS STAGE INVOLVES',
    next: 'THE PLAN',
  };

  /* ---------- PAMPHLETS: one entry per image in /assets ---------- */
  const PAMPHLETS = [
    {
      id: 'collect', kicker: 'STAGE 01', title: 'Collect', status: 'practising', span: 4, tilt: -1.2,
      alt: 'Hand-drawn survey sheets with filled and empty answer circles and a pencil lying across them.',
      text: 'Before any chart there is a survey. The café study uses a 1–5 rating, a 0–10 recommend score and one main theme per answer, so each response is quick to give and easy to count.',
      list: [
        'Questions that take one tap to answer',
        'Recording visit type and time of day so groups can be compared',
        'Saying clearly when answers are generated, not real',
      ],
      evidence: 'The dataset (360 rows) can be downloaded. It is synthetic, generated for an imaginary café.',
      action: { label: 'Download the dataset', href: 'data/survey.csv', download: true },
      ask: 'About the Collect pamphlet: ',
    },
    {
      id: 'clean', kicker: 'STAGE 02', title: 'Clean', status: 'next', span: 4, tilt: 0.9,
      alt: 'A hand-drawn table with a blue header row, a few smudged cells and an eraser in the corner.',
      text: 'Real data arrives with gaps, duplicates and typos. This is the next project: take a messy public dataset, fix it in the open and leave the original untouched.',
      list: [
        'Choose a public dataset with real mess in it',
        'Check missing values, duplicates and impossible values first',
        'Keep a change log so every fix can be explained',
      ],
      evidence: 'Not started yet. Nothing is published for this stage.',
      action: null,
      ask: 'About the Clean pamphlet (a messy dataset I could try): ',
    },
    {
      id: 'measure', kicker: 'STAGE 03', title: 'Measure', status: 'live', span: 4, tilt: -0.7,
      alt: 'A hand-drawn bar chart with five blue bars and a magnifying glass over the last one.',
      text: '“Satisfied” is the share of answers rated 4 or 5. Net promoter score is the share scoring 9–10 minus the share scoring 0–6 on the recommend question.',
      list: [
        'Comparing groups instead of trusting one overall average',
        'A marker at week 8, when the queue system changed',
        'Saying “too few answers” when a view has fewer than 12',
      ],
      evidence: 'The explorer in the project section calculates both measures live, and shows the arithmetic.',
      action: { label: 'Open the live explorer', href: '#work' },
      ask: 'About the Measure pamphlet: ',
    },
    {
      id: 'say', kicker: 'STAGE 04', title: 'Say it', status: 'practising', span: 5, tilt: 1.1,
      alt: 'Two hand-drawn speech bubbles, one grey and one blue, with a small dark heart above them.',
      text: 'A number only matters if someone can act on it. Each view of the explorer ends in one plain sentence, with the limits of the data stated beside it.',
      list: [
        'One finding per view, in plain words',
        'Stating the limits: synthetic data, small samples, no proof of cause',
        'Writing for someone who has never seen the spreadsheet',
      ],
      evidence: 'Every explorer view ends with a one-sentence finding. The limits are written in “How the numbers were made”.',
      action: { label: 'See a finding in context', href: '#work' },
      ask: 'About the Say it pamphlet: ',
    },
    {
      id: 'cover', kicker: 'THE RESULT', title: 'The dashboard', status: 'live', span: 7, tilt: -0.8,
      alt: 'A hand-drawn dashboard window with a big blue number 73, a rising line chart, four bars and a bulleted list.',
      text: 'Everything on one screen: a headline number, the trend over twelve weeks, the themes people raised and a one-sentence finding. The 73 in this drawing matches the real overall figure: 264 of 360 answers rated 4 or 5.',
      list: [
        'A headline number first',
        'A trend with a reference point',
        'A written finding that updates with the filters',
      ],
      evidence: 'The explorer in the project section is the working version. AI assistants helped write its code.',
      action: { label: 'Open the live explorer', href: '#work' },
      ask: 'About the dashboard: ',
    },
    {
      id: 'sheet', kicker: 'TOOL', title: 'Spreadsheets', status: 'practising', span: 6, tilt: 0.8,
      alt: 'A hand-drawn spreadsheet grid with a blue header row and one highlighted cell.',
      text: 'Where much analysis starts: sorting, filtering, pivoting and checking totals by hand. The café dataset opens in any spreadsheet.',
      list: [
        'Pivot tables to compare groups',
        'Checking a chart’s totals by hand',
        'One row per response, one clear header per column',
      ],
      evidence: 'No workbook is published yet. You can reproduce the 73% yourself with the formula in “How the numbers were made”.',
      action: { label: 'See how 73% is made', href: '#homework' },
      ask: 'About the Spreadsheets pamphlet: ',
    },
    {
      id: 'sql', kicker: 'TOOL', title: 'SQL', status: 'learning', span: 6, tilt: -1,
      alt: 'A hand-drawn notebook page with a blue binding strip and lines of notes, two of them highlighted.',
      text: 'Asking a table questions in code: filter, group, count and compare. I am at the beginning of learning it.',
      list: [
        'SELECT, WHERE and ORDER BY',
        'GROUP BY to compare groups',
        'Joins, which come later (the data is one table, so none yet)',
      ],
      evidence: 'Five practice queries on the café data are published: see “The SQL I ran” under the project, or data/queries.sql.',
      action: null,
      ask: 'About the SQL pamphlet: ',
    },
  ];

  /* ===================== helpers ===================== */
  const $ = (s, r = document) => r.querySelector(s);
  const byId = new Map(PAMPHLETS.map((p) => [p.id, p]));

  function h(tag, props = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const thumb = (p, sizes) =>
    h('img', {
      src: `assets/thumbs/${p.id}.jpg`,
      srcset: `assets/thumbs/${p.id}.jpg 720w, assets/${p.id}.jpg 1600w`,
      sizes, alt: p.alt, width: 1600, height: 1000, loading: 'lazy', decoding: 'async',
    });

  const pill = (status) => h('span', { class: 'pill', 'data-s': status, text: STATUS[status] });
  const isPaused = () => document.documentElement.classList.contains('paused');

  /* "opened" ticks are remembered on this device only; if storage is blocked we keep them in memory */
  const KEY = 'krade-pamphlets-seen';
  const seen = new Set();
  try { JSON.parse(localStorage.getItem(KEY) || '[]').forEach((id) => byId.has(id) && seen.add(id)); } catch (e) { /* storage unavailable */ }
  const saveSeen = () => { try { localStorage.setItem(KEY, JSON.stringify([...seen])); } catch (e) { /* ignore */ } };

  /* ===================== the collapsed section ===================== */
  const extra = $('#pamphlets');
  const openExtra = () => { if (extra && !extra.open) extra.open = true; };

  /* ===================== pamphlet board ===================== */
  const board = $('#pam-board');
  const filtersHost = $('#pam-filters');
  const resultEl = $('#pam-result');
  const seenEl = $('#seen-count');
  let filter = 'all';

  const cards = new Map();
  PAMPHLETS.forEach((p, i) => {
    const btn = h('button', { type: 'button', class: 'pam__btn', 'data-open': p.id },
      thumb(p, '(max-width: 600px) 90vw, (max-width: 850px) 45vw, 40vw'),
      h('span', { class: 'pam__cap' },
        h('span', { class: 'pam__kicker' }, h('span', { text: `${String(i + 1).padStart(2, '0')} / ${p.kicker}` })),
        h('span', { class: 'pam__title', text: p.title }),
        h('span', { class: 'pam__foot' }, pill(p.status), h('span', { class: 'pam__open', text: 'OPEN ↗' }))));
    const li = h('li', { class: 'pam' + (p.span >= 6 ? ' pam--wide' : '') }, btn);
    li.style.setProperty('--span', p.span);
    li.style.setProperty('--tilt', p.tilt + 'deg');
    board.append(li);
    cards.set(p.id, li);

    /* gentle 3D tilt that follows the mouse; off when motion is paused */
    btn.addEventListener('pointermove', (e) => {
      if (isPaused() || e.pointerType !== 'mouse') return;
      const b = btn.getBoundingClientRect();
      btn.style.setProperty('--ry', (((e.clientX - b.left) / b.width) - 0.5) * 7 + 'deg');
      btn.style.setProperty('--rx', (0.5 - ((e.clientY - b.top) / b.height)) * 7 + 'deg');
    });
    btn.addEventListener('pointerleave', () => { btn.style.removeProperty('--rx'); btn.style.removeProperty('--ry'); });
  });

  function refreshSeen() {
    cards.forEach((li, id) => li.classList.toggle('is-seen', seen.has(id)));
    seenEl.textContent = `${seen.size} / ${PAMPHLETS.length} OPENED`;
  }

  const visibleIds = () => PAMPHLETS.filter((p) => filter === 'all' || p.status === filter).map((p) => p.id);

  function applyFilter() {
    const ids = new Set(visibleIds());
    const filtered = filter !== 'all';
    PAMPHLETS.forEach((p) => {
      const li = cards.get(p.id);
      li.hidden = !ids.has(p.id);
      li.style.setProperty('--span', filtered ? 4 : p.span);
      li.classList.toggle('pam--wide', !filtered && p.span >= 6);
    });
    resultEl.textContent = filtered ? `SHOWING ${ids.size} OF ${PAMPHLETS.length}` : '';
  }

  ['all', 'live', 'practising', 'learning', 'next'].forEach((key) => {
    const count = key === 'all' ? PAMPHLETS.length : PAMPHLETS.filter((p) => p.status === key).length;
    const label = key === 'all' ? 'All' : STATUS[key];
    const chip = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(key === filter), text: `${label} (${count})` });
    chip.addEventListener('click', () => {
      filter = key;
      filtersHost.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      applyFilter();
    });
    filtersHost.append(chip);
  });

  /* ===================== viewer ===================== */
  const viewer = $('#viewer');
  const v = {
    img: $('#v-img'), cap: $('#v-cap'), kicker: $('#v-kicker'), title: $('#v-title'), status: $('#v-status'),
    text: $('#v-text'), listLabel: $('#v-list-label'), list: $('#v-list'), evidence: $('#v-evidence'),
    live: $('#v-live'), liveText: $('#v-live-text'), ask: $('#v-ask'), prev: $('#v-prev'), next: $('#v-next'), count: $('#v-count'),
  };
  let order = PAMPHLETS.map((p) => p.id);
  let current = null;

  function setHash(id) {
    try { history.replaceState(null, '', id ? `#pamphlet-${id}` : location.pathname + location.search); } catch (e) { /* sandboxed */ }
  }

  function show(id) {
    const p = byId.get(id);
    if (!p) return;
    current = id;
    const n = PAMPHLETS.indexOf(p) + 1;
    v.img.src = `assets/${p.id}.jpg`;
    v.img.alt = p.alt;
    v.cap.textContent = `PAMPHLET ${String(n).padStart(2, '0')} / ${PAMPHLETS.length} · HAND-DRAWN`;
    v.kicker.textContent = p.kicker;
    v.title.textContent = p.title;
    v.status.textContent = STATUS[p.status];
    v.status.dataset.s = p.status;
    v.text.textContent = p.text;
    v.listLabel.textContent = LIST_LABEL[p.status];
    v.list.replaceChildren(...p.list.map((t) => h('li', { text: t })));
    v.evidence.textContent = p.evidence;

    if (p.action) {
      v.live.hidden = false;
      v.liveText.textContent = p.action.label;
      v.live.setAttribute('href', p.action.href);
      if (p.action.download) v.live.setAttribute('download', ''); else v.live.removeAttribute('download');
    } else {
      v.live.hidden = true;
    }
    const idx = order.indexOf(id);
    v.count.textContent = `${idx + 1} / ${order.length}`;
    v.prev.disabled = order.length < 2;
    v.next.disabled = order.length < 2;

    if (!seen.has(id)) { seen.add(id); saveSeen(); refreshSeen(); }
    setHash(id);
  }

  function open(id) {
    if (!byId.has(id)) return;
    const vis = visibleIds();
    order = vis.includes(id) ? vis : PAMPHLETS.map((p) => p.id);
    show(id);
    if (!viewer.open) {
      if (typeof viewer.showModal === 'function') viewer.showModal(); else viewer.setAttribute('open', '');
      document.body.classList.add('modal-open');
    }
  }

  function step(dir) {
    const i = order.indexOf(current);
    show(order[(i + dir + order.length) % order.length]);
    viewer.scrollTop = 0;
  }

  /* start a message to Pradip about the pamphlet being viewed */
  function startMessage(topic, starter) {
    const sel = $('#question-topic');
    const msg = $('#question-message');
    if (!sel || !msg) return;
    if ([...sel.options].some((o) => o.value === topic)) sel.value = topic;
    const cur = msg.value.trim();
    msg.value = cur ? `${cur}\n\n${starter}` : starter;
    msg.dispatchEvent(new Event('input', { bubbles: true }));
    $('#contact').scrollIntoView({ block: 'start' });
    $('#question-status').textContent = 'Message started. Finish it, add your name and email, then press Prepare email.';
    setTimeout(() => {
      msg.focus({ preventScroll: true });
      msg.setSelectionRange(msg.value.length, msg.value.length);
    }, 400);
  }

  viewer.addEventListener('close', () => { document.body.classList.remove('modal-open'); setHash(null); });
  $('#v-close').addEventListener('click', () => viewer.close());
  v.prev.addEventListener('click', () => step(-1));
  v.next.addEventListener('click', () => step(1));
  v.live.addEventListener('click', () => viewer.close());
  v.ask.addEventListener('click', () => {
    const p = byId.get(current);
    viewer.close();
    startMessage('A question about your work', p.ask);
  });
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  /* anything with data-open="id" opens that pamphlet; links to #pamphlets open the section */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open]');
    if (t) { openExtra(); open(t.getAttribute('data-open')); return; }
    const a = e.target.closest('a[href="#pamphlets"]');
    if (a) openExtra();
  });

  function fromHash() {
    if (location.hash === '#pamphlets') openExtra();
    const m = /^#pamphlet-([a-z]+)$/.exec(location.hash);
    if (m && byId.has(m[1])) { openExtra(); open(m[1]); }
  }
  window.addEventListener('hashchange', fromHash);

  /* ===================== go ===================== */
  applyFilter();
  refreshSeen();
  fromHash();
})();
