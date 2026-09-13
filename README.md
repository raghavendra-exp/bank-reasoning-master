# Bank Reasoning Master 🏛️⚡

> An interactive, professional exam-preparation platform for **SBI Clerk (Junior Associate), IBPS Clerk / Customer Service Associate (CSA), and IBPS RRB Office Assistant (Multipurpose)** Reasoning Ability (Prelims & Mains).

Designed as an authentic, serious exam-preparation platform that takes a candidate from:
**ZERO → CONCEPT CLEAR → BASIC PRACTICE → SPEED BUILDING → PYQ → EXAM LEVEL → MOCK TEST → PERFORMANCE ANALYSIS.**

---

## 🌟 Key Platform Modules

1. **Dashboard & Readiness Engine**:
   - **Reasoning Readiness Score (0 to 100)**: Evaluates concept coverage, accuracy, solving speed, and test consistency.
   - **Smart Daily Recommendation**: Automatically diagnoses your weakest topic or slowest solving speed and assigns today's targeted training.
   - **Weakness Detector Matrix**: Color-coded calibration (Red: <60% weak, Yellow: 60-80% needs improvement, Green: >80% mastered) across all 22 reasoning topics.

2. **Official Exam Pattern Dashboards**:
   - Separate, official cards for **SBI Clerk**, **IBPS Clerk/CSA**, and **IBPS RRB Office Assistant**.
   - Details: Prelims & Mains questions, marks, duration, sectional timer vs composite timer (RRB 45m composite), negative marking (0.25), and whether Computer Aptitude is combined.
   - Verified against official notification announcements with archive preservation.

3. **7 Interactive Visualizer Engines**:
   - **Seating Arrangement Visualizer**: 8-person circular table with rotation, linear single/parallel rows, square table (corners vs sides), inward/outward facing, left/right inspector, and Case 1 vs Case 2 comparison.
   - **Syllogism Engine**: Venn diagram generator for *All*, *Some*, *No*, *Some not*, and *Only a few*. Includes possibility rules and a **10-Second Syllogism Challenge Drill**.
   - **Inequality Chain Visualizer**: Relational flow simulator implementing the Open Door / Gatekeeper rule (`>` > `≥` > `=`) with either-or detection.
   - **Blood Relation Visualizer**: Generational tier mapping (+2, +1, 0, -1, -2) and family tree generation.
   - **Direction & Distance Compass**: 8-point compass (N, NE, E, SE, S, SW, W, NW) with Cartesian vector coordinate tracking ($East = +X, North = +Y$) and Pythagoras theorem shortest distance calculator.
   - **Alphabet & Coding Calculator**: Positional values ($A=1 \dots Z=26$, reverse $A=26 \dots Z=1$), 13 opposite letter pairs (Sum = 27), and live word letter-pair counter.
   - **Input-Output Step Machine**: Step-by-step arrangement tracking with auto-placement detection and step-indexing shortcuts.

4. **Practice Arena & "Solve Like Topper" Dual Solutions**:
   - 500+ solvable questions with topic, exam, and difficulty filters.
   - Exam interface with timer, mark for review, question palette, and bilingual toggle (English / हिंदी).
   - Dual Solution Display: **Method 1 (Normal Standard Method)** vs **Method 2 (Fast Exam / Topper Shortcut)** with explicit time-savings calculations.
   - Error Classification Modal: Categorize misses into *Concept error*, *Calculation error*, *Misread*, *Time rush*, *Forgot trick*, or *Guess*.

5. **Speed Lab (Cognitive Speed Conditioning)**:
   - 20-second sprint (Inequality / Syllogism)
   - 30-second drill (Alphanumeric / Ranking)
   - 45-second challenge (Direction / Blood relations)
   - 60-second logic sprint (Critical Reasoning)
   - 90-second puzzle sprint (Floor & Linear seating)

6. **Daily Challenge (10-Question Sprint)**:
   - 10 balanced questions daily (3 Easy, 4 Medium, 2 Hard, 1 Brain-teaser) with 10-minute timer and streak tracking.

7. **Question Selection Trainer**:
   - Simulates 5 available puzzle sets in an exam. Candidate chooses which to attempt first; expert feedback reveals variable count, fixed anchors, and ideal attempt order.

8. **Full Mock Simulator**:
   - SBI Clerk Prelims (35 Q, 20m, -0.25 penalty)
   - IBPS Clerk Prelims (35 Q, 20m, -0.25 penalty)
   - IBPS RRB OA Prelims (40 Q, 40 marks, 22m recommended timer)
   - Mini Mock (20 Q, 10m)
   - Full post-mock diagnostic: net score, percentile estimate, topic-wise marks loss breakdown, and faculty recommendations.

9. **PYQ Intelligence & 2020-2026 Trend Analysis**:
   - Empirical analysis of 96+ shifts across SBI, IBPS, and RRB.
   - Yearly topic frequencies, puzzle share (~57.8%), and priority badges (🔥 Must Do, ⭐ High, ✅ Important).

10. **Revision Hub ("Revise My Mistakes")**:
    - Aggregates all questions answered incorrectly with mistake reason breakdown.
    - One-click practice to re-solve errors until cleared.

11. **Study Plans & 9-Level Roadmap**:
    - 30-Day Sprint, 60-Day Foundation, 90-Day Zero-to-Topper plans with daily pace selector (1h, 2h, or 3h/day).

12. **Content Extensibility & Local Backups**:
    - In-browser Question Importer with JSON syntax & duplicate ID validation.
    - Export and Import user progress to JSON for seamless migration across browsers.

---

## 🚀 Quick Start (Local Development)

Ensure you have Node.js (v18+) installed.

```bash
# 1. Clone or navigate to the project directory
cd bank-reasoning-master

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production (GitHub Pages ready)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

The repository comes pre-configured with a zero-configuration GitHub Actions workflow: `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Create a new GitHub repository named `bank-reasoning-master` (or any name you prefer).
2. Initialize git and push the project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bank Reasoning Master platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. That's it! GitHub Actions will automatically install dependencies, build the project with Vite, and publish the static website to `https://<your-username>.github.io/<your-repo-name>/`.

---

## 📂 Content Architecture

Because the platform is deployed statically on GitHub Pages, all question banks and topic data reside in lightweight, standard JSON files in `/public/data/`:

| File | Purpose |
|------|---------|
| `/public/data/exam-config.json` | Official exam structures, cycle years, source citations, negative marking rules |
| `/public/data/topics.json` | 22 reasoning topics, syllabus details, pitfalls, shortcuts, expected times |
| `/public/data/pyq.json` | 2020–2026 PYQ trend matrices, shift statistics, sample memory-based questions |
| `/public/data/questions.json` | Curated base questions with dual normal vs topper explanations |
| `/public/data/tricks.json` | 10 core mind tricks, topper comparison charts, revision flashcards |
| `/public/data/study-plans.json` | 30-day, 60-day, and 90-day daily schedules |

To add new questions or edit existing patterns, refer to [QUESTION_BANK_GUIDE.md](./QUESTION_BANK_GUIDE.md).

---

## 🛡️ Data & Privacy Policy
- **No Login Required**: The platform works 100% client-side without any backend database or third-party trackers.
- **Offline-First**: All progress, bookmarks, notes, and error logs are saved in the browser's `localStorage` and can be backed up as JSON anytime.
- **No Fabricated Data**: Official exam patterns are strictly cross-checked against official SBI & IBPS advertisements.

---

## ⚖️ License
MIT License. Built for bank exam aspirants preparing for SBI, IBPS, and RRB recruitment exams.
