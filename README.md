# AMUN (آمون) — Deep Space Mission Designer & Orbital Simulator

<div align="center">

<img src="./assets/header-3d.svg" alt="Project AMUN: Deep Space Mission Designer and Orbital Simulator" width="100%" />

<br /><br />

<a href="https://github.com/omarmetman/amun"><img src="./assets/btn-launch.svg" alt="Launch Simulator" height="52" /></a>
<a href="./promo-video.html"><img src="./assets/btn-video.svg" alt="Play 30s Promo Video" height="52" /></a>
<a href="https://github.com/omarmetman/amun"><img src="./assets/btn-github.svg" alt="View Source Code on GitHub" height="52" /></a>

<br /><br />

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Vitest-41%2F41%20Passed-3FA878?logo=vitest&logoColor=white)](https://vitest.dev/)
[![NASA Open Data](https://img.shields.io/badge/NASA%20Data-Horizons%20%7C%20SBDB%20%7C%20NTRS-E3A92F?logo=nasa&logoColor=white)](https://www.nasa.gov/)
[![Offline First](https://img.shields.io/badge/Architecture-100%25%20Client--Side%20%7C%20Offline%20Ready-0D1F4C)](#offline-architecture)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AA%20%7C%20RTL%20%2B%20LTR-EDE7D8?logoColor=0D1F4C)](#accessibility--internationalization)

[Live Demo](https://github.com/omarmetman/amun) • [Interactive Promo Player](promo-video.html) • [Subtitles (AR/EN)](amun_subtitles_ar.srt) • [Documentation](#table-of-contents)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Core Engineering Workflow (11 Steps)](#core-engineering-workflow-11-steps)
- [Astrophysics & Mathematical Formulations](#astrophysics--mathematical-formulations)
- [NASA Open Data Provenance](#nasa-open-data-provenance)
- [Story Campaign: "AMUN Horizon"](#story-campaign-amun-horizon)
- [Pilot Profile & 26 Achievements](#pilot-profile--26-achievements)
- [Design Identity: The Egyptian Engineer's Blueprint](#design-identity-the-egyptian-engineers-blueprint)
- [Development Methodology (50% AI / 50% Human Engineering)](#development-methodology-50-ai--50-human-engineering)
- [Technical Architecture](#technical-architecture)
- [Interactive 30-Second Promo Video Player](#interactive-30-second-promo-video-player)
- [Getting Started & Installation](#getting-started--installation)
- [Automated Testing & Verification](#automated-testing--verification)
- [Extensibility Guide](#extensibility-guide)
- [Scientific Scope & Pedagogical Limits](#scientific-scope--pedagogical-limits)
- [License & NASA Media Compliance](#license--nasa-media-compliance)

---

## Overview

**Project AMUN** (*named after the ancient Egyptian deity of hidden potential, represented by the iconic twin plumes and solar disc*) is a modern, web-based space mission design laboratory. It guides users through the intricate compromises of interplanetary spaceflight: balancing scientific instrument power against solar decay, sizing rocket propellants using closed-form structural equations, optimizing Deep Space Network communications, and navigating Hohmann transfer trajectories.

Unlike typical gamified space titles that rely on arbitrary scores or unphysical sliders, AMUN enforces a **pure, deterministic computational engine** (`src/engine`). Every slider movement or subsystem choice immediately ripples through five coupled aerospace constraints:
1. **Mass vs. Launch Vehicle Capacity** ($C_3$ characteristic energy curve)
2. **Power Generation vs. Load Budget** (Cruise, Science, and Eclipse safe-modes)
3. **Data Link Budget vs. Interplanetary Range** (Deep Space Network 34m / 70m)
4. **Mission $\Delta v$ Demand vs. Available Rocket Velocity**
5. **Subsystem Expenditures vs. Budget & Reserves**

---

## Key Features

* **Authentic 11-Step Mission Wizard**: From initial science objectives to orbital trajectory design and post-mortem evaluation.
* **Pure Mathematical Engine**: Decoupled from the UI, executing closed-form rocket equations, inverse-square solar flux models, and link margins.
* **Deterministic Monte Carlo Simulation**: Seeded pseudo-random number generator (FNV-1a + Mulberry32) ensuring identical design + identical seed = identical mission trajectory and events.
* **"AMUN Horizon" 6-Chapter Story Campaign**: An episodic narrative following a catastrophic 2041 solar flare, unraveling deep-space signals across the Solar System (2041–2051).
* **Commander Profile & 26 Scientific Achievements**: Permanent browser-persisted progression with pilot ranks from *Trainee* to *Legend of Amun*.
* **Bespoke Visual Language**: Replaces generic dark sci-fi templates with authentic Egyptian mural pigments (*Lapis Lazuli*, *Egyptian Blue*, *Limestone*, *Gold Ochre*), linear Margin Rulers, and an SVG Trajectory Stepper.
* **NASA Provenance Badges**: Real-time provenance badges documenting live vs. cached vs. snapshot data from NASA JPL Horizons, SBDB, and NTRS citations.
* **100% Client-Side & Offline-Ready**: Embedded JSON snapshots guarantee complete functionality without external servers or internet connection.
* **Full Bidirectional Localization**: Native Right-to-Left (RTL) Arabic and Left-to-Right (LTR) English interfaces.

---

## Core Engineering Workflow (11 Steps)

<div align="center">
  <img src="./assets/telemetry-3d.svg" alt="Live Aerospace Flight Telemetry Deck & Margin Rulers" width="100%" />
</div>

<br />

The simulator is structured as a sequential aerospace design review lifecycle:

```
[01 Objectives] ──> [02 Spacecraft] ──> [03 Instruments] ──> [04 Launch Vehicle]
                                                                     │
[08 Comms]      <── [07 Mass & Δv]  <── [06 Power Budget] <── [05 Budget & Reserves]
    │
    └──> [09 Orbit Trajectory] ──> [10 Mission Simulation] ──> [11 Post-Mortem Report]
```

1. **Step 01 — Mission Objectives**: Select celestial target (Moon, Mars, Venus, Jupiter, Asteroids like Bennu/Ceres, Comets like 67P/Halley) and mission profile (Flyby, Orbiter, Lander, Rendezvous, Sample Return).
2. **Step 02 — Spacecraft Bus & Propulsion**: Select bus platform (Dry mass, structural capacity) and engine chemistry (Monopropellant, Bipropellant, or High-$I_{sp}$ Ion thruster) with redundancy and radiation hardening options.
3. **Step 03 — Scientific Instruments**: Allocate payload suite (Narrow/Wide Cameras, IR Spectrometer, LIDAR, Magnetometer, Sub-surface Radar, Mass Spectrometer, Gamma/Neutron detector, Sample Capsule). Science return scales dynamically with target affinity.
4. **Step 04 — Launch Vehicle**: Interpolate rocket payload capacities as a function of characteristic injection energy ($C_3$) across Electron, Falcon 9, Falcon Heavy, Atlas V 551, Vulcan Centaur, Ariane 6, and SLS Block 1.
5. **Step 05 — Budget & Reserves**: Allocate development, daily operations ($opsDays$), DSN tracking hours, and financial safety reserves against stochastic cost inflation.
6. **Step 06 — Power Subsystems**: Size solar array surface areas ($m^2$), Radioisotope Thermoelectric Generators (RTGs), and battery capacities ($Wh/kg$) across Cruise, Science, and Eclipse modes.
7. **Step 07 — Mass & Rocket Sizing**: Solve the structural tank-to-propellant mass ratio in closed form. Flags physical singularities when delta-v demands exceed propulsion capability.
8. **Step 08 — Deep Space Communications**: High-Gain Antenna (HGA) diameter sizing, X/Ka band selection, transmitter RF power, and DSN ground station aperture matching (34m vs 70m).
9. **Step 09 — Orbital Constraints**: Hohmann transfer mechanics, synodic launch window penalties, planetary capture, landing velocity requirements, and orbital plane change penalties ($\Delta v \approx 2v\sin(i/2)$).
10. **Step 10 — Mission Simulation**: Seeded timeline execution modeling launch reliability, interplanetary cruise, planetary insertion, operational telemetry, and stochastic anomalies (solar storms, micrometeoroid impacts, DSN scheduling conflicts).
11. **Step 11 — Mission Success Evaluation**: 100-point composite score (Science 35%, Budget 20%, Engineering Margins 20%, Reliability 25%), letter rank ($S, A, B, C, D, F$), and root-cause post-mortem analysis.

---

## Astrophysics & Mathematical Formulations

<div align="center">
  <img src="./assets/physics-3d.svg" alt="5 Coupled Computational Physics Engines" width="100%" />
</div>

<br />

All computations reside in standalone, pure TypeScript modules (`src/engine/`) with zero framework dependencies.

### 1. Closed-Form Propellant & Structural Sizing (`rocket.ts`)

Standard rocket calculations suffer from recursive dependency: adding propellant requires larger tanks, which adds dry mass, demanding more propellant. AMUN resolves this analytically using a closed-form closed-mass solution.

Let $k = \frac{m_{\text{tank}}}{m_{\text{prop}}}$ be the structural tank fraction (typically $0.08$ to $0.15$), and $m_{\text{other}}$ be the spacecraft dry mass excluding propellant tanks:

$$x = \frac{\Delta v_{\text{req}} \cdot (1 + \text{reserve})}{I_{sp} \cdot g_0}$$

The closed-form propellant mass is derived from:

$$m_{\text{wet}} = m_{\text{other}} + (1 + k) m_{\text{prop}} = (m_{\text{other}} + k m_{\text{prop}}) \cdot e^x$$

$$m_{\text{prop}} = \frac{m_{\text{other}} \cdot (e^x - 1)}{1 - k \cdot (e^x - 1)}$$

> **Physical Singularity Boundary**: If $1 - k \cdot (e^x - 1) \le 0$, the denominator collapses to zero or negative. The engine flags `equationClosed = false`, preventing impossible spacecraft designs and triggering an immediate engineering halt: *"Equation cannot close: Reduce required $\Delta v$ or upgrade $I_{sp}$"*.

### 2. Solar Flux & Power Generation Model (`power.ts`)

Solar irradiance $S(r)$ decays according to the inverse-square law based on heliocentric distance $r$ (in Astronomical Units, AU):

$$S(r) = \frac{1361}{r^2} \quad [\text{W/m}^2]$$

Solar array electrical output accounting for multi-junction cell efficiency $\eta \approx 0.28$, structural packing factor $P_f \approx 0.90$, and annual radiation degradation $\delta \approx 2.5\%/\text{year}$:

$$P_{\text{solar}}(t) = A \cdot S(r) \cdot \eta \cdot P_f \cdot (1 - \delta)^t$$

RTG electrical power with radioactive isotope decay (plutonium-238, $\approx 0.8\%/\text{year}$):

$$P_{\text{rtg}}(t) = n_{\text{rtg}} \cdot 290 \cdot (1 - 0.008)^t \quad [\text{W}]$$

### 3. Deep Space Network Link Budget (`comms.ts`)

Telecommunication downlink bitrate $R$ is calibrated against Mars Reconnaissance Orbiter (MRO) empirical benchmarks:

$$R = R_{\text{ref}} \cdot \left(\frac{P_{\text{tx}}}{100}\right) \cdot \left(\frac{D_{\text{ant}}}{3}\right)^2 \cdot f_{\text{ratio}}^2 \cdot \left(\frac{0.5}{d_{\text{AU}}}\right)^2 \cdot G_{\text{ground}} \quad [\text{kbit/s}]$$

* $R_{\text{ref}} \approx 4000 \text{ kbit/s}$ at reference distance $0.5 \text{ AU}$.
* $f_{\text{ratio}} = 4.0$ for Ka-band ($\approx 32 \text{ GHz}$) vs. $1.0$ for X-band ($\approx 8.4 \text{ GHz}$).
* $G_{\text{ground}} = 4.2$ for the massive DSN $70\text{m}$ antenna vs. $1.0$ for standard $34\text{m}$ beam waveguide antennas.
* $d_{\text{AU}}$ is the dynamic target-to-Earth range extracted from NASA JPL Horizons.

### 4. Hohmann Transfer & Synodic Launch Windows (`orbit.ts`)

Interplanetary transit duration $T$ along a semi-major axis $a = \frac{r_1 + r_2}{2}$:

$$T = \pi \sqrt{\frac{a^3}{\mu_{\odot}}} \approx 0.5 \cdot a_{\text{AU}}^{1.5} \cdot 365.25 \quad [\text{days}]$$

Launch window recurrence periods are derived from the synodic period $P_{\text{syn}}$:

$$P_{\text{syn}} = \frac{1}{|1/P_{\text{Earth}} - 1/P_{\text{target}}|}$$

Departures outside optimal planar alignments incur an orbital plane-change $\Delta v$ penalty:

$$\Delta v_{\text{plane}} \approx 2 \cdot v_{\text{target}} \cdot \sin\left(\frac{i}{2}\right)$$

---

## NASA Open Data Provenance

AMUN connects directly to official NASA/JPL public endpoints. Every factual parameter is accompanied by an interactive provenance footnote badge:

| Endpoint / Archive | Implementation | Purpose in AMUN |
| :--- | :--- | :--- |
| **[NASA JPL Horizons API](https://ssd.jpl.nasa.gov/api/horizons.api)** | REST Vector & Ephemeris Queries | Real target-to-Sun and target-to-Earth ranges, orbital inclinations, and heliocentric positions. |
| **[NASA JPL SBDB API](https://ssd-api.jpl.nasa.gov/sbdb.api)** | Small-Body Database Queries | High-precision orbital elements, diameters, and rotational periods for asteroids (Bennu, Ceres, Vesta) and comets (67P, Halley). |
| **[NASA Image & Video Library](https://images-api.nasa.gov/search)** | Media Asset Retrieval | High-resolution celestial body photography paired with official mission attribution credits. |
| **[NASA Technical Reports (NTRS)](https://ntrs.nasa.gov/api/citations/search)** | STI Program Citations | Aerospace engineering literature links provided inside the in-game *Learn Panel*. |
| **[Basics of Space Flight](https://science.nasa.gov/learn/basics-of-space-flight/)** | Educational Concept Reference | JPL educational chapter citations integrated into contextual help popovers. |

```
                ┌──────────────────────────────────┐
                │        Client Web Browser        │
                └────────────────┬─────────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌──────────────────────┐                    ┌──────────────────────┐
│  Live NASA Endpoints │                    │  Fallback Snapshots  │
│  JPL Horizons / SBDB │                    │  Offline JSON Files  │
│  (7-day Cache Layer) │                    │  (Zero Connectivity) │
└──────────────────────┘                    └──────────────────────┘
```

> **Offline Snapshot Failover**: To ensure robust operation in remote educational settings or during API maintenance, AMUN packages verified static snapshots (`horizons.json`, `sbdb.json`). The system automatically fails over to the snapshot if network latency exceeds 8 seconds.

---

## Story Campaign: "AMUN Horizon"

<div align="center">
  <img src="./assets/campaign-3d.svg" alt="AMUN Horizon: 6-Chapter Solar System Campaign" width="100%" />
</div>

<br />

Beyond sandbox mission planning, AMUN introduces **AMUN Horizon**—a six-chapter narrative campaign spanning from 2041 to 2051.

```
2041                 2043               2045               2047               2049               2051
[Ch 1: Moon Echo] ──> [Ch 2: Mars Dust] ──> [Ch 3: Bennu] ──> [Ch 4: Venus] ──> [Ch 5: Jupiter] ──> [Ch 6: Ceres]
```

* **Premise**: In 2041, an unprecedented solar super-storm severs deep-space relay grids. Amidst the noise, an anomalous 1420.405 MHz pulse is detected repeating every 26 months across six strategic loci.
* **Campaign Mechanics**: Each chapter enforces a strict operational brief (fixed target, mission profile, and seed), tasking the player with engineering a viable spacecraft configuration that satisfies both primary and optional secondary milestones.
* **Balanced Presets**: All chapters feature mathematically verified reference presets tested via automated CI test suites (`campaign.test.ts`) guaranteeing 3-star feasibility.

---

## Pilot Profile & 26 Achievements

The simulator features a comprehensive career tracking system storing pilot accomplishments locally without external user accounts:

* **26 Unique Achievements** grouped into four disciplines:
  1. *Milestones* (First launch, first successful planetary orbit, first sample returned).
  2. *Exploration* (Visiting comets, extreme outer solar system targets).
  3. *Engineering Mastery* (Closing design margins within the optimal 10%–30% safety window, surviving safe-mode emergencies, zero-loss telecommunication links).
  4. *Excellence* (Attaining S-Rank evaluations, completing the campaign).
* **Progressive Ranks**: *Trainee* $\rightarrow$ *Assistant Engineer* $\rightarrow$ *Mission Engineer* $\rightarrow$ *Flight Director* $\rightarrow$ *Legend of AMUN*.

---

## Design Identity: The Egyptian Engineer's Blueprint

AMUN rejects generic sci-fi tropes—such as neon glows, starfield particle backgrounds, and glassmorphic card stacks—in favor of a disciplined aesthetic inspired by ancient Egyptian mural pigments and technical drafting blueprints.

```
┌────────────────────────────────────────────────────────────────────────┐
│  COLOR PALETTE (Authentic Mural Pigments)                              │
├────────────────────────────────────────────────────────────────────────┤
│  ■ Lapis Lazuli     #0D1F4C   Deep engineering canvas background       │
│  ■ Egyptian Blue    #1A3A85   Structural surfaces and 1px borders      │
│  ■ Limestone White  #EDE7D8   High-contrast legible typography         │
│  ■ Gold Ochre       #E3A92F   Primary interactive focus and highlights │
│  ■ Malachite        #3FA878   Nominal margins & verified systems       │
│  ■ Amber            #F28C28   Engineering warnings & cautions          │
│  ■ Carnelian        #D8452F   Critical blockers & unclosed equations   │
└────────────────────────────────────────────────────────────────────────┘
```

* **The Trajectory Stepper**: Replaces standard step bars with an interactive SVG orbital transfer curve tracking the spacecraft from Earth to destination.
* **Margin Rulers**: Replaces radial dials with horizontal linear aerospace margin bars clearly highlighting the optimal $10\% - 30\%$ engineering safety margin.
* **The Cartouche (الخرطوش)**: Traditional oval rope cartouches frame mission names and the final letter evaluation grade.
* **The Lotus Frieze**: A subtle geometric architectural border gracing the welcome interface and mission debrief dossier.
* **Bespoke 24px Iconography**: Handcrafted SVG vector icons with uniform 1.75px line-weights.

---

## Development Methodology (50% AI / 50% Human Engineering)

AMUN was developed under a disciplined, hybrid development model pairing rigorous human aerospace systems architecture with AI development acceleration.

```
┌─────────────────────────────────────────────────────────────────────────┐
│              PROJECT AMUN COLLABORATIVE ENGINEERING MODEL               │
├────────────────────────────────────┬────────────────────────────────────┤
│   HUMAN SYSTEMS ARCHITECTURE (50%) │   AI IMPLEMENTATION ACCEL. (50%)   │
├────────────────────────────────────┼────────────────────────────────────┤
│ • Derivation of closed-form rocket │ • DeepSeek 4.1 Flash (Free Tier):  │
│   and mass-ratio equations.        │   Initial TypeScript scaffolding,  │
│ • Definition of 11-step workflow   │   pure mathematical formulations,  │
│   and interactive dependency graph.│   and Vitest unit test suites.     │
│ • "AMUN Horizon" 6-chapter story   │ • Google Gemini Flash (Free Tier): │
│   narrative and debrief lore.      │   Visual redesign execution,       │
│ • Authentic Egyptian mural pigment │   mobile 360px viewport auditing,  │
│   art direction & UX blueprints.   │   RTL bidirectionality compliance, │
│ • NASA API integration & vetting   │   and final production build       │
│   of orbital mechanics benchmarks. │   stabilization.                   │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

## Technical Architecture

```
src/
├── data/              # Typed game records (Targets, Launchers, Instruments, Campaign)
│   ├── snapshot/      # Embedded JPL Horizons & SBDB offline cache
│   └── sources.ts     # Provenance records & citation links
├── engine/            # PURE COMPUTATIONAL LAYER (Zero React dependencies)
│   ├── constants.ts   # Astrodynamic constants (g0, AU, mu_sun)
│   ├── rocket.ts      # Closed-form Tsiolkovsky mass equation
│   ├── orbit.ts       # Hohmann transfer, C3 interpolation, synodic windows
│   ├── power.ts       # Solar flux decay, RTG, eclipse battery sizing
│   ├── comms.ts       # DSN link margin & bitrate formulas
│   ├── derive.ts      # Single unified design resolution pipeline
│   ├── simulate.ts    # Seeded Monte Carlo mission simulator
│   └── score.ts       # Multi-attribute scoring & causal post-mortem analysis
├── store/             # Zustand persistent state management
│   ├── useMissionStore.ts # Central mission state + schema migrations
│   └── useCampaign.ts     # Chapter progress & evaluation selectors
├── components/        # Handcrafted modular presentation layer
│   ├── AmunLogo.tsx   # Bespoke twin-plume & solar disc vector logo
│   ├── Ornament.tsx   # Egyptian Cartouche & Lotus Frieze components
│   ├── Icons.tsx      # Unified 24px geometric stroke icon suite
│   ├── Stepper.tsx    # SVG Trajectory transfer curve stepper
│   ├── Gauge.tsx      # Aerospace Margin Rulers
│   └── Dashboard.tsx  # Persistent engineering telemetry bar
└── steps/             # Step01Objectives through Step11Evaluation views
```

---

## Interactive 30-Second Promo Video Player

The repository includes a dedicated, browser-based motion graphics player: [`promo-video.html`](promo-video.html).

* **Format**: Precision 30.0-second timeline (900 frames @ 30 FPS).
* **Dual Aspect Ratio**: Switchable between **16:9 Landscape (1920×1080)** and **9:16 Vertical (1080×1920)** with safe margin guides.
* **Audio Synthesis**: Integrated Web Audio API sound generator (soft clicks, carnelian warning alert, launch rumble, evaluation chime).
* **Subtitles**: Accompanied by synchronized subtitle files:
  * Arabic: [`amun_subtitles_ar.srt`](amun_subtitles_ar.srt)
  * English: [`amun_subtitles_en.srt`](amun_subtitles_en.srt)

To preview or capture the video, open `promo-video.html` in any modern web browser.

---

## Getting Started & Installation

### Prerequisites

* **Node.js**: Version 18.0 or higher
* **npm** (or `pnpm` / `yarn`)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/omarmetman/amun.git
cd amun

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the simulator.

### Production Build

```bash
# Run strict TypeScript validation and build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The resulting `dist/` directory is completely static and can be deployed directly to GitHub Pages, Netlify, Vercel, or any static hosting service with zero backend requirements.

---

## Automated Testing & Verification

AMUN enforces 100% test pass rates across its pure mathematical engine and state stores using **Vitest**:

```bash
npm test
```

### Test Suite Overview (41 Passing Tests):
* **`engine.test.ts` (18 tests)**: Verifies closed-form propellant mass equation, rocket capacity ceilings, solar flux $1/r^2$ decay, DSN bitrate decay, Hohmann transfer times, $C_3$ interpolation, and deterministic seed reproducibility.
* **`campaign.test.ts` (8 tests)**: Asserts that all 6 campaign reference presets are physically viable, error-free, and capable of earning 3 stars.
* **`achievements.test.ts` (8 tests)**: Validates achievement unlocking logic, pilot stat tracking, and migration resilience.
* **`useMissionStore.test.ts` (7 tests)**: Confirms state persistence, import/export sanitization, and campaign directive locking.

---

## Extensibility Guide

AMUN's content architecture is entirely data-driven (`src/data/`). Adding new targets, launch vehicles, or instruments requires no modifications to the physics engine.

### Adding a New Celestial Target (`src/data/targets.ts`)

```typescript
export const NEW_TARGET: MissionTarget = {
  id: 'europa',
  name: { ar: 'أوروبا', en: 'Europa' },
  kind: 'moon',
  horizonsId: '502',
  sunDistanceAU: 5.20,
  earthDistanceAU: 4.28,
  semiMajorAxisAU: 5.20,
  eccentricity: 0.009,
  orbitalPeriodYears: 11.86,
  inclinationDeg: 1.79,
  diameterKm: 3121,
  gravityMS2: 1.315,
  rotationHours: 85.2,
  captureDvMS: 850,
  landingDvMS: 2100,
  returnDvMS: 4200,
  hazardFactor: 1.4,
  sampleReturnCapable: true,
  landingCapable: true,
  allowedMissions: ['flyby', 'orbiter', 'lander', 'sampleReturn'],
  image: {
    url: 'https://images-assets.nasa.gov/image/PIA00502/PIA00502~orig.jpg',
    credit: 'NASA/JPL',
    nasaId: 'PIA00502'
  },
  sourceKeys: ['horizons', 'nasaFact']
};
```

---

## Scientific Scope & Pedagogical Limits

AMUN is designed as an educational bridge between introductory science and professional systems engineering. To maintain engaging browser playability, deliberate modeling boundaries were chosen:

* **Trajectory Modeling**: Utilizes analytical Hohmann transfers with synodic window approximations; does not solve numerical $N$-body differential equations.
* **Gravity Assists**: Modeled via analytical velocity transfer bonuses rather than patched conic numerical optimization.
* **Telecommunications**: Link budgets model space loss and antenna gain while simplifying atmospheric weather attenuation and pointing jitter.
* **Thermal & Radiation**: Radiation shielding modifies probability weights in the stochastic simulator rather than simulating particle transport physics.
* **Story Narrative**: The 1420.405 MHz pulse in the campaign is based on the genuine neutral hydrogen radio line ($21\text{cm}$), while the narrative lore is an original educational fiction.

---

## License & NASA Media Compliance

* **Software**: Distributed under the [MIT License](LICENSE).
* **NASA Data & Imagery**: NASA imagery, audio, video, and data used in this project are public domain under NASA Media Usage Guidelines. Spacecraft and planetary assets remain the property of NASA/JPL-Caltech.
* **Brand Identity**: The AMUN name, twin-plume emblem, and custom iconography are original assets created for this project.

<div align="center">

```
=============================================================
  "From the Nile to the Stars — Designed for NASA Space Apps"
=============================================================
```

</div>
