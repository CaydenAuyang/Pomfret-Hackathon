# 🚀 Faculty Imposter

> **An Among Us-inspired party game where players guess which faculty member is the "imposter" — built for the Pomfret School Hackathon.**

🔗 **[Play it live →](https://caydenauyang.github.io/Pomfret-Hackathon/)**

---

## 📖 What Is This?

**Faculty Imposter** is an interactive, multiplayer party game designed to be projected on a big screen and played with a live audience. It takes the social-deduction concept from *Among Us* and applies it to a school setting: AI-generated images depict faculty members in absurd, fictional scenarios, and players compete to identify who the real "imposter" is among the lineup.

The game was created by a team of four Pomfret School students — **Cayden, Nolan, Jay, and Elina** — for a school hackathon. It's designed to be run by a host (e.g. a teacher or MC) who controls the game on a laptop while the audience watches on a projector.

---

## 🎮 How It Works

The game flows through three distinct screens:

### 1. 🎰 Roulette Screen
A visually striking slot-machine-style roulette spins through a carousel of 8 faculty image cards. The host clicks **"SPIN ROULETTE"** to randomly select the next faculty target. The roulette animates with a gradual deceleration effect — fast at first, then slowing down for dramatic tension — before landing on the chosen image.

A status indicator in the bottom-right corner shows how many faculty images remain in the pool.

### 2. 🕵️ Game Screen (Scoring Round)
Once an image is selected, the game transitions to a split-screen scoring view:

- **Left panel**: Displays the selected faculty image at large scale with a name label and "Target Verified" badge.
- **Right panel**: Shows all four players (color-coded as Among Us crewmates — Red, Blue, Green, and Pink) with three scoring actions each:
  - 🎯 **Caught (+2 pts)** — The player correctly identified the imposter.
  - 🔄 **Redeem (+3 pts)** — The player redeemed themselves after a wrong guess.
  - 🛡️ **Alive (+5 pts)** — The player survived the round without being eliminated.

The host awards points by clicking the buttons next to each player. Animated score popups fly upward when points are awarded, providing satisfying visual feedback. A header bar tracks the current round out of 8 total.

When the host is done scoring, they click **"NEXT ASSIGNMENT"** to return to the roulette for the next image, or **"FINALIZE MISSION"** if it's the last round.

### 3. 🏆 Victory Screen
After all 8 rounds (or when the host manually ends the game), a victory screen appears with:

- A confetti explosion animation using `canvas-confetti`.
- A large winner card showcasing the top-scoring player's crewmate icon, name, and total points.
- A full leaderboard table ranking all four players by score.
- A restart button to initialize a new game from scratch.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) (via Vite 7) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Confetti** | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| **Fonts** | [Google Fonts](https://fonts.google.com/) — Outfit & Bangers |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via `gh-pages` |
| **Build Tool** | [Vite](https://vite.dev/) |

---

## ✨ Design Highlights

The UI is heavily themed around Among Us with a dark, spacey aesthetic:

- **Starfield background** with animated floating asteroids created as SVG + Framer Motion elements.
- **Glassmorphism panels** with backdrop blur and subtle borders for a premium feel.
- **Custom crewmate SVG icons** that render inline with each player's Among Us color.
- **3D-style buttons** with box-shadow depth, hover effects, and active press animations.
- **Neon cyan accent color** (`#38fedc`) used throughout for a futuristic HUD-like appearance.
- **Bangers font** for bold, game-style headings alongside Outfit for clean body text.
- **Score popups** that animate upward and fade out using Framer Motion.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/CaydenAuyang/Pomfret-Hackathon.git
cd Pomfret-Hackathon/faculty-imposter

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/Pomfret-Hackathon/`.

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Deploying to GitHub Pages

```bash
npm run deploy
```

This runs `vite build` followed by `gh-pages -d dist`, pushing the built files to the `gh-pages` branch automatically.

---

## 📁 Project Structure

```
Pomfret-Hackathon/
├── README.md
├── LICENSE                          # MIT License
└── faculty-imposter/
    ├── index.html                   # HTML entry point (loads Google Fonts)
    ├── package.json                 # Dependencies & scripts
    ├── vite.config.js               # Vite config (base path for GH Pages)
    ├── tailwind.config.js           # Custom colors, fonts, animations
    ├── postcss.config.js            # PostCSS + Tailwind integration
    ├── public/
    │   └── images/
    │       ├── faculty-1.jpg        # 8 faculty images used in the game
    │       ├── faculty-2.jpg
    │       ├── ...
    │       └── faculty-8.jpg
    └── src/
        ├── main.jsx                 # React entry point
        ├── index.css                # Global styles, starfield, glass panels, buttons
        └── App.jsx                  # All game logic & components (single-file app)
```

---

## 👥 Team

| Member | Role |
|---|---|
| **Cayden** | Lead Developer |
| **Nolan** | Contributor |
| **Jay** | Contributor |
| **Elina** | Contributor |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ at the Pomfret School Hackathon
</p>
