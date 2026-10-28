import "./styles.css";
import { mountLandingEffects } from "./specularButton.js";

const API = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api")).replace(/\/$/, "");
const app = document.querySelector("#app");
let cleanupSpecularButtons = null;

const state = {
  token: localStorage.getItem("inkloom_token"),
  user: null,
  page: "overview",
  content: [],
  detail: null,
  analytics: null,
  brandKit: { guidelines: [], facts: [], assets: [] },
  attachedMedia: null,
  detailWorkbenchTab: "highlights", // "highlights" | "edit"
};

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const initials = (name = "Inkloom") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const date = (value) =>
  value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "—";

const titleCase = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const icon = (name) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"/><path d="m19 14 1.3 2.7L23 18l-2.7 1.3L19 22l-1.3-2.7L15 18l2.7-1.3L19 14z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    diff: '<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.file}</svg>`;
};

async function api(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    ...options.headers,
  };
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers,
      body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body,
    });
  } catch {
    throw new Error(`Could not connect to Inkloom's API at ${API}. Verify your server is running.`);
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && state.token) {
    logout();
    throw new Error(data.error || "Your session expired. Please sign in again.");
  }
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function toast(message, kind = "success") {
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = `toast ${kind}`;
  element.setAttribute("role", "status");
  element.textContent = message;
  document.body.append(element);
  window.setTimeout(() => element.remove(), 4200);
}

function logout() {
  localStorage.removeItem("inkloom_token");
  state.token = null;
  state.user = null;
  state.detail = null;
  state.content = [];
  renderLanding();
}

async function switchPersona(role) {
  const credentials = {
    admin: { email: "admin@demo.test", name: "Alex Admin" },
    creator: { email: "creator@demo.test", name: "Cara Creator" },
    reviewer: { email: "reviewer@demo.test", name: "Rae Reviewer" },
  }[role];
  if (!credentials) return;
  try {
    toast(`Switching persona to ${credentials.name}…`, "info");
    const result = await api("/auth/login", {
      method: "POST",
      body: { email: credentials.email, password: "Passw0rd!demo" },
    });
    state.token = result.token;
    state.user = result.user;
    localStorage.setItem("inkloom_token", result.token);
    await loadApp();
    toast(`Active as ${result.user.name} (${titleCase(result.user.role)})`, "success");
  } catch (err) {
    toast(`Could not switch persona: ${err.message}`, "error");
  }
}

// Word-level Myers diff algorithm
function diffWords(oldText = "", newText = "") {
  if (oldText === newText) return [{ type: "same", value: oldText }];
  const oldTokens = oldText.split(/(\s+)/);
  const newTokens = newText.split(/(\s+)/);
  const m = oldTokens.length;
  const n = newTokens.length;
  if (m === 0) return newTokens.map((v) => ({ type: "added", value: v }));
  if (n === 0) return oldTokens.map((v) => ({ type: "removed", value: v }));

  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (oldTokens[i] === newTokens[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }
  let i = m;
  let j = n;
  const result = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      result.unshift({ type: "same", value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", value: newTokens[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: "removed", value: oldTokens[i - 1] });
      i--;
    }
  }
  return result;
}

// In-text interactive highlighting
function renderHighlightedDraft(text = "", findings = []) {
  if (!findings || !findings.length) {
    return `<div class="draft-text-content">${escapeHtml(text)}</div>`;
  }
  const valid = findings
    .filter((f) => f.start != null && f.end != null && f.end > f.start && f.status === "open")
    .sort((a, b) => a.start - b.start);

  let html = "";
  let lastIndex = 0;
  for (const f of valid) {
    if (f.start < lastIndex) continue;
    html += escapeHtml(text.slice(lastIndex, f.start));
    const sev = f.severity || "medium";
    const cat = f.category || "general";
    html += `<mark class="highlight-mark highlight-${escapeHtml(sev)} highlight-${escapeHtml(cat)}" data-highlight-fid="${escapeHtml(f.fid)}" title="${escapeHtml(f.explanation)}" tabindex="0"><span>${escapeHtml(text.slice(f.start, f.end))}</span><span class="highlight-tag">${escapeHtml(sev.toUpperCase())}</span></mark>`;
    lastIndex = f.end;
  }
  html += escapeHtml(text.slice(lastIndex));
  return `<div class="draft-text-content highlighted-draft">${html}</div>`;
}

// Client-side rule tester for interactive Brand Sandbox
function testSnippetLocally(snippet, guidelines = [], facts = []) {
  if (!snippet.trim()) return { score: 100, findings: [] };
  const findings = [];
  for (const g of guidelines.filter((x) => x.active !== false)) {
    try {
      const re = new RegExp(g.pattern, "gi");
      for (const m of snippet.matchAll(re)) {
        if (!m[0]) continue;
        findings.push({
          category: g.category,
          severity: g.severity || "medium",
          excerpt: m[0],
          explanation: g.rule,
          suggestion: g.replacement || null,
          sourceLabel: `Guideline v${g.version || 1}: ${g.rule}`,
        });
      }
    } catch {}
  }
  for (const f of facts.filter((x) => x.status === "active")) {
    if (!f.match?.regex || f.match.expected == null) continue;
    try {
      const re = new RegExp(f.match.regex, "gi");
      for (const m of snippet.matchAll(re)) {
        const got = m.slice(1).find((v) => v !== undefined);
        if (got === undefined || String(got) === String(f.match.expected)) continue;
        findings.push({
          category: "factual",
          severity: "critical",
          excerpt: m[0],
          explanation: `Says “${got}” but approved fact is “${f.match.expected}”.`,
          suggestion: m[0].replace(got, f.match.expected),
          sourceLabel: `Approved Fact v${f.version || 1}: ${f.statement}`,
        });
      }
    } catch {}
  }
  const checks = [
    { pattern: /<img\b(?![^>]*\balt\s*=)[^>]*>/gi, category: "accessibility", severity: "medium", explanation: "Image missing alternative text." },
    { pattern: /\[(?:click here|here|read more|learn more)\]\([^)]+\)/gi, category: "accessibility", severity: "medium", explanation: "Use descriptive link destination text." },
    { pattern: /\b(?:TODO|LOREM IPSUM|TBD|REPLACE[ _-]ME)\b/gi, category: "messaging", severity: "high", explanation: "Unfinished draft placeholder detected." },
    { pattern: /(?:logo[-_]?(?:old|draft|v1|temp)\.(?:png|jpg|svg|webp))/gi, category: "visual", severity: "high", explanation: "Deprecated or unofficial logo asset reference." },
  ];
  for (const c of checks) {
    for (const m of snippet.matchAll(c.pattern)) {
      findings.push({
        category: c.category,
        severity: c.severity,
        excerpt: m[0],
        explanation: c.explanation,
        suggestion: null,
        sourceLabel: "Built-in Governance Check",
      });
    }
  }
  const weights = { critical: 25, high: 12, medium: 6, low: 2 };
  const deduction = findings.reduce((sum, f) => sum + (weights[f.severity] || 0), 0);
  const score = Math.max(0, 100 - deduction);
  return { score, findings };
}

// Media file analyzer (aspect ratio, dimensions, canvas color extraction)
function analyzeMediaFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = (width / height).toFixed(2);
      const isLandscape16_9 = Math.abs(width / height - 16 / 9) < 0.15;
      const isSquare1_1 = Math.abs(width / height - 1.0) < 0.1;
      const isPortrait4_5 = Math.abs(width / height - 4 / 5) < 0.1;

      const canvas = document.createElement("canvas");
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 10, 10);
      const pixelData = ctx.getImageData(0, 0, 10, 10).data;
      const colors = [];
      for (let i = 0; i < pixelData.length; i += 40) {
        const r = pixelData[i].toString(16).padStart(2, "0");
        const g = pixelData[i + 1].toString(16).padStart(2, "0");
        const b = pixelData[i + 2].toString(16).padStart(2, "0");
        colors.push(`#${r}${g}${b}`.toUpperCase());
      }

      callback({
        name: file.name,
        dataUrl,
        width,
        height,
        ratio,
        fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
        standardRatio: isLandscape16_9 ? "16:9 (Landscape Web)" : isSquare1_1 ? "1:1 (Square Feed)" : isPortrait4_5 ? "4:5 (Portrait Social)" : "Custom Dimension",
        isRatioStandard: isLandscape16_9 || isSquare1_1 || isPortrait4_5,
        isSizeOptimized: file.size < 2 * 1024 * 1024,
        colors: [...new Set(colors)].slice(0, 4),
      });
    };
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

