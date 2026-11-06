// Docs pages: theme, menu, table of contents, copy menu and search.
(() => {
  const $ = (id) => document.getElementById(id);
  const root = document.body.dataset.root;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  // Theme
  const applyTheme = (t) => {
    const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelectorAll('[data-theme-set]').forEach((b) => b.classList.toggle('on', b.dataset.themeSet === t));
  };
  applyTheme(store.get('chatrelay-docs-theme') || 'system');
  document.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => { store.set('chatrelay-docs-theme', b.dataset.themeSet); applyTheme(b.dataset.themeSet); }));

  // Mobile menu
  $('dMenu').addEventListener('click', () => { const open = $('dSide').classList.toggle('open'); $('dMenu').setAttribute('aria-expanded', String(open)); });

  // Code blocks
  document.querySelectorAll('.code-copy').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.closest('.code').querySelector('pre').innerText); b.textContent = 'Copied'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done'); }, 1300); } catch { b.textContent = 'Failed'; }
  }));

  // On this page: highlight the section being read
  const links = [...document.querySelectorAll('.d-toc a')];
  const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  if (heads.length) {
    const mark = () => {
      let cur = heads[0];
      for (const h of heads) if (h.getBoundingClientRect().top < 170) cur = h;
      links.forEach((a) => {
        const on = decodeURIComponent(a.hash.slice(1)) === cur.id;
        a.classList.toggle('on', on);
        if (on) { const box = a.parentElement; const top = a.offsetTop - box.offsetTop; if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 60) box.scrollTop = top - box.clientHeight / 2; }
      });
    };
    mark();
    addEventListener('scroll', mark, { passive: true });
  }

  // Reading progress, and the section ruler on the stripes
  const bar = $('dProgress');
  const sections = [...document.querySelectorAll('.d-doc h2, .cl-item')].slice(0, 26);
  const rail = document.createElement('div');
  rail.className = 'ticks on';
  rail.setAttribute('aria-hidden', 'true');
  sections.forEach((h) => { const t = document.createElement('i'); t.addEventListener('click', () => { if (h.tagName === 'DETAILS') h.open = true; h.scrollIntoView({ block: 'start' }); }); rail.appendChild(t); });
  if (sections.length > 1) document.body.appendChild(rail);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    let cur = -1;
    sections.forEach((h, i) => { if (!h.classList.contains('hide') && h.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
    [...rail.children].forEach((t, i) => t.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Blocks rise in as they scroll into view
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const blocks = [...document.querySelectorAll('.d-doc > *:not(h1):not(.d-lead), .cl-item, .d-pager')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -5% 0px' });
    blocks.forEach((b) => { b.classList.add('d-in'); io.observe(b); });
  }

  // Supported tools: filter the cards
  document.querySelectorAll('.t-filter button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.t-filter button').forEach((x) => x.classList.toggle('on', x === b));
    document.querySelectorAll('.t-card').forEach((c) => { c.classList.remove('d-in'); c.classList.toggle('hide', b.dataset.kind !== 'all' && c.dataset.kind !== b.dataset.kind); });
  }));

  // Changelog: filter, version chips, open all, and the line that fills as you read
  const cl = $('cl');
  if (cl) {
    const items = [...cl.querySelectorAll('.cl-item')];
    const find = $('clFind'), count = $('clCount'), all = $('clAll'), fill = $('clFill');
    let minor = 'all';
    const empty = document.createElement('p'); empty.className = 'cl-empty'; empty.textContent = 'No release matches that.'; empty.hidden = true; cl.appendChild(empty);
    const apply = () => {
      const terms = find.value.toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const it of items) {
        const ok = (minor === 'all' || it.dataset.minor === minor) && terms.every((t) => it.textContent.toLowerCase().includes(t));
        it.classList.toggle('hide', !ok);
        if (ok) { shown++; if (terms.length) it.open = true; }
      }
      count.textContent = shown === items.length ? `${shown} releases` : `${shown} of ${items.length} releases`;
      empty.hidden = shown > 0;
      paint(); onScroll();
    };
    const paint = () => {
      const r = cl.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * 0.45 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      items.forEach((it) => it.classList.toggle('seen', it.getBoundingClientRect().top < innerHeight * 0.45));
      all.textContent = items.filter((i) => !i.classList.contains('hide')).every((i) => i.open) ? 'Close all' : 'Open all';
    };
    find.addEventListener('input', apply);
    document.querySelectorAll('.cl-chips button').forEach((b) => b.addEventListener('click', () => {
      minor = b.dataset.minor;
      document.querySelectorAll('.cl-chips button').forEach((x) => x.classList.toggle('on', x === b));
      apply();
    }));
    all.addEventListener('click', () => { const open = all.textContent === 'Open all'; items.forEach((i) => { if (!i.classList.contains('hide')) i.open = open; }); paint(); });
    items.forEach((i) => i.addEventListener('toggle', paint));
    addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint);
    const hash = decodeURIComponent(location.hash.slice(1));
    const target = hash && document.getElementById(hash);
    if (target && target.tagName === 'DETAILS') { target.open = true; target.scrollIntoView(); }
    paint();
  }

  // Copy menu
  const pageMd = async () => (await fetch('index.md')).text();
  const copyBtn = $('dCopyPage'), pop = $('dPop'), more = $('dCopyMore');
  const copyPage = async () => {
    const label = copyBtn.querySelector('span');
    try { await navigator.clipboard.writeText(await pageMd()); label.textContent = 'Copied'; } catch { label.textContent = 'Failed'; }
    setTimeout(() => { label.textContent = 'Copy'; }, 1300);
  };
  const togglePop = (open) => { pop.hidden = !open; more.setAttribute('aria-expanded', String(open)); };
  copyBtn.addEventListener('click', copyPage);
  more.addEventListener('click', (e) => { e.stopPropagation(); togglePop(pop.hidden); });
  document.addEventListener('click', (e) => { if (!pop.contains(e.target)) togglePop(false); });
  const askAi = async (base) => {
    const w = open('about:blank', '_blank');
    const md = (await pageMd()).slice(0, 5000);
    const q = `I am reading the ChatRelay docs page "${document.body.dataset.title}". Help me with it.\n\n${md}`;
    const url = base + encodeURIComponent(q);
    if (w) { w.opener = null; w.location = url; } else location.href = url;
  };
  pop.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    togglePop(false);
    const act = b.dataset.act;
    if (act === 'copy') copyPage();
    if (act === 'chatgpt') askAi('https://chatgpt.com/?q=');
    if (act === 'claude') askAi('https://claude.ai/new?q=');
    if (act === 'pdf') print();
  });

  // Search
  const modal = $('dModal'), q = $('dQ'), results = $('dResults');
  let index = null, sel = 0;
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const openSearch = async () => {
    modal.hidden = false; q.value = ''; q.focus(); search();
    if (!index) { try { index = await (await fetch(`${root}docs/search.json`)).json(); search(); } catch { results.innerHTML = '<p>Search could not load.</p>'; } }
  };
  const closeSearch = () => { modal.hidden = true; };
  function search() {
    const terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!index || !terms.length) { results.innerHTML = terms.length ? '' : '<p>Type a few words: sync, Cursor CLI, backup…</p>'; return; }
    const hits = [];
    for (const p of index) {
      const text = p.text.toLowerCase(), title = p.title.toLowerCase();
      if (!terms.every((t) => text.includes(t) || title.includes(t))) continue;
      const head = p.heads.find((h) => terms.every((t) => h.text.toLowerCase().includes(t)));
      const at = text.indexOf(terms[0]);
      const start = Math.max(0, at - 50);
      let snip = esc(p.text.slice(start, start + 150));
      for (const t of terms) snip = snip.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), (m) => `<mark>${m}</mark>`);
      hits.push({ score: (terms.every((t) => title.includes(t)) ? 2 : 0) + (head ? 1 : 0), url: `${root}docs/${p.slug}/${head ? '#' + head.id : ''}`, title: head ? `${p.title} › ${head.text}` : p.title, group: p.group, snip });
    }
    hits.sort((a, b) => b.score - a.score);
    sel = 0;
    results.innerHTML = hits.length ? hits.slice(0, 12).map((h, i) => `<a href="${h.url}"${i ? '' : ' class="on"'}><b>${esc(h.title)}</b><small>${esc(h.group)}</small><small>…${h.snip}…</small></a>`).join('') : '<p>Nothing found.</p>';
  }
  q.addEventListener('input', search);
  $('dSearch').addEventListener('click', openSearch);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeSearch(); });
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
    if (modal.hidden) return;
    const items = [...results.querySelectorAll('a')];
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((a, i) => a.classList.toggle('on', i === sel));
      items[sel].scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && items[sel]) location.href = items[sel].href;
  });
})();
