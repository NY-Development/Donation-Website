# 💜 Donation Web App — Frontend

A modern, responsive, and animation-rich **frontend donation platform** built with **React (Vite)**, **Tailwind CSS v4**, and **GSAP**.

This frontend focuses on **clean UX, accessibility, and performance**, providing donors with a smooth and trustworthy experience while remaining fully backend-agnostic and API-ready.

---

## 🎯 Purpose

- Present donation campaigns clearly and credibly
- Provide a frictionless, secure-feeling donation flow
- Deliver smooth, subtle animations without sacrificing performance
- Serve as a scalable UI foundation for NGO / charity platforms

---

## ✨ Key Features

- ⚛️ **React + Vite** — Fast development & optimized builds
- 🎨 **Tailwind CSS v4** — Utility-first responsive styling
- 🎬 **GSAP** — Smooth page, scroll & micro-interaction animations
- 🧭 **React Router** — Public & protected routing
- 🔐 **Auth-ready UI** — Route guards & conditional rendering
- 💳 **Donation UI Flow** — Validated forms & feedback states
- 🧩 **Reusable Component System**
- 📱 **Fully Responsive** — Mobile, tablet & desktop
- 🌗 **Dark-mode Friendly Design**

---

## 🗂️ Folder Structure

src
├─ animations/ # GSAP timelines & reusable animations
├─ components/
│ ├─ layout/ # Navbar, Footer, App Layout
│ ├─ onboarding/ # Multi-step onboarding flow
│ └─ ui/ # Buttons, cards, modals, loaders
├─ hooks/ # Custom React hooks
├─ pages/ # Route-based pages
├─ routes/ # Public & protected route configs
├─ services/ # API & auth helpers (Axios-based)
├─ App.jsx
└─ main.jsx


---

## 🚦 Frontend Pages

- 🏠 Home / Landing
- 💝 Donate
- 📋 Campaigns
- 📄 Campaign Detail
- 🆕 Start a Campaign
- ℹ️ About
- 🆘 Help Center
- 🔑 Sign In / Sign Up
- ✅ Protected Pages (dashboard, confirmation, etc.)

---

## 🎨 Design System

- Reusable buttons & UI components
- Consistent spacing & typography
- Clear visual hierarchy
- Accessible form controls
- Dark-mode friendly color palette

---

## 🎬 Animations (GSAP)

- Page entrance transitions
- Scroll-triggered section reveals
- CTA hover micro-interactions
- Donation success animations
- Onboarding step transitions

All animations are **subtle, performant, and user-focused**.

---

## 🧠 Onboarding Flow

- Introduces platform features
- Step-based navigation (Next / Back)
- GSAP-powered transitions
- Completion state stored locally

---

## 🔐 Frontend Security Notes

- No sensitive data stored on the client
- Token handling delegated to backend
- Route protection via UI guards
- Automatic redirect for unauthorized access

---

## 🛠️ Tech Stack

| Technology | Purpose |
|----------|--------|
| ⚛️ React | UI development |
| ⚡ Vite | Bundler & dev server |
| 🎨 Tailwind CSS v4 | Styling |
| 🎬 GSAP | Animations |
| 🧭 React Router | Navigation |
| 🌐 Axios | API requests |

---

## 🧪 Testing & Optimization

- Responsive testing across devices
- Animation performance tuning
- Route validation
- Code cleanup & refactoring
- Accessibility checks (contrast, focus states)

---

## 🏁 Getting Started

### Install dependencies
```bash
npm install
Start development server
npm run dev
Build for production
npm run build
🔮 Planned Enhancements
Donation dashboard UI

Campaign creation wizard

Analytics & progress visualizations

Multi-language UI support

Accessibility (WCAG) improvements

Theme customization

🤝 Contribution Guidelines
Follow component-based architecture

Keep UI components reusable and stateless where possible

Use Tailwind utility classes consistently

Keep animations minimal and purposeful

📜 License
This frontend project is licensed under the MIT License.

💜 Crafted with care to maximize trust, clarity, and impact.