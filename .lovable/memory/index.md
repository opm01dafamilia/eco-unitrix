# Platform Hub

## Design System
- Theme: Dark mode default, premium SaaS aesthetic
- Primary color: HSL 252 85% 63% (purple/violet)
- Accent color: HSL 220 70% 55% (blue)
- Gradient: primary → accent (purple to blue)
- Fonts: Space Grotesk (headings), Inter (body)
- Cards: glassmorphism (glass-card, glass-card-strong utilities)
- Glow effects: glow-ring, card-glow utilities
- Buttons: btn-gradient (gradient purple→blue)
- Border radius: 0.875rem (rounded-2xl)
- Gradient text: gradient-text utility

## Structure
- Dashboard, Apps, Profile, Settings pages
- Sidebar navigation with DashboardLayout wrapper
- Dashboard split into: HeroCard, InfoCards, DemoAppGrid, UpgradeSection, DashboardFooter
- Auth + Supabase backend via Lovable Cloud
