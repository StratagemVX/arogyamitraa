# Arogya Mitra (ಆರೋಗ್ಯ ಸಹಾಯಕ) — Multilingual Voice-First Healthcare Triage Assistant

> Assistive voice-guided and multilingual healthcare triage web app (Kannada, Hindi, and English) built with React 18, TypeScript, Vite, Tailwind CSS, Web Speech API, Firebase, and Supabase.

[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Client-3ECF8E.svg)](https://supabase.com/)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech-API-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## Executive Overview

**Arogya Mitra** (`arogyamitraa`) helps bridge language and literacy barriers for preliminary health triage and first-aid awareness. Built as an installable Progressive Web App (`public/manifest.json`, `public/sw.js`), it supports spoken symptom input and voice readback across Kannada, Hindi, and English, emergency shortcuts, first-aid guidance, and nearby hospital/clinic lookup.

> **Security Remediation Status (`main` vs. Open Draft PR #1 — `security/remove-tracked-env`):**
> - **PR #1** removes tracked `.env`, private TLS keys (`ca.key`, `localhost-key.pem`), and localhost/CA certificates (`ca.crt`, `localhost.pem`, `public/ca.crt`) from version control; replaces `.env.example` with placeholders only; upgrades vulnerable packages in `package-lock.json`; hardens `HospitalMap.tsx` and `useTextToSpeech.ts`; adds Vitest security/triage tests (`src/test/security-and-triage.test.tsx`); and adds `.github/workflows/quality.yml` (verified passing in CI with ESLint 0 errors, 4/4 Vitest tests, and Vite production build).

---

## Core Capabilities & Actual Project Structure

### Implemented Modules
- **Voice & Multilingual Triage (`useVoiceRecognition.ts`, `useTextToSpeech.ts`, `useMedicalAnalysis.ts`, `src/lib/translations.ts`):** Web Speech recognition and speech synthesis UI with `VoiceOrb`, `TranscriptDisplay`, `LanguageSelector`, `SymptomQuickPick`, `QuickActions`, and `StatusIndicator`.
- **Safety, First-Aid & Offline Support (`Disclaimer.tsx`, `EmergencyButton.tsx`, `FirstAidGuide.tsx`, `HospitalMap.tsx`, `OfflineIndicator.tsx`, `useServiceWorker.ts`):** Medical disclaimer banner, emergency escalation controls, first-aid guide cards, hospital finder UI, and PWA offline support.
- **Cloud Client Integrations (`src/integrations/firebase/client.ts`, `src/integrations/supabase/client.ts`):** Client SDK wiring configured via Vite `VITE_*` environment variables.

```text
arogyamitraa/
├── .github/workflows/quality.yml     # CI: npm ci --ignore-scripts, audit, lint, test, build (PR #1)
├── public/                           # manifest.json, sw.js, favicon.svg, robots.txt
├── src/
│   ├── components/                   # Disclaimer, EmergencyButton, FirstAidGuide, HospitalMap,
│   │                                 # LanguageSelector, OfflineIndicator, QuickActions, StatusIndicator,
│   │                                 # SymptomQuickPick, TranscriptDisplay, VoiceOrb, ui/
│   ├── hooks/                        # useAudioLevel, useConversationHistory, useMedicalAnalysis,
│   │                                 # useServiceWorker, useTextToSpeech, useVoiceRecognition
│   ├── integrations/                 # firebase/client.ts, supabase/client.ts, supabase/types.ts
│   ├── lib/translations.ts           # Multilingual copy & triage translations
│   ├── pages/                        # Index.tsx, NotFound.tsx
│   └── test/                         # setup.ts, example.test.ts, security-and-triage.test.tsx (PR #1)
├── .env.example                      # Placeholder client environment template
├── TESTING_GUIDE.md
├── VOICE_ASSISTANT_IMPLEMENTATION.md
└── package.json
```

---

## Setup, Environment & Verification

### Installation & Local Development
```bash
git clone https://github.com/StratagemVX/arogyamitraa.git
cd arogyamitraa

npm ci --ignore-scripts
cp .env.example .env
npm run dev
```

### Environment Configuration (`.env.example`)
All browser configuration uses client-side `VITE_*` variables (`src/integrations/supabase/client.ts` & `src/integrations/firebase/client.ts`):
- **Supabase:** `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Firebase:** `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`

*Never commit real `.env` files, private keys (`*.key`, `*.pem`), or privileged service credentials.*

### Available Package Scripts (`package.json`)
| Script | Command | Notes |
|---|---|---|
| `npm run dev` | `vite` | Start local Vite dev server |
| `npm run build` | `vite build` | Production SPA build |
| `npm run lint` | `eslint .` | ESLint analysis |
| `npm test` | `vitest run` | Run Vitest unit & triage/security suite |
| `npm run preview` | `vite preview` | Preview built `dist/` bundle |

---

## Contributor Attribution & Profile

- **Lead Engineer:** Chethan Kumar B S (`StratagemVX`)
- **GitHub:** [https://github.com/StratagemVX](https://github.com/StratagemVX)
- **Portfolio:** [https://chethan-kumar-portfolio.vercel.app/](https://chethan-kumar-portfolio.vercel.app/)
- **LinkedIn:** [https://linkedin.com/in/chethan-kumar-b-s-781a002bb](https://linkedin.com/in/chethan-kumar-b-s-781a002bb)