function renderLanding() {
  cleanupSpecularButtons?.();
  app.innerHTML = `<a class="skip-link" href="#landing-main">Skip to content</a>
    <div class="landing-page" id="landing-top">
      <header class="landing-header">
        <a class="brand landing-brand" href="#landing-top" aria-label="Inkloom home"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
        <nav class="landing-nav" aria-label="Main navigation"><a href="#what-we-check">Capabilities</a><a href="#how-it-works">How it works</a><a href="#for-teams">For teams</a><a href="#faq">FAQ</a></nav>
        <div class="landing-actions"><button class="landing-login" data-landing-login>Sign in</button><button class="button button-primary" data-landing-register>Get started ${icon("arrow")}</button></div>
      </header>
      <main id="landing-main">
        <section class="landing-hero">
          <div class="hero-copy">
            <div class="animated-kicker"><span class="kicker-badge">NEW</span><span class="kicker-pulse"></span><span>Brand governance for every content team</span><span class="kicker-spark">✦</span></div>
            <h1>Keep every voice<br><span class="flip-words-container"><span class="flip-word" data-flip-word>true to your brand.</span></span></h1>
            <p class="hero-paragraph">When many people and tools publish content, small inconsistencies can erode trust. Inkloom checks drafts against your <span class="highlight-text">approved facts</span> and <span class="highlight-text">guidelines</span>, explains what needs attention, and keeps <span class="highlight-text bold">people in control</span>.</p>
            <div class="hero-ctas"><button class="button button-primary button-large" data-landing-register>Create your workspace ${icon("arrow")}</button><a class="hero-secondary" href="#how-it-works">See how reviews work <span>↓</span></a></div>
            <div class="hero-assurance"><span class="assurance-icon">${icon("shield")}</span><span><strong>Human decisions stay central</strong><small>Rules-based checks work without AI. AI review is optional.</small></span></div>
          </div>
          <div class="hero-visual" aria-label="Illustration of an explainable brand review">
            <div class="visual-orbit orbit-a"></div><div class="visual-orbit orbit-b"></div>
            <div class="review-preview">
              <div class="preview-top"><span class="preview-doc">${icon("file")}</span><span><strong>Draft review</strong><small>Example finding · Claims guideline</small></span><span class="preview-live"><i></i> Needs review</span></div>
              <div class="preview-rule"><span>APPROVED GUIDELINE</span><strong>Claims must be supported by approved evidence.</strong></div>
              <div class="preview-excerpt"><span>IN THE DRAFT</span><p>“The <mark>best platform in the world</mark> for modern marketing.”</p></div>
              <div class="preview-finding"><span class="preview-alert">${icon("warning")}</span><div><div class="preview-finding-title"><strong>Evidence needed</strong><span>CLAIMS · HIGH</span></div><p>“Best platform” is an unsupported superlative. No approved comparison source was found.</p></div></div>
              <div class="preview-suggestion"><span>${icon("spark")} Suggested direction</span><p>“A platform designed to help teams do their best work.”</p></div>
              <div class="preview-footer"><span>Suggestion for the creator to consider</span><span>Reviewer makes the final decision</span></div>
            </div>
            <div class="hero-caption"><span class="caption-spark">✳</span> Clear reasons. Approved sources. People in control.</div>
          </div>
        </section>
        <section class="trust-strip" aria-label="Inkloom review principles">
          <div class="trust-strip-label">
            <span class="trust-dot"></span>
            <span>BUILT FOR TRUSTWORTHY CONTENT</span>
          </div>
          <div class="marquee-wrapper">
            <div class="marquee-track">
              <!-- Set 1 -->
              <span class="trust-pill trust-pill-emerald">${icon("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo">${icon("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber">${icon("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose">${icon("lock")} <strong>Workspace privacy</strong></span>
              <!-- Set 2 -->
              <span class="trust-pill trust-pill-emerald" aria-hidden="true">${icon("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo" aria-hidden="true">${icon("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber" aria-hidden="true">${icon("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose" aria-hidden="true">${icon("lock")} <strong>Workspace privacy</strong></span>
              <!-- Set 3 -->
              <span class="trust-pill trust-pill-emerald" aria-hidden="true">${icon("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo" aria-hidden="true">${icon("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber" aria-hidden="true">${icon("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose" aria-hidden="true">${icon("lock")} <strong>Workspace privacy</strong></span>
            </div>
          </div>
        </section>
        <section class="landing-section checks-section" id="what-we-check"><div class="landing-section-heading"><span class="landing-kicker">ONE REVIEW, WITH THE REASONS INCLUDED</span><h2>Catch the drift.<br><em>Keep the creator’s intent.</em></h2><p>Use approved brand knowledge to check drafts before publication. Every finding gives your team useful context for what to do next.</p></div><div class="check-grid">
          <article class="check-card"><span class="check-badge">1</span><h3>Approved facts &amp; guidelines</h3><p>Keep versioned facts, terminology, tone, and claims guidance together as your team’s reference point.</p><span class="check-tag">YOUR BRAND KNOWLEDGE</span></article>
          <article class="check-card"><span class="check-badge">2</span><h3>Consistent language &amp; claims</h3><p>Flag outdated details, off-brand wording, terminology mismatches, and unsupported promotional claims.</p><span class="check-tag">FACTS · TONE · MESSAGING</span></article>
          <article class="check-card"><span class="check-badge">3</span><h3>Accessible draft content</h3><p>Check HTML and Markdown drafts for missing image alt text and vague link labels before they go out.</p><span class="check-tag">BUILT-IN ACCESSIBILITY CHECKS</span></article>
          <article class="check-card"><span class="check-badge">4</span><h3>Findings people can understand</h3><p>See the excerpt, why it was flagged, the supporting source when available, and a possible revision.</p><span class="check-tag">EXPLAINABLE &amp; SOURCE-AWARE</span></article>
          <article class="check-card"><span class="check-badge">5</span><h3>Human review &amp; accountability</h3><p>Creators revise, reviewers decide, and version history keeps the discussion and outcome traceable.</p><span class="check-tag">ROLES · APPROVALS · AUDIT</span></article>
          <article class="check-card"><span class="check-badge">6</span><h3>Governance insights</h3><p>See repeated issues, review activity, and guidance people often reject so your process can improve.</p><span class="check-tag">LEARN FROM REVIEW HISTORY</span></article>
        </div></section>
        <section class="workflow-section" id="how-it-works"><div class="workflow-intro"><span class="landing-kicker">FROM FIRST DRAFT TO HUMAN APPROVAL</span><h2>A clear path to on-brand publishing</h2><p>Automation helps your team spot issues early. People keep control of edits and decisions.</p></div><div class="workflow-steps"><article><span>1</span><h3>Set your brand guidance</h3><p>Add approved facts, claims, terminology, and tone guidelines to your workspace.</p><small>ADMIN-MAINTAINED KNOWLEDGE</small></article><article><span>2</span><h3>Review a draft</h3><p>Paste content or import a text file. Run rules-based checks, with optional AI review.</p><small>AI OPTIONAL · RULES ALWAYS AVAILABLE</small></article><article><span>3</span><h3>Revise with context</h3><p>Inspect excerpts, reasons, sources, and suggested fixes. Choose what to accept or reject.</p><small>CREATOR STAYS IN CONTROL</small></article><article><span>4</span><h3>Approve and learn</h3><p>Submit for teammate review, track the decision, and use governance insights to improve guidance.</p><small>HUMAN SIGN-OFF · HISTORY</small></article></div></section>
        <section class="teams-section" id="for-teams"><div><span class="landing-kicker teams-kicker">SHARED OWNERSHIP, CLEAR RESPONSIBILITY</span><h2>Creators, reviewers,<br><em>one trusted process.</em></h2><p>Give creators room to write, reviewers the evidence to make a decision, and admins the tools to keep approved guidance current.</p><button class="button teams-cta-button" data-landing-register>Start with your team ${icon("arrow")}</button></div><div class="teams-card"><div class="team-row creator-row"><span class="team-step creator-step">C</span><div><strong>Creator</strong><small>Drafts, considers findings, and submits for review</small></div><span class="team-check">01</span></div><div class="team-row reviewer-row"><span class="team-step reviewer-step">R</span><div><strong>Reviewer</strong><small>Checks evidence, leaves feedback, records a decision</small></div><span class="team-check">02</span></div><div class="team-row admin-row"><span class="team-step admin-step">A</span><div><strong>Admin</strong><small>Maintains approved facts, guidelines, and team roles</small></div><span class="team-check">03</span></div><div class="teams-card-note">${icon("lock")} AI review is optional. Only the text needed for review is sent to the configured provider.</div></div></section>
        <section class="landing-cta" id="governance-trust"><span class="cta-mark">i.</span><div><span class="landing-kicker">RESPONSIBLE AUTOMATION, WITH PEOPLE IN CONTROL</span><h2>Make better decisions<br><em>before content goes live.</em></h2><p>Rules-based checks work without AI. When AI is enabled, your team can review its findings and keep the final say.</p></div><button class="button button-light button-large" data-landing-register>Create your workspace ${icon("arrow")}</button></section>
        <section class="faq-section" id="faq"><div class="faq-intro"><span class="landing-kicker">GOOD TO KNOW</span><h2>Clear answers before your first review.</h2><p>Inkloom is designed to make brand reviews understandable, useful, and accountable.</p></div><div class="faq-list">
          <details><summary>What can Inkloom review today?</summary><p>Teams can review pasted drafts and import text files. Built-in accessibility checks can flag missing image alt text and vague links in HTML and Markdown. PDF and DOCX uploads and visual image analysis are not supported yet.</p></details>
          <details><summary>Do we need to use AI?</summary><p>No. Rules and approved-fact checks run without AI. If an AI provider is configured, AI review is optional and the rules-based review remains available if the provider fails.</p></details>
          <details><summary>How does Inkloom keep people in control?</summary><p>Suggestions are choices for the creator. Teammates review submitted content, record decisions, and can request changes or reject content. Critical findings block approval unless an authorised reviewer records an override reason.</p></details>
          <details><summary>What happens to content sent for AI review?</summary><p>Only the text needed for a review is sent to the configured AI provider. Check that provider’s retention policy and tell your team when AI review is enabled.</p></details>
        </div></section>
      </main>
      <section class="newsletter-section" aria-labelledby="newsletter-heading"><span class="newsletter-icon">${icon("mail")}</span><h2 id="newsletter-heading">Stay informed on brand governance best practices.</h2><p>Occasional practical notes on brand safety, explainable AI reviews, and content workflows.</p><form id="newsletter-form"><label class="sr-only" for="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com"><button class="button newsletter-submit" type="submit">Stay in the loop</button></form><small class="newsletter-disclaimer">Your email stays private. <button type="button" data-newsletter-mode="unsubscribe">Already subscribed? Unsubscribe</button></small></section>
      <footer class="landing-footer"><div class="footer-main"><div class="footer-brand-column"><a class="brand brand-light" href="#landing-top"><span class="brand-mark">i.</span><span>inkloom ai</span></a><p>Brand governance that helps teams publish consistent, trustworthy content.</p><span class="footer-security">${icon("shield")} Explainable checks · Human oversight · AI optional</span></div><div class="footer-column"><strong>PRODUCT</strong><a href="#what-we-check">What we check</a><a href="#how-it-works">How it works</a><a href="#faq">Frequently asked questions</a></div><div class="footer-column"><strong>YOUR TEAM</strong><a href="#for-teams">Roles &amp; approvals</a><button data-landing-login>Sign in</button></div><div class="footer-column"><strong>TRANSPARENCY</strong><span>Rules-based checks work without AI</span><span>Text review only for supported formats</span><span>Human approval stays in the loop</span></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Inkloom AI</span><span>Consistent content. Clear reasons. Human decisions.</span></div></footer>
    </div>`;
  cleanupSpecularButtons = mountLandingEffects(app);
}

