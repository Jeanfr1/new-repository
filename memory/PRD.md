# Scarllet Aurora — Landing Page PRD

## Original Problem Statement
Recreate the visual style/UI/UX of `https://skeleton-rebuild.preview.emergentagent.com/` (NomadaToast — dark luxury, premium editorial scroll-driven site) but rebuild the hero around a 5.04s video as a full-screen scroll-controlled experience for a fictional "Scarllet Aurora" — an AI influencer brand. Below the hero, 6 content sections (Problem, Proof, Solution, How, Who, Final CTA).

## User Choices
- 1A — No backend (pure static frontend)
- 2A — Smooth-scroll CTAs (`mailto:` for the final action)
- 3A — Use public CDN URL (later localized to `/media/hero.webm` + `.mp4` for codec compatibility)
- 4 — Best UX fallback (desktop scroll-scrub, mobile autoplay-loop with overlays synced to `timeupdate`)

## User Persona
- AI-curious creators stuck in 9-to-5s who want a faceless online income system
- People wanting to learn AI fast and shortcut the content-creation learning curve
- Brand tone: direct, confident, slightly provocative, aspirational

## Architecture
- Pure React frontend (single page, no backend, no DB)
- Files:
  - `/app/frontend/src/App.js` — single-page composition (Nav, Hero, 6 sections, Footer)
  - `/app/frontend/src/App.css` — full design system (color tokens, typography, all section styles)
  - `/app/frontend/src/index.css` — base dark theme override of Tailwind defaults
  - `/app/frontend/public/index.html` — Bricolage Grotesque + Fraunces + Inter Tight + JetBrains Mono fonts
  - `/app/frontend/public/media/hero.webm` (2MB, VP9 — primary for Chromium/Firefox)
  - `/app/frontend/public/media/hero.mp4` (3.8MB, H.264 High profile + faststart — Safari/iOS fallback)

## Implementation — what's been done (May 2026)
- **Hero v2 (current)**: single 100vh section with continuous autoplay+muted+loop video; the 5 cue overlays cycle automatically via `video.timeupdate` (not scroll-bound), CTA "Get the Method" always visible at bottom-left of hero. *Replaces* the v1 scroll-scrub hero which the user removed because it caused micro-freezes during scrolling.
- Mobile / desktop / reduced-motion all share the same loop logic now (reduced-motion still pauses on the final frame)
- 6 sections with editorial dark-luxury aesthetic — 4 stat counters, 3-step method grid, 5-item checklist, final CTA frame with copper glow
- Fixed top nav with glass-blur scrolled state, smooth-scroll to anchors
- Mailto-based final CTA → `hi@scarlletaurora.com`
- Custom typography: Bricolage Grotesque (display) + Fraunces (italic accents) + Inter Tight (body) + JetBrains Mono (kicker labels)
- Color palette: deep charcoal `#0B0A09`, copper `#C87941`, teal `#3ECFCF`, cream `#F5F0EB`
- Testing agent iteration 1 (scroll-scrub hero): 22/22 PASS
- Testing agent iteration 2 (loop hero regression): 24/24 PASS

## Backlog / Future Enhancements
- P1: Lead capture form on final CTA (replace `mailto:` with email submission to a serverless endpoint or MongoDB-backed FastAPI) — would lift conversion rate vs `mailto:`
- P1: Stripe checkout for an actual digital-product purchase flow (since the tagline is "She's not real. But the income is.")
- P2: Hover/scroll-triggered horizontal carousel of generated AI personas in the Solution section
- P2: Add Open Graph / Twitter Card meta tags for shareability
- P2: Add a small `<details>` FAQ block before the Final CTA (objection handling)
- P3: Lazy-load WebM via `IntersectionObserver` to delay buffer until user starts scrolling

## Next Tasks
- Add lead capture form + storage (would convert browsers to leads)
- A/B test the final CTA copy ("Get Access Now" vs "Steal the Blueprint" vs "Get the System")
- Add real social-proof testimonials (currently the 4 stat numbers are dummy data per brief)
