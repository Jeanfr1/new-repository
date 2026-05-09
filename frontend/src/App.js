import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import "./App.css";

const HERO_VIDEO_WEBM = "/media/hero.webm";
const HERO_VIDEO_MP4 = "/media/hero.mp4";

const CUES = [
  {
    headline: "She thinks in data.",
    sub: "Scarllet Aurora — the AI that works while you sleep.",
  },
  {
    headline: "She knows the system.",
    sub: "Every AI tool. Every shortcut. Every income stream.",
  },
  {
    headline: "Then she gets to work.",
    sub: "No face. No filming. No team.",
  },
  {
    headline: "The tools obey her.",
    sub: "ChatGPT. Claude. Gemini. Veo3. Grok. All of them.",
  },
  {
    headline: "She's not real.",
    sub: "But the income is.",
    cta: true,
  },
];

const TOOLS = ["ChatGPT", "Claude", "Gemini", "Veo3", "Grok", "Sora", "Runway"];

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getCueIndex(p) {
  if (p < 0.15) return 0;
  if (p < 0.45) return 1;
  if (p < 0.7) return 2;
  if (p < 0.92) return 3;
  return 4;
}

/* ------------------------- NAV ------------------------- */
function Nav({ scrolled }) {
  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`} data-testid="top-nav">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" data-testid="nav-brand">
          <span className="brand-mark">SA</span>
          <span className="brand-name">
            Scarllet <em>Aurora</em>
          </span>
          <span className="brand-tag">AI Influencer · Est. 2026</span>
        </a>
        <nav className="nav-links">
          <a onClick={(e) => { e.preventDefault(); smoothScrollTo("problem"); }} href="#problem">The Problem</a>
          <a onClick={(e) => { e.preventDefault(); smoothScrollTo("proof"); }} href="#proof">Proof</a>
          <a onClick={(e) => { e.preventDefault(); smoothScrollTo("solution"); }} href="#solution">Solution</a>
          <a onClick={(e) => { e.preventDefault(); smoothScrollTo("how"); }} href="#how">Method</a>
        </nav>
        <a
          className="btn btn-pill"
          href="https://stan.store/scarlletaurora"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="nav-cta-btn"
        >
          <span>Get Access</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </header>
  );
}

/* ------------------------- HERO ------------------------- */
function Hero() {
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const [activeCue, setActiveCue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // detect reduced motion only
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(rm.matches);
    update();
    rm.addEventListener("change", update);
    return () => rm.removeEventListener("change", update);
  }, []);

  // Autoplay loop on every device; cues cycle via video.timeupdate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      const onMeta = () => {
        try { video.currentTime = video.duration || 0; } catch (_) {}
      };
      if (video.readyState >= 1) onMeta();
      else video.addEventListener("loadedmetadata", onMeta, { once: true });
      setActiveCue(4);
      setProgress(1);
      return;
    }

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});

    const onTime = () => {
      if (!video.duration) return;
      const p = video.currentTime / video.duration;
      setProgress(p);
      setActiveCue(getCueIndex(p));
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [reducedMotion]);

  return (
    <section
      id="top"
      className="hero hero-loop"
      ref={heroRef}
      data-testid="hero-section"
    >
      <div className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          data-testid="hero-video"
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>

        {/* visual treatments */}
        <div className="hero-grain" />
        <div className="hero-vignette" />
        <div className="hero-radial" />
        <div className="hero-grid-lines" />

        {/* overlay */}
        <div className="hero-overlay">
          <div className="hero-meta">
            <span className="meta-row">
              <span className="dot" /> Live · 5.04s loop
            </span>
            <span className="meta-row meta-end">
              <span className="ai-badge">Ai</span> Scarllet Aurora · v.01
            </span>
          </div>

          <div className="cue-stack">
            {CUES.map((c, i) => {
              const state =
                activeCue === i ? "active" : activeCue > i ? "past" : "future";
              return (
                <div
                  key={i}
                  className={`cue cue-${state}`}
                  data-testid={`hero-cue-${i + 1}`}
                  aria-hidden={activeCue !== i}
                >
                  <div className="cue-index">
                    <span className="cue-number">0{i + 1}</span>
                    <span className="cue-line" />
                    <span className="cue-of">/ 05</span>
                  </div>
                  <h1 className="cue-headline">{c.headline}</h1>
                  <p className="cue-sub">{c.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="hero-foot">
            <div className="hero-foot-left">
              <a
                className="btn btn-primary hero-cta"
                href="https://stan.store/scarlletaurora"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-cta-btn"
              >
                <span>Get the Method</span>
                <ArrowRight size={18} />
              </a>
              <span className="hero-tools">
                {TOOLS.map((t) => (
                  <span key={t} className="tool-chip">
                    <span className="chip-dot" />
                    {t}
                  </span>
                ))}
              </span>
            </div>
            <div className="hero-foot-right">
              <span className="kicker">Scroll for the blueprint ↓</span>
            </div>
          </div>
        </div>

        {/* cue rail (now non-scroll, syncs to video time) */}
        <div className="hero-rail" data-testid="hero-progress">
          <div className="rail-track">
            <div className="rail-fill" style={{ height: `${progress * 100}%` }} />
            {[0, 0.3, 0.6, 0.8, 1].map((p, i) => (
              <span
                key={i}
                className={`rail-tick ${activeCue >= i ? "rail-tick-on" : ""}`}
                style={{ top: `${p * 100}%` }}
              />
            ))}
          </div>
          <div className="rail-label">
            <span>{String(activeCue + 1).padStart(2, "0")}</span>
            <span className="rail-sep">/</span>
            <span>05</span>
          </div>
        </div>

        {/* corner crosshairs */}
        <span className="corner corner-tl" />
        <span className="corner corner-tr" />
        <span className="corner corner-bl" />
        <span className="corner corner-br" />
      </div>
    </section>
  );
}

/* ----------------------- PROBLEM ----------------------- */
function ProblemSection() {
  return (
    <section id="problem" className="section section-problem" data-testid="problem-section">
      <div className="rule-row">
        <span className="kicker">01 — The problem</span>
        <span className="kicker kicker-dim">Faceless income · honest ceiling</span>
      </div>
      <div className="problem-grid">
        <div className="problem-headline">
          <h2 className="display-h2">
            You want to make money online.{" "}
            <em className="serif text-copper">But you don't want to be on camera.</em>
          </h2>
        </div>
        <aside className="note-card">
          <span className="note-eyebrow">Note · 01</span>
          <span className="note-title">Honest</span>
        </aside>
        <div className="problem-body">
          <p className="lead">
            No team. No studio. No audience built over years.
          </p>
          <p className="muted">
            You've watched other creators and thought: there has to be a faster way.
            <span className="text-cream"> There is.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ PROOF ------------------------ */
function ProofSection() {
  const stats = [
    { num: "169K", label: "No face. No filming. No team." },
    { num: "134K", label: "AI is taking your job." },
    { num: "126K", label: "Wanted to make money online." },
    { num: "54K", label: "She doesn't exist… but she pays my rent." },
  ];
  return (
    <section id="proof" className="section section-proof" data-testid="proof-section">
      <div className="rule-row">
        <span className="kicker">02 — Proof of concept</span>
        <span className="kicker kicker-dim">17 viral cuts · 4 platforms · 0 cameras</span>
      </div>
      <div className="proof-head">
        <h2 className="display-h2">
          Numbers from a face <em className="serif text-teal">that doesn't exist.</em>
        </h2>
      </div>
      <div className="stats-row">
        {stats.map((s, i) => (
          <article className="stat" key={i} data-testid={`proof-stat-${i + 1}`}>
            <span className="stat-idx">0{i + 1}</span>
            <div className="stat-num">{s.num}</div>
            <div className="stat-bar">
              <span className="stat-bar-fill" />
            </div>
            <p className="stat-label">"{s.label}"</p>
          </article>
        ))}
      </div>
      <p className="proof-foot">
        These videos were made with AI. No camera. No real creator.
      </p>
    </section>
  );
}

/* ----------------------- SOLUTION ----------------------- */
function SolutionSection() {
  return (
    <section id="solution" className="section section-solution" data-testid="solution-section">
      <div className="rule-row">
        <span className="kicker">03 — The solution</span>
        <span className="kicker kicker-dim">Character · content · monetisation</span>
      </div>
      <div className="solution-grid">
        <div className="solution-side">
          <div className="solution-card">
            <span className="solution-eyebrow">Build profile</span>
            <span className="solution-name">Scarllet Aurora</span>
            <span className="solution-meta">
              <span className="muted">Persona</span>
              <span>AI Influencer</span>
              <span className="muted">Voice</span>
              <span>Direct · confident</span>
              <span className="muted">Languages</span>
              <span>EN · PT · ES</span>
              <span className="muted">Posts</span>
              <span>Daily, 4 platforms</span>
            </span>
            <span className="solution-tools">
              {["ChatGPT", "Claude", "Gemini", "Veo3", "Grok"].map((t) => (
                <span key={t} className="tool-chip">
                  <span className="chip-dot" />
                  {t}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="solution-main">
          <h2 className="display-h1">
            Meet Scarllet. <em className="serif text-copper">She works 24/7.</em> She never gets tired. She's not real.
          </h2>
          <p className="lead">
            Scarllet Aurora is an AI influencer built from scratch — character, content, and monetization system.
          </p>
          <p className="muted">
            What you're looking at is a blueprint.
            <span className="text-cream"> And it's one you can replicate.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ HOW IT WORKS ------------------------ */
function HowSection() {
  const steps = [
    {
      n: "01",
      title: "Build your AI character",
      body:
        "Create a photorealistic AI persona with a consistent look, voice, and personality. No camera required.",
      pillars: ["Look", "Voice", "Story"],
    },
    {
      n: "02",
      title: "Generate content at scale",
      body:
        "Use AI video and image tools to produce short-form content that hooks, holds, and goes viral. Automated.",
      pillars: ["Hooks", "Loops", "Cadence"],
    },
    {
      n: "03",
      title: "Monetize the system",
      body:
        "Turn views into income through digital products, affiliate links, and community access. No face required.",
      pillars: ["Products", "Affiliates", "Community"],
    },
  ];
  return (
    <section id="how" className="section section-how" data-testid="how-section">
      <div className="rule-row">
        <span className="kicker">04 — Method</span>
        <span className="kicker kicker-dim">Three moves · ship weekly</span>
      </div>
      <h2 className="display-h2">
        From paper to <em className="serif text-teal">payout</em>, in three moves.
      </h2>
      <div className="steps">
        {steps.map((s, i) => (
          <article key={i} className="step" data-testid={`how-step-${i + 1}`}>
            <header className="step-head">
              <span className="step-num">{s.n}</span>
              <span className="step-meta">step {i + 1} / 3</span>
            </header>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-body">{s.body}</p>
            <ul className="step-pillars">
              {s.pillars.map((p) => (
                <li key={p}><span className="dash" /> {p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------ WHO ------------------------ */
function WhoSection() {
  const items = [
    "You want to make money online but don't want to be on camera",
    "You've tried content creation and burned out from filming",
    "You want to learn how AI tools actually make money — not just theory",
    "You're stuck in a 9-to-5 and want a real exit strategy",
    "You want to shortcut 2 years of learning into a clear, actionable system",
  ];
  return (
    <section id="who" className="section section-who" data-testid="who-section">
      <div className="rule-row">
        <span className="kicker">05 — Who this is for</span>
        <span className="kicker kicker-dim">Five lines · one mirror</span>
      </div>
      <div className="who-grid">
        <div className="who-headline">
          <h2 className="display-h2">
            If any of these feel like you, <em className="serif text-copper">the blueprint is for you.</em>
          </h2>
        </div>
        <ul className="checks">
          {items.map((t, i) => (
            <li key={i} className="check" data-testid={`who-item-${i + 1}`}>
              <span className="check-num">0{i + 1}</span>
              <span className="check-icon">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="check-text">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------- FINAL CTA ----------------------- */
function FinalCTA() {
  return (
    <section id="final-cta" className="section section-final" data-testid="final-cta-section">
      <div className="final-frame">
        <div className="final-glow" />
        <div className="final-inner">
          <span className="kicker">06 — Get access</span>
          <h2 className="display-h0">
            The blueprint is <em className="serif text-copper">open.</em>
          </h2>
          <p className="final-sub">Get the exact system behind Scarllet Aurora.</p>
          <a
            className="btn btn-primary btn-large"
            href="https://stan.store/scarlletaurora"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="final-cta-btn"
          >
            <span>Get Access Now</span>
            <ArrowRight size={20} />
          </a>
          <p className="fine-print">Digital product · Instant access · Lifetime updates.</p>
        </div>
        <div className="final-edges">
          <span className="edge edge-tl" />
          <span className="edge edge-tr" />
          <span className="edge edge-bl" />
          <span className="edge edge-br" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------ FOOTER ------------------------ */
function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-grid">
        <div>
          <span className="brand-mark">SA</span>
          <span className="footer-name">Scarllet Aurora</span>
          <p className="muted footer-tag">She's not real. But the income is.</p>
        </div>
        <div>
          <span className="kicker">Channels</span>
          <ul className="foot-list">
            <li>YouTube</li>
            <li>TikTok</li>
            <li>Instagram</li>
            <li>X / Threads</li>
          </ul>
        </div>
        <div>
          <span className="kicker">Stack</span>
          <ul className="foot-list">
            <li>ChatGPT · Claude</li>
            <li>Gemini · Grok</li>
            <li>Veo3 · Sora · Runway</li>
            <li>Nano Banana</li>
          </ul>
        </div>
        <div>
          <span className="kicker">Get in</span>
          <ul className="foot-list">
            <li><a href="mailto:hi@scarlletaurora.com">hi@scarlletaurora.com</a></li>
            <li>Est. 2026 — present</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Scarllet Aurora · A faceless studio.</span>
        <span>Built for creators who'd rather ship than be seen.</span>
      </div>
    </footer>
  );
}

/* ------------------------- APP ------------------------- */
function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="app" data-testid="app-root">
      <Nav scrolled={scrolled} />
      <Hero />
      <ProblemSection />
      <ProofSection />
      <SolutionSection />
      <HowSection />
      <WhoSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