function renderAuth(register = false) {
  cleanupSpecularButtons?.();
  cleanupSpecularButtons = null;
  app.innerHTML = `<main class="auth-screen">
    <section class="auth-aside">
      <div class="auth-aside-inner"></div>
      <a class="brand brand-light" href="#" aria-label="Inkloom home"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
      <div class="auth-story">
        <span class="eyebrow light">INTELLIGENT BRAND GOVERNANCE</span>
        <h1>Ensure every<br>word feels like <em>you.</em></h1>
        <p>Deterministic brand rules, verified company facts, and human approval workflows before any draft goes live.</p>
        <div class="auth-features">
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${icon("book")}</span>Approved facts</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${icon("info")}</span>Clear findings</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${icon("users")}</span>Human approvals</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${icon("lock")}</span>Workspace privacy</div>
        </div>
      </div>
      <div class="demo-card">
        <span class="demo-icon">${icon("users")}</span>
        <div>
          <strong>Evaluation Demo Logins (Password: <code>Passw0rd!demo</code>)</strong>
          <p>
            • Admin: <button type="button" class="text-button" data-demo="admin">admin@demo.test</button><br>
            • Creator: <button type="button" class="text-button" data-demo="creator">creator@demo.test</button><br>
            • Reviewer: <button type="button" class="text-button" data-demo="reviewer">reviewer@demo.test</button>
          </p>
        </div>
      </div>
      <span class="auth-foot">Confidential workspace · Isolated tenant storage</span>
    </section>
    <section class="auth-panel"><div class="auth-form-wrap">
      <span class="eyebrow">WORKSPACE ACCESS</span>
      <h2>${register ? "Create your <span class=\"auth-heading-accent\">brand workspace</span>" : "Welcome back to <span class=\"auth-heading-accent\">Inkloom</span>"}</h2>
      <p class="muted">${register ? "Establish a private brand kit and invite your review team." : "Sign in to review content and inspect governance insights."}</p>
      <form id="auth-form" class="form-stack">
        ${register ? '<label>Full name<input name="name" autocomplete="name" placeholder="Alex Morgan" required maxlength="100"></label><label>Organization name<input name="organisationName" placeholder="Acme Studio" required maxlength="120"></label>' : ""}
        <label>Work email<input name="email" type="email" autocomplete="email" placeholder="you@company.com" required></label>
        <label>Password<input name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" placeholder="${register ? "At least 8 characters" : "Your password"}" required minlength="${register ? 8 : 1}"></label>
        <button class="button button-primary button-wide" type="submit">${register ? "Create workspace" : "Sign in"} ${icon("arrow")}</button>
      </form>
      <p class="auth-switch">${register ? "Already have an account?" : "New to Inkloom?"} <button type="button" class="text-button" data-auth-toggle>${register ? "Sign in" : "Create a workspace"}</button><br><button type="button" class="auth-home-link" data-auth-home>← Back to Inkloom home</button></p>
      <p class="privacy-note">${icon("lock")} Private by design. Rule engine runs locally on your server. Confidential materials are protected.</p>
    </div></section>
  </main>`;

  document.querySelector("#auth-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Authenticating…';
    try {
      const result = await api(register ? "/auth/register" : "/auth/login", { method: "POST", body: form });
      state.token = result.token;
      state.user = result.user;
      localStorage.setItem("inkloom_token", result.token);
      await loadApp();
    } catch (error) {
      toast(error.message, "error");
      button.disabled = false;
      button.innerHTML = `${register ? "Create workspace" : "Sign in"} ${icon("arrow")}`;
    }
  });
}

function navItem(page, label, symbol, badge = "") {
  return `<button class="nav-link ${state.page === page ? "active" : ""}" data-page="${page}">${icon(symbol)}<span>${label}</span>${badge ? `<span class="nav-count">${badge}</span>` : ""}</button>`;
}

function shell(content) {
  const user = state.user;
  const pending = state.content.filter((item) => item.status === "in_review").length;
  app.innerHTML = `
  <div class="print-only-header">
    <h2>INKLOOM AI — BRAND GOVERNANCE AUDIT SUMMARY</h2>
    <p>Organization: <strong>${escapeHtml(user?.organisationName || "Demo Co")}</strong> | Export Date: ${date(new Date())} | User: ${escapeHtml(user?.name)}</p>
  </div>
  <div class="app-shell">
    <aside class="sidebar">
      <a href="#" class="brand"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
      <div class="workspace-switch"><span class="workspace-avatar">${escapeHtml(initials(user?.organisationName || "Demo"))}</span><span class="workspace-name">${escapeHtml(user?.organisationName || "Demo Co")}<small>${escapeHtml(user?.role?.toUpperCase())} WORKSPACE</small></span><span class="switch-caret">✓</span></div>
      <div class="nav-section"><span class="nav-label">WORKSPACE</span>${navItem("overview", "Overview", "grid")}${navItem("content", "All Content", "file")}${navItem("approvals", "Approvals Queue", "check", pending || "")}</div>
      <div class="nav-section"><span class="nav-label">BRAND GOVERNANCE</span>${navItem("guidelines", "Brand Kit & Assets", "book")}${navItem("analytics", "Governance Insights", "chart")}${navItem("team", "Team & Roles", "users")}</div>
      <div class="sidebar-bottom">
        <div class="privacy-card"><span class="privacy-icon">${icon("shield")}</span><strong>Responsible AI review</strong><p>Rules-based checks run without AI. Optional AI sends only review text to your configured provider.</p><button data-page="guidelines">View Brand Kit ${icon("arrow")}</button></div>
        <button class="profile" data-logout><span class="avatar">${escapeHtml(initials(user?.name))}</span><span class="profile-info">${escapeHtml(user?.name)}<small>${escapeHtml(user?.role)} · Sign out</small></span><span class="logout-symbol">↗</span></button>
      </div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumbs"><span>Workspace</span><span class="crumb-slash">/</span><strong>${escapeHtml(titleCase(state.page))}</strong></div>
        <div class="topbar-right">
          <div class="persona-switcher" aria-label="Demo Persona Switcher">
            <span class="persona-label">Persona:</span>
            <button class="persona-chip ${user?.role === "admin" ? "active" : ""}" data-switch-role="admin" title="Full brand kit admin">👑 Admin</button>
            <button class="persona-chip ${user?.role === "creator" ? "active" : ""}" data-switch-role="creator" title="Drafts & submits content">✏️ Creator</button>
            <button class="persona-chip ${user?.role === "reviewer" ? "active" : ""}" data-switch-role="reviewer" title="Reviews & approves drafts">🧐 Reviewer</button>
          </div>
          <span class="secure-label">${icon("shield")} Secure Tenant</span>
          <button class="avatar avatar-small" aria-label="Account">${escapeHtml(initials(user?.name))}</button>
        </div>
      </header>
      <div class="page-body">${content}</div>
    </main>
  </div>
  <dialog id="app-modal"></dialog>`;
}

const statusBadge = (status) => `<span class="status-badge status-${escapeHtml(status)}"><i></i>${escapeHtml(titleCase(status))}</span>`;
const scoreClass = (score) => (score >= 90 ? "score-good" : score >= 70 ? "score-mid" : "score-low");

const contentRows = (items) =>
  items.length
    ? items
        .map(
          (item) => `<button class="content-row" data-open="${escapeHtml(item._id)}">
    <span class="content-type-icon">${icon(item.type === "email" ? "mail" : item.type === "social" ? "spark" : "file")}</span>
    <span class="row-title"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(titleCase(item.type))} · By ${escapeHtml(item.createdByName || "Team member")}</small></span>
    <span class="row-score ${item.score == null ? "score-na" : scoreClass(item.score)}">${item.score == null ? "—" : `${item.score}<small>/100</small>`}</span>
    ${statusBadge(item.status)}
    <span class="row-date">${date(item.updatedAt)}</span>
    ${icon("arrow")}
  </button>`
        )
        .join("")
    : `<div class="empty-state"><span class="empty-illustration">✳</span><strong>No content here yet.</strong><p>Bring in a draft to run an explainable brand governance review.</p><button class="button button-primary" data-page="new-content">Create your first review</button></div>`;

function overviewPage() {
  const items = state.content.slice(0, 5);
  const analytics = state.analytics || {};
  const awaiting = state.content.filter((item) => item.status === "in_review").length;
  const reviewed = state.content.filter((item) => item.score != null).length;
  const score = analytics.avgScore;
  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();

  return `
    <div class="page-heading">
      <div><span class="eyebrow">🗓 ${today}</span><h1>Brand Governance <em>Dashboard</em></h1><p class="muted">Real-time status of brand alignment, active approvals, and governance findings.</p></div>
      <div class="heading-actions">
        <button class="button button-outline" data-action="print-report">${icon("printer")} Export Report</button>
        <button class="button button-primary" data-page="new-content">${icon("plus")} New Content Review</button>
      </div>
    </div>
    <section class="welcome-banner">
      <div class="welcome-text"><span class="welcome-mark">✳</span><div><span class="eyebrow light">✦ INTELLIGENT BRAND SAFEGUARDS</span><h2>Consistent brand voice <em>across every channel.</em></h2><p>Deterministic factual verification, tone alignment, accessibility checks, and approved asset standards.</p></div></div>
      <button class="button button-light" data-page="new-content">Review a new draft ${icon("arrow")}</button>
      <span class="banner-orbit orbit-one"></span><span class="banner-orbit orbit-two"></span>
    </section>
    <section class="metric-grid">
      <article class="metric-card"><span class="metric-icon metric-lavender">${icon("file")}</span><span class="metric-label">Content Reviewed</span><strong>${reviewed}<small> drafts</small></strong><span class="metric-foot">Across ${state.content.length} total workspace items</span></article>
      <article class="metric-card"><span class="metric-icon metric-mint">${icon("spark")}</span><span class="metric-label">Brand Alignment Score</span><strong>${score == null ? "—" : `${score}`}<small>${score == null ? "" : "/100"}</small></strong><span class="metric-foot">${score == null ? "Run reviews to establish score" : "Workspace average quality"}</span></article>
      <article class="metric-card"><span class="metric-icon metric-peach">${icon("clock")}</span><span class="metric-label">Pending Approvals</span><strong>${awaiting}<small> items</small></strong><span class="metric-foot">${awaiting ? "Awaiting reviewer sign-off" : "All caught up"}</span></article>
      <article class="metric-card"><span class="metric-icon metric-rose">${icon("warning")}</span><span class="metric-label">Open Critical Issues</span><strong>${analytics.criticalOpen ?? 0}<small> issues</small></strong><span class="metric-foot">Require resolution or written override</span></article>
    </section>
    <section class="section-block">
      <div class="section-heading"><div><span class="eyebrow">📋 ACTIVITY PIPELINE</span><h2>Recently Touched <em>Content</em></h2></div><button class="button button-quiet" data-page="content">View all ${icon("arrow")}</button></div>
      <div class="content-list">${contentRows(items)}</div>
    </section>`;
}

