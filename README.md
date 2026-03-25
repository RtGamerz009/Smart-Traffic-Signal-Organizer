<div align="center">

# 🚦 Smart Traffic Signal Optimizer

### *AI-inspired adaptive traffic scheduling — minimize congestion, maximize flow*

> A production-quality simulation of a **dynamic priority-based traffic signal system** for a 4-road intersection — built as a premium engineering showcase of a classic Google/FAANG system design interview challenge.

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22B5BF?style=for-the-badge)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live-00ff88?style=for-the-badge)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet?style=for-the-badge)](CONTRIBUTING.md)

<br/>

[**View Live Demo →**](#) &nbsp;&nbsp;·&nbsp;&nbsp; [**Report Bug**](issues) &nbsp;&nbsp;·&nbsp;&nbsp; [**Request Feature**](issues)

</div>

---

## 📸 Project Preview

<div align="center">

| Dashboard Overview | Live Intersection |
|:-:|:-:|
| ![Dashboard](./assets/dashboard-preview.png) | ![Intersection](./assets/intersection-visualizer.png) |

| Decision Engine | Analytics |
|:-:|:-:|
| ![Decision Engine](./assets/decision-engine.png) | ![Analytics](./assets/analytics-dashboard.png) |

> *The simulation runs entirely in-browser. No backend, no API calls — pure frontend engineering.*

</div>

---

## 🎯 About the Project

### The Problem

Every major city in the world still relies on **fixed-timer traffic signals** — lights that cycle through red, yellow, and green on a rigid schedule, completely oblivious to the actual number of vehicles waiting. The result?

- 🚗 A road with **30 cars** waits while the green light burns for an **empty road**
- 🚑 Emergency vehicles are delayed by the same predictable cycle as everyone else
- 🏙️ City-wide congestion compounds because intersections can't react to reality
- ⏱️ Millions of combined hours wasted daily at signal lights globally

### The Solution

This project implements a **Smart Traffic Signal Optimizer** — an adaptive, priority-driven scheduling system that calculates which road deserves green *right now*, based on live queue data, waiting time, vehicle arrival rates, and emergency flags.

The result is a simulation that:
- **Eliminates idle green time** on empty roads
- **Dynamically scales** green duration to actual congestion
- **Mathematically prevents starvation** for low-traffic roads
- **Immediately overrides** for emergency vehicles
- **Proves its superiority** over fixed timers with live analytics

This isn't just a data structure exercise. It's a **full system design implementation** — engineered like a real smart-city product.

---

## ⚡ Why This Project Stands Out

This is not a typical DSA homework assignment. It's a **real-time simulation** of a complex engineering system that combines multiple Computer Science disciplines into a single, cohesive, visually compelling product.

| Discipline | How It's Applied |
|:---|:---|
| 🧠 **Greedy Algorithms** | Each cycle selects the locally optimal road using a weighted priority score |
| 📋 **Scheduling Theory** | Dynamic priority scheduling with aging — similar to OS process scheduling |
| 🔢 **Queue Theory** | Vehicle queues grow with arrival rates and shrink as traffic clears |
| ⚖️ **Fairness / Aging** | Waiting time continuously increases a road's score, preventing starvation |
| 🏗️ **System Design** | Modular architecture separating algorithm logic, simulation engine, and UI |
| 📊 **Data Visualization** | Real-time Recharts dashboard tracking priority trends and throughput |
| 🎨 **Frontend Engineering** | Premium animated UI built with Framer Motion and Tailwind CSS |

---

## ✨ Key Features

### 🚦 Core Simulation
- **Adaptive Priority Scheduler** — dynamically selects the highest-priority road each cycle
- **Real-time Intersection Visualizer** — animated top-down view with live traffic lights, vehicle queues, and countdown timer
- **Dynamic Green Duration** — green time scales with queue length, eliminating idle waste
- **Starvation Prevention (Aging)** — every waiting road gains a progressive priority boost

### 🚨 Emergency Handling
- Toggle ambulance / fire truck presence per road
- Emergency flag triggers an immediate, maximum-priority override (δ = 10,000)
- Visual alert with pulsing red indicator on the active emergency road

### 📊 Analytics & Telemetry
- Live priority score trend line chart (Recharts)
- Vehicles cleared donut chart per road
- Cycle decision history log (last 20 cycles with reasons)
- Real-time stats: total vehicles cleared, average wait time, cycle count

### 🎮 User Controls
- Sliders for initial queue size and arrival rate per road
- Emergency vehicle toggle per road
- Simulation speed: `0.5×` `1×` `2×` `5×`
- **Preset Scenarios**: Balanced, Rush Hour, Emergency
- Start / Pause / Reset controls

### 📐 Algorithm Transparency
- Full formula breakdown with per-parameter explanation
- Smart vs. Fixed Timer comparison panel
- Expandable **Interview Explanation Mode** — how to describe this system in a Google/FAANG interview

### 🎨 Premium Design
- Dark futuristic dashboard aesthetic
- Glassmorphism cards with neon signal glow
- Framer Motion animated transitions
- Fully responsive layout

---

## ⚙️ How It Works

```
User configures roads → System ticks every second → Priority calculated → Winner gets green → Queue updates → Repeat
```

**Step-by-step cycle:**

1. **Configure** — Set vehicle counts, arrival rates, and emergency flags for each of the 4 roads (North, East, South, West)
2. **Calculate** — Every second, the system calculates a priority score for each road using the weighted formula
3. **Select** — The road with the highest priority score wins the green signal
4. **Assign Duration** — Green time is dynamically computed: `min(60s, max(10s, QueueLength × 2s))`
5. **Process** — While green, one vehicle clears per second; all other queues continue receiving new arrivals
6. **Age** — Each second a road doesn't receive green, its `waitingTime` increases, gradually boosting its priority
7. **Override** — If any road has an emergency vehicle, it immediately receives the maximum possible score
8. **Log** — Every phase switch is recorded in the decision history with scores and reasoning

---

## 🧠 Core Algorithm

### Priority-Based Dynamic Scheduling

The system evaluates a weighted priority score for each road on every tick:

```
Priority Score =
  (α × Queue Length)      +   // Primary throughput driver
  (β × Waiting Time)      +   // Fairness / aging mechanism
  (γ × Arrival Rate)      +   // Predictive congestion anticipation
  (δ × Emergency Flag)        // Absolute override (0 or 1)
```

**Default weight constants:**

| Symbol | Parameter | Default Value | Role |
|:------:|:----------|:-------------:|:-----|
| `α` | Queue Length multiplier | `1.5` | Prioritizes roads with more waiting vehicles |
| `β` | Waiting Time multiplier | `0.8` | Prevents starvation via aging |
| `γ` | Arrival Rate multiplier | `1.2` | Anticipates future congestion growth |
| `δ` | Emergency Flag multiplier | `10,000` | Guarantees immediate override |

**Example calculation:**

```typescript
// Road A: 15 vehicles, waited 20s, arrival rate 2.0/s, no emergency
const priorityA = (1.5 × 15) + (0.8 × 20) + (1.2 × 2.0) + (10000 × 0)
//              = 22.5      +  16.0       +  2.4         +  0
//              = 40.9
```

---

## 🟢 Dynamic Green Time Logic

Green duration is never fixed. It scales proportionally with actual congestion:

```
Green Time = min(MaxGreenTime, max(MinGreenTime, QueueLength × TimePerVehicle))
```

| Constant | Default | Meaning |
|:---------|:-------:|:--------|
| `MinGreenTime` | `10s` | Minimum cycle to allow meaningful flow |
| `MaxGreenTime` | `60s` | Cap to ensure fairness across roads |
| `TimePerVehicle` | `2s` | Estimated seconds to clear one vehicle |

**Effect:** A road with 5 cars gets 10s. A road with 25 cars gets 50s. An empty road gets nothing.  
This alone eliminates the single largest waste in fixed-timer systems.

---

## ⚖️ Fairness & Starvation Prevention

A pure greedy algorithm that always selects the highest queue would eventually **starve** low-traffic roads during sustained peak hours on adjacent roads.

This system prevents starvation through **aging** — the same technique used in operating system process schedulers:

```
Every second a road waits (without green), its waitingTime increases.
waitingTime contributes β × W to its priority score.
Over time, even an empty road will accumulate enough wait score to win a cycle.
```

**Practical result:** No road waits more than O(max_green_time × n_roads) seconds before receiving a green signal, regardless of traffic imbalance.

---

## 🚨 Emergency Vehicle Handling

When an ambulance, fire truck, or police vehicle is present on a road:

- The `Emergency Flag` is set to `1`
- The road's priority score jumps by `δ = 10,000` — far exceeding any realistic sum of the other terms
- The system immediately selects that road on the next phase switch
- The emergency flag clears once the road receives green

**Real-world relevance:** This models sensor-equipped smart traffic systems deployed in cities like Amsterdam, Singapore, and Columbus, Ohio — where emergency vehicles communicate with intersection controllers to pre-empt normal signal cycles.

---

## 🆚 Smart Optimizer vs. Fixed Timer

| Metric | Fixed Timer | Smart Optimizer |
|:-------|:-----------:|:---------------:|
| Green time allocated to empty roads | ✅ Yes (always) | ❌ Never |
| Adapts to real-time queue length | ❌ No | ✅ Every second |
| Emergency vehicle priority | ❌ None | ✅ Immediate override |
| Prevents starvation | ❌ Accidental | ✅ Mathematical guarantee |
| Average waiting time | High | Significantly lower |
| Idle signal waste | Present every cycle | Eliminated |
| Scales to arrival rate | ❌ No | ✅ Yes (γ × R term) |
| Congestion anticipation | ❌ None | ✅ Predictive via arrival rate |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| **React 18** | Component architecture and state management |
| **TypeScript** | Full type safety across simulation engine and UI |
| **Tailwind CSS 4** | Utility-first styling with custom design system |
| **Framer Motion** | Smooth transitions, animated counters, layout animations |
| **ShadCN UI** | Accessible, composable component primitives |
| **Lucide React** | Consistent icon system throughout |

### Data & Logic
| Technology | Purpose |
|:-----------|:--------|
| **Recharts** | Priority trend line charts, throughput donut charts |
| **React Hooks** | `useState`, `useEffect`, `useCallback`, `useReducer` for simulation loop |
| **Custom Hook** | `useSimulation()` — encapsulates the entire tick engine |

### Algorithm Modules
| Module | Responsibility |
|:-------|:--------------|
| `priorityCalculator.ts` | Computes weighted priority score for each road |
| `signalScheduler.ts` | Selects next road and calculates green duration |
| `constants.ts` | Algorithm weights, timing constraints, and scenario presets |
| `useSimulation.ts` | Main simulation loop with interval-based ticking |

---

## 📂 Project Architecture

```
artifacts/traffic-optimizer/src/
│
├── components/
│   ├── IntersectionVisualizer.tsx  # Animated top-down intersection view
│   ├── DecisionEngine.tsx          # Real-time priority ranking panel
│   ├── ControlPanel.tsx            # User controls (sliders, toggles, speed)
│   ├── AnalyticsDashboard.tsx      # Recharts analytics (trends + throughput)
│   ├── HistoryTable.tsx            # Cycle decision history log
│   └── AlgorithmExplanation.tsx    # Formula breakdown + interview mode
│
├── hooks/
│   └── useSimulation.ts            # Core simulation tick engine + state
│
├── lib/
│   ├── priorityCalculator.ts       # Priority score formula
│   └── constants.ts                # Algorithm weights, presets
│
├── types/
│   └── index.ts                    # Road, SimulationState, CycleRecord types
│
├── pages/
│   └── Home.tsx                    # Main page layout and composition
│
├── App.tsx                         # Router and provider setup
├── main.tsx                        # Entry point
└── index.css                       # Dark theme, glassmorphism, neon utilities
```

**Key design principle:** Simulation logic is completely decoupled from the UI. The `useSimulation` hook is the single source of truth — components only render what the hook exposes.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=18`
- pnpm `>=8`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-traffic-signal-optimizer.git
cd smart-traffic-signal-optimizer

# Install dependencies
pnpm install

# Start the development server
pnpm --filter @workspace/traffic-optimizer run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm --filter @workspace/traffic-optimizer run build
```

---

## 🎮 Usage Guide

1. **Set Traffic Conditions** — Use the sliders to configure the initial vehicle count and arrival rate for each of the 4 roads
2. **Toggle Emergencies** — Enable the emergency switch on any road to simulate an ambulance scenario
3. **Choose a Preset** — Select *Balanced*, *Rush Hour*, or *Emergency* to load a realistic scenario instantly
4. **Start the Simulation** — Hit **Start** and watch the intersection respond in real time
5. **Monitor Signals** — Observe which road wins each cycle and why, via the Decision Engine panel
6. **Read the Analytics** — Watch priority score trends and vehicle throughput evolve in the charts
7. **Review History** — Check the cycle log to see the reasoning behind every decision
8. **Adjust Speed** — Crank it to `5×` to fast-forward through many cycles quickly
9. **Learn the Algorithm** — Scroll to the Algorithm section and expand **Interview Explanation Mode**

---

## 📚 What I Learned

Building this project required going well beyond typical web development:

- **Greedy algorithms applied to real systems** — understanding when locally optimal decisions approximate globally optimal outcomes
- **Scheduling theory** — how OS-level concepts (priority queues, aging, preemption) map directly to traffic engineering
- **Simulation architecture** — designing a tick-based system with deterministic state transitions
- **Fairness mechanisms** — implementing aging to provide mathematical guarantees against starvation
- **React performance patterns** — optimizing interval-based state updates without excessive re-renders using `useCallback` and `useRef`
- **Data visualization design** — choosing chart types that communicate algorithm behavior clearly
- **System design thinking** — separating the algorithm layer from the presentation layer for testability and extensibility

---

## 🔭 Future Improvements

| Enhancement | Description |
|:------------|:------------|
| 🤖 **ML Traffic Prediction** | Use historical patterns to predict arrival rates and pre-adjust priorities |
| 📡 **IoT Sensor Integration** | Connect to real traffic sensor APIs for live data feeds |
| 🏙️ **Multi-Intersection Network** | Coordinate signals across a city grid with green wave progression |
| 🚶 **Pedestrian-Aware Signals** | Add pedestrian crossing requests as a priority modifier |
| 🎓 **Reinforcement Learning** | Train an RL agent to optimize weight constants (α, β, γ, δ) automatically |
| 📈 **Cloud Analytics** | Persist simulation runs to a database and visualize aggregate trends |
| 🔊 **Audio Feedback** | Ambient signal sounds with toggle |
| 📱 **Mobile Responsive Simulation** | Touch-friendly controls for the mobile viewport |

---

## 💼 Resume & Portfolio

### Resume Description
> Engineered a production-quality Smart Traffic Signal Optimizer — a real-time browser simulation implementing priority-based greedy scheduling, aging-based starvation prevention, and emergency override logic for a 4-road intersection. Built with React, TypeScript, and Framer Motion, featuring a live analytics dashboard powered by Recharts.

### GitHub Repository Description
> 🚦 AI-inspired adaptive traffic signal optimizer — real-time greedy scheduling simulation with fairness, emergency override, and live analytics dashboard. Built with React + TypeScript.

### LinkedIn Project Description
> **Smart Traffic Signal Optimizer** | React · TypeScript · Framer Motion · Recharts  
> Designed and built a full-stack simulation of an adaptive traffic signal controller — solving a classic system design interview challenge as a premium, portfolio-grade web application. Implements priority-based greedy scheduling, starvation prevention via aging, and emergency vehicle override with a real-time animated intersection visualizer and analytics dashboard.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add: my feature description'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

Please read the [contribution guidelines](CONTRIBUTING.md) before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use this for personal projects, portfolios, and learning purposes with attribution.

---

<div align="center">

**Built with logic, design, and system thinking.**

*If this project helped you — give it a ⭐ and share it.*

[![GitHub stars](https://img.shields.io/github/stars/your-username/smart-traffic-signal-optimizer?style=social)](https://github.com/your-username/smart-traffic-signal-optimizer)
[![Twitter Follow](https://img.shields.io/twitter/follow/your-handle?style=social)](https://twitter.com/your-handle)

</div>
