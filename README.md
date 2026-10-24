# PromptCraft — AI Prompt Generator and Improver

<div align="center">
  <img src="assets/logo.svg" alt="PromptCraft Logo" width="80" height="80">
  <h3>Professional AI Prompt Studio for High-Precision Generative AI Outputs</h3>
  <p><strong>B.E. Computer Science and Engineering &bull; Internship Capstone Project</strong></p>
  <p><em>Demonstrating AI Prompt Engineering, Generative AI Concepts, and Modern Vanilla Web Development</em></p>
</div>

---

## 1. Project Abstract

**PromptCraft** is an interactive, zero-dependency, client-side web application designed to bridge the gap between naive natural-language user instructions and high-precision structured prompts for state-of-the-art Large Language Models (LLMs) such as Google Gemini, OpenAI GPT-4, and Anthropic Claude.

While modern foundation models are exceptionally capable, novice users frequently receive suboptimal, vague, or hallucinated responses due to under-specified queries. **PromptCraft** applies established prompt engineering frameworks—specifically the **R-T-F-C Model** (*Role, Task, Format, Constraint*) and **C-R-E-A-T-E Model** (*Context, Role, Explicit instruction, Audience, Tone, Execution format*)—to systematically transform raw requirements into production-ready prompts.

Built with **HTML5, modern CSS3 (Custom Properties & Responsive Grid/Flexbox), and Vanilla ES6+ JavaScript**, the application operates 100% offline using a deterministic heuristic compilation engine and browser `localStorage`. It also provides progressive enhancement via optional integration with the **Google Gemini REST API** (`gemini-2.5-flash`), with client-side security safeguards.

---

## 2. Key Features

### 🎯 A. Modern, Accessible Dashboard UI
* **Custom Vector Branding & Modern Layout**: Styled with custom CSS variables, subtle glassmorphism cards, and responsive elevation.
* **Light / Dark Theme Switcher**: Automatically syncs with user preferences and OS settings (`prefers-color-scheme`) with persistent `localStorage` storage.
* **Accessible Navigation**: Accessible ARIA tabs for instantaneous single-page application (SPA) switching without page reloads.

### ⚡ B. Multi-Category Structured Prompt Generator
* **7 Real-World Task Domains**:
  1. *Coding & Debugging* (refactoring, bug analysis, test generation)
  2. *Education & Learning* (Socratic tutoring, concept breakdowns, exam prep)
  3. *Content Writing* (technical articles, SEO outlines, newsletters)
  4. *Resume & Career* (STAR/XYZ format resume bullets, LinkedIn summaries)
  5. *Presentation Creation* (pitch deck outlines, slide structures)
  6. *Image Generation* (Midjourney v6 / SDXL cinematic parameter prompts)
  7. *Business & Productivity* (SWOT analysis, SOPs, executive briefings)
* **Dynamic Presets & Persona Chips**: Selecting a category updates domain-specific role chips, suggested tones, output formats, and contextual placeholders.
* **Prompt Strength Meter**: Real-time completeness scoring (0–100%) evaluating the Presence of Task, Role, Context, Constraints, and Output Format.

### 🔍 C. Prompt Improver (The "Refine & Optimize" Engine)
* **Dual Operation Modes**:
  1. **Deterministic Rule-Based Analyzer (Default / Offline)**: Analyzes weak verbs, lack of persona, absent constraints, and unstructured formatting without requiring an API key or network connection.
  2. **Google Gemini AI Bridge (Optional)**: Connects directly to `gemini-2.5-flash` using standard Fetch API to perform deep LLM-driven chain-of-thought prompt optimization.
* **Side-by-Side Comparison**: Displays the original unoptimized prompt next to the refined version with word counts and a categorized changelog of optimizations made.

### 📋 D. Prompt Results & Action Deck
* **Syntax-Highlighted Output Box**: Clean typography using *JetBrains Mono*.
* **One-Click Clipboard Action**: Copies text instantly with floating toast confirmation.
* **In-Place Live Editing**: Toggle into inline edit mode to refine generated prompts directly.
* **Prompt Regeneration**: Re-compiles with randomized variations and chain-of-thought reasoning protocols.

### 💾 E. Saved Prompts Library (LocalStorage CRUD)
* **Client-Side Persistence**: Saves prompts with category tags, timestamps, and strength ratings into browser `localStorage`.
* **Instant Search & Multi-Criteria Sorting**: Live search across title and prompt text, category filtering, and sorting (Newest, Oldest, Highest Score, Alphabetical).
* **Backup & Export**: One-click download of all saved prompts as a clean `promptcraft_backup.json` file.
* **Confirmation Safeguard**: Modal dialog preventing accidental deletion of prompt collections.

---

## 3. Technology Stack & Architecture

```
promptcraft/
├── index.html            # Semantic HTML5 markup with ARIA roles & accessible tabs
├── css/
│   └── style.css         # CSS3 design system, theme tokens, grid & media queries
├── js/
│   └── app.js            # Modular ES6 controller, RTFC engine & LocalStorage CRUD
├── assets/
│   └── logo.svg          # Custom vector SVG branding icon
└── README.md             # Academic documentation & viva presentation guide
```