function contentPage() {
  const query = new URLSearchParams(location.hash.split("?")[1] || "");
  const filter = query.get("status") || "all";
  const items = filter === "all" ? state.content : state.content.filter((item) => item.status === filter);
  return `
    <div class="page-heading"><div><span class="eyebrow">📁 ORGANIZATION CONTENT</span><h1>All Content <em>Drafts</em></h1><p class="muted">All marketing, social, email, and web copy across the review lifecycle.</p></div><button class="button button-primary" data-page="new-content">${icon("plus")} New Review</button></div>
    <div class="filter-tabs">
      ${[["all", "Everything"], ["draft", "Drafts"], ["in_review", "In Review"], ["approved", "Approved"], ["changes_requested", "Changes Requested"]].map(([val, label]) => `<button class="filter-tab ${filter === val ? "selected" : ""}" data-filter="${val}">${label}</button>`).join("")}
    </div>
    <div class="content-list">${contentRows(items)}</div>`;
}

function newContentPage() {
  return `
    <div class="page-heading"><div><button class="back-link" data-page="content">← Back to content</button><span class="eyebrow">✏️ NEW REVIEW WORKFLOW</span><h1>Create &amp; Review <em>Content</em></h1><p class="muted">Check copy, visual assets, and links against approved brand guidelines before publication.</p></div></div>
    <form id="new-content-form" class="editor-layout">
      <section class="editor-card">
        <div class="editor-topline"><span class="step-number">01</span><div><strong>Content Details</strong><small>Paste text or import Markdown / HTML / TXT / CSV.</small></div>
          <label class="upload-button">${icon("file")} Import text file<input type="file" id="draft-file" accept=".txt,.md,.html,.csv,.json,text/plain,text/markdown,text/html"></label>
        </div>
        <label>Draft Title<input name="title" maxlength="200" required placeholder="e.g. Q4 Product Launch Announcement"></label>
        <label>Content Format<select name="type"><option value="marketing">Marketing copy</option><option value="social">Social media post</option><option value="email">Email newsletter</option><option value="web">Website landing page</option><option value="press">Press release</option></select></label>
        <label>Draft Content<textarea name="text" id="draft-text" maxlength="20000" required rows="12" placeholder="Paste your draft copy here. Include links, images or text. Inkloom will evaluate it against your brand kit..."></textarea></label>
        
        <!-- Visual Asset Inspector Section -->
        <div class="media-inspector-card">
          <div class="editor-topline"><span class="step-number">02</span><div><strong>Visual &amp; Media Asset Inspector (Optional)</strong><small>Upload an image to check dimensions, aspect ratio, alt text, and color harmony.</small></div>
            <label class="upload-button">${icon("image")} Attach image<input type="file" id="media-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml"></label>
          </div>
          <div id="media-preview-container" class="hidden"></div>
        </div>

        <div class="editor-footer"><span><span id="word-count">0 words</span> · Up to 20,000 characters</span><button class="button button-primary" type="submit">${icon("spark")} Save &amp; Run Brand Review</button></div>
      </section>
      <aside class="editor-aside">
        <div class="soft-card"><span class="soft-card-icon">${icon("book")}</span><span class="eyebrow">BRAND KIT SOURCES</span><h3>Multi-Dimensional Governance</h3><p>Every finding links back to an approved fact, terminology rule, or accessibility standard.</p><button type="button" class="text-button" data-page="guidelines">Explore brand kit ${icon("arrow")}</button></div>
        <div class="soft-card soft-card-light"><span class="soft-card-icon">${icon("shield")}</span><strong>Explainable &amp; Safe</strong><p>Suggestions are strictly optional. Human creators retain final creative authority.</p></div>
      </aside>
    </form>`;
}

function findingCard(finding, index) {
  return `<article class="finding-card finding-${escapeHtml(finding.severity)}" data-finding-fid="${escapeHtml(finding.fid)}">
    <div class="finding-head"><span class="finding-number">${String(index + 1).padStart(2, "0")}</span><span class="finding-category">${escapeHtml(titleCase(finding.category))}</span><span class="severity severity-${escapeHtml(finding.severity)}">${escapeHtml(titleCase(finding.severity))}</span><span class="finding-status">${escapeHtml(titleCase(finding.status))}</span></div>
    <blockquote>“${escapeHtml(finding.excerpt)}”</blockquote>
    <p class="finding-explanation">${escapeHtml(finding.explanation)}</p>
    <div class="finding-source"><span class="source-dot ${finding.evidenceMissing ? "source-missing" : ""}">${finding.evidenceMissing ? "?" : "↗"}</span><span><small>${finding.evidenceMissing ? "NO SUPPORTING SOURCE" : finding.sourceType === "accessibility" ? "ACCESSIBILITY CHECK" : finding.sourceType === "governance" ? "GOVERNANCE STANDARD" : "APPROVED BRAND SOURCE"}</small><strong>${escapeHtml(finding.sourceLabel || "No supporting source found")}</strong></span></div>
    ${finding.suggestion ? `<div class="suggestion"><span class="suggestion-label">${icon("spark")} Suggested On-Brand Correction</span><p>${escapeHtml(finding.suggestion)}</p></div>` : ""}
    ${finding.status === "open" && finding.suggestion && canEditDetail() ? `<div class="finding-actions"><button class="button button-outline" data-suggestion="${escapeHtml(finding.fid)}" data-action="accept">Apply Suggestion</button><button class="button button-quiet" data-suggestion="${escapeHtml(finding.fid)}" data-action="reject">Dismiss</button></div>` : ""}
  </article>`;
}

function canEditDetail() {
  const content = state.detail?.content;
  return content && ["draft", "changes_requested"].includes(content.status) && (state.user.role === "admin" || String(content.createdBy) === state.user.id);
}

