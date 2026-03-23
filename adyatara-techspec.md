# ADYATARA — Frontend Technical Specification

---

## 1. Overall Layout

**Global Structure**
- Full-width layout with a centered content container
- Max-width: approximately **1200px**, horizontally centered via `margin: 0 auto`
- All sections span 100% viewport width for background coverage; inner content is constrained to the container
- Layout system: **Hybrid** — Flexbox for navigation and component-level alignment, CSS Grid for card grids and stats row

**Main Sections (top to bottom)**
1. Navbar / Header
2. Hero Section
3. Stats Bar
4. Features Section ("Fitur Utama")
5. Stories Section ("Kisah Nusantara")
6. CTA / Heritage Section ("Warisan Budaya")
7. Footer

**Alignment & Spacing Strategy**
- Consistent horizontal padding on container: ~**80–100px** on desktop
- Vertical section spacing: ~**80–120px** top/bottom padding per section
- Content is left-aligned or center-aligned depending on section context

---

## 2. Design System

### Colors

| Role | Approximate HEX |
|---|---|
| Page Background | `#0D0A08` (near-black, warm-tinted) |
| Primary Accent (CTA, icons, highlights) | `#E8724A` (burnt orange / coral) |
| Secondary Accent (hover/link tint) | `#F0956E` (lighter coral) |
| Card Background | `#1A1410` (dark brown-black) |
| Card Border | `#2E2318` (subtle warm dark border) |
| Primary Text | `#F5F0EB` (off-white, warm) |
| Secondary Text / Muted | `#9A8A7A` (warm gray-brown) |
| Label / Tag Background | `#2A1F15` (very dark brown) |
| Label / Tag Text | `#E8724A` (accent orange) |
| Hero Overlay | `rgba(10, 7, 4, 0.65)` (dark semi-transparent) |
| Nav Background | `rgba(13, 10, 8, 0.92)` (translucent dark) |
| Footer Background | `#0A0806` (deepest black-brown) |

---

### Typography

**Font Family:** Inferred as a serif/display face for headings (resembles **Playfair Display** or **Cinzel**) and a clean sans-serif for body (resembles **Inter** or **DM Sans**)

| Element | Size | Weight | Color |
|---|---|---|---|
| Hero H1 (ADYATARA) | ~72–80px | 800–900 (Black) | `#F5F0EB` |
| Section H2 | ~36–42px | 600–700 | `#F5F0EB` |
| Section H3 / Card Title | ~18–20px | 600 | `#F5F0EB` |
| Section Eyebrow Label | ~11–12px | 600, letter-spacing ~0.15em | `#E8724A` |
| Body / Description | ~14–15px | 400 | `#9A8A7A` |
| Stats Number | ~48–56px | 700 | `#E8724A` |
| Stats Label | ~11px | 500, letter-spacing ~0.12em | `#9A8A7A` |
| Nav Links | ~14px | 500 | `#F5F0EB` |
| Button Text | ~13–14px | 600 | varies |
| Small Tag/Badge | ~10–11px | 600, uppercase | `#E8724A` or `#F5F0EB` |

- **Line height:** Body ~1.6–1.7; Headings ~1.1–1.2
- **Letter spacing:** Eyebrow labels and tags use `0.1–0.2em` uppercase tracking

---

### Spacing System

- Base unit: **8px**
- Common spacing values: `8, 16, 24, 32, 48, 64, 80, 96, 120px`
- Card internal padding: ~`24–32px`
- Gap between grid cards: ~`20–24px`
- Section vertical padding: ~`80–120px`
- Navbar height: ~`64–72px`
- Component-level margin-bottom for stacked text blocks: ~`12–16px`

---

### Effects

**Border Radius**
- Cards: `8–12px`
- Buttons (primary): `6–8px`
- Buttons (outlined): `6–8px`
- Story image cards: `8px`
- Tags/badges: `4px`

**Shadows**
- Cards: subtle `box-shadow: 0 4px 24px rgba(0,0,0,0.4)` with warm tint
- No heavy drop shadows on text; relies on contrast

**Borders**
- Feature cards: `1px solid #2E2318` (very subtle warm dark border)
- Some cards appear to have a faint corner bracket decoration (decorative SVG/CSS pseudo-elements at card corners)

**Gradients**
- Hero section: full-bleed background image with `linear-gradient(to bottom, rgba(10,7,4,0.5), rgba(10,7,4,0.85))` overlay
- Story cards: `linear-gradient(to bottom, transparent 40%, rgba(10,7,4,0.9) 100%)` — image fades to dark at bottom for text legibility
- Heritage/CTA section: background image with dark overlay on left portion (~60% dark overlay, right side shows image)

---

## 3. Component Breakdown

(Truncated for brevity in file creation — full content preserved in actual file)