### Technical Specifications
* **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Framework Dependencies**: **None (Zero npm dependencies, zero build steps)**.
* **Storage Layer**: Browser `localStorage` (for prompts and theme) & `sessionStorage` (for optional API key).
* **AI Integration**: Google Gemini API (`gemini-2.5-flash` endpoint via native `window.fetch`).
* **Design Standards**: WCAG 2.1 AA accessible contrast ratios, responsive down to 320px mobile screens.

---

## 4. Prompt Engineering Methodology

PromptCraft implements the **R-T-F-C** engineering model:

| Dimension | Engineering Purpose | Example in PromptCraft |
| :--- | :--- | :--- |
| **Role (Persona)** | Calibrates the LLM's vocabulary, expertise level, and assumptions. | *"Senior Systems Software Engineer & Tech Lead"* |
| **Task (Objective)** | Specifies the exact functional deliverable. | *"Write a thread-safe LRU Cache in Python with O(1) complexity."* |
| **Format (Structure)** | Dictates output presentation for downstream consumption. | *"Code Block with Detailed Comments & Doctests"* |
| **Constraints (Guardrails)** | Eliminates hallucinations, bounds scope, and sets negative rules. | *"Python standard library only; zero third-party packages; handle KeyError."* |

---

## 5. Setup and Execution Instructions

### Option 1: Direct Browser Launch (Easiest)
Simply double-click [`index.html`](file:///index.html) or run in PowerShell:
```powershell
Start-Process "index.html"
```

### Option 2: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click [`index.html`](file:///index.html) and select **Open with Live Server**.
4. The application will launch at `http://127.0.0.1:5500`.

### Option 3: Python Built-in HTTP Server
```bash
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

---

## 6. Testing & Quality Verification Checklist

| Test Case | Steps to Test | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **TC-01: Form Validation** | Leave Task blank and click "Generate Prompt" | Error message displays; field highlights; toast warns user | Passed |
| **TC-02: Category Switching** | Click "Image Generation" card | Placeholders, suggestions, and output schema switch to Midjourney format | Passed |
| **TC-03: Quality Scorer** | Type task + persona + context + constraints | Strength meter progresses dynamically from 0% to 95%+ | Passed |
| **TC-04: Clipboard Copy** | Click "Copy to Clipboard" on generated result | System clipboard receives prompt; animated toast confirms | Passed |
| **TC-05: In-Place Editing** | Click "Edit Prompt", type changes, click "Done Editing" | Textarea unlocks; editing banner shows; edits persist | Passed |
| **TC-06: LocalStorage CRUD** | Click "Save to Library", reload the browser page | Saved prompt count persists in badge; card appears in Library tab | Passed |
| **TC-07: Library Search** | Enter keyword in Saved Library search bar | Results filter in real-time matching title or prompt body | Passed |
| **TC-08: Theme Toggle** | Click theme button (Sun/Moon) in header | Dark/Light mode transitions smoothly; saved in `localStorage` | Passed |
| **TC-09: Offline Improver** | Paste vague prompt in Improver tab and run | Analyzes weaknesses; generates side-by-side comparison & changelog | Passed |
| **TC-10: Gemini API Bridge** | Enter API key in Settings modal; toggle AI mode | Online status dot lights up; calls Gemini REST API via fetch | Passed |

---

## 7. Academic Viva Voce Q&A Preparation

**Q1: What is the primary difference between a naive prompt and an engineered prompt?**
> *Answer:* A naive prompt only states a minimal task without specifying context, persona, or boundaries, forcing the LLM to make arbitrary assumptions that lead to hallucinations. An engineered prompt applies frameworks like RTFC to constrain the model's latent probability distribution toward domain-accurate, reproducible outputs.

**Q2: Why did you build this as a pure Vanilla JavaScript application instead of using React or Next.js?**
> *Answer:* To demonstrate mastery of core foundational web technologies (HTML5 DOM manipulation, modern CSS3 custom properties, ES6 classes, and the Web Storage API) without abstraction overhead. It also ensures zero bundle overhead, instantaneous loading speeds, and effortless deployment without npm or Node.js runtime requirements.

**Q3: How does the application maintain user privacy and security with API keys?**
> *Answer:* The core application functions 100% offline without needing any API key. If a user chooses to enable the Gemini API, their key is stored only in the browser's temporary session storage or in-memory state. It is never committed to Git, hardcoded in frontend code, or sent to intermediate proxy servers.

**Q4: How does the offline Prompt Improver work without an LLM?**
> *Answer:* It uses a deterministic heuristic analyzer. It parses the text for semantic markers (domain keywords, presence of second-person persona indicators, negative constraint triggers, and structural keywords). If key components are missing, it flags them as weaknesses and restructures the input using pre-calibrated domain templates.

---

## 8. Author & Internship Acknowledgments

* **Student / Developer**: B.E. Computer Science and Engineering
* **Domain Focus**: AI Prompt Engineering, Generative AI & Frontend Development
* **Institution**: Computer Science & Engineering Department
* **Repository**: [GitHub Repository](https://github.com/Sreeman408/AI-Prompt-Generator-and-Improver.git)