function detailPage() {
  const { content, review, approvals, audit } = state.detail;
  const latest = content.versions.at(-1);
  const editable = canEditDetail();
  const reviewer = ["admin", "reviewer"].includes(state.user.role);
  const canDecide = content.status === "in_review" && reviewer && String(content.createdBy) !== state.user.id;
  const hasMultipleVersions = content.versions.length > 1;

  return `
    <div class="page-heading detail-heading">
      <div>
        <button class="back-link" data-page="content">← All Content</button>
        <span class="eyebrow">${escapeHtml(titleCase(content.type))} · VERSION ${latest.n}</span>
        <h1>${escapeHtml(content.title)}</h1>
        <div class="detail-meta">${statusBadge(content.status)} <span>Author: <strong>${escapeHtml(content.createdByName || "Teammate")}</strong></span><span>Updated: ${date(content.updatedAt)}</span></div>
      </div>
      <div class="heading-actions">
        ${hasMultipleVersions ? `<button class="button button-outline" data-action="show-diff">${icon("diff")} Compare Version Diff</button>` : ""}
        ${editable ? `<button class="button button-outline" data-action="run-review" data-id="${escapeHtml(content._id)}">${icon("spark")} ${review?.version === latest.n ? "Re-run Brand Review" : "Run Brand Review"}</button>${review?.version === latest.n ? `<button class="button button-primary" data-action="submit" data-id="${escapeHtml(content._id)}">${icon("arrow")} Submit for Approval</button>` : ""}` : ""}
      </div>
    </div>
    ${content.status === "in_review" ? `<div class="review-banner">${icon("clock")} <span><strong>Under Formal Review.</strong> ${canDecide ? "You are an authorized reviewer. Inspect findings and submit your decision below." : "This draft is locked for review. You will be notified once decided."}</span></div>` : ""}
    <div class="detail-grid">
      <section class="detail-main">
        <div class="workbench-tabs">
          <button class="workbench-tab ${state.detailWorkbenchTab === "highlights" ? "selected" : ""}" data-workbench-tab="highlights">${icon("file")} Interactive Highlights</button>
          ${editable ? `<button class="workbench-tab ${state.detailWorkbenchTab === "edit" ? "selected" : ""}" data-workbench-tab="edit">${icon("plus")} Edit Version Text</button>` : ""}
        </div>
        ${
          state.detailWorkbenchTab === "highlights"
            ? `<div class="section-heading compact"><div><span class="eyebrow">DRAFT PREVIEW</span><h2>In-Text Findings Inspector</h2></div><span class="version-pill">v${latest.n}</span></div>${renderHighlightedDraft(latest.text, review?.findings)}`
            : editable
            ? `<form id="edit-content-form" class="editor-card detail-editor"><textarea aria-label="Draft content" name="text" maxlength="20000" rows="10">${escapeHtml(latest.text)}</textarea><div class="editor-footer"><span>${latest.text.trim().split(/\s+/).filter(Boolean).length} words</span><button class="button button-outline" type="submit">Save As New Version</button></div></form>`
            : `<div class="draft-preview">${escapeHtml(latest.text)}</div>`
        }

        <div class="section-heading compact findings-title" style="margin-top: 28px;">
          <div><span class="eyebrow">EXPLAINABLE FINDINGS</span><h2>Review Results <span class="title-count">${review?.findings?.length || 0}</span></h2></div>
          ${review ? `<div class="score-chip ${scoreClass(review.score)}">${review.score}<small>/100</small></div>` : ""}
        </div>
        ${
          review
            ? `<p class="muted review-summary">${review.modelInfo?.aiUsed ? `AI-assisted review (${escapeHtml(review.modelInfo.model || "gpt-4o-mini")})` : "Deterministic rule engine review"}${review.modelInfo?.note ? ` · ${escapeHtml(review.modelInfo.note)}` : ""}. Suggestions never override human judgment.</p>
               ${review.findings.length ? `<div class="findings-list">${review.findings.map(findingCard).join("")}</div>` : '<div class="success-card"><span>✓</span><div><strong>100% Brand Compliant.</strong><p>No guideline violations, claim inaccuracies, or accessibility issues detected in this version.</p></div></div>'}`
            : `<div class="empty-state compact-empty"><span class="empty-illustration">${icon("spark")}</span><strong>No review run on this version yet.</strong><p>Trigger a brand review to verify facts, tone, and visual guidelines.</p>${editable ? `<button class="button button-primary" data-action="run-review" data-id="${escapeHtml(content._id)}">${icon("spark")} Run Review</button>` : ""}</div>`
        }

        ${
          canDecide
            ? `<section class="decision-card" style="margin-top: 32px;"><span class="eyebrow">HUMAN SIGN-OFF GATE</span><h2>Authorized Review Decision</h2><p class="muted">Leave constructive context for the creator. Approving with unresolved critical findings requires a formal written override.</p>
                 <form id="decision-form">
                   <label>Reviewer Decision Context<textarea name="comment" rows="3" placeholder="Explain your feedback or approval reason…" ${review?.findings?.some((f) => f.severity === "critical" && f.status === "open") ? 'required minlength="5"' : ""}></textarea></label>
                   ${review?.findings?.some((f) => f.severity === "critical" && f.status === "open") ? '<label class="checkbox-row" style="margin-top: 8px;"><input type="checkbox" name="override" required> <strong>Document Override:</strong> I acknowledge critical findings are open and confirm this publication is approved under exception policy.</label>' : ""}
                   <div class="decision-actions" style="margin-top: 16px;">
                     <button class="button button-primary" type="submit" name="decision" value="approved">Approve Content</button>
                     <button class="button button-outline" type="submit" name="decision" value="changes_requested">Request Changes</button>
                     <button class="button button-danger" type="submit" name="decision" value="rejected">Reject Draft</button>
                   </div>
                 </form>
               </section>`
            : ""
        }
      </section>
      <aside class="detail-side">
        <div class="side-card">
          <span class="eyebrow">ALIGNMENT SCORE</span>
          <div class="score-large ${review ? scoreClass(review.score) : ""}">${review ? review.score : "—"}<small>/100</small></div>
          <p>Brand Integrity Index</p>
          <div class="side-stat"><span>Open Findings</span><strong>${review ? review.findings.filter((f) => f.status === "open").length : "—"}</strong></div>
          <div class="side-stat"><span>Version Count</span><strong>${content.versions.length} ${content.versions.length === 1 ? "version" : "versions"}</strong></div>
        </div>
        <div class="side-card">
          <span class="eyebrow">DECISION HISTORY</span>
          ${approvals.length ? approvals.map((item) => `<div class="approval-history">${statusBadge(item.decision)}<p>${escapeHtml(item.comment || "No comment added")}</p><small>${escapeHtml(item.reviewerName || "Reviewer")} · ${date(item.decidedAt)}${item.override ? " · [Override Documented]" : ""}</small></div>`).join("") : '<p class="muted side-empty">No formal decisions recorded yet.</p>'}
        </div>
        <div class="side-card">
          <span class="eyebrow">AUDIT TRAIL</span>
          ${audit.length ? `<div class="timeline">${audit.slice(0, 8).map((entry) => `<div class="timeline-item"><span class="timeline-dot"></span><span><strong>${escapeHtml(titleCase(entry.action.replace("content.", "").replace("review.", "review ")))}</strong><small>${escapeHtml(entry.actorName || "Teammate")} · ${date(entry.timestamp)}</small></span></div>`).join("")}</div>` : '<p class="muted side-empty">Audit events will appear here.</p>'}
        </div>
      </aside>
    </div>`;
}

function approvalsPage() {
  const items = state.content.filter((item) => item.status === "in_review");
  return `
    <div class="page-heading"><div><span class="eyebrow">👥 HUMAN REVIEW PIPELINE</span><h1>Pending Approvals <em>Queue</em></h1><p class="muted">Drafts awaiting review and authorization before publication.</p></div><span class="approval-count">${items.length} waiting</span></div>
    <div class="content-list">${items.length ? contentRows(items) : '<div class="empty-state"><span class="empty-illustration">✓</span><strong>Queue is clear.</strong><p>No content is waiting for review. Excellent work!</p><button class="button button-outline" data-page="content">Explore All Content</button></div>'}</div>`;
}

function guidelinesPage() {
  const admin = state.user.role === "admin";
  return `
    <div class="page-heading">
      <div><span class="eyebrow">📚 CANONICAL BRAND REPOSITORY</span><h1>Brand Kit &amp; <em>Asset Library</em></h1><p class="muted">Centrally manage brand guidelines, verified facts, visual design tokens, and test copy in real-time.</p></div>
    </div>
    <div class="kit-tabs">
      <button class="kit-tab selected" data-kit-tab="guidelines">Guidelines <span id="guideline-count">—</span></button>
      <button class="kit-tab" data-kit-tab="facts">Approved Facts <span id="fact-count">—</span></button>
      <button class="kit-tab" data-kit-tab="assets">Brand Assets &amp; Palette <span id="asset-count">—</span></button>
      <button class="kit-tab" data-kit-tab="sandbox">Interactive Rule Sandbox ${icon("spark")}</button>
    </div>

    <!-- Tab 1: Guidelines -->
    <section id="kit-guidelines" class="kit-section">
      <div class="section-heading"><div><span class="eyebrow">VOICE &amp; TONE STANDARDS</span><h2>Brand Guidelines</h2><p class="muted">Terminology, claims, tone, and accessibility rules with explicit severity.</p></div>${admin ? `<button class="button button-primary" data-action="show-guideline-form">${icon("plus")} Add Guideline</button>` : ""}</div>
      <form class="inline-form hidden" id="guideline-form">
        <label>Category<select name="category"><option value="terminology">Terminology</option><option value="claims">Claims &amp; Promises</option><option value="tone">Tone of Voice</option></select></label>
        <label>Pattern (Regex or Words)<input name="pattern" required maxlength="200" placeholder="e.g. \\bcheap\\b or best in the world"></label>
        <label>Approved Alternative<input name="replacement" maxlength="300" placeholder="e.g. affordable"></label>
        <label>Guideline Rationale &amp; Source<input name="rule" required minlength="3" maxlength="500" placeholder="Explain why this rule exists and cite company policy"></label>
        <label>Severity<select name="severity"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label>
        <button class="button button-primary" type="submit">Save Guideline</button>
      </form>
      <div id="guideline-list" class="kit-list"><div class="loading-state">Loading guidelines…</div></div>
    </section>

    <!-- Tab 2: Facts -->
    <section id="kit-facts" class="kit-section hidden">
      <div class="section-heading"><div><span class="eyebrow">CANONICAL TRUTH</span><h2>Approved Facts &amp; Data</h2><p class="muted">Verified facts, product metrics, and pricing claims cited during reviews.</p></div>${admin ? `<button class="button button-primary" data-action="show-fact-form">${icon("plus")} Add Approved Fact</button>` : ""}</div>
      <form class="inline-form hidden" id="fact-form">
        <label>Topic<input name="topic" required maxlength="120" placeholder="e.g. Free Trial Duration"></label>
        <label>Approved Statement<input name="statement" required minlength="3" maxlength="500" placeholder="Our product provides a 14-day free trial."></label>
        <label>Source Document<input name="source" maxlength="300" placeholder="Pricing page, approved Oct 2026"></label>
        <label>Keywords <small>(comma-separated)</small><input name="keywords" placeholder="free, trial, days, tier"></label>
        <div class="form-divider">Optional Exact Claim Regex Check</div>
        <label>Pattern to Extract Claim<input name="regex" maxlength="200" placeholder="free for (\\d+) days"></label>
        <label>Expected Value<input name="expected" maxlength="100" placeholder="14"></label>
        <button class="button button-primary" type="submit">Save Approved Fact</button>
      </form>
      <div id="fact-list" class="kit-list"><div class="loading-state">Loading approved facts…</div></div>
    </section>

    <!-- Tab 3: Brand Assets & Visual Palette -->
    <section id="kit-assets" class="kit-section hidden">
      <div class="section-heading"><div><span class="eyebrow">VISUAL IDENTITY &amp; DESIGN SYSTEM</span><h2>Reusable Brand Assets &amp; Palette</h2><p class="muted">Official colors, typography, logos, and photography standards.</p></div>${admin ? `<button class="button button-primary" data-action="show-asset-form">${icon("plus")} Add Brand Asset</button>` : ""}</div>
      <form class="inline-form hidden" id="asset-form">
        <label>Asset Name<input name="name" required maxlength="120" placeholder="e.g. Iris Primary Brand Color"></label>
        <label>Asset Type<select name="type"><option value="color">Color Token</option><option value="logo">Official Logo</option><option value="typography">Typography Spec</option><option value="imagery">Imagery Standard</option><option value="badge">Brand Badge</option></select></label>
        <label>Value / Hex / URL / Spec<input name="value" required maxlength="1000" placeholder="#4F46E5 or font family name or asset URL"></label>
        <label>Description &amp; Purpose<input name="description" maxlength="500" placeholder="Primary CTA and link color"></label>
        <label>Usage Rules &amp; Restrictions<textarea name="usageRules" rows="2" placeholder="Maintain 4.5:1 contrast against background; do not stretch"></textarea></label>
        <label>Tags <small>(comma-separated)</small><input name="tags" placeholder="core, primary, dark-mode"></label>
        <button class="button button-primary" type="submit">Save Brand Asset</button>
      </form>
      <div id="asset-list" class="asset-grid"><div class="loading-state">Loading brand assets…</div></div>
    </section>

    <!-- Tab 4: Interactive Rule Sandbox -->
    <section id="kit-sandbox" class="kit-section hidden">
      <div class="sandbox-card">
        <div class="sandbox-header">
          <div><span class="eyebrow">TEST BEFORE PUBLISHING</span><h2>Interactive Brand Rule Sandbox</h2><p class="muted">Type or paste test copy to observe real-time brand rule evaluation and instant score calculations.</p></div>
          <div class="sandbox-score-row"><span class="eyebrow">Real-time Score:</span><div id="sandbox-score-badge" class="score-chip score-good" style="margin-left: 10px;">100<small>/100</small></div></div>
        </div>
        <div class="sandbox-presets">
          <span class="preset-label" style="font-size: 13px; font-weight: 700; color: #475569; align-self: center;">Try sample copy:</span>
          <button type="button" class="preset-pill" data-sandbox-preset="trial">Wrong Trial &amp; Superlative Claim</button>
          <button type="button" class="preset-pill" data-sandbox-preset="a11y">A11y Link &amp; Deprecated Logo</button>
          <button type="button" class="preset-pill" data-sandbox-preset="clean">Clean On-Brand Copy</button>
        </div>
        <textarea id="sandbox-input" class="sandbox-textarea" placeholder="Start typing copy to test against all active brand guidelines and facts..."></textarea>
        <div class="sandbox-live-results">
          <div class="section-heading compact"><div><span class="eyebrow">INSTANT DETECTIONS</span><h3>Real-Time Findings (<span id="sandbox-findings-count">0</span>)</h3></div></div>
          <div id="sandbox-findings-list" class="findings-list">
            <p class="muted" style="font-size: 14px;">No findings triggered. The copy is 100% compliant with active rules.</p>
          </div>
        </div>
      </div>
    </section>

    <p class="kit-footnote" style="margin-top: 24px;">${icon("lock")} Only workspace administrators can modify canonical brand kit entries. History is preserved so prior reviews stay explainable.</p>`;
}

