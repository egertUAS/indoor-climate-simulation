# Indoor Climate Simulator

Interactive real-time indoor climate simulation built with React. Visualize how temperature, CO₂ levels, ventilation, and energy costs change based on occupancy, HVAC settings, and outdoor conditions.

🌐 **[Live Demo](https://eparts.github.io/indoor-climate-simulation/)**

## Features

- 🌡️ Real-time temperature simulation with thermal mass
- 💨 Ventilation control with adjustable fan speed
- ♻️ Heat recovery toggle
- 👥 Occupancy-based CO₂ modelling
- 💰 Energy cost breakdown
- 📊 Live climate graphs
- 🏠 Animated building cross-section
- ❄️/☀️ Winter/Summer mode presets

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)

### Local Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

This project automatically deploys to **GitHub Pages** via GitHub Actions on every push to the `main` branch.

### Manual Setup (one-time)

1. Create a GitHub repository named `indoor-climate-simulation`
2. Push the code to the `main` branch
3. Go to **Settings → Pages → Source** and select **GitHub Actions**
4. The site will be live at `https://<your-username>.github.io/indoor-climate-simulation/`

## Tech Stack

- [React 19](https://react.dev/) – UI framework
- [Vite 7](https://vite.dev/) – Build tool
- [Tailwind CSS 4](https://tailwindcss.com/) – Styling
- [Recharts](https://recharts.org/) – Data visualization
- [Framer Motion](https://motion.dev/) – Animations
