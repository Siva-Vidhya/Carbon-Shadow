# 🌍 Carbon Shadow

> **See the impact of your choices before you make them.**

Carbon Shadow is an interactive, client-side web platform designed for **PromptWars Challenge 3: Carbon Footprint Awareness Platform**. It breaks down the abstract concept of carbon emissions into tangible, highly visual, and gamified metrics, empowering users to make sustainable lifestyle shifts.

---

## 🎯 Challenge Alignment

| Requirement | Feature | Implementation |
| :--- | :--- | :--- |
| Visualize future scenarios | **Digital Twin** | Projects Current, Light, and Optimal paths based on user settings (`twin.js`) |
| Context-aware recommendations | **Echo AI Assistant** | Filters actionable shifts based on diet/commute/flights (`echo.js`) |
| Real-time behavior impact | **Shift Engine** | Instantly deducts carbon scores when shifts are applied (`dashboard.js`) |
| Carbon impact of purchases | **Receipt Lens** | AR camera prototype estimating emissions of grocery items (`camera.js`) |
| Track eco-actions & progress | **Carbon Wallet** | Persistent tracking of applied shifts and reward points (`app.js`) |

---

## 🚀 Features

*   👯 **Digital Twin**: Visualizes three distinct future scenarios (Current Path, Light Path, Optimal Path) directly influenced by your configured lifestyle settings.
*   🤖 **Echo AI Assistant**: Context-aware sustainability recommendations that intelligently adapt to your profile (e.g., hiding beef reduction tips if you are vegan).
*   ⚡ **Shift Engine**: A commitment loop that shows the real-time impact of behavior changes on your live carbon score gauge.
*   📸 **Receipt Lens**: An AR-inspired camera feature that scans products/receipts to break down their precise carbon footprint and suggest eco-friendly alternatives.
*   💳 **Carbon Wallet**: A gamified tracking system that logs your completed eco-actions and rewards you with persistent points across sessions.

---

## 🛠 Tech Stack

Carbon Shadow was built to be blazingly fast, highly secure, and exceptionally lightweight:

*   **Core**: HTML5, CSS3, Vanilla JavaScript (ES2022)
*   **Architecture**: Client-side `localStorage` state management
*   **Testing**: Vitest + JSDOM for robust unit testing
*   **Security**: Strict Content Security Policies (CSP), DOM sanitization, and graceful JSON degradation.

---

## 💻 How to Run Locally

Carbon Shadow requires absolutely no build steps or backend servers!

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/carbon-shadow.git
   ```
2. Open `index.html` in any modern web browser.
3. Alternatively, serve it via any static local server:
   ```bash
   npx serve .
   ```

---

## 🧪 How to Run Tests

Our comprehensive 30+ unit test suite ensures UI logic, state management, and edge cases are locked down.

1. Install testing dependencies:
   ```bash
   npm install
   ```
2. Run the Vitest suite:
   ```bash
   npm run test
   # or
   npx vitest run
   ```

---

## 📂 File Structure Overview

```text
├── index.html          # Landing page
├── dashboard.html      # Main Carbon Wallet & Shift Engine UI
├── twin.html           # Digital Twin projection UI
├── camera.html         # Receipt Lens AR prototype UI
├── settings.html       # Lifestyle configuration UI
├── app.js              # Core application entry & camera logic
├── dashboard.js        # Shift Engine logic & gauge rendering
├── twin.js             # Scenario projection math & rendering
├── echo.js             # AI Assistant recommendation filtering
├── settings.js         # User preference management
├── security-utils.js   # XSS sanitization and safe localStorage wrappers
├── constants.js        # Centralized emission values & config
├── .eslintrc.json      # Strict linting rules (max-lines, etc.)
└── tests/              # Vitest JSDOM test suites
```

---

## 🛣 Future Roadmap

*   **PWA Integration**: Add Service Workers to make Carbon Shadow installable and functional offline.
*   **Live OpenData APIs**: Replace our `SHADOW_DB` with live calls to global emission databases like OpenFDA or global carbon registries.
*   **Social Leaderboards**: Introduce anonymous peer comparison to drive community-wide sustainability goals.

---

## 🤝 Contributing

Contributions are welcome! Please ensure you adhere to the project's strict 30-line `max-lines-per-function` ESLint rule before submitting a PR.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Run the Linter (`npx eslint *.js`)
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request