function analyticsPage() {
  const data = state.analytics || {};
  const categories = data.byCategory || [];
  const max = Math.max(1, ...categories.map((item) => item.value));
  const source = data.topSources || [];

  return `
    <div class="page-heading">
      <div><span class="eyebrow">📊 ORGANIZATIONAL GOVERNANCE</span><h1>Governance Insights &amp; <em>Analytics</em></h1><p class="muted">Identify recurring brand mistakes, turnaround metrics, and guidelines that may need clarification.</p></div>
      <button class="button button-outline" data-action="print-report">${icon("printer")} Print Audit Report</button>
    </div>
    <section class="metric-grid metric-grid-three">
      <article class="metric-card"><span class="metric-icon metric-lavender">${icon("file")}</span><span class="metric-label">Total Drafts</span><strong>${data.totalContent || 0}<small> pieces</small></strong></article>
      <article class="metric-card"><span class="metric-icon metric-mint">${icon("spark")}</span><span class="metric-label">Workspace Health</span><strong>${data.avgScore ?? "—"}<small>/100</small></strong></article>
      <article class="metric-card"><span class="metric-icon metric-peach">${icon("clock")}</span><span class="metric-label">Average Approval Time</span><strong>${data.avgHoursToApproval ?? "—"}<small> hours</small></strong></article>
    </section>
    <div class="insight-grid">
      <section class="insight-card">
        <div class="section-heading compact"><div><span class="eyebrow">FINDINGS DISTRIBUTION</span><h2>Violations by Category</h2></div></div>
        ${categories.length ? `<div class="bar-list">${categories.map((item) => `<div class="bar-row"><span>${escapeHtml(titleCase(item.name))}</span><div class="bar-track"><i style="width:${Math.max(4, (item.value / max) * 100)}%"></i></div><strong>${item.value}</strong></div>`).join("")}</div>` : '<div class="chart-empty">Category distribution will appear after your first review.</div>'}
      </section>
      <section class="insight-card">
        <div class="section-heading compact"><div><span class="eyebrow">FREQUENTLY CITED RULES</span><h2>Most-Triggered Guidance</h2></div></div>
        ${source.length ? `<div class="source-list">${source.map((item) => `<div><span class="source-dot">↗</span><span class="source-text"><strong>${escapeHtml(item.label)}</strong><small>${item.count} findings · ${item.accepted} suggestions accepted · ${item.rejected} rejected</small></span></div>`).join("")}</div>` : '<div class="chart-empty">Source citations will appear after reviews are run.</div>'}
      </section>
    </div>
    <section class="clarity-card" style="margin-top: 24px;">
      <span class="clarity-icon">${icon("spark")}</span>
      <div>
        <span class="eyebrow">GUIDELINES UNDER REVIEW</span>
        <h2>Guidelines With High Rejection Rates</h2>
        <p>When creators repeatedly reject suggestions for a specific rule, the guideline may be ambiguous or overly rigid. Consider reviewing these policies with your creative team.</p>
        ${data.needsClarification?.length ? `<div class="clarity-items">${data.needsClarification.map((item) => `<span><strong>${item.rejectionRate}%</strong> rejected · ${escapeHtml(item.label)}</span>`).join("")}</div>` : '<span class="clarity-empty">No guideline ambiguity detected yet. Great clarity in your brand kit!</span>'}
      </div>
    </section>`;
}

function teamPage() {
  const canManage = state.user.role === "admin";
  return `
    <div class="page-heading">
      <div><span class="eyebrow">🤝 COLLABORATIVE GOVERNANCE</span><h1>Team Roles &amp; <em>Permissions</em></h1><p class="muted">Role-based access control ensuring authors can draft and designated reviewers can approve.</p></div>
      ${canManage ? `<button class="button button-primary" data-action="show-team-form">${icon("plus")} Invite Teammate</button>` : ""}
    </div>
    ${canManage ? `
      <form id="team-form" class="inline-form hidden">
        <label>Name<input name="name" required maxlength="100" placeholder="Jordan Lee"></label>
        <label>Work email<input name="email" type="email" required placeholder="jordan@company.com"></label>
        <label>Temporary Password<input name="password" type="password" minlength="8" maxlength="100" required placeholder="At least 8 characters"></label>
        <label>Role<select name="role"><option value="creator">Creator (Drafts &amp; Revises)</option><option value="reviewer">Reviewer (Approves &amp; Requests Changes)</option><option value="admin">Admin (Brand Kit &amp; Team Manager)</option></select></label>
        <button class="button button-primary" type="submit">Add Teammate</button>
      </form>` : ""}
    <div id="team-list" class="team-grid"><div class="loading-state">Loading team members…</div></div>
    <div class="roles-note" style="margin-top: 24px;">
      <span class="soft-card-icon">${icon("users")}</span>
      <div>
        <strong>Three Distinct Governance Roles</strong>
        <p><b>Creators</b> write copy, attach media, and consider suggested corrections · <b>Reviewers</b> inspect word-level diffs and make human approval decisions · <b>Admins</b> manage canonical brand kit rules, assets, and workspace policies.</p>
      </div>
    </div>`;
}

function renderPage() {
  state.page = state.page || "overview";
  if (state.page === "detail" && !state.detail) state.page = "content";
  const pages = {
    overview: overviewPage,
    content: contentPage,
    "new-content": newContentPage,
    detail: detailPage,
    approvals: approvalsPage,
    guidelines: guidelinesPage,
    analytics: analyticsPage,
    team: teamPage,
  };
  shell((pages[state.page] || overviewPage)());
  wirePage();
}

async function loadApp() {
  if (!state.user) state.user = (await api("/auth/me")).user;
  const [content, analytics] = await Promise.all([api("/content"), api("/analytics/overview")]);
  state.content = content;
  state.analytics = analytics;
  renderPage();
}

async function openDetail(id) {
  try {
    state.detail = await api(`/content/${encodeURIComponent(id)}`);
    state.page = "detail";
    state.detailWorkbenchTab = "highlights";
    renderPage();
  } catch (error) {
    toast(error.message, "error");
  }
}

function showList(list, kind) {
  const target = document.querySelector(`#${kind}-list`);
  const admin = state.user.role === "admin";
  if (!target) return;
  if (!list.length) {
    target.innerHTML = `<div class="empty-kit"><span>${kind === "guideline" ? icon("book") : icon("check")}</span><strong>No ${kind === "guideline" ? "guidelines" : "approved facts"} recorded yet.</strong><p>${admin ? "Add your first approved entry to guide reviewers." : "An administrator can add entries here."}</p></div>`;
    return;
  }
  target.innerHTML = list
    .map(
      (item) => `
    <article class="kit-item">
      <div class="kit-item-icon">${kind === "guideline" ? icon("book") : icon("check")}</div>
      <div class="kit-item-copy">
        <div class="kit-item-title">
          <strong>${escapeHtml(kind === "guideline" ? item.rule : item.topic)}</strong>
          ${kind === "guideline" ? `<span class="category-tag">${escapeHtml(titleCase(item.category))}</span>` : ""}
          <span class="version-pill">v${item.version}</span>
          ${item.active === false || item.status === "retired" ? '<span class="retired-tag">Retired</span>' : ""}
        </div>
        <p>${escapeHtml(kind === "guideline" ? `Match: ${item.pattern}${item.replacement ? ` · Suggest: ${item.replacement}` : ""}` : item.statement)}</p>
        <small>${escapeHtml(item.source || `${titleCase(item.severity || "approved")} · Added ${date(item.createdAt)}`)}</small>
      </div>
      ${admin && item.active !== false && item.status !== "retired" ? `<button class="button button-quiet" data-retire="${escapeHtml(item._id)}" data-kind="${kind}" aria-label="Deactivate ${escapeHtml(kind)}">Deactivate</button>` : ""}
    </article>`
    )
    .join("");
}

