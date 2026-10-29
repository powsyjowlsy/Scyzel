# Saint Catherine's College - Institutional Web Portal & Weather Hub

A semantic, modern minimalist institutional portal and meteorological advisory center for **Saint Catherine's College** (Carcar City, Cebu, Philippines).

Developed as part of the **Grade 12 Techno WEATHER Performance Task** for the **Accountancy, Business and Management (ABM)** and **Humanities and Social Sciences (HUMSS)** Strands.

[![Institution: Saint Catherine's College](https://img.shields.io/badge/Institution-Saint_Catherine's_College-1E40AF.svg)](#)
[![Meteorological Standard: DOST-PAGASA](https://img.shields.io/badge/Meteorological_Standard-DOST--PAGASA_Aligned-059669.svg)](#)
[![Design System: Swiss Modernism 2.0](https://img.shields.io/badge/Design_System-Swiss_Modernism_2.0-2563EB.svg)](#)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production_Ready-success.svg)](#)

---

## Project Attribution & Academic Context

- **Educational Institution**: Saint Catherine's College (Carcar City, Cebu, Philippines)
- **Academic Program**: Senior High School Department (ABM & HUMSS Strands)
- **Course Requirement**: Grade 12 Techno WEATHER Performance Task
- **Meteorological Benchmark**: Carcar City, Cebu Coordinates (`10.1100° N, 123.6400° E`, Elevation `14 m MSL`)

---

## Project Overview & Background

Founded on June 15, 1923 by the Dominican Sisters of Saint Catherine of Siena, Saint Catherine's College has stood for over a century as a pillar of Catholic evangelization and academic excellence in southern Cebu.

This project delivers a high-performance, accessible, and responsive institutional web application that pairs an end-to-end academic showcase with an official campus weather and disaster risk reduction hub aligned with DOST-PAGASA benchmarks:
1. **Educational Continuum**: Showcases complete academic offerings from Basic Education (PAASCU Level II Accredited K-10) to Senior High School academic strands and Higher Education degree programs.
2. **Zero-Fabrication Live Telemetry**: Directly fetches real-time meteorological conditions for Carcar City from Open-Meteo with automated localStorage caching for offline resilience.
3. **Interactive Doppler Radar**: Multi-layer embed providing live Doppler rain radar and satellite cloud cover tracking across the Visayas basin.
4. **Rothfusz Heat Index Calculator**: Simulates ambient thermal stress via NOAA/Rothfusz regression equation and categorizes exposure across DOST-PAGASA 5-tier safety protocols.
5. **Human-Centric Ergonomics**: Built directly around 7 proactive UI/UX pillars preventing accidental data loss, sanitizing input, and facilitating instant browser-native printing.

---

## Core System Modules

### 1. Header & Navigation Architecture
- Accessible top navigation bar with brand crest, full institutional wordmark, and smooth anchor routing.
- Responsive mobile drawer sheet toggled via SVG hamburger/close transitions.
- Integrated quick-action button jumping directly to Admissions and Weather alerts.

### 2. Modern Minimalist Hero Showcase
- Luminous modern minimalist blue gradient (`#172554` to `#1E40AF` to `#1D4ED8`) with ambient negative-space radial depth.
- Strict WCAG AAA/AA contrast compliance ensuring effortless reading of typography without optical glare.
- Quick statistical proof metrics: 103 Years of Formation, PAASCU Level II Accredited, 100% DepEd/CHED Compliant, PAGASA Telemetry Station.

### 3. Comprehensive Academic Continuum
- Interactive tabbed strand and degree directory:
  - **Basic Education**: Kindergarten, Elementary (Grades 1-6), Junior High School (Grades 7-10).
  - **Senior High School**: Accountancy, Business and Management (ABM), Humanities and Social Sciences (HUMSS), Science, Technology, Engineering and Mathematics (STEM), General Academic Strand (GAS), Technical-Vocational-Livelihood (TVL).
  - **Higher Education**: College of Teacher Education (BEEd, BSEd English/Math/Filipino/SocStud), College of Business Administration (BSBA Financial Management, Marketing Management).

### 4. Official Weather & Disaster Preparedness Hub
- **Live Meteorological Telemetry**: Real-time ambient temperature, apparent heat index, relative humidity, wind velocity, atmospheric pressure, and cloud cover.
- **Doppler Radar & Satellite Tracking**: Tabbed container switching seamlessly between Visayas Doppler precipitation radar and regional satellite cloud imagery.
- **Interactive Heat Index Safety Calculator**:
  - Live dual sliders for ambient temperature (20°C to 45°C) and relative humidity (20% to 100%).
  - Three-part visual output hierarchy: prominent tabular metric (`font-variant-numeric: tabular-nums`), 5-stage segmented progress meter (`Normal`, `Caution`, `Ext. Caution`, `Danger`, `Ext. Danger`), and modular health risk / campus operational guidance sub-cards.
- **Verified Emergency Gateways**: Direct external links to DOST-PAGASA Tropical Cyclone Warnings, Severe Weather Bulletins, Flood Advisories, and Heat Index Bulletins.

### 5. Admissions Terminal & 7 UI/UX Ergonomic Pillars
- **Destructive Action Safeguard**: 2-step button state requiring confirmation within 4 seconds before clearing unsaved input.
- **Proactive Input Sanitization**: Real-time keystroke filtering restricting mobile numbers to 11 digits (`09XXXXXXXXX`) and student LRNs to 12 numerical digits.
- **Visual Error Highlighting & Auto-Focus**: Automatic highlighting of invalid inputs with instant viewport focus on the first invalid field upon submission attempt.
- **Zero-Friction Auto-Calculations**: Automatic calculation of applicant age and eligible academic departments directly from birthday inputs.
- **Decoupled Client-Native Workflows**: One-click instant `window.print()` rendering a clean, distraction-free admissions prospectus taking under 0.5 seconds.
- **Dual-Route Distribution**: Side-by-side access to digital online admissions inquiry and physical printable checklist.

---

## Architectural Standards & Invariants

- **Anti-AI Human-Centric Aesthetic**: Zero emojis across UI typography, headers, or documentation. All icons rendered via semantic SVG vector paths.
- **Tabular Numerals**: Strict enforcement of `font-variant-numeric: tabular-nums` across meteorological telemetry, coordinates, and statistics.
- **Container Cushioning & Typographic Breathing Rhythm**: Generous minimum padding (20px) on alert containers and relaxed line-heights (1.6) on all analytical text blocks.
- **Framework Utility Class Discipline**: 100% semantic CSS classes backed by design tokens (`var(--space-*)`, `var(--radius-*)`), completely eliminating undeclared framework class bleed.

---

## Technology Stack

- **Markup**: Semantic HTML5 (W3C validated, ARIA accessible)
- **Styling**: Modular CSS3 (Swiss Modernism 2.0 Design Tokens, Responsive Flexbox & CSS Grid)
- **Scripting**: Vanilla ECMAScript 2022+ (Zero external JavaScript runtime frameworks)
- **Meteorological API**: Open-Meteo REST API (Carcar City, Cebu coordinates)
- **Radar & Satellite Embeds**: Interactive Windy embed framework
- **Code Intelligence**: `@colbymchenry/codegraph` AST symbol graph indexing

---

## Getting Started

### Prerequisites
- Modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari)
- Optional: Python 3, Node.js (`http-server`), or VS Code Live Server extension

### Installation & Local Preview
```bash
# Clone the repository
git clone https://github.com/powsyjowlsy/Scyzel.git
cd Scyzel

# Option A: Open directly in your default browser
start index.html

# Option B: Run via lightweight local server (Python 3)
python -m http.server 8000
# Navigate to http://localhost:8000
```

---

## Performance Task Attribution & License

This project was developed for academic and educational evaluation under the **Grade 12 Techno WEATHER Performance Task** (ABM & HUMSS Strands). All institutional assets, emblems, and historical references belong to Saint Catherine's College, Carcar City, Cebu.
