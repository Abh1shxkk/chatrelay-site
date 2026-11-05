// ChatRelay landing page interactions
(() => {
  // Preview a stripe palette with ?palette=forest|plum|mono|sunset
  const pal = new URLSearchParams(location.search).get('palette');
  if (pal) document.documentElement.dataset.palette = pal;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header border on scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMobile');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // Generic tabs: [data-tabs] > [data-tab] buttons switch [data-panel] views (closest group only)
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const own = (sel) => [...group.querySelectorAll(sel)].filter((el) => el.closest('[data-tabs]') === group);
    const tabs = own('[data-tab]');
    const panels = own('[data-panel]');
    const acts = own('[data-act]');
    const select = (name) => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
      panels.forEach((p) => p.classList.toggle('on', p.dataset.panel === name));
      acts.forEach((a) => a.classList.toggle('on', a.dataset.act === name));
    };
    tabs.forEach((t) => t.addEventListener('click', () => { select(t.dataset.tab); group.dataset.touched = '1'; }));
    group._select = select;
    group._names = tabs.map((t) => t.dataset.tab);
  });

  // Hero mock: cycle panes until the visitor clicks a tab
  const stage = document.querySelector('.stage[data-tabs]');
  if (stage && !reduced) {
    let i = 0;
    const timer = setInterval(() => {
      if (stage.dataset.touched) return clearInterval(timer);
      i = (i + 1) % stage._names.length;
      stage._select(stage._names[i]);
    }, 5200);
  }

  // Hero status bar: uploading -> synced loop
  const state = document.getElementById('syncState');
  if (state && !reduced) {
    const synced = state.innerHTML;
    const uploading = '<svg class="ico spin"><use href="#i-loader"/></svg> Uploading 2 changes…';
    setInterval(() => {
      state.innerHTML = uploading;
      setTimeout(() => { state.innerHTML = synced; }, 1800);
    }, 7000);
  }

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { return; }
      const old = btn.innerHTML;
      btn.classList.add('done');
      btn.innerHTML = '<svg class="ico"><use href="#i-check"/></svg>';
      setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = old; }, 1400);
    });
  });

  // Deterministic pseudo-random numbers so the charts look the same on every visit
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  // Hero usage chart: 30 stacked bars by tool
  const bars = document.getElementById('heroBars');
  if (bars) {
    const tools = [['--c-claude', 0.55], ['--c-codex', 0.25], ['--c-cursor', 0.12], ['--c-kiro', 0.08]];
    for (let d = 0; d < 30; d++) {
      const weekend = d % 7 === 5 || d % 7 === 6;
      const total = weekend ? 8 + rnd() * 22 : 35 + rnd() * 65;
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${total}%`;
      const parts = tools.map(([c, share]) => [c, share * (0.7 + rnd() * 0.6)]);
      const sum = parts.reduce((a, [, v]) => a + v, 0);
      parts.forEach(([c, v]) => {
        const seg = document.createElement('i');
        seg.style.background = `var(${c})`;
        seg.style.height = `${(v / sum) * 100}%`;
        bar.appendChild(seg);
      });
      bars.appendChild(bar);
    }
  }

  // "When you work" heatmap: weekday x hour, busiest Thu 14:00
  const heat = document.getElementById('heat');
  if (heat) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach((day, di) => {
      const label = document.createElement('span');
      label.textContent = day;
      heat.appendChild(label);
      for (let h = 0; h < 24; h++) {
        const work = Math.exp(-((h - 14) ** 2) / 18) * 0.85 + Math.exp(-((h - 22) ** 2) / 6) * 0.35;
        const dayW = di >= 5 ? 0.35 : di === 3 ? 1 : 0.8;
        let v = Math.min(1, work * dayW * (0.75 + rnd() * 0.5));
        if (di === 3 && h === 14) v = 1;
        const cell = document.createElement('i');
        if (v > 0.08) cell.style.background = `rgba(33, 32, 28, ${(0.08 + v * 0.85).toFixed(2)})`;
        cell.title = `${day} ${String(h).padStart(2, '0')}:00`;
        heat.appendChild(cell);
      }
    });
  }

  // Floating download card: appears after the hero, can be closed
  const float = document.getElementById('float');
  let floatClosed = false;
  if (float) {
    document.getElementById('floatX').addEventListener('click', () => { floatClosed = true; float.classList.remove('on'); });
  }

  // Section ruler on the left rail
  const sheet = document.querySelector('.sheet');
  const sections = sheet ? [...sheet.querySelectorAll('.section')] : [];
  const ticks = document.createElement('div');
  ticks.className = 'ticks';
  ticks.setAttribute('aria-hidden', 'true');
  sections.forEach(() => ticks.appendChild(document.createElement('i')));
  document.body.appendChild(ticks);
  const onRail = () => {
    if (!sheet) return;
    const vh = window.innerHeight;
    const r = sheet.getBoundingClientRect();
    ticks.classList.toggle('on', r.top < vh * 0.3 && r.bottom > vh * 0.7);
    if (float) float.classList.toggle('on', !floatClosed && r.top < vh * 0.5 && r.bottom > vh);
    let active = 0;
    sections.forEach((s, n) => { if (s.getBoundingClientRect().top < vh * 0.5) active = n; });
    [...ticks.children].forEach((t, n) => t.classList.toggle('on', n === active));
  };
  onRail();
  window.addEventListener('scroll', onRail, { passive: true });
  window.addEventListener('resize', onRail);

  // ---- Hero heading: typed letter by letter at a human rhythm ----
  // Every letter of the phrase is already laid out (invisible), so the line never moves.
  // Typing fades letters in one at a time; the caret glides to the end of the last one.
  const typed = document.getElementById('typed');
  if (typed && !reduced) {
    const line = typed.closest('.type-line');
    const caret = line.querySelector('.type-caret');
    const phrases = ['on every PC.', 'in every tool.', 'in Claude Code.', 'in Codex.', 'on your phone.'];
    let p = 0;
    let n = 0;
    let chars = [];
    const lay = (text) => {
      typed.textContent = '';
      chars = [...text].map((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        typed.appendChild(s);
        return s;
      });
    };
    const place = () => {
      if (!chars.length) return;
      const box = line.getBoundingClientRect();
      const x = n > 0 ? chars[n - 1].getBoundingClientRect().right : chars[0].getBoundingClientRect().left;
      caret.style.transform = 'translateX(' + (x - box.left).toFixed(1) + 'px)';
    };
    const busy = (on) => line.classList.toggle('typing', on);
    const type = () => {
      chars[n].classList.add('on');
      n++;
      place();
      if (n >= chars.length) { busy(false); return setTimeout(erase, 2600); }
      const next = chars[n].textContent;
      const prev = chars[n - 1].textContent;
      let wait = 70 + Math.random() * 60;              // normal key rhythm
      if (prev === ' ') wait += 70;                    // small breath between words
      if (next === next.toUpperCase() && next !== next.toLowerCase()) wait += 50; // reaching for Shift
      if (Math.random() < 0.07) wait += 180;           // an occasional thinking pause
      setTimeout(type, wait);
    };
    const erase = () => {
      busy(true);
      n--;
      chars[n].classList.remove('on');
      place();
      if (n > 0) return setTimeout(erase, 36);
      setTimeout(() => {
        p = (p + 1) % phrases.length;
        lay(phrases[p]);
        place();
        setTimeout(type, 420);
      }, 260);
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      lay(phrases[0]);
      chars.forEach((c) => c.classList.add('on'));
      n = chars.length;
      line.classList.add('live');
      place();
      setTimeout(erase, 2600);
    });
    window.addEventListener('resize', place);
  }

  // ---- Hero: auto-sync story. The activity window narrates, the rows change status ----
  const log = document.getElementById('assistLog');
  if (log) {
    const stateEl = document.getElementById('assistState');
    const nowEl = document.getElementById('assistNow');
    const rows = {};
    document.querySelectorAll('[data-row]').forEach((r) => { rows[r.dataset.row] = r; });
    const initial = Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, r.querySelector('.rs').textContent]));
    const setRow = (k, text, flash = true) => {
      const rs = rows[k].querySelector('.rs');
      rs.textContent = text;
      rs.classList.toggle('busy', text.endsWith('…'));
      rs.classList.toggle('done', text === 'Synced');
      if (flash) { rows[k].classList.remove('flash'); void rows[k].offsetWidth; rows[k].classList.add('flash'); }
    };
    const say = (t) => {
      const p = document.createElement('p');
      p.textContent = t;
      log.appendChild(p);
      while (log.children.length > 5) log.firstChild.remove();
    };
    const steps = [
      { say: 'A Claude Code session ended in shop.', now: 'Checking what changed' },
      { row: 'a', status: 'Uploading…', say: 'Only the new lines travel: 14 lines, 6 KB.', now: 'Uploading to me/ai-history' },
      { say: 'Secret scan: 1 token found, redacted in the upload.', now: 'Uploading to me/ai-history' },
      { row: 'a', status: 'Synced', say: 'Uploaded as one commit.', now: 'Looking for new chats' },
      { row: 'b', status: 'Pulling…', say: 'New Codex thread from OFFICE-PC.', now: 'Backing up, then pulling' },
      { say: 'Rewrote 166 paths to D:\\work\\shop.', now: 'Writing the thread' },
      { row: 'b', status: 'Synced', say: 'Done. Run codex resume to continue.' },
    ];
    if (reduced) {
      steps.forEach((s) => { say(s.say); if (s.row) setRow(s.row, s.status, false); });
      stateEl.textContent = 'Done';
    } else {
      let i = 0;
      const tick = () => {
        if (i === 0) { log.textContent = ''; Object.keys(rows).forEach((k) => setRow(k, initial[k], false)); }
        const s = steps[i];
        say(s.say);
        if (s.row) setRow(s.row, s.status);
        nowEl.textContent = s.now || '';
        stateEl.textContent = s.now ? 'Working' : 'Done';
        i = (i + 1) % steps.length;
        setTimeout(tick, i === 0 ? 4500 : 1900);
      };
      tick();
    }
  }

  // ---- Sections: staggered lines, cycling highlights, counters ----
  // Terminal output and lists appear line by line when their block scrolls into view
  document.querySelectorAll('.term pre').forEach((pre) => {
    pre.innerHTML = pre.innerHTML.split('\n').map((l, n) => `<span class="ln" style="--i:${n}">${l || ' '}</span>`).join('\n');
  });
  document.querySelectorAll('.doc, .models tbody, .steps-list, .handled').forEach((box) => {
    [...box.children].forEach((el, n) => { el.classList.add('ln'); el.style.setProperty('--i', n); });
  });

  if (!reduced) {
    // [data-seq]: one item at a time gets the highlight class
    document.querySelectorAll('[data-seq]').forEach((box) => {
      const sel = box.dataset.seq;
      const cls = box.dataset.seqClass || 'hot';
      const list = sel ? [...box.querySelectorAll(sel)] : [...box.children];
      let n = list.findIndex((el) => el.classList.contains(cls));
      setInterval(() => {
        list.forEach((el) => el.classList.remove(cls));
        n = (n + 1) % list.length;
        list[n].classList.add(cls);
      }, 1700);
    });

    // [data-cycle="a|b|c"]: status text that changes
    document.querySelectorAll('[data-cycle]').forEach((el) => {
      const words = el.dataset.cycle.split('|');
      let n = 0;
      setInterval(() => { n = (n + 1) % words.length; el.textContent = words[n]; }, 2400);
    });

    // [data-auto] tab groups change tab by themselves until someone clicks
    document.querySelectorAll('[data-tabs][data-auto]').forEach((group) => {
      let n = 0;
      const timer = setInterval(() => {
        if (group.dataset.touched) return clearInterval(timer);
        if (!group.classList.contains('in')) return;
        n = (n + 1) % group._names.length;
        group._select(group._names[n]);
      }, 4800);
    });

    // Heatmap: a random busy hour lights up
    if (heat) {
      const cells = [...heat.querySelectorAll('i')].filter((c) => c.style.background);
      setInterval(() => {
        const c = cells[Math.floor(Math.random() * cells.length)];
        c.classList.add('ping');
        setTimeout(() => c.classList.remove('ping'), 900);
      }, 650);
    }

    // [data-count]: count up when first seen
    const counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          co.unobserve(e.target);
          const end = Number(e.target.dataset.count);
          const t0 = performance.now();
          const frame = (t) => {
            const p = Math.min(1, (t - t0) / 1200);
            e.target.textContent = Math.round(end * (1 - (1 - p) ** 3));
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        });
      });
      counters.forEach((c) => co.observe(c));
    }
  }

  // ---- Protection card: breathing chart, pipeline, event feed ----
  const feed = document.getElementById('feed');
  if (feed) {
    const card = document.getElementById('health');
    const pipe = [...document.querySelectorAll('#pipe > *')];
    const countEl = document.getElementById('healthCount');
    const pool = [
      ['eye', 'Upload from OFFICE-PC', 'Originals only read'],
      ['file', 'Pull into D:\\work\\shop', 'Dry run shown first'],
      ['merge', 'Changed on both PCs', 'Both kept'],
      ['key', 'Token found in a chat', 'Redacted'],
      ['pause', 'Codex is running', 'Skipped, retried later'],
      ['history', 'settings.json about to change', 'Backed up'],
      ['lock', 'Upload to GitHub', 'Encrypted'],
      ['branch', 'Public repository chosen', 'Refused'],
      ['shield', '.env value in a summary', 'Hidden'],
    ];
    let passed = 0;
    const add = (ev) => {
      const li = document.createElement('li');
      li.innerHTML = '<svg class="ico"><use href="#i-' + ev[0] + '"/></svg><span class="what">' + ev[1] + '</span><em class="chk busy">Checking…</em>';
      feed.prepend(li);
      while (feed.children.length > 6) feed.lastChild.remove();
      return li;
    };
    const resolve = (li, ev, counts) => {
      const em = li.querySelector('em');
      em.className = 'chk ok';
      em.textContent = ev[2];
      if (counts) countEl.textContent = String(++passed);
    };
    pool.slice(0, 5).forEach((ev) => resolve(add(ev), ev, false));

    // Chart: the line breathes slowly while the card is on screen
    const base = [[0, 92], [20, 93], [52, 89], [82, 75], [112, 77], [142, 85], [172, 86], [202, 78], [232, 68], [262, 70], [292, 71], [322, 75], [352, 66], [382, 52], [412, 53], [442, 55], [472, 55], [502, 44], [532, 30], [562, 33], [592, 38], [622, 40], [652, 32], [682, 19], [712, 23], [742, 25], [772, 24], [802, 17], [832, 9], [870, 11]];
    const lineEl = document.getElementById('healthLine');
    const areaEl = document.getElementById('healthArea');
    const dotEl = document.getElementById('healthDot');
    const draw = (t) => {
      const pts = base.map(([x, y], n) => [x, y + Math.sin(t / 1100 + n * 0.7) * 3 + Math.sin(t / 1900 + n * 1.3) * 2]);
      const d = 'M' + pts.map((q) => q[0] + ' ' + q[1].toFixed(1)).join(' L');
      lineEl.setAttribute('d', d);
      areaEl.setAttribute('d', d + ' L870 110 L0 110Z');
      dotEl.style.top = 'calc(' + (pts[pts.length - 1][1] / 110 * 100).toFixed(2) + '% - 4px)';
    };
    draw(0);

    if (reduced) {
      pipe.forEach((el) => el.classList.add('on'));
    } else {
      let visible = false;
      if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(card);
      const loop = (t) => { if (!visible) return; draw(t); requestAnimationFrame(loop); };
      let k = 5;
      setInterval(() => {
        if (!visible) return;
        const ev = pool[k++ % pool.length];
        const li = add(ev);
        pipe.forEach((el) => el.classList.remove('on'));
        pipe.forEach((el, n) => setTimeout(() => el.classList.add('on'), 90 * n + 60));
        setTimeout(() => resolve(li, ev, true), 90 * pipe.length + 260);
      }, 2400);
    }
  }

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  }
})();
