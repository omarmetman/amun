<div align="center">

# AMUN — Deep Space Mission Designer & Orbital Simulator

<br />

<img src="./assets/header-3d.svg" alt="Project AMUN: Deep Space Mission Designer and Orbital Simulator" width="100%" />

<br /><br />

<a href="https://omarmetman.vercel.app/projects/amun"><img src="./assets/btn-website.svg" alt="Project Showcase Lab" height="52" /></a>
<a href="https://github.com/omarmetman/amun"><img src="./assets/btn-launch.svg" alt="Launch Simulator" height="52" /></a>
<a href="./AMUN_promo.mp4"><img src="./assets/btn-video.svg" alt="Watch Promo Video" height="52" /></a>
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

<br />

**[Project Showcase (Lab)](https://omarmetman.vercel.app/projects/amun) • [Live GitHub Source](https://github.com/omarmetman/amun) • [Watch Video (MP4)](./AMUN_promo.mp4) • [English Subtitles](./amun_subtitles_en.srt) • [Arabic Subtitles](./amun_subtitles_ar.srt)**

<br />

---

### **"From the Nile to the Stars — Designed for NASA Space Apps"**
*An authentic, client-side aerospace engineering simulator and interactive educational platform.*  
*Bridging genuine orbital mechanics, NASA open datasets, and systems engineering trade-offs within an authentic Ancient Egyptian mural pigment blueprint.*

---

<br />

## Official 30-Second Promotional Video

<video src="https://github.com/omarmetman/amun/raw/main/AMUN_promo.mp4" width="85%" controls poster="./assets/header-3d.svg">
  <source src="./AMUN_promo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<br />

**[▶ Direct Video Stream (AMUN_promo.mp4)](./AMUN_promo.mp4)** &nbsp;|&nbsp; 
**[Download Arabic Subtitles (.srt)](./amun_subtitles_ar.srt)** &nbsp;|&nbsp; 
**[Download English Subtitles (.srt)](./amun_subtitles_en.srt)**

<br /><br />

---

## Mission Overview

<p style="max-width: 850px; line-height: 1.8;">
<b>Project AMUN</b> is an interactive, browser-based space mission design simulator. It guides engineers and learners through the authentic compromises of interplanetary spaceflight: balancing payload instrumentation against power generation, sizing rocket stages with analytical closed-form propellant equations, optimizing Deep Space Network telecommunications, and timing synodic Hohmann transfer departures.
</p>

<br />

```
========================================================================================
                               FIVE COUPLED AEROSPACE CONSTRAINTS
========================================================================================
 [1] Mass vs. Launch Capacity     ──> Characteristic injection energy C3 interpolation
 [2] Power vs. Load Budget        ──> Inverse-square solar flux S(r) = 1361/r² & RTG decay
 [3] Data Link vs. Range          ──> Deep Space Network (DSN 34m/70m) Ka/X band budget
 [4] Delta-V Demand vs. Capacity  ──> Closed-form Tsiolkovsky equation with structural tank fraction
 [5] Subsystems vs. Expenditure   ──> Development, daily operations, DSN hours & safety reserve
========================================================================================
```

<br /><br />

---

## 3D Aerospace Telemetry Deck & Margin Rulers

<br />

<img src="./assets/telemetry-3d.svg" alt="Live Aerospace Flight Telemetry Deck & Margin Rulers" width="100%" />

<br /><br />

<p style="max-width: 820px; line-height: 1.8;">
Rather than repetitive circular gauges, AMUN implements linear aerospace <b>Margin Rulers</b>. Each critical resource (Mass, Power, Delta-v, Budget) features an explicit capacity ceiling and a shaded <b>10%–30% optimal safety margin</b>. Negative margins trigger instant blocking errors, while excess margins reduce overall mission efficiency.
</p>

<br /><br />

---

## Core Engineering Workflow (11 Steps)

```
[01 Objectives] ──> [02 Spacecraft] ──> [03 Instruments] ──> [04 Launch Vehicle]
                                                                     │
[08 Comms]      <── [07 Mass & Δv]  <── [06 Power Budget] <── [05 Budget & Reserves]
    │
    └──> [09 Orbit Trajectory] ──> [10 Mission Simulation] ──> [11 Post-Mortem Report]
```

<br />

| Stage | Engineering Review Milestone | Primary Systems Computed |
| :---: | :--- | :--- |
| **01** | **Mission Objectives** | Target selection (Moon, Mars, Asteroids, Comets) & tiered scientific thresholds |
| **02** | **Spacecraft Platform** | Bus dry mass, radiation hardening, and chemical vs. high-$I_{sp}$ ion propulsion |
| **03** | **Scientific Payload** | Allocating instruments (Spectrometers, LIDAR, Magnetometers, Sample Capsules) |
| **04** | **Launch Vehicle** | Sizing payload capacity against characteristic energy ($C_3$) interpolation curves |
| **05** | **Budget & Reserves** | Subsystem costs, daily operations expenditure, and risk inflation reserve |
| **06** | **Power Budget** | Solar flux decay ($S=1361/r^2$), annual cell degradation, RTGs, and eclipse battery |
| **07** | **Mass & Rocket Sizing** | Closed-form Tsiolkovsky propellant mass with structural tank fraction ($k$) |
| **08** | **Communications** | High-Gain Antenna (HGA) diameter, Ka/X bands, and DSN 34m/70m link margin |
| **09** | **Orbital Trajectories** | Hohmann transit times, synodic launch windows, planetary capture, and plane-change |
| **10** | **Mission Simulation** | Seeded deterministic Monte Carlo simulation of cruise, insertion, and anomalies |
| **11** | **Evaluation & Debrief** | 100-point scoring matrix, letter rank (S through F), and causal post-mortem analysis |

<br /><br />

---

## 5 Coupled Computational Physics Engines

<br />

<img src="./assets/physics-3d.svg" alt="5 Coupled Computational Physics Engines" width="100%" />

<br /><br />

<p style="max-width: 850px; line-height: 1.8;">
All calculations reside in <code>src/engine/</code> as pure mathematical functions with zero React or framework dependencies. The UI purely observes a single derived design state (<code>deriveDesign</code>).
</p>

<br />

### 1. Closed-Form Propellant Mass with Structural Tank Fraction
$$x = \frac{\Delta v_{\text{req}} \cdot (1 + \text{reserve})}{I_{sp} \cdot g_0}$$

$$m_{\text{prop}} = \frac{m_{\text{other}} \cdot (e^x - 1)}{1 - k \cdot (e^x - 1)}$$

### 2. Inverse-Square Solar Irradiance Decay
$$S(r) = \frac{1361}{r^2} \quad [\text{W/m}^2]$$

$$P_{\text{solar}}(t) = A \cdot S(r) \cdot \eta \cdot P_f \cdot (1 - \delta)^t$$

### 3. Deep Space Network Empirical Telecommunications Downlink
$$R = 4000 \cdot \left(\frac{P_{\text{tx}}}{100}\right) \cdot \left(\frac{D_{\text{ant}}}{3}\right)^2 \cdot f_{\text{ratio}}^2 \cdot \left(\frac{0.5}{d_{\text{AU}}}\right)^2 \cdot G_{\text{ground}} \quad [\text{kbit/s}]$$

### 4. Interplanetary Hohmann Transfer Dynamics
$$T_{\text{transit}} = \pi \sqrt{\frac{a^3}{\mu_{\odot}}} \approx 0.5 \cdot a_{\text{AU}}^{1.5} \cdot 365.25 \quad [\text{days}]$$

$$\Delta v_{\text{plane}} \approx 2 \cdot v_{\text{target}} \cdot \sin\left(\frac{i}{2}\right)$$

<br /><br />

---

## Story Campaign: "AMUN Horizon" (2041–2051)

<br />

<img src="./assets/campaign-3d.svg" alt="AMUN Horizon: 6-Chapter Solar System Campaign" width="100%" />

<br /><br />

<p style="max-width: 850px; line-height: 1.8;">
An episodic 6-chapter narrative set in the wake of a catastrophic 2041 solar super-storm. Players follow an anomalous 1420.405 MHz neutral hydrogen pulse repeating every 26 months across six strategic planetary loci.
</p>

<br />

| Chapter | Epoch | Celestial Target | Mission Profile | Scientific Objective |
| :---: | :---: | :---: | :---: | :--- |
| **01** | **2041** | **The Moon** | Lunar Orbiter | Establishing baseline deep-space relay and telemetry calibration |
| **02** | **2043** | **Mars** | Mars Orbiter | Mapping high-altitude dust storms and relaying anomalous ground pulses |
| **03** | **2045** | **101955 Bennu** | Sample Return | Retrieving pristine regolith samples from carbonaceous asteroid |
| **04** | **2047** | **Venus** | Atmospheric Lander | Penetrating super-dense sulfur atmosphere to confirm signal locus |
| **05** | **2049** | **Jupiter** | Radiation Orbiter | Navigating extreme radiation belts to track Jovian magnetosphere emissions |
| **06** | **2051** | **1 Ceres** | The Horizon Orbiter | Exploring Occator crater bright spots to unlock the final campaign certificate |

<br /><br />

---

## NASA Open Data Integration & Offline Snapshot Failover

<br />

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

<br />

| NASA Resource / Endpoint | Integration Protocol | In-Game Utility |
| :--- | :---: | :--- |
| **[NASA JPL Horizons API](https://ssd.jpl.nasa.gov/api/horizons.api)** | REST Ephemerides | Real heliocentric and geocentric distances, orbital inclinations, and vectors |
| **[NASA JPL Small-Body Database](https://ssd-api.jpl.nasa.gov/sbdb.api)** | REST Queries | High-precision orbital elements, diameters, and spin periods for asteroids and comets |
| **[NASA Image and Video Library](https://images-api.nasa.gov/search)** | Direct Media API | High-resolution photography of celestial bodies with authentic mission credits |
| **[NASA Technical Reports Server](https://ntrs.nasa.gov/api/citations/search)** | STI Citations | Peer-reviewed aerospace literature citations inside the Learn Panel |
| **[Basics of Space Flight](https://science.nasa.gov/learn/basics-of-space-flight/)** | Educational Docs | Conceptual explanations linked directly inside subsystem guidance popovers |

<br /><br />

---

## Mission Flight Crew & Core Architects

<br />

<img src="./assets/team-3d.svg" alt="AMUN Mission Flight Crew & Core Architects" width="100%" />

<br /><br />

<p style="max-width: 850px; line-height: 1.8;">
Project AMUN was engineered by an interdisciplinary team combining full-stack software architecture, aerospace flight dynamics, and authentic cultural visual identity:
</p>

<br />

| Specialist | Mission Role & Technical Responsibility | Professional Connect |
| :--- | :--- | :---: |
| **Omar Mohammed Etman** | **Mission Commander & Systems Architect**<br>• Core closed-form astrodynamic engine (`src/engine`)<br>• Tsiolkovsky closed propellant sizing & state management pipeline<br>• Full-stack React 18, TypeScript, and Vite integration | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/omar-m-etman) |
| **Elshimaa Sayed Mohamed** | **Creative Director & Visual Identity Lead**<br>• Authentic Ancient Egyptian mural pigment palette design<br>• Bespoke 24px stroke iconography, Cartouche, and Lotus Frieze<br>• Mobile-first UI/UX architecture & 360px viewport experience | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](http://linkedin.com/in/oshsayeddesigner) |
| **Abdullah Azb** | **Aerospace Systems & Flight Dynamics Specialist**<br>• Orbital transfer mechanics & Hohmann trajectory modeling<br>• Characteristic launch energy ($C_3$) interpolation tables<br>• Planetary ephemeris validation and NASA scientific datasets | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abdullah-azb-18290a262) |
| **Mahmoud Abdelhamid** | **Software Engineer & Telemetry Lead**<br>• Deep Space Network (DSN) link budget & bitrate calculations<br>• Deterministic Monte Carlo stochastic simulation logic<br>• Automated test suites (41/41 passing) & client-side persistence | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mahmoud-abdel-hamid-513363406/) |

<br /><br />

---

## Development Methodology (50% AI / 50% Human Engineering)

<br />

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

<br /><br />

---

## Technical Stack & Quick Start

<br />

| Layer | Technology | Role in Project AMUN |
| :---: | :---: | :--- |
| **Frontend Framework** | **React 18.3** | Component rendering and reactive lifecycle |
| **Language** | **TypeScript 5.6** | Strict type-safety across physics, state, and API contracts |
| **Build Engine** | **Vite 5.4** | Ultra-fast HMR and optimized static production bundle |
| **Styling & Pigments** | **Tailwind CSS 3.4** | Bespoke palette tokens (Lapis, Egyptian Blue, Limestone, Ochre) |
| **State Management** | **Zustand 4.5** | Centralized mission store with schema migrations (`persist`) |
| **Test Runner** | **Vitest 2.1** | Node test environment for 41 pure engine & store test suites |

<br />

```bash
# 1. Clone repository
git clone https://github.com/omarmetman/amun.git
cd amun

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev

# 4. Execute unit test suite (41/41 tests)
npm test

# 5. Compile production bundle
npm run build
```

<br /><br />

---

## Automated Verification (100% Tests Passing)

<br />

```
 RUN  v2.1.9 E:/Amun

 ✓ src/engine/engine.test.ts (18 tests)
 ✓ src/engine/campaign.test.ts (8 tests)
 ✓ src/engine/achievements.test.ts (8 tests)
 ✓ src/store/useMissionStore.test.ts (7 tests)

 Test Files  4 passed (4)
      Tests  41 passed (41)
   Duration  6.2s
```

<br /><br />

---

## License & Compliance

* **Software Engine**: Open-source under the [MIT License](LICENSE).
* **NASA Assets**: Public domain under NASA Media Usage Guidelines. Spacecraft and planetary photography courtesy of NASA/JPL-Caltech.
* **Showcase Laboratory**: [https://omarmetman.vercel.app/projects/amun](https://omarmetman.vercel.app/projects/amun)

<br />

```
=============================================================
  "From the Nile to the Stars — Designed for NASA Space Apps"
=============================================================
```

</div>
