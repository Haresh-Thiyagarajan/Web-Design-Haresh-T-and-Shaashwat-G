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

  const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const pad2 = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const stamp = (d, min) => `${ymd(d)}T${pad2(Math.floor(min / 60))}${pad2(min % 60)}00`;
  function parseTimes(t) {
    const parts = [...(t || "").matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi)];
    if (!parts.length) return null;
    const fallback = (parts[parts.length - 1][3] || "").toLowerCase();
    const toMinutes = (m) => {
      let h = Number(m[1]);
      const mer = (m[3] || fallback).toLowerCase();
      if (mer === "pm" && h < 12) h += 12;
      if (mer === "am" && h === 12) h = 0;
      return h * 60 + Number(m[2] || 0);
    };
    const start = toMinutes(parts[0]);
    return { start, end: parts.length > 1 ? toMinutes(parts[1]) : start + 60 };
  }
  function repeatRule(e) {
    if (!e.recur) return "";
    const days = e.recur.weekdays.flatMap((w) => e.recur.nth ? e.recur.nth.map((n) => `${n}${WEEKDAY_CODES[w]}`) : [WEEKDAY_CODES[w]]);
    let rule = `FREQ=${e.recur.nth ? "MONTHLY" : "WEEKLY"};BYDAY=${days.join(",")}`;
    if (e.season) {
      const months = []; for (let m = e.season.startMonth; m <= e.season.endMonth; m++) months.push(m);
      rule += `;BYMONTH=${months.join(",")}`;
    }
    return rule;
  }
  function calendarEvent(e, n) {
    const times = e.recur ? parseTimes(e.recur.time) : null;
    const next = new Date(n.date); next.setDate(next.getDate() + 1);
    return {
      title: e.name,
      location: e.address || "",
      details: `${e.summary} More information: ${e.website || ""}`.trim(),
      start: times ? stamp(n.date, times.start) : ymd(n.date),
      end: times ? stamp(n.date, times.end) : ymd(next),
      allDay: !times,
      rule: repeatRule(e)
    };
  }
  const icsEscape = (t) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const icsFold = (line) => line.match(/.{1,70}/g).join("\r\n ");
  function buildIcs(e, n) {
    const c = calendarEvent(e, n);
    const now = new Date().toISOString().replace(/[-:]|\.\d{3}/g, "");
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sammamish Community Resources//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:${e.id}-${ymd(n.date)}@sammamish-community-resources`, `DTSTAMP:${now}`,
      c.allDay ? `DTSTART;VALUE=DATE:${c.start}` : `DTSTART:${c.start}`,
      c.allDay ? `DTEND;VALUE=DATE:${c.end}` : `DTEND:${c.end}`,
      c.rule && `RRULE:${c.rule}`,
      `SUMMARY:${icsEscape(c.title)}`, c.location && `LOCATION:${icsEscape(c.location)}`, `DESCRIPTION:${icsEscape(c.details)}`,
      "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean);
    return lines.map(icsFold).join("\r\n") + "\r\n";
  }
  function googleCalendarUrl(e, n) {
    const c = calendarEvent(e, n);
    const q = new URLSearchParams({ action: "TEMPLATE", text: c.title, dates: `${c.start}/${c.end}`, details: c.details, location: c.location, ctz: "America/Los_Angeles" });
    if (c.rule) q.set("recur", `RRULE:${c.rule}`);
    return `https://calendar.google.com/calendar/render?${q}`;
  }
  function calendarMenu(e, n) {
    if (e.type !== "event" || !n || n.seasonal) return "";
    return `
          <details class="cal-menu">
            <summary class="cal-btn">${icon("calendar-plus")}Add to calendar<span class="visually-hidden">: ${esc(e.name)}</span></summary>
            <div class="cal-options">
              <button type="button" data-ics="${e.id}">Apple, Outlook, or other calendar app</button>
              <a href="${esc(googleCalendarUrl(e, n))}" target="_blank" rel="noopener">Google Calendar<span class="visually-hidden"> (opens in a new tab)</span></a>
            </div>
          </details>`;
  }
  function initCalendar() {
    document.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-ics]");
      if (b) {
        const e = ENTRIES.find((x) => x.id === b.dataset.ics), n = nextDate(e);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([buildIcs(e, n)], { type: "text/calendar" }));
        link.download = `${e.id}.ics`;
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        b.closest("details").open = false;
        toast("Calendar file downloaded. Open it to add the event.");
        return;
      }
      $$(".cal-menu[open]").forEach((d) => { if (!d.contains(ev.target)) d.open = false; });
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      $$(".cal-menu[open]").forEach((d) => { d.open = false; d.querySelector("summary").focus(); });
    });
  }

  function renderHeader() {
    const current = page === "home" ? "home" : page;
    const navItems = NAV.map((n) =>
      `<li><a href="${n.href}"${n.key === current ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
    const html = `
      <div class="topbar">
        <div class="wrap">
          <p class="topbar-help">${icon("life-buoy")}<span class="help-long">Need help now? Call or text <a href="tel:988">988</a> for crisis support, or dial <a href="tel:211">2-1-1</a> for local resources.</span><span class="help-short">Need help now? Call or text <a href="tel:988">988</a> or dial <a href="tel:211">2-1-1</a>.</span></p>
          <div class="a11y" id="a11y">
            <button class="a11y-toggle" type="button" aria-expanded="false" aria-controls="a11y-panel">${icon("settings", "gear")}<span>Accessibility settings</span>${icon("chevron-down", "chev")}</button>
            <div class="a11y-panel" id="a11y-panel" role="group" aria-labelledby="a11y-title">
              <p class="a11y-title" id="a11y-title">Accessibility settings</p>
              <div class="a11y-row">
                <span class="a11y-icon">${icon("type")}</span>
                <span class="a11y-text"><strong id="text-size-title">Text size</strong><small id="text-size-label" aria-live="polite">Normal</small></span>
                <span class="a11y-stepper" role="group" aria-labelledby="text-size-title">
                  <button type="button" data-text-step="-1">A−<span class="visually-hidden"> Smaller text</span></button>
                  <span class="a11y-dots" aria-hidden="true">${TEXT_SIZES.map(() => "<i></i>").join("")}</span>
                  <button type="button" data-text-step="1">A+<span class="visually-hidden"> Larger text</span></button>
                </span>
              </div>
              <div class="a11y-row">
                <span class="a11y-icon">${icon("contrast")}</span>
                <span class="a11y-text"><strong id="contrast-title">High contrast</strong><small>Stronger colors and borders</small></span>
                <button class="a11y-switch" type="button" role="switch" aria-checked="false" aria-labelledby="contrast-title" id="contrast-toggle"><span></span></button>
              </div>
              <div class="a11y-row">
                <span class="a11y-icon">${icon("moon")}</span>
                <span class="a11y-text"><strong id="theme-title">Dark mode</strong><small>Light text on a dark background</small></span>
                <button class="a11y-switch" type="button" role="switch" aria-checked="false" aria-labelledby="theme-title" id="theme-toggle"><span></span></button>
              </div>
              <button class="a11y-reset" type="button" id="a11y-reset">${icon("rotate-ccw")}Reset to default</button>
            </div>
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
            <a class="btn btn-primary" href="my-calendar.html" id="go-calendar">${icon("calendar-days")}Go to my calendar</a>
            <button class="btn btn-ghost" type="button" id="clear-list">${icon("trash-2")}Clear</button>
          </div>
        </div>
      </dialog>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div id="print-area" aria-hidden="true"></div>`;
    $("#site-footer").outerHTML = html;
  }

  // Text size steps run from -1 (small) to 2 (largest); 0 is the default.
  const TEXT_SIZES = ["Small", "Normal", "Large", "Largest"];
  function initPrefs() {
    const root = document.documentElement;
    const wrap = $("#a11y"), toggle = $(".a11y-toggle");
    let text = Math.max(-1, Math.min(2, store.get("pref-text", 0)));
    let contrast = store.get("pref-contrast", false);
    let dark = store.get("pref-dark", false);
    const apply = () => {
      if (text) root.dataset.text = text; else delete root.dataset.text;
      if (contrast) root.dataset.contrast = "high"; else delete root.dataset.contrast;
      if (dark) root.dataset.theme = "dark"; else delete root.dataset.theme;
      $("#contrast-toggle").setAttribute("aria-checked", String(contrast));
      $("#theme-toggle").setAttribute("aria-checked", String(dark));
      $("#text-size-label").textContent = TEXT_SIZES[text + 1];
      $$(".a11y-dots i").forEach((dot, i) => dot.classList.toggle("on", i === text + 1));
      $('[data-text-step="-1"]').disabled = text <= -1;
      $('[data-text-step="1"]').disabled = text >= 2;
      $("#a11y-reset").disabled = !text && !contrast && !dark;
    };
    apply();
    $$("[data-text-step]").forEach((b) => b.addEventListener("click", () => {
      text = Math.max(-1, Math.min(2, text + Number(b.dataset.textStep)));
      store.set("pref-text", text); apply();
      toast(`Text size: ${TEXT_SIZES[text + 1].toLowerCase()}`);
      if (b.disabled) b.parentElement.querySelector("button:not(:disabled)").focus();
    }));
    $("#contrast-toggle").addEventListener("click", () => {
      contrast = !contrast; store.set("pref-contrast", contrast); apply();
      toast(contrast ? "High contrast on" : "High contrast off");
    });
    $("#theme-toggle").addEventListener("click", () => {
      dark = !dark; store.set("pref-dark", dark); apply();
      toast(dark ? "Dark mode on" : "Dark mode off");
    });
    $("#a11y-reset").addEventListener("click", () => {
      text = 0; contrast = false; dark = false;
      ["pref-text", "pref-contrast", "pref-dark"].forEach((k) => store.set(k, k === "pref-text" ? 0 : false));
      apply(); toast("Settings reset"); toggle.focus();
    });

    const setOpen = (open) => { wrap.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); };
    toggle.addEventListener("click", () => setOpen(!wrap.classList.contains("open")));
    document.addEventListener("click", (ev) => { if (!wrap.contains(ev.target)) setOpen(false); });
    wrap.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && wrap.classList.contains("open")) { setOpen(false); toggle.focus(); } });
    wrap.addEventListener("focusout", (ev) => { if (ev.relatedTarget && !wrap.contains(ev.relatedTarget)) setOpen(false); });
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
      : `<p class="drawer-empty">Your list is empty. Press <strong>Save to My List</strong> on any listing to keep it here. Saved events show up on your calendar.</p>`;
    $("#clear-list").disabled = !items.length;
    if (page === "calendar") renderCalendar();
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
    $("#go-calendar").addEventListener("click", (ev) => { if (page === "calendar") { ev.preventDefault(); drawer.close(); } });
    document.addEventListener("click", (ev) => { if (ev.target.closest("#print-list")) printList(); });
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

  // My Calendar page: a month grid of saved events, with each day's details listed below it.
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const CAL_MONTHS_AHEAD = 11;
  let calMonth = firstOfMonth;
  function occurrences(e, first) {
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    if (e.date) { const d = parseDate(e.date); return d >= first && d <= last ? [d] : []; }
    if (!e.recur) return [];
    const out = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      if (!e.recur.weekdays.includes(d.getDay())) continue;
      if (e.recur.nth && !e.recur.nth.includes(Math.ceil(d.getDate() / 7))) continue;
      if (!inSeason(e, d)) continue;
      out.push(new Date(d));
    }
    return out;
  }
  const occId = (e, d) => `on-${ymd(d)}-${e.id}`;
  function renderCalendar() {
    const mount = $("#calendar"); if (!mount) return;
    const items = saved.map((id) => ENTRIES.find((e) => e.id === id)).filter(Boolean);
    const events = items.filter((e) => e.type === "event");
    const others = items.filter((e) => e.type !== "event");
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const monthsAhead = (y - firstOfMonth.getFullYear()) * 12 + m - firstOfMonth.getMonth();
    const label = `${MONTH_NAMES[m]} ${y}`;

    const byDay = new Map();
    const notThisMonth = [];
    events.forEach((e) => {
      const dates = occurrences(e, calMonth);
      if (!dates.length) notThisMonth.push(e);
      dates.forEach((d) => { const k = d.getDate(); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push({ e, d }); });
    });

    const cells = [];
    for (let i = 0; i < calMonth.getDay(); i++) cells.push(`<td class="cal-day is-blank"></td>`);
    for (let day = 1, count = new Date(y, m + 1, 0).getDate(); day <= count; day++) {
      const d = new Date(y, m, day), list = byDay.get(day) || [];
      const cls = ["cal-day", d < today && "is-past", d.getTime() === today.getTime() && "is-today", list.length && "has-events"].filter(Boolean).join(" ");
      cells.push(`<td class="${cls}"${d.getTime() === today.getTime() ? ' aria-current="date"' : ""}>
          <span class="cal-num">${day}<span class="visually-hidden"> ${MONTH_NAMES[m]}${d.getTime() === today.getTime() ? ", today" : ""}</span></span>
          ${list.length ? `<ul>${list.map(({ e, d }) => `<li><a class="cal-chip" href="#${occId(e, d)}">${esc(e.name)}</a></li>`).join("")}</ul>` : ""}
        </td>`);
    }
    while (cells.length % 7) cells.push(`<td class="cal-day is-blank"></td>`);
    const weeks = []; for (let i = 0; i < cells.length; i += 7) weeks.push(`<tr>${cells.slice(i, i + 7).join("")}</tr>`);

    const days = [...byDay.keys()].sort((a, b) => a - b);
    const detail = (e, d) => {
      const times = e.recur && e.recur.time;
      return `
        <li class="agenda-event" id="${occId(e, d)}">
          <h4><a href="${entryHref(e)}">${esc(e.name)}</a></h4>
          <ul class="entry-details">
            <li>${icon("clock")}<span>${esc(times || e.when || "See the event page for times")}${times && e.when ? `<br><small>${esc(e.when)}</small>` : ""}</span></li>
            ${e.address ? `<li>${icon("map-pin")}<span><a href="${directionsUrl(e.address)}" target="_blank" rel="noopener">${esc(e.address)}<span class="visually-hidden"> (get directions in Google Maps, opens in a new tab)</span></a></span></li>` : ""}
            ${e.phone ? `<li>${icon("phone")}<span><a href="tel:${e.phone.replace(/[^\d+]/g, "")}">${esc(e.phone)}</a></span></li>` : ""}
            ${e.website ? `<li>${icon("globe")}<a href="${esc(e.website)}" target="_blank" rel="noopener">Visit website<span class="visually-hidden"> for ${esc(e.name)} (opens in a new tab)</span></a></li>` : ""}
          </ul>
          <p class="agenda-summary">${esc(e.summary)}</p>
          <div class="agenda-actions">
            ${d >= today ? calendarMenu(e, { date: d }) : ""}
            <button class="btn btn-ghost agenda-remove" type="button" data-remove="${e.id}">${icon("trash-2")}Remove from My List<span class="visually-hidden">: ${esc(e.name)}</span></button>
          </div>
        </li>`;
    };

    mount.innerHTML = `
      <div class="cal-toolbar">
        <button class="icon-btn cal-step" type="button" data-cal-step="-1"${monthsAhead <= 0 ? " disabled" : ""} aria-label="Previous month">${icon("chevron-left")}</button>
        <h2 id="cal-title" tabindex="-1" aria-live="polite">${label}</h2>
        <button class="icon-btn cal-step" type="button" data-cal-step="1"${monthsAhead >= CAL_MONTHS_AHEAD ? " disabled" : ""} aria-label="Next month">${icon("chevron-right")}</button>
        <button class="btn btn-ghost cal-print" type="button" id="print-list"${items.length ? "" : " disabled"}>${icon("printer")}Print my list</button>
      </div>
      ${events.length ? "" : `
      <div class="cal-empty">
        <p><strong>No events on My List yet.</strong> Press <strong>Save to My List</strong> on any event and it will show up here.</p>
        <a class="btn btn-primary" href="events.html">${icon("calendar-days")}Browse events</a>
      </div>`}
      <table class="cal-grid" aria-labelledby="cal-title">
        <thead><tr>${DAYS.map((d) => `<th scope="col"><abbr title="${d}">${d}</abbr></th>`).join("")}</tr></thead>
        <tbody>${weeks.join("")}</tbody>
      </table>
      ${events.length ? `
      <section class="agenda" aria-labelledby="agenda-title">
        <h2 id="agenda-title">Your events in ${label}</h2>
        ${days.length ? `<ol class="agenda-days">${days.map((day) => {
          const d = new Date(y, m, day);
          return `<li class="agenda-day${d < today ? " is-past" : ""}">
            <h3>${dateBlock({ date: d })}<span>${fmtDate(d)}${d < today ? " <small>(past)</small>" : ""}</span></h3>
            <ul class="agenda-events">${byDay.get(day).map(({ e, d }) => detail(e, d)).join("")}</ul>
          </li>`;
        }).join("")}</ol>` : `<p class="agenda-none">None of your saved events happen in ${MONTH_NAMES[m]}.</p>`}
        ${notThisMonth.length ? `
        <div class="agenda-later">
          <h3>Not happening in ${MONTH_NAMES[m]}</h3>
          <ul>${notThisMonth.map((e) => `<li><a href="${entryHref(e)}">${esc(e.name)}</a>: ${esc(e.when || nextLabel(e, nextDate(e)))}</li>`).join("")}</ul>
        </div>` : ""}
      </section>` : ""}
      ${others.length ? `
      <section class="agenda-others" aria-labelledby="others-title">
        <h2 id="others-title">Also on your list</h2>
        <p>These don't have set dates, so they aren't on the calendar.</p>
        <ul>${others.map((e) => `
          <li>
            <a href="${entryHref(e)}"><strong>${esc(e.name)}</strong></a>
            <small>${TYPES[e.type].label}${e.hours ? " · " + esc(e.hours) : ""}${e.phone ? " · " + esc(e.phone) : ""}</small>
            ${e.address ? `<a class="agenda-directions" href="${directionsUrl(e.address)}" target="_blank" rel="noopener">${icon("navigation")}Directions<span class="visually-hidden"> to ${esc(e.name)} in Google Maps (opens in a new tab)</span></a>` : ""}
          </li>`).join("")}</ul>
      </section>` : ""}`;
  }
  function initCalendarPage() {
    document.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-cal-step]"); if (!b) return;
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(b.dataset.calStep), 1);
      renderCalendar();
      const again = $(`[data-cal-step="${b.dataset.calStep}"]`);
      (again && !again.disabled ? again : $("#cal-title")).focus();
    });
  }

  function renderEntry(e, level = 2) {
    const src = SOURCES[e.source];
    const n = e.type === "event" ? nextDate(e) : null;
    const details = [
      e.type === "event" && `<li>${icon("calendar-days")}<span><span class="entry-next">${esc(nextLabel(e, n))}</span><br>${esc(e.when || "")}</span></li>`,
      !e.address && e.type === "organization" && `<li class="no-location">${icon("map-pin")}<span>No location provided</span></li>`,
      e.address && `<li>${icon("map-pin")}<span><a href="${directionsUrl(e.address)}" target="_blank" rel="noopener">${esc(e.address)}<span class="visually-hidden"> (get directions in Google Maps, opens in a new tab)</span></a></span></li>`,
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
          <button class="save-btn" type="button" data-id="${e.id}" aria-pressed="false">${icon("bookmark")}Save to My List</button>${calendarMenu(e, n)}
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

  const directionsUrl = (address) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  // Map of every listing with coordinates; pins at the same spot share one popup.
  function renderMap(items, plural) {
    if (!window.L || !items.some((e) => e.lat != null)) return "";
    return `
      <section class="map-panel" aria-labelledby="map-title">
        <div class="map-head">
          <h2 id="map-title">${icon("map-pin")}Where to find ${plural}</h2>
          <p>Select a pin to see what's there and get directions in Google Maps.</p>
        </div>
        <div class="map" id="map" role="region" aria-label="Map of ${plural}"></div>
      </section>`;
  }
  let updateMap = () => {};
  function initMap(items) {
    const el = $("#map"); if (!el) return;
    const places = new Map();
    items.filter((e) => e.lat != null).forEach((e) => {
      const key = `${e.lat},${e.lng}`;
      if (!places.has(key)) places.set(key, { lat: e.lat, lng: e.lng, address: e.address, entries: [] });
      places.get(key).entries.push(e);
    });
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const pin = L.divIcon({ className: "map-pin", html: icon("map-pin"), iconSize: [40, 40], iconAnchor: [20, 38], popupAnchor: [0, -34] });
    const markers = [...places.values()].map((p) => {
      const names = p.entries.map((e) => e.name);
      const marker = L.marker([p.lat, p.lng], { icon: pin, title: names.join(", ") }).bindPopup(`
        <div class="map-popup">
          <p class="map-popup-address">${esc(p.address)}</p>
          <ul>${p.entries.map((e) => `<li><a href="#${e.id}">${esc(e.name)}</a></li>`).join("")}</ul>
          <a class="btn btn-primary map-directions" href="${directionsUrl(p.address)}" target="_blank" rel="noopener">${icon("navigation")}Get directions<span class="visually-hidden"> in Google Maps (opens in a new tab)</span></a>
        </div>`, { maxWidth: 260, autoPanPaddingTopLeft: [56, 16], autoPanPaddingBottomRight: [16, 16] });
      return { marker, ids: p.entries.map((e) => e.id) };
    });
    markers.forEach(({ marker }) => marker.addTo(map));
    map.fitBounds(L.latLngBounds(markers.map(({ marker }) => marker.getLatLng())), { paddingTopLeft: [48, 72], paddingBottomRight: [48, 32], maxZoom: 15 });
    updateMap = (shownIds) => markers.forEach(({ marker, ids }) => {
      if (ids.some((id) => shownIds.has(id))) marker.addTo(map); else marker.remove();
    });
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
      ${renderMap(items, plural)}
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
      const shownIds = new Set();
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
        if (ok) { shown++; shownIds.add(e.id); }
      });
      updateMap(shownIds);
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
    initMap(items);
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

  // Homepage background: drone video embedded from YouTube (the clean middle of the video, looped).
  // Until it plays, or if it can't, a tour of Sammamish photos runs instead.
  // The pause button stops either one and is remembered.
  const SCENE_MS = 8000, FADE_MS = 1700;
  const BG_VIDEO = { id: "L6VZIEyO724", start: 9, end: 114, label: "Summer in Sammamish, video by Kevin Shi" };
  const VIDEO_REVEAL_MS = 4500;
  function initBannerMotion() {
    const btn = $("#banner-motion"), banner = $(".banner"); if (!btn || !banner) return;
    const scenes = $$(".banner-bg", banner), place = $("#banner-place-name"), videoBox = $("#banner-video");
    let paused = store.get("pref-banner-paused", false), current = 0, timer = null, player = null, videoOn = false, revealTimer = null;
    const show = (n) => {
      const prev = scenes[current];
      current = n % scenes.length;
      const next = scenes[current];
      prev.classList.replace("is-active", "is-leaving");
      setTimeout(() => prev.classList.remove("is-leaving"), FADE_MS);
      next.classList.add("is-active");
      if (place) place.textContent = next.dataset.place;
    };
    const schedule = () => {
      clearInterval(timer);
      if (!paused && !videoOn && !motionOff() && scenes.length > 1) timer = setInterval(() => show(current + 1), SCENE_MS);
    };
    const apply = () => {
      banner.classList.toggle("is-paused", paused);
      btn.innerHTML = `${icon(paused ? "circle-play" : "circle-pause")}<span>${paused ? "Play" : "Pause"} background</span>`;
      if (player && player.playVideo) { if (paused) player.pauseVideo(); else player.playVideo(); }
      schedule();
    };
    btn.addEventListener("click", () => { paused = !paused; store.set("pref-banner-paused", paused); apply(); });
    apply();

    if (!videoBox || motionOff()) return;
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player(videoBox.appendChild(document.createElement("div")), {
        videoId: BG_VIDEO.id, host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1, iv_load_policy: 3, start: BG_VIDEO.start, end: BG_VIDEO.end },
        events: {
          onReady: (e) => { e.target.mute(); if (paused) e.target.pauseVideo(); else e.target.playVideo(); },
          onStateChange: (e) => {
            // YouTube shows its title bar for a few seconds after playback starts, and a "More videos"
            // panel whenever the video pauses or buffers. So the video only fades in after it has been
            // playing for a few seconds, and fades back out to the photos whenever it stops.
            clearTimeout(revealTimer);
            if (e.data === YT.PlayerState.PLAYING) {
              revealTimer = setTimeout(() => {
                videoOn = true; videoBox.classList.add("is-on"); schedule();
                if (place) place.textContent = BG_VIDEO.label;
              }, VIDEO_REVEAL_MS);
            } else {
              videoBox.classList.remove("is-on");
            }
            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(BG_VIDEO.start, true); e.target.playVideo(); }
          }
        }
      });
      // Jump back to the start just before the clip's end, so the end credits never show.
      setInterval(() => {
        if (player && player.getCurrentTime && !paused && player.getCurrentTime() >= BG_VIDEO.end - 0.4) player.seekTo(BG_VIDEO.start, true);
      }, 250);
    };
    const api = document.createElement("script");
    api.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(api);
  }

  // Live weather card on the homepage, from Open-Meteo (free, no key). The sky behind it is drawn
  // and animated to match the conditions: stars at night, sun, drifting clouds, rain, snow, fog, or storms.
  const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=47.6163&longitude=-122.0356" +
    "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum" +
    "&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles&forecast_days=1";
  const WEATHER_REFRESH_MS = 15 * 60 * 1000;
  // WMO weather codes -> label, sky scene, and icon (day / night).
  function weatherInfo(code, day) {
    const c = (label, sky, dayIcon, nightIcon = dayIcon) => ({ label, sky, icon: day ? dayIcon : nightIcon });
    if (code === 0) return c(day ? "Sunny" : "Clear", "clear", "sun", "moon");
    if (code === 1) return c(day ? "Mostly sunny" : "Mostly clear", "clear", "sun", "moon");
    if (code === 2) return c("Partly cloudy", "partly", "cloud-sun", "cloud-moon");
    if (code === 3) return c("Cloudy", "cloudy", "cloud");
    if (code === 45 || code === 48) return c("Foggy", "fog", "cloud-fog");
    if (code >= 51 && code <= 57) return c("Drizzle", "rain", "cloud-drizzle");
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return c(code === 65 || code === 82 ? "Heavy rain" : code === 61 || code === 80 ? "Light rain" : "Rain", "rain", "cloud-rain");
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return c("Snow", "snow", "cloud-snow");
    if (code >= 95) return c("Thunderstorms", "storm", "cloud-lightning");
    return c("Cloudy", "cloudy", "cloud");
  }
  const rand = (min, max) => min + Math.random() * (max - min);
  function treeLine() {
    let trees = "";
    for (let x = -10; x < 1210; x += rand(26, 46)) {
      const hgt = rand(38, 96), wid = hgt * rand(0.32, 0.42), base = 120;
      trees += `<path d="M${x.toFixed(1)} ${base - hgt}L${(x + wid / 2).toFixed(1)} ${base}H${(x - wid / 2).toFixed(1)}Z"/>`;
    }
    return `<svg class="sky-trees" viewBox="0 0 1200 120" preserveAspectRatio="none">${trees}</svg>`;
  }
  function skyLayers(sky, day) {
    const many = (n, make) => Array.from({ length: n }, make).join("");
    const clouds = (n, dark) => many(n, (_, i) => `<span class="sky-cloud${dark ? " dark" : ""}" style="top:${rand(-6, 46).toFixed(0)}%;width:${rand(220, 420).toFixed(0)}px;animation-duration:${rand(55, 95).toFixed(0)}s;animation-delay:-${rand(0, 90).toFixed(0)}s;opacity:${rand(0.35, 0.75).toFixed(2)}"></span>`);
    let html = "";
    if (!day && (sky === "clear" || sky === "partly")) html += many(140, () => `<span class="sky-star" style="left:${rand(0, 100).toFixed(2)}%;top:${rand(0, 92).toFixed(2)}%;--s:${rand(1, 2.6).toFixed(1)}px;animation-delay:-${rand(0, 6).toFixed(1)}s;animation-duration:${rand(2.5, 6).toFixed(1)}s"></span>`);
    if (day && (sky === "clear" || sky === "partly")) html += `<span class="sky-sun"></span>`;
    if (sky === "partly") html += clouds(3, false);
    if (sky === "cloudy") html += clouds(6, !day);
    if (sky === "rain" || sky === "storm") html += clouds(5, true) + many(sky === "storm" ? 110 : 80, () => `<span class="sky-drop" style="left:${rand(-5, 105).toFixed(1)}%;animation-delay:-${rand(0, 1.2).toFixed(2)}s;animation-duration:${rand(0.55, 0.95).toFixed(2)}s"></span>`);
    if (sky === "storm") html += `<span class="sky-flash"></span>`;
    if (sky === "snow") html += clouds(4, false) + many(90, () => `<span class="sky-flake" style="left:${rand(0, 100).toFixed(1)}%;--s:${rand(3, 7).toFixed(1)}px;--drift:${rand(-40, 40).toFixed(0)}px;animation-delay:-${rand(0, 10).toFixed(1)}s;animation-duration:${rand(7, 13).toFixed(1)}s"></span>`);
    if (sky === "fog") html += many(4, (_, i) => `<span class="sky-fog" style="top:${18 + i * 18}%;animation-duration:${40 + i * 12}s;animation-delay:-${i * 9}s"></span>`);
    return html + treeLine();
  }
  function clockTime(iso) {
    const [hh, mm] = iso.split("T")[1].split(":").map(Number);
    return `${((hh + 11) % 12) + 1}:${pad2(mm)} ${hh < 12 ? "AM" : "PM"}`;
  }
  async function loadWeather() {
    const card = $("#weather"), body = $("#weather-body"); if (!card) return;
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error(res.status);
      const { current: now, daily } = await res.json();
      const day = now.is_day === 1, info = weatherInfo(now.weather_code, day);
      const deg = (v) => `${Math.round(v)}°`;
      const filled = ["sun", "moon", "cloud"].includes(info.icon);
      if (card.dataset.sky !== `${info.sky}-${day ? "day" : "night"}`) {
        card.dataset.sky = `${info.sky}-${day ? "day" : "night"}`;
        $(".weather-sky", card).innerHTML = skyLayers(info.sky, day);
      }
      body.innerHTML = `
        <div class="weather-top">
          <p class="weather-temp"><span class="visually-hidden">Temperature in Sammamish: </span>${deg(now.temperature_2m)}</p>
          <p class="weather-now"><span class="weather-icon${filled ? " is-filled" : ""}">${icon(info.icon)}</span><span>${info.label}</span></p>
        </div>
        <div class="weather-bottom">
          <div class="weather-stats">
            <ul>
              <li>Feels like <strong>${deg(now.apparent_temperature)}</strong></li>
              <li>High <strong>${deg(daily.temperature_2m_max[0])}</strong></li>
              <li>Low <strong>${deg(daily.temperature_2m_min[0])}</strong></li>
            </ul>
            <ul>
              <li>Chance of rain <strong>${daily.precipitation_probability_max[0] ?? 0}%</strong></li>
              <li><strong>${Number((daily.precipitation_sum[0] ?? 0).toFixed(2))} in</strong><span class="visually-hidden"> of rain today</span></li>
            </ul>
          </div>
          <p class="weather-source">Sammamish, WA · Updated ${clockTime(now.time)} · Data: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo<span class="visually-hidden"> (opens in a new tab)</span></a></p>
        </div>`;
    } catch (e) {
      card.dataset.sky = "error";
      body.innerHTML = `<p class="weather-loading">The weather isn't available right now. Check the <a href="https://forecast.weather.gov/MapClick.php?lat=47.6163&lon=-122.0356" target="_blank" rel="noopener">National Weather Service forecast for Sammamish<span class="visually-hidden"> (opens in a new tab)</span></a>.</p>`;
    }
  }
  function initWeather() {
    const card = $("#weather"); if (!card) return;
    loadWeather();
    setInterval(loadWeather, WEATHER_REFRESH_MS);
    // Only animate the sky while the card is on screen.
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => card.classList.toggle("is-offscreen", !en.isIntersecting)).observe(card);
  }

  // Homepage news: headlines saved to data/news.json every few hours by a GitHub Action
  // (.github/workflows/update-news.yml). Each card links to the full story on the newspaper's site.
  function newsDate(iso) {
    const d = new Date(iso), day = new Date(d); day.setHours(0, 0, 0, 0);
    const ago = Math.round((today - day) / 864e5);
    if (ago <= 0) return "Today";
    if (ago === 1) return "Yesterday";
    if (ago < 7) return `${ago} days ago`;
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  }
  async function initNews() {
    const list = $("#news"); if (!list) return;
    try {
      const res = await fetch("data/news.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const { items, source, updated } = await res.json();
      if (!items || !items.length) throw new Error("empty");
      // First story is the big feature on the left; the next two stack on the right.
      list.innerHTML = items.slice(0, 3).map((n, i) => {
        const photo = i === 0 ? (n.imageLarge || n.image) : (n.image || n.imageLarge);
        return `
        <li class="${i === 0 ? "news-lead" : "news-side"}"><a class="news-card" href="${esc(n.url)}" target="_blank" rel="noopener">
          <span class="news-photo">${photo ? `<img src="${esc(photo)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : ""}${icon("newspaper", "news-photo-fallback")}</span>
          <span class="news-text">
            <span class="news-meta"><span class="tag">${esc(n.section)}</span><time datetime="${esc(n.date)}">${newsDate(n.date)}</time></span>
            <strong class="news-title">${esc(n.title)}</strong>
            <span class="news-source">${icon("newspaper")}${esc(source.name)}${icon("external-link", "ext")}<span class="visually-hidden"> (opens in a new tab)</span></span>
          </span>
        </a></li>`;
      }).join("");
      $$(".news-photo img", list).forEach((img) => img.addEventListener("error", () => img.remove()));
      const u = new Date(updated);
      $("#news-updated").textContent = `The latest local stories from the ${source.name}. Checked ${MONTHS[u.getMonth()]} ${u.getDate()}.`;
    } catch (e) {
      list.innerHTML = `<li class="news-empty">News isn't available right now. Read the latest at the <a href="https://sammamishindependent.com/" target="_blank" rel="noopener">Sammamish Independent<span class="visually-hidden"> (opens in a new tab)</span></a>.</li>`;
    }
  }

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
    initCalendar();
    if (page === "home") { renderHome(); initBannerMotion(); initWeather(); initNews(); }
    if (TYPES[page]) renderCategory(page);
    if (page === "sources") renderSources();
    if (page === "calendar") initCalendarPage();
    $$("[data-search]").forEach(initSearch);
    updateListUI();
    if (location.hash) setTimeout(highlightTarget, 60);
    window.addEventListener("hashchange", highlightTarget);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