function showAssets(assets) {
  const target = document.querySelector("#asset-list");
  if (!target) return;
  if (!assets.length) {
    target.innerHTML = `<div class="empty-kit" style="grid-column: 1/-1;"><span>${icon("palette")}</span><strong>No brand assets yet.</strong><p>Admins can add color tokens, official logos, and typography rules.</p></div>`;
    return;
  }
  target.innerHTML = assets
    .filter((a) => a.active !== false)
    .map((asset) => {
      const isColor = asset.type === "color";
      return `
      <article class="asset-card">
        <div class="asset-card-top">
          ${isColor ? `<div class="color-swatch-box" style="background-color: ${escapeHtml(asset.value)};"></div>` : `<div class="color-swatch-box" style="display:grid;place-items:center;background:#f1f5f9;color:#4f46e5;">${icon(asset.type === "logo" ? "image" : "palette")}</div>`}
          <div class="asset-details">
            <h4>${escapeHtml(asset.name)}</h4>
            <p>${escapeHtml(asset.description || titleCase(asset.type))}</p>
          </div>
        </div>
        <div class="asset-value-row">
          <span>${escapeHtml(asset.value)}</span>
          <button class="copy-badge" data-copy-val="${escapeHtml(asset.value)}">Copy</button>
        </div>
        ${asset.usageRules ? `<div class="asset-rules-box"><strong>Usage Rule:</strong> ${escapeHtml(asset.usageRules)}</div>` : ""}
        <div class="asset-tags">
          <span class="asset-tag">${escapeHtml(asset.type)}</span>
          ${(asset.tags || []).map((t) => `<span class="asset-tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </article>`;
    })
    .join("");
}

async function loadKit() {
  const [guidelines, facts, assets] = await Promise.all([
    api("/brand/guidelines"),
    api("/brand/facts"),
    api("/brand/assets").catch(() => []),
  ]);
  state.brandKit = { guidelines, facts, assets };
  document.querySelector("#guideline-count").textContent = guidelines.filter((item) => item.active).length;
  document.querySelector("#fact-count").textContent = facts.filter((item) => item.status === "active").length;
  document.querySelector("#asset-count").textContent = assets.filter((item) => item.active !== false).length;
  showList(guidelines, "guideline");
  showList(facts, "fact");
  showAssets(assets);
}

async function loadTeam() {
  const users = await api("/team");
  const target = document.querySelector("#team-list");
  if (!target) return;
  target.innerHTML = users
    .map(
      (member) => `
    <article class="team-card">
      <span class="team-avatar">${escapeHtml(initials(member.name))}</span>
      <div>
        <strong>${escapeHtml(member.name)}</strong>
        <p>${escapeHtml(member.email)}</p>
        <span class="role-tag role-${escapeHtml(member.role)}">${escapeHtml(titleCase(member.role))}</span>
      </div>
    </article>`
    )
    .join("");
}

// Version Diff Dialog using modern-web-guidance native <dialog>
function openDiffModal() {
  const content = state.detail?.content;
  if (!content || content.versions.length < 2) {
    return toast("Multiple versions are required to compare diffs.", "info");
  }
  const modal = document.querySelector("#app-modal");
  const vOld = content.versions.at(-2);
  const vNew = content.versions.at(-1);
  const diffs = diffWords(vOld.text, vNew.text);

  const diffHtml = diffs
    .map((token) => {
      if (token.type === "added") return `<span class="diff-token-added">${escapeHtml(token.value)}</span>`;
      if (token.type === "removed") return `<span class="diff-token-removed">${escapeHtml(token.value)}</span>`;
      return `<span class="diff-token-same">${escapeHtml(token.value)}</span>`;
    })
    .join("");

  modal.innerHTML = `
    <div class="modal-header">
      <h3>Version Diff: v${vOld.n} → v${vNew.n}</h3>
      <button class="modal-close" data-modal-close aria-label="Close dialog">✕</button>
    </div>
    <div class="modal-body">
      <div class="diff-legend">
        <span><b class="diff-token-added">+ Added words</b></span>
        <span><b class="diff-token-removed">- Removed words</b></span>
        <span><b>Unchanged copy</b></span>
      </div>
      <div class="diff-container">${diffHtml}</div>
    </div>
    <div class="modal-footer">
      <button class="button button-outline" data-modal-close>Close</button>
    </div>`;

  modal.showModal();
}

