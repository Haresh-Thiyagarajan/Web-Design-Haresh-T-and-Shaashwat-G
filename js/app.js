(function () {
  "use strict";

  const ENTRIES = window.ENTRIES || [];
  const SOURCES = window.SOURCES || {};
  const ICONS = window.ICONS || {};
  const page = document.body.dataset.page || "home";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (name, extra = "") =>
    `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { }
    }
  };

  const TYPES = {
    organization: { page: "organizations.html", label: "Organization", plural: "Organizations", icon: "building-2", blurb: "Local groups, nonprofits, and public agencies that serve Sammamish." },
    program: { page: "programs.html", label: "Program", plural: "Programs", icon: "users", blurb: "Ongoing activities you can join, for kids, teens, adults, and seniors." },
    service: { page: "services.html", label: "Service", plural: "Services", icon: "hand-heart", blurb: "Help you can get: counseling, legal advice, bill help, and more." },
    event: { page: "events.html", label: "Event", plural: "Events", icon: "calendar-days", blurb: "Upcoming community events and meetings, with the next date for each." },
    resource: { page: "resources.html", label: "Resource", plural: "Resources", icon: "book-open", blurb: "Crisis lines, parks and trails, food and shopping, and ways to volunteer." }
  };

  const NAV = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "organizations.html", label: "Organizations", key: "organization" },
    { href: "programs.html", label: "Programs", key: "program" },
    { href: "services.html", label: "Services", key: "service" },
    { href: "events.html", label: "Events", key: "event" },
    { href: "resources.html", label: "Resources", key: "resource" },
    { href: "sources.html", label: "Sources", key: "sources" },
    { href: "about.html", label: "About", key: "about" }
  ];

  const BRAND_MARK = `
    <svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs><clipPath id="bm-clip"><circle cx="24" cy="24" r="22"/></clipPath></defs>
      <g clip-path="url(#bm-clip)">
        <rect width="48" height="48" fill="#e3f1e8"/>
        <circle cx="11" cy="13" r="3.2" fill="#f2c14e"/>
        <path d="M2 32L14 19.5L20 25.5L29 10L46 32Z" fill="#5f9a7a"/>
        <path d="M29 10L25.1 16.5L27.2 15.2L29 17.8L31 15.2L34.3 16.6Z" fill="#fff"/>
        <path d="M13 20L9.8 26H11.6L8 32H18L14.4 26H16.2Z" fill="#15532f"/>
        <path d="M21 24.5L18.6 29H20L17.5 32H24.5L22 29H23.5Z" fill="#15532f"/>
        <rect y="32" width="48" height="16" fill="#1e6b45"/>
        <path d="M8 37q4-2.4 8 0t8 0 8 0 8 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M13 42q4-2.4 8 0t8 0 8 0" fill="none" stroke="#cfe8d8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
      </g>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="#1e6b45" stroke-width="1.8"/>
    </svg>`;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date(); today.setHours(0, 0, 0, 0);

  function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
  function inSeason(entry, d) {
    if (!entry.season) return true;
    const m = d.getMonth() + 1;
    return m >= entry.season.startMonth && m <= entry.season.endMonth;
  }
  function nextDate(entry) {
    if (entry.date) {
      const d = parseDate(entry.date);
      return d >= today ? { date: d } : null;
    }
    if (!entry.recur) return null;
    const outOfSeason = entry.season && !inSeason(entry, today);
    for (let i = 0; i < 400; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if (!entry.recur.weekdays.includes(d.getDay())) continue;
      if (entry.recur.nth && !entry.recur.nth.includes(Math.ceil(d.getDate() / 7))) continue;
      if (!inSeason(entry, d)) continue;
      return { date: d, seasonal: outOfSeason };
    }
    return null;
  }
  const fmtDate = (d) => `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  function dateBlock(n) {
    if (!n) return `<span class="date-block tba"><span class="m">Date</span><span class="d">TBA</span></span>`;
    if (n.seasonal) return `<span class="date-block tba"><span class="m">${MONTHS[n.date.getMonth()]}</span><span class="d">${n.date.getFullYear()}</span></span>`;
    return `<span class="date-block"><span class="m">${MONTHS[n.date.getMonth()]}</span><span class="d">${n.date.getDate()}</span></span>`;
  }
  function nextLabel(entry, n) {
    if (!n) return "Check the source for the next date";
    if (n.seasonal) return `Season returns ${MONTHS[n.date.getMonth()]} ${n.date.getFullYear()}`;
    return `Next: ${fmtDate(n.date)}${entry.recur && entry.recur.time ? ", " + entry.recur.time : ""}`;
  }

  function renderHeader() {
    const current = page === "home" ? "home" : page;
    const navItems = NAV.map((n) =>
      `<li><a href="${n.href}"${n.key === current ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
    const html = `
      <div class="topbar">
        <div class="wrap">
          <p class="topbar-help">${icon("life-buoy")}<span class="help-long">Need help now? Call or text <a href="tel:988">988</a> for crisis support, or dial <a href="tel:211">2-1-1</a> for local resources.</span><span class="help-short">Need help now? Call or text <a href="tel:988">988</a> or dial <a href="tel:211">2-1-1</a>.</span></p>
          <div class="tools" role="group" aria-label="Accessibility settings">
            <span class="tools-label">Text size</span>
            <button class="tool-btn" type="button" data-text-step="-1">A−<span class="visually-hidden"> smaller text</span></button>
            <button class="tool-btn" type="button" data-text-step="1">A+<span class="visually-hidden"> larger text</span></button>
            <button class="tool-btn" type="button" id="contrast-toggle" aria-pressed="false">${icon("contrast")}<span>High contrast</span></button>
          </div>
        </div>
      </div>
      <header class="site-header">
        <div class="header-main">
          <div class="wrap">
            <a class="brand" href="index.html">
              ${BRAND_MARK}
              <span class="brand-text"><span class="brand-name">Sammamish</span><span class="brand-sub">Community Resources</span></span>
            </a>
            <div class="header-actions">
              ${searchBox("header")}
              <button class="list-btn" type="button" id="open-list" aria-haspopup="dialog">
                ${icon("bookmark")}<span class="list-label">My List</span><span class="list-count" aria-label="items saved">0</span>
              </button>
            </div>
          </div>
        </div>
        <nav class="site-nav" aria-label="Main">
          <div class="wrap">
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list"><span>Menu</span>${icon("chevron-down")}</button>
            <ul class="nav-list" id="nav-list">${navItems}</ul>
          </div>
        </nav>
      </header>`;
    $("#site-header").outerHTML = html;
  }

  function searchBox(id, big = false) {
    return `
      <div class="site-search${big ? " hero-search" : ""}" data-search>
        <label class="visually-hidden" for="search-${id}">Search all community resources</label>
        ${icon("search")}
        <input class="search-input" id="search-${id}" type="search" autocomplete="off"
          placeholder="${big ? "Try “food” or “seniors”" : "Search resources"}"
          role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="results-${id}">
        <ul class="search-results" id="results-${id}" role="listbox" aria-label="Search results" hidden></ul>
      </div>`;
  }

  function renderFooter() {
    const html = `
      <footer class="site-footer">
        <div class="wrap footer-grid">
          <div>
            <div class="footer-brand">${BRAND_MARK}<span class="brand-name">Sammamish Community Resources</span></div>
            <p>One place to find organizations, programs, services, events, and resources in Sammamish, Washington.</p>
            <p>A student project, not an official City of Sammamish website.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>${NAV.slice(1, 6).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h2>About this site</h2>
            <ul>
              <li><a href="sources.html">Sources</a></li>
              <li><a href="about.html">About</a></li>
            </ul>
          </div>
          <div>
            <h2>Sammamish City Hall</h2>
            <p>801 228th Ave SE<br>Sammamish, WA 98075<br><a href="tel:+14252950500">(425) 295-0500</a><br>Mon–Fri, 8:30 am–5:00 pm</p>
          </div>
        </div>
        <div class="wrap footer-bottom">
          <p>Created by Haresh T and Shaashwat G for FBLA Website Design, 2026–2027.</p>
          <p>Information checked October 2026. Always confirm details with the organization.</p>
        </div>
      </footer>

      <dialog class="drawer" id="list-drawer" aria-labelledby="list-title">
        <div class="drawer-inner">
          <div class="drawer-head">
            <h2 id="list-title">My List</h2>
            <button class="icon-btn" type="button" id="close-list" aria-label="Close My List">${icon("x")}</button>
          </div>
          <div class="drawer-body" id="list-body"></div>
          <p class="visually-hidden" role="status" aria-live="polite" id="list-status"></p>
          <div class="drawer-foot">
            <button class="btn btn-primary" type="button" id="print-list">${icon("printer")}Print my list</button>
            <button class="btn btn-ghost" type="button" id="clear-list">${icon("trash-2")}Clear</button>
          </div>
        </div>
      </dialog>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div id="print-area" aria-hidden="true"></div>`;
    $("#site-footer").outerHTML = html;
  }

  function initPrefs() {
    const root = document.documentElement;
    let text = store.get("pref-text", 0);
    let contrast = store.get("pref-contrast", false);
    const apply = () => {
      if (text) root.dataset.text = text; else delete root.dataset.text;
      if (contrast) root.dataset.contrast = "high"; else delete root.dataset.contrast;
      const btn = $("#contrast-toggle"); if (btn) btn.setAttribute("aria-pressed", String(contrast));
    };
    apply();
    $$("[data-text-step]").forEach((b) => b.addEventListener("click", () => {
      text = Math.max(0, Math.min(2, text + Number(b.dataset.textStep)));
      store.set("pref-text", text); apply();
      toast(["Text size: normal", "Text size: large", "Text size: largest"][text]);
    }));
    $("#contrast-toggle").addEventListener("click", () => {
      contrast = !contrast; store.set("pref-contrast", contrast); apply();
      toast(contrast ? "High contrast on" : "High contrast off");
    });
  }

  function initNav() {
    const toggle = $(".nav-toggle"), list = $("#nav-list");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      list.classList.toggle("open", open);
    });
  }

  let toastTimer;
  function toast(msg) {
    const d = $("#list-drawer"); if (d && d.open) { $("#list-status").textContent = msg; }
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  const TOPIC_WORDS = {
    "Food": ["food", "foods", "groceries", "grocery", "hungry", "meal", "meals", "pantry", "eat", "restaurant", "restaurants", "pizza", "pho", "shopping", "market", "farmers market", "food bank"],
    "Health & Safety": ["health", "safety", "counseling", "counselling", "therapy", "therapist", "mental health", "crisis", "suicide", "emergency", "abuse", "domestic violence", "dv"],
    "Assistance & Referrals": ["assistance", "referrals", "help", "legal", "lawyer", "attorney", "bills", "bill", "rent", "money", "utility", "energy", "immigrant", "immigrants", "refugee", "211", "2-1-1"],
    "Kids & Teens": ["kids", "kid", "children", "child", "teens", "teen", "teenager", "youth", "family", "families"],
    "Seniors": ["seniors", "senior", "elderly", "older adults", "older"],
    "Learning": ["learning", "learn", "library", "classes", "class", "english", "esl", "tutor", "tutoring", "tech help", "computer"],
    "Parks & Recreation": ["parks", "park", "recreation", "trail", "trails", "hike", "hiking", "outdoors", "swim", "swimming", "beach", "lake", "bike", "biking", "pool", "gym", "concert", "concerts"],
    "Community": ["community", "city", "city hall", "council", "government", "festival", "events"],
    "Volunteer": ["volunteer", "volunteers", "volunteering", "service hours", "give back"]
  };
  const TOPIC_MAIN = {
    "Food": ["food", "foods", "groceries", "grocery", "hungry", "eat", "food help"],
    "Health & Safety": ["health", "safety", "health and safety", "crisis", "emergency"],
    "Assistance & Referrals": ["assistance", "referrals", "help", "assistance and referrals"],
    "Kids & Teens": ["kids", "kid", "children", "child", "teens", "teen", "teenagers", "youth", "kids and teens"],
    "Seniors": ["seniors", "senior", "elderly", "older adults"],
    "Learning": ["learning", "learn", "classes", "education"],
    "Parks & Recreation": ["parks", "park", "recreation", "outdoors", "parks and recreation", "hike", "hiking", "hikes", "trails", "trail"],
    "Community": ["community", "city"],
    "Volunteer": ["volunteer", "volunteers", "volunteering", "service hours"]
  };
  const topicFor = (q, broad) => {
    const t = q.trim().toLowerCase().replace(/&/g, "and");
    const table = broad ? TOPIC_MAIN : TOPIC_WORDS;
    return Object.keys(table).find((k) => k.toLowerCase().replace(/&/g, "and") === t || table[k].includes(t)) || null;
  };
  const TYPE_ORDER = ["organization", "program", "service", "event", "resource"];
  function searchText(e) { return `${e.name} ${e.summary} ${e.topics.join(" ")}`.toLowerCase(); }
  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const byTopic = (topic) => ENTRIES.filter((e) => e.topics.includes(topic))
      .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.name.localeCompare(b.name));
    const broad = topicFor(q, true);
    if (broad) return byTopic(broad);
    const words = q.split(/\s+/);
    const matches = ENTRIES.map((e) => {
      const name = e.name.toLowerCase(), text = searchText(e);
      if (!words.every((w) => text.includes(w))) return null;
      let score = 0;
      if (name.startsWith(q)) score += 50; else if (name.includes(q)) score += 30;
      words.forEach((w) => { if (name.includes(w)) score += 10; else score += 2; });
      return { e, score };
    }).filter(Boolean).sort((x, y) => y.score - x.score || x.e.name.localeCompare(y.e.name)).map((r) => r.e);
    if (matches.length) return matches;
    const related = topicFor(q, false);
    return related ? byTopic(related) : [];
  }
  const entryHref = (e) => `${TYPES[e.type].page}#${e.id}`;

  function initSearch(box) {
    const input = $("input", box), list = $("ul", box);
    let results = [], active = -1;
    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); active = -1; };
    const paint = () => {
      const q = input.value.trim();
      if (!q) { close(); return; }
      results = search(q).slice(0, 8);
      list.innerHTML = results.length
        ? results.map((e, i) => `
            <li role="option" id="${list.id}-${i}" aria-selected="${i === active}">
              <a class="search-option" href="${entryHref(e)}" tabindex="-1">
                <span class="icon-badge type-dot" style="width:36px;height:36px">${icon(TYPES[e.type].icon)}</span>
                <strong>${esc(e.name)}</strong><small>${TYPES[e.type].label} · ${esc((e.topics || []).join(", "))}</small>
              </a></li>`).join("")
        : `<li class="search-empty" role="option" aria-disabled="true">No matches for “${esc(q)}”. Try a simpler word, like “food” or “youth”.</li>`;
      list.hidden = false; input.setAttribute("aria-expanded", "true");
      if (active >= 0) input.setAttribute("aria-activedescendant", `${list.id}-${active}`); else input.removeAttribute("aria-activedescendant");
    };
    input.addEventListener("input", () => { active = -1; paint(); });
    input.addEventListener("focus", paint);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown" && results.length) { ev.preventDefault(); active = (active + 1) % results.length; paint(); }
      else if (ev.key === "ArrowUp" && results.length) { ev.preventDefault(); active = (active - 1 + results.length) % results.length; paint(); }
      else if (ev.key === "Enter") {
        const target = results[active >= 0 ? active : 0];
        if (target) { ev.preventDefault(); go(target); }
      } else if (ev.key === "Escape") { close(); }
    });
    list.addEventListener("mousedown", (ev) => ev.preventDefault());
    list.addEventListener("click", (ev) => {
      const a = ev.target.closest("a"); if (!a) return;
      ev.preventDefault(); const i = $$("a", list).indexOf(a); go(results[i]);
    });
    input.addEventListener("blur", () => setTimeout(close, 120));
    function go(e) {
      close();
      const href = entryHref(e);
      if (location.pathname.endsWith(TYPES[e.type].page)) { history.replaceState(null, "", "#" + e.id); highlightTarget(); }
      else location.href = href;
    }
  }

  let saved = store.get("my-list", []).filter((id) => ENTRIES.some((e) => e.id === id));
  function updateListUI(bump) {
    const c = $(".list-count");
    if (c) {
      c.textContent = saved.length;
      c.setAttribute("aria-label", `${saved.length} saved`);
      if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    }
    $$(".save-btn").forEach((b) => {
      const on = saved.includes(b.dataset.id);
      b.setAttribute("aria-pressed", String(on));
      const nm = esc((ENTRIES.find((x) => x.id === b.dataset.id) || {}).name || "");
      b.innerHTML = on ? `${icon("bookmark-check")}Saved<span class="visually-hidden">: ${nm}</span>` : `${icon("bookmark")}Save to My List<span class="visually-hidden">: ${nm}</span>`;
    });
    const body = $("#list-body"); if (!body) return;
    const items = saved.map((id) => ENTRIES.find((e) => e.id === id)).filter(Boolean);
    body.innerHTML = items.length
      ? `<ul class="drawer-list">${items.map((e) => `
          <li><strong><a href="${entryHref(e)}">${esc(e.name)}</a></strong>
            <button class="icon-btn" type="button" data-remove="${e.id}" aria-label="Remove ${esc(e.name)}">${icon("x")}</button>
            <small>${TYPES[e.type].label}${e.phone ? " · " + esc(e.phone) : ""}</small></li>`).join("")}</ul>`
      : `<p class="drawer-empty">Your list is empty. Press <strong>Save to My List</strong> on any listing to keep it here, then print it or take it with you.</p>`;
    $("#print-list").disabled = !items.length;
    $("#clear-list").disabled = !items.length;
  }
  function toggleSave(id) {
    const e = ENTRIES.find((x) => x.id === id);
    if (saved.includes(id)) { saved = saved.filter((x) => x !== id); toast(`Removed ${e.name}`); }
    else { saved.push(id); toast(`Saved ${e.name} to My List`); }
    store.set("my-list", saved); updateListUI(true);
  }
  function initList() {
    const drawer = $("#list-drawer");
    $("#open-list").addEventListener("click", () => { updateListUI(); drawer.showModal(); });
    $("#close-list").addEventListener("click", () => drawer.close());
    drawer.addEventListener("click", (ev) => { if (ev.target === drawer) drawer.close(); });
    document.addEventListener("click", (ev) => {
      const s = ev.target.closest(".save-btn"); if (s) toggleSave(s.dataset.id);
      const r = ev.target.closest("[data-remove]"); if (r) toggleSave(r.dataset.remove);
    });
    $("#clear-list").addEventListener("click", () => { saved = []; store.set("my-list", saved); updateListUI(true); toast("My List cleared"); });
    $("#print-list").addEventListener("click", printList);
    updateListUI();
  }
  function printList() {
    const items = saved.map((id) => ENTRIES.find((e) => e.id === id)).filter(Boolean);
    const area = $("#print-area");
    area.innerHTML = `
      <h1>My Sammamish Resource List</h1>
      <p class="print-sub">Printed ${fmtDate(new Date())} from Sammamish Community Resources</p>
      <ol>${items.map((e) => `<li><strong>${esc(e.name)}</strong> (${TYPES[e.type].label})
        <div>${esc(e.summary)}</div>
        <div>${[e.address, e.phone && "Phone: " + e.phone, e.hours || e.when, e.website].filter(Boolean).map(esc).join(" · ")}</div></li>`).join("")}</ol>
      <p class="print-foot">Need help now? Call or text 988 (crisis) · Dial 2-1-1 (local resources) · Call 911 (emergency). Always confirm hours before you go.</p>`;
    document.body.classList.add("printing");
    window.print();
    setTimeout(() => document.body.classList.remove("printing"), 400);
  }

  function renderEntry(e, level = 2) {
    const src = SOURCES[e.source];
    const n = e.type === "event" ? nextDate(e) : null;
    const details = [
      e.type === "event" && `<li>${icon("calendar-days")}<span><span class="entry-next">${esc(nextLabel(e, n))}</span><br>${esc(e.when || "")}</span></li>`,
      e.address && `<li>${icon("map-pin")}<span>${esc(e.address)}</span></li>`,
      e.phone && `<li>${icon("phone")}<span>${/^[\d\s()+-]+$/.test(e.phone) ? `<a href="tel:${e.phone.replace(/[^\d+]/g, "")}">${esc(e.phone)}</a>` : esc(e.phone)}</span></li>`,
      e.hours && `<li>${icon("clock")}<span>${esc(e.hours)}</span></li>`,
      e.website && `<li>${icon("globe")}<a href="${esc(e.website)}" target="_blank" rel="noopener">Visit website<span class="visually-hidden"> for ${esc(e.name)} (opens in a new tab)</span></a></li>`
    ].filter(Boolean).join("");
    return `
      <li class="entry${e.image ? "" : " no-photo"}" id="${e.id}" data-topics="${esc((e.topics || []).join("|"))}">
        ${e.image ? `<img class="entry-photo${e.logo ? " is-logo" : ""}" src="${e.image}" alt="${esc(e.imageAlt || "")}" loading="lazy" width="320" height="240">` : ""}
        <div class="entry-main">
          <h${level} class="entry-name">${e.website ? `<a class="entry-link" href="${esc(e.website)}" target="_blank" rel="noopener">${esc(e.name)}${icon("external-link", "ext")}<span class="visually-hidden"> (opens website in a new tab)</span></a>` : esc(e.name)}</h${level}>
          <div class="entry-meta-line">
            ${(e.topics || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
          </div>
          <p class="entry-summary">${esc(e.summary)}</p>
          ${src ? `<p class="entry-source">Source: <a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.publisher)}</a> · Checked ${fmtChecked(e.checked)}</p>` : ""}
        </div>
        <div class="entry-aside">
          <ul class="entry-details">${details}</ul>
          <button class="save-btn" type="button" data-id="${e.id}" aria-pressed="false">${icon("bookmark")}Save to My List</button>
        </div>
      </li>`;
  }
  function fmtChecked(s) { if (!s) return ""; const d = parseDate(s); return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }

  function highlightTarget() {
    const id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    const el = document.getElementById(id); if (!el || !el.classList.contains("entry")) return;
    if (el.hidden) { resetFilters(); }
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    el.classList.remove("is-target"); void el.offsetWidth; el.classList.add("is-target");
  }

  let resetFilters = () => {};
  function renderCategory(type) {
    const mount = $("#listing"); if (!mount) return;
    let items = ENTRIES.filter((e) => e.type === type).sort((a, b) => a.name.localeCompare(b.name));
    if (type === "event") {
      items = items.map((e) => ({ e, n: nextDate(e) }))
        .sort((a, b) => (a.n ? (a.n.seasonal ? 1e13 : 0) + a.n.date.getTime() : 9e15) - (b.n ? (b.n.seasonal ? 1e13 : 0) + b.n.date.getTime() : 9e15))
        .map((x) => x.e);
    }
    const topics = [...new Set(items.flatMap((e) => e.topics || []))].sort();
    const plural = TYPES[type].plural.toLowerCase();

    mount.innerHTML = `
      <div class="toolbar">
        <div class="toolbar-row">
          <div class="filter-search">
            <label class="visually-hidden" for="filter-q">Search ${plural}</label>
            ${icon("search")}
            <input class="search-input" id="filter-q" type="search" placeholder="Search ${plural}" autocomplete="off">
          </div>
        </div>
        ${type === "event" ? `
        <ul class="chips" aria-label="Filter by date">
          <li><button class="chip" type="button" data-when="all" aria-pressed="true">All upcoming</button></li>
          <li><button class="chip" type="button" data-when="7" aria-pressed="false">Next 7 days</button></li>
          <li><button class="chip" type="button" data-when="30" aria-pressed="false">Next 30 days</button></li>
        </ul>` : ""}
        <ul class="chips" aria-label="Filter by topic">
          <li><button class="chip" type="button" data-topic="" aria-pressed="true">All topics</button></li>
          ${topics.map((t) => `<li><button class="chip" type="button" data-topic="${esc(t)}" aria-pressed="false">${esc(t)}</button></li>`).join("")}
        </ul>
        <p class="result-count" id="result-count" aria-live="polite"></p>
      </div>
      ${type === "resource" ? renderResourceGroups(items) : `<ul class="entries">${items.map((e) => renderEntry(e)).join("")}</ul>`}
      <div class="empty-state" id="empty" hidden>
        <h2>No ${plural} match those filters</h2>
        <p>Try another word, or clear the filters to see everything.</p>
        <button class="btn btn-ghost" type="button" id="clear-filters">Clear filters</button>
      </div>`;

    let topic = "", q = "", when = "all";
    const apply = () => {
      const matches = new Set((q ? search(q) : items).map((e) => e.id));
      let shown = 0;
      items.forEach((e) => {
        let ok = matches.has(e.id) && (!topic || (e.topics || []).includes(topic));
        if (ok && type === "event" && when !== "all") {
          const n = nextDate(e);
          ok = !!n && !n.seasonal && (n.date - today) / 864e5 <= Number(when);
        }
        const el = document.getElementById(e.id);
        if (ok && el.hidden) { el.classList.remove("slide-in"); void el.offsetWidth; el.classList.add("slide-in"); }
        el.hidden = !ok;
        if (ok) shown++;
      });
      $$(".group").forEach((g) => { g.hidden = !$$(".entry", g).some((el) => !el.hidden); });
      $("#empty").hidden = shown > 0;
      $("#result-count").textContent = `Showing ${shown} of ${items.length} ${plural}`;
    };
    $("#filter-q").addEventListener("input", (ev) => { q = ev.target.value; apply(); });
    $$("[data-topic]").forEach((b) => b.addEventListener("click", () => {
      topic = b.dataset.topic;
      $$("[data-topic]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); apply();
    }));
    $$("[data-when]").forEach((b) => b.addEventListener("click", () => {
      when = b.dataset.when;
      $$("[data-when]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); apply();
    }));
    resetFilters = () => {
      topic = ""; q = ""; when = "all"; $("#filter-q").value = "";
      $$("[data-topic]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.topic === "")));
      $$("[data-when]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.when === "all")));
      apply();
    };
    $("#clear-filters").addEventListener("click", resetFilters);
    apply();
  }

  function renderResourceGroups(items) {
    const groups = [
      { title: "Get help", desc: "Crisis lines and guides to local services.", icon: "life-buoy", test: (e) => ["Health & Safety", "Assistance & Referrals"].includes(e.topics[0]) },
      { title: "Parks and recreation", desc: "Places to hike, swim, bike, and play.", icon: "trees", test: (e) => e.topics[0] === "Parks & Recreation" },
      { title: "Food", desc: "Grocery stores, shopping centers, and places to eat.", icon: "utensils", test: (e) => e.topics[0] === "Food" },
      { title: "Community and volunteering", desc: "Public spaces and ways to give back.", icon: "heart-handshake", test: (e) => ["Community", "Volunteer"].includes(e.topics[0]) }
    ];
    return groups.map((g) => `
      <section class="group" aria-labelledby="g-${g.icon}">
        <h2 class="group-title" id="g-${g.icon}"><span class="icon-badge">${icon(g.icon)}</span>${g.title}</h2>
        <p class="group-desc">${g.desc}</p>
        <ul class="entries">${items.filter(g.test).sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)).map((e) => renderEntry(e, 3)).join("")}</ul>
      </section>`).join("");
  }

  function renderHome() {
    const hs = $("#hero-search"); if (hs) hs.outerHTML = searchBox("hero", true);
    const q = $("#quick-links");
    if (q) q.innerHTML = Object.entries(TYPES).map(([key, t]) => {
      const count = ENTRIES.filter((e) => e.type === key).length;
      return `<li><a class="quick-link" href="${t.page}">
          <span class="icon-badge">${icon(t.icon)}</span>
          <h3>${t.plural}</h3><p>${t.blurb}</p>
          <span class="count">${count} listed ${icon("arrow-right")}</span></a></li>`;
    }).join("");

    const up = $("#upcoming");
    if (up) {
      const events = ENTRIES.filter((e) => e.type === "event").map((e) => ({ e, n: nextDate(e) }))
        .filter((x) => x.n && !x.n.seasonal).sort((a, b) => a.n.date - b.n.date).slice(0, 4);
      up.innerHTML = events.map(({ e, n }) => `
        <li><a href="events.html#${e.id}">
          ${dateBlock(n)}
          <span><strong>${esc(e.name)}</strong><small>${DAYS[n.date.getDay()]}${e.recur && e.recur.time ? ", " + esc(e.recur.time) : ""} · ${esc((e.address || "").split(",")[0])}</small></span>
          ${icon("arrow-right")}</a></li>`).join("");
    }

    const pop = $("#popular-todo");
    if (pop) {
      const byId = (id) => ENTRIES.find((e) => e.id === id);
      const list = [byId("sammamish-landing"), ...ENTRIES.filter((e) => e.todo === "outdoors"),
        byId("farmers-market"), byId("summer-concerts"), ...ENTRIES.filter((e) => e.todo === "food")].filter(Boolean).slice(0, 20);
      const ic = (e) => e.todo === "food" ? "utensils" : e.type === "event" ? "calendar-days" : /bike/i.test(e.name) ? "bike" : /lake|landing|beach/i.test(e.name) ? "waves" : "trees";
      pop.innerHTML = list.map((e, i) => `
        <li aria-label="${i + 1} of ${list.length}"><a class="todo" href="${entryHref(e)}">
          ${e.image ? `<img class="todo-photo" src="${e.image}" alt="" loading="lazy" width="320" height="200">` : `<span class="todo-icon">${icon(ic(e))}</span>`}
          <span class="todo-text"><strong>${esc(e.name)}</strong><small>${esc((e.topics || [])[0] || "")}</small></span></a></li>`).join("");

      const prev = $(".carousel-btn.prev"), next = $(".carousel-btn.next");
      const update = () => {
        prev.disabled = pop.scrollLeft <= 2;
        next.disabled = pop.scrollLeft + pop.clientWidth >= pop.scrollWidth - 2;
      };
      let gliding = 0;
      const glide = (dir) => {
        const card = pop.firstElementChild;
        const gap = parseFloat(getComputedStyle(pop).columnGap) || 16;
        const step = card ? (card.getBoundingClientRect().width + gap) * 2 : pop.clientWidth / 2;
        const from = pop.scrollLeft;
        const to = Math.max(0, Math.min(pop.scrollWidth - pop.clientWidth, from + dir * step));
        if (motionOff()) { pop.scrollLeft = to; return; }
        cancelAnimationFrame(gliding);
        pop.style.scrollSnapType = "none";
        const start = performance.now(), dur = 650;
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          pop.scrollLeft = from + (to - from) * ease(t);
          if (t < 1) gliding = requestAnimationFrame(tick);
          else { pop.style.scrollSnapType = ""; update(); }
        };
        gliding = requestAnimationFrame(tick);
      };
      [prev, next].forEach((b) => b.addEventListener("click", () => glide(Number(b.dataset.dir))));
      pop.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    }

    $$("[data-popular]").forEach((b) => b.addEventListener("click", () => {
      const input = $("#search-hero"); input.value = b.dataset.popular; input.focus();
      input.dispatchEvent(new Event("input"));
    }));
  }

  function renderSources() {
    const list = $("#source-list");
    if (list) {
      list.innerHTML = Object.entries(SOURCES).map(([key, s]) => {
        const users = ENTRIES.filter((e) => e.source === key);
        return `<li><strong>${esc(s.title)}</strong>
          <small>${esc(s.publisher)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a></small>
          ${users.length ? `<small><br>Used for: ${users.map((e) => `<a href="${entryHref(e)}">${esc(e.name)}</a>`).join(", ")}</small>` : ""}</li>`;
      }).join("");
    }
    const photos = $("#photo-credits");
    if (photos) photos.innerHTML = (window.PHOTO_CREDITS || []).map((p) =>
      `<li><strong>${esc(p.subject)}</strong><small>${esc(p.credit)}${p.url ? ` <a href="${esc(p.url)}" target="_blank" rel="noopener">Source page</a>` : ""} File: ${esc(p.file)}</small></li>`).join("");
  }

  const motionOff = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navIndex = (url) => {
    try { const f = new URL(url, location.href).pathname.split("/").pop() || "index.html"; return NAV.findIndex((n) => n.href === f); }
    catch (e) { return -1; }
  };
  window.addEventListener("pageswap", (e) => { if (e.viewTransition && motionOff()) e.viewTransition.skipTransition(); });
  window.addEventListener("pagereveal", (e) => {
    if (!e.viewTransition) return;
    const from = window.navigation && navigation.activation && navigation.activation.from;
    const a = from ? navIndex(from.url) : -1, b = navIndex(location.href);
    e.viewTransition.types.add(a > b ? "backward" : "forward");
  });

  function initBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "to-top"; btn.hidden = true;
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = icon("arrow-up") + "<span>Top</span>";
    btn.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: motionOff() ? "auto" : "smooth" });
    });
    document.body.appendChild(btn);
    let ticking = false;
    const update = () => { ticking = false; btn.hidden = scrollY < innerHeight * 1.2; };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  renderHeader();
  initBackToTop();
  initPrefs();
  initNav();
  function start() {
    $$("[data-icon]").forEach((el) => { el.outerHTML = el.classList.contains("icon-badge") ? `<span class="icon-badge">${icon(el.dataset.icon)}</span>` : icon(el.dataset.icon); });
    renderFooter();
    initList();
    if (page === "home") renderHome();
    if (TYPES[page]) renderCategory(page);
    if (page === "sources") renderSources();
    $$("[data-search]").forEach(initSearch);
    updateListUI();
    if (location.hash) setTimeout(highlightTarget, 60);
    window.addEventListener("hashchange", highlightTarget);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