function wirePage() {
  if (state.page === "guidelines") loadKit().catch((error) => toast(error.message, "error"));
  if (state.page === "team") loadTeam().catch((error) => toast(error.message, "error"));

  // Text draft file import
  document.querySelector("#draft-file")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    document.querySelector("#draft-text").value = await file.text();
    if (!document.querySelector('[name="title"]').value) {
      document.querySelector('[name="title"]').value = file.name.replace(/\.[^.]+$/, "");
    }
    const words = document.querySelector("#draft-text").value.trim().split(/\s+/).filter(Boolean).length;
    document.querySelector("#word-count").textContent = `${words} words`;
  });

  // Media file analyzer
  document.querySelector("#media-file-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    analyzeMediaFile(file, (analysis) => {
      state.attachedMedia = analysis;
      const preview = document.querySelector("#media-preview-container");
      if (preview) {
        preview.classList.remove("hidden");
        preview.innerHTML = `
          <div class="media-preview-row">
            <div class="media-preview-box"><img src="${analysis.dataUrl}" alt="${escapeHtml(analysis.name)}"></div>
            <div class="media-checks-list">
              <div class="media-check-item">
                <span class="media-check-status ${analysis.isRatioStandard ? "status-ok" : "status-warn"}">${analysis.isRatioStandard ? "✓" : "!"}</span>
                <span>Aspect Ratio: <strong>${analysis.ratio} (${analysis.standardRatio})</strong></span>
              </div>
              <div class="media-check-item">
                <span class="media-check-status ${analysis.isSizeOptimized ? "status-ok" : "status-warn"}">${analysis.isSizeOptimized ? "✓" : "!"}</span>
                <span>Dimensions: <strong>${analysis.width}×${analysis.height}px (${analysis.fileSizeMB} MB)</strong></span>
              </div>
              <div class="media-check-item">
                <span class="media-check-status status-ok">✓</span>
                <span>Extracted Colors: 
                  ${analysis.colors.map((c) => `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin:0 2px;vertical-align:middle;border:1px solid #0002;"></span>`).join("")}
                </span>
              </div>
            </div>
          </div>`;
      }
    });
  });

  document.querySelector("#draft-text")?.addEventListener("input", (event) => {
    const words = event.target.value.trim().split(/\s+/).filter(Boolean).length;
    document.querySelector("#word-count").textContent = `${words} words`;
  });

  // Interactive Sandbox evaluation
  const sandboxInput = document.querySelector("#sandbox-input");
  if (sandboxInput) {
    const runSandbox = () => {
      const val = sandboxInput.value;
      const { score, findings } = testSnippetLocally(val, state.brandKit.guidelines, state.brandKit.facts);
      const scoreBadge = document.querySelector("#sandbox-score-badge");
      if (scoreBadge) {
        scoreBadge.textContent = `${score}/100`;
        scoreBadge.className = `score-chip ${scoreClass(score)}`;
      }
      document.querySelector("#sandbox-findings-count").textContent = findings.length;
      const list = document.querySelector("#sandbox-findings-list");
      if (list) {
        if (!findings.length) {
          list.innerHTML = `<p class="muted" style="font-size: 13px;">No issues flagged. Copy complies with all active brand standards.</p>`;
        } else {
          list.innerHTML = findings
            .map(
              (f, i) => `
            <article class="finding-card finding-${escapeHtml(f.severity)}" style="margin-bottom: 10px;">
              <div class="finding-head"><span class="finding-number">${String(i + 1).padStart(2, "0")}</span><span class="finding-category">${escapeHtml(titleCase(f.category))}</span><span class="severity severity-${escapeHtml(f.severity)}">${escapeHtml(titleCase(f.severity))}</span></div>
              <blockquote>“${escapeHtml(f.excerpt)}”</blockquote>
              <p class="finding-explanation">${escapeHtml(f.explanation)}</p>
              <div class="finding-source"><span class="source-dot">↗</span><span><strong>${escapeHtml(f.sourceLabel)}</strong></span></div>
              ${f.suggestion ? `<div class="suggestion"><span class="suggestion-label">${icon("spark")} Suggested Fix</span><p>${escapeHtml(f.suggestion)}</p></div>` : ""}
            </article>`
            )
            .join("");
        }
      }
    };
    sandboxInput.addEventListener("input", runSandbox);
  }

  // Create new content submit
  document.querySelector("#new-content-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const form = Object.fromEntries(new FormData(event.currentTarget));
      const content = await api("/content", { method: "POST", body: form });
      await api("/reviews", { method: "POST", body: { contentId: content._id } });
      toast("Draft created & brand review completed.");
      await loadApp();
      await openDetail(content._id);
    } catch (error) {
      toast(error.message, "error");
      button.disabled = false;
    }
  });

  // Edit content version submit
  document.querySelector("#edit-content-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api(`/content/${state.detail.content._id}`, {
        method: "PUT",
        body: { text: new FormData(event.currentTarget).get("text"), note: "Edited in Inkloom workbench" },
      });
      toast("New version saved. Running fresh review…");
      await api("/reviews", { method: "POST", body: { contentId: state.detail.content._id } });
      await openDetail(state.detail.content._id);
      await loadApp();
    } catch (error) {
      toast(error.message, "error");
    }
  });

  // Decision submit
  document.querySelector("#decision-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    if (!submitter) return;
    try {
      const form = new FormData(event.currentTarget);
      const endpoint = { approved: "approve", changes_requested: "request-changes", rejected: "reject" }[submitter.value];
      await api(`/content/${state.detail.content._id}/${endpoint}`, {
        method: "POST",
        body: { comment: form.get("comment"), override: form.get("override") === "on" },
      });
      toast(`Decision recorded: ${titleCase(submitter.value)}.`);
      await loadApp();
      await openDetail(state.detail.content._id);
    } catch (error) {
      toast(error.message, "error");
    }
  });

  // Add guideline form
  document.querySelector("#guideline-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.replacement) delete data.replacement;
    try {
      await api("/brand/guidelines", { method: "POST", body: data });
      toast("Guideline added to brand kit.");
      await loadKit();
      event.currentTarget.reset();
      event.currentTarget.classList.add("hidden");
    } catch (error) {
      toast(error.message, "error");
    }
  });

  // Add fact form
  document.querySelector("#fact-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.keywords = (data.keywords || "").split(",").map((item) => item.trim()).filter(Boolean);
    if (data.source === "") delete data.source;
    if (data.regex && data.expected) data.match = { regex: data.regex, expected: data.expected };
    delete data.regex;
    delete data.expected;
    try {
      await api("/brand/facts", { method: "POST", body: data });
      toast("Approved fact added to brand kit.");
      await loadKit();
      event.currentTarget.reset();
      event.currentTarget.classList.add("hidden");
    } catch (error) {
      toast(error.message, "error");
    }
  });

  // Add asset form
  document.querySelector("#asset-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.tags = (data.tags || "").split(",").map((item) => item.trim()).filter(Boolean);
    try {
      await api("/brand/assets", { method: "POST", body: data });
      toast("Brand asset added to library.");
      await loadKit();
      event.currentTarget.reset();
      event.currentTarget.classList.add("hidden");
    } catch (error) {
      toast(error.message, "error");
    }
  });

  // Add team form
  document.querySelector("#team-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/team", { method: "POST", body: Object.fromEntries(new FormData(event.currentTarget)) });
      toast("Teammate added successfully.");
      await loadTeam();
      event.currentTarget.reset();
      event.currentTarget.classList.add("hidden");
    } catch (error) {
      toast(error.message, "error");
    }
  });
}

// Light dismiss click listener for native dialogs (modern-web-guidance)
document.addEventListener("click", (event) => {
  const modal = document.querySelector("#app-modal");
  if (modal && event.target === modal) {
    modal.close();
  }
});

// Newsletter subscription
document.addEventListener("submit", async (event) => {
  if (event.target.matches("#newsletter-form")) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    const mode = button.dataset.mode || "subscribe";
    button.textContent = mode === "unsubscribe" ? "Removing…" : "Subscribing…";
    try {
      await api(`/newsletter/${mode}`, { method: "POST", body: { email: new FormData(form).get("email") } });
      form.reset();
      toast(mode === "unsubscribe" ? "Your email has been removed." : "Subscribed! Newsletter interest recorded.");
      button.textContent = mode === "unsubscribe" ? "Unsubscribed" : "Subscribed";
    } catch (error) {
      toast(error.message, "error");
      button.disabled = false;
      button.textContent = mode === "unsubscribe" ? "Unsubscribe" : "Stay in the loop";
    }
  }
});

// Global click event dispatcher
document.addEventListener("click", async (event) => {
  // Resolve clicks to the actual control. Matching every span first caused
  // clicks on button labels/icons to stop at the nested span and skip actions.
  const target = event.target.closest("button, a, mark");
  if (!target) return;

  if (target.matches("[data-modal-close]")) {
    document.querySelector("#app-modal")?.close();
    return;
  }
  if (target.matches("[data-logout]")) return logout();
  if (target.matches("[data-landing-register]")) return renderAuth(true);
  if (target.matches("[data-landing-login]")) return renderAuth(false);
  if (target.matches("[data-auth-home]")) return renderLanding();

  if (target.matches("[data-switch-role]")) {
    return switchPersona(target.dataset.switchRole);
  }

  if (target.matches("[data-action=print-report]")) {
    window.print();
    return;
  }

  if (target.matches("[data-action=show-diff]")) {
    return openDiffModal();
  }

  if (target.matches("[data-copy-val]")) {
    navigator.clipboard?.writeText(target.dataset.copyVal);
    toast(`Copied ${target.dataset.copyVal} to clipboard!`);
    return;
  }

  if (target.matches("[data-highlight-fid]")) {
    const fid = target.dataset.highlightFid;
    const card = document.querySelector(`[data-finding-fid="${fid}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.style.outline = "2px solid #4f46e5";
      setTimeout(() => (card.style.outline = ""), 1500);
    }
    return;
  }

  if (target.matches("[data-sandbox-preset]")) {
    const presets = {
      trial: "Enjoy our brand new platform free for 60 days! It is simply the best platform in the world, and we guarantee 100% success for all users.",
      a11y: "Check out our pricing page: [click here](https://example.com/pricing). We have cheap plans. <img src=\"logo-old.png\">",
      clean: "Our product provides a 14-day free trial. Read [the launch documentation](https://example.com/guide) to learn about our affordable team tiers.",
    };
    const input = document.querySelector("#sandbox-input");
    if (input) {
      input.value = presets[target.dataset.sandboxPreset] || "";
      input.dispatchEvent(new Event("input"));
    }
    return;
  }

  if (target.matches("[data-workbench-tab]")) {
    state.detailWorkbenchTab = target.dataset.workbenchTab;
    renderPage();
    return;
  }

  if (target.matches("[data-newsletter-mode]")) {
    const form = document.querySelector("#newsletter-form");
    if (!form) return;
    const button = form.querySelector('[type="submit"]');
    const unsubscribe = target.dataset.newsletterMode === "unsubscribe";
    button.dataset.mode = unsubscribe ? "unsubscribe" : "subscribe";
    button.textContent = unsubscribe ? "Unsubscribe" : "Stay in the loop";
    button.disabled = false;
    target.dataset.newsletterMode = unsubscribe ? "subscribe" : "unsubscribe";
    target.textContent = unsubscribe ? "Never mind — stay subscribed" : "Already subscribed? Unsubscribe";
    document.querySelector("#newsletter-email").placeholder = unsubscribe ? "Email address to remove" : "you@company.com";
    document.querySelector("#newsletter-heading").textContent = unsubscribe ? "Update your email preferences." : "A little more clarity, in your inbox.";
    return;
  }

  if (target.matches("[data-auth-toggle]")) {
    return renderAuth(!document.querySelector("#auth-form [name=organisationName]"));
  }

  if (target.matches("[data-demo]")) {
    const email = { admin: "admin@demo.test", creator: "creator@demo.test", reviewer: "reviewer@demo.test" }[target.dataset.demo];
    document.querySelector("#auth-form [name=email]").value = email;
    document.querySelector("#auth-form [name=password]").value = "Passw0rd!demo";
    document.querySelector("#auth-form").requestSubmit();
    return;
  }

  if (target.matches("[data-page]")) {
    event.preventDefault();
    state.page = target.dataset.page;
    state.detail = null;
    if (["overview", "content", "approvals", "analytics"].includes(state.page)) {
      try {
        await loadApp();
      } catch (error) {
        toast(error.message, "error");
      }
    } else {
      renderPage();
    }
    return;
  }

  if (target.matches("[data-open]")) return openDetail(target.dataset.open);

  if (target.matches("[data-filter]")) {
    document.querySelectorAll(".filter-tab").forEach((item) => item.classList.toggle("selected", item === target));
    const filter = target.dataset.filter;
    const items = filter === "all" ? state.content : state.content.filter((item) => item.status === filter);
    document.querySelector(".content-list").innerHTML = contentRows(items);
    return;
  }

  if (target.matches("[data-kit-tab]")) {
    document.querySelectorAll(".kit-tab").forEach((item) => item.classList.toggle("selected", item === target));
    const tab = target.dataset.kitTab;
    document.querySelector("#kit-guidelines")?.classList.toggle("hidden", tab !== "guidelines");
    document.querySelector("#kit-facts")?.classList.toggle("hidden", tab !== "facts");
    document.querySelector("#kit-assets")?.classList.toggle("hidden", tab !== "assets");
    document.querySelector("#kit-sandbox")?.classList.toggle("hidden", tab !== "sandbox");
    if (tab === "sandbox") {
      document.querySelector("#sandbox-input")?.dispatchEvent(new Event("input"));
    }
    return;
  }

  if (target.matches("[data-action=show-guideline-form]")) return document.querySelector("#guideline-form").classList.toggle("hidden");
  if (target.matches("[data-action=show-fact-form]")) return document.querySelector("#fact-form").classList.toggle("hidden");
  if (target.matches("[data-action=show-asset-form]")) return document.querySelector("#asset-form").classList.toggle("hidden");
  if (target.matches("[data-action=show-team-form]")) return document.querySelector("#team-form").classList.toggle("hidden");

  if (target.matches("[data-retire]")) {
    if (!window.confirm("Deactivate this source? It will remain in history for existing reviews.")) return;
    const collection = target.dataset.kind === "guideline" ? "guidelines" : "facts";
    try {
      await api(`/brand/${collection}/${target.dataset.retire}`, { method: "DELETE" });
      toast("Source deactivated. Previous review history is preserved.");
      await loadKit();
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  if (target.matches("[data-action=run-review]")) {
    target.disabled = true;
    target.innerHTML = '<span class="spinner"></span> Reviewing…';
    try {
      await api("/reviews", { method: "POST", body: { contentId: target.dataset.id } });
      toast("Brand review complete. Inspect findings.");
      await openDetail(target.dataset.id);
      await loadApp();
    } catch (error) {
      toast(error.message, "error");
      target.disabled = false;
      target.innerHTML = `${icon("spark")} Run brand review`;
    }
    return;
  }

  if (target.matches("[data-action=submit]")) {
    try {
      await api(`/content/${target.dataset.id}/submit`, { method: "POST", body: {} });
      toast("Submitted for human reviewer sign-off.");
      await loadApp();
      await openDetail(target.dataset.id);
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  if (target.matches("[data-suggestion]")) {
    try {
      await api(`/reviews/${state.detail.review._id}/suggestions/${target.dataset.suggestion}`, {
        method: "POST",
        body: { action: target.dataset.action },
      });
      toast(
        target.dataset.action === "accept"
          ? "Suggestion applied as a new version. Fresh review ready."
          : "Suggestion dismissed. Your wording remains."
      );
      await openDetail(state.detail.content._id);
      await loadApp();
    } catch (error) {
      toast(error.message, "error");
    }
  }
});

async function start() {
  if (!state.token) return renderLanding();
  try {
    await loadApp();
  } catch (error) {
    if (!state.token) return;
    renderAuth();
    toast(error.message, "error");
  }
}

start();
