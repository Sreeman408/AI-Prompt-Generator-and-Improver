/**
 * PROMPTCRAFT — AI Prompt Generator & Improver
 * Core Application Engine, DOM Controller, LocalStorage Manager & AI Bridge
 * 
 * Technologies: Vanilla JavaScript (ES6+), Web Storage API, Fetch API
 * Academic Project: B.E. Computer Science & Engineering Capstone Project
 */

'use strict';

/* ==========================================================================
   1. Application Configuration & Category Presets
   ========================================================================== */

const APP_CONFIG = {
  STORAGE_KEYS: {
    PROMPTS: 'promptcraft_saved_prompts',
    THEME: 'promptcraft_theme',
    API_KEY: 'promptcraft_gemini_key',
    API_MODEL: 'promptcraft_gemini_model',
  },
  DEFAULT_MODEL: 'gemini-2.5-flash',
  MAX_TASK_CHARS: 500,
};

// Comprehensive Category Presets for all 7 Task Domains
const CATEGORY_PRESETS = {
  coding: {
    name: 'Coding & Debugging',
    badge: 'Coding',
    defaultRole: 'Staff Software Engineer & Technical Architect',
    suggestedRoles: [
      'Senior Python Developer',
      'Full-Stack Web Architect',
      'DevOps & SRE Specialist',
      'Cybersecurity & Code Auditor'
    ],
    taskPlaceholder: 'e.g., Write a thread-safe LRU Cache in Python with O(1) time complexity and full unit tests...',
    contextPlaceholder: 'e.g., High-throughput backend service running on AWS ECS, target audience is senior engineering team.',
    defaultTone: 'Professional & Technical',
    defaultFormat: 'Code Block with Detailed Comments',
    constraintsPlaceholder: 'e.g., Python standard library only, include type hints (PEP 484), handle edge cases for missing keys, document O(N) complexity.',
    sample: {
      task: 'Build a production-ready rate limiter middleware in Node.js using a token bucket algorithm.',
      role: 'Senior Backend Engineer and API Architect',
      context: 'Microservices architecture with 10,000 requests per second across distributed Docker containers.',
      tone: 'Professional & Technical',
      format: 'Code Block with Detailed Comments',
      constraints: 'Zero third-party dependencies, must handle concurrent Redis connections gracefully, include docstrings and time complexity analysis.'
    }
  },

  education: {
    name: 'Education & Learning',
    badge: 'Education',
    defaultRole: 'Distinguished Professor and Socratic Academic Tutor',
    suggestedRoles: [
      'University Computer Science Lecturer',
      'STEM High-School Teacher',
      'Socratic Method Tutor',
      'Curriculum Design Specialist'
    ],
    taskPlaceholder: 'e.g., Explain the concept of Dynamic Programming versus Memoization using intuitive real-world analogies...',
    contextPlaceholder: 'e.g., 2nd-year undergraduate engineering student with basic knowledge of recursion.',
    defaultTone: 'Educational & Step-by-Step',
    defaultFormat: 'Step-by-Step Implementation Guide',
    constraintsPlaceholder: 'e.g., Use the Feynman technique, avoid mathematical jargon without definitions, include a self-assessment quiz with answers.',
    sample: {
      task: 'Explain how the Transformer attention mechanism (Self-Attention) works in Generative AI models.',
      role: 'Distinguished AI Researcher and University Lecturer',
      context: 'Undergraduate computer science students familiar with linear algebra and basic neural networks.',
      tone: 'Educational & Step-by-Step',
      format: 'Step-by-Step Implementation Guide',
      constraints: 'Use the Feynman technique, avoid heavy calculus, include a visual ASCII matrix walkthrough and a 3-question self-check quiz.'
    }
  },

  content: {
    name: 'Content Writing',
    badge: 'Content',
    defaultRole: 'Award-Winning Editorial Director and Copywriter',
    suggestedRoles: [
      'Senior Tech Columnist',
      'SEO Content Strategist',
      'Creative Fiction Author',
      'B2B SaaS Copywriter'
    ],
    taskPlaceholder: 'e.g., Write an in-depth article analyzing the ethical implications of autonomous AI agents in software engineering...',
    contextPlaceholder: 'e.g., Tech industry leaders, developers, and tech executives reading an editorial publication like TechCrunch.',
    defaultTone: 'Executive & Persuasive',
    defaultFormat: 'Bullet Points with Key Highlights',
    constraintsPlaceholder: 'e.g., Under 800 words, no promotional clichés, cite real-world regulatory frameworks (e.g., EU AI Act), engaging hook.',
    sample: {
      task: 'Write a comprehensive guide on modern Prompt Engineering best practices for enterprise software teams.',
      role: 'Principal Developer Advocate & Senior Tech Columnist',
      context: 'Published on an engineering blog targeting developers transitioning into GenAI engineering.',
      tone: 'Clear & Concise',
      format: 'Markdown Table Summary',
      constraints: 'Focus on RTFC and few-shot prompting, provide tangible before-and-after examples, avoid marketing fluff.'
    }
  },

  resume: {
    name: 'Resume & Career',
    badge: 'Career',
    defaultRole: 'Executive Career Coach and Senior Technical Recruiter',
    suggestedRoles: [
      'FAANG Technical Recruiter',
      'Executive Leadership Coach',
      'LinkedIn Optimization Expert',
      'Behavioral Interview Mentor'
    ],
    taskPlaceholder: 'e.g., Transform my project experience into 4 high-impact resume bullet points using the STAR/XYZ formula...',
    contextPlaceholder: 'e.g., Applying for an Entry-Level Software Engineer or GenAI Intern role at a tier-1 technology company.',
    defaultTone: 'Executive & Persuasive',
    defaultFormat: 'Bullet Points with Key Highlights',
    constraintsPlaceholder: 'e.g., Begin with strong action verbs (Architected, Spearheaded, Optimized), quantify metrics (%, latency, users), avoid passive voice.',
    sample: {
      task: 'Rewrite my machine learning internship experience into 4 quantifiable resume bullet points using Google\'s XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]).',
      role: 'FAANG Technical Recruiter and Career Strategist',
      context: 'Recent Computer Science graduate applying for Artificial Intelligence and Machine Learning Engineer positions.',
      tone: 'Executive & Persuasive',
      format: 'Bullet Points with Key Highlights',
      constraints: 'Include specific metrics (e.g. 40% latency reduction, 95% accuracy), eliminate weak words like "worked on" or "helped", tailor for ATS keyword scanners.'
    }
  },

  presentation: {
    name: 'Presentation Creation',
    badge: 'Presentation',
    defaultRole: 'Keynote Speaker and Strategic Communications Designer',
    suggestedRoles: [
      'Venture Capital Pitch Coach',
      'TEDx Keynote Designer',
      'Corporate Strategy Consultant',
      'Academic Conference Speaker'
    ],
    taskPlaceholder: 'e.g., Create a 10-slide pitch deck structure for an AI-powered developer productivity tool...',
    contextPlaceholder: 'e.g., 5-minute presentation to Angel Investors and Venture Capitalists at a demo day.',
    defaultTone: 'Executive & Persuasive',
    defaultFormat: 'Executive One-Pager Summary',
    constraintsPlaceholder: 'e.g., 10 slides max, 1 key takeaway per slide, include speaker notes and suggested visual ideas.',
    sample: {
      task: 'Design a 7-slide academic capstone presentation outline demonstrating PromptCraft to university evaluators.',
      role: 'Keynote Speaker and Academic Defense Coach',
      context: 'B.E. Computer Science final year project evaluation committee and external examiners.',
      tone: 'Professional & Technical',
      format: 'Executive One-Pager Summary',
      constraints: 'Include Problem Statement, System Architecture, RTFC Model, Live Demo Flow, and Future Scope. Keep slides concise with speaker cues.'
    }
  },

  image: {
    name: 'Image Generation',
    badge: 'Image Gen',
    defaultRole: 'Master Visual Artist and Midjourney Prompt Engineer',
    suggestedRoles: [
      'Cinematic Concept Artist',
      '3D Lighting & Texture Director',
      'Photorealistic Studio Photographer',
      'Anime / Digital Illustrator'
    ],
    taskPlaceholder: 'e.g., Create a cinematic, photorealistic portrait of an AI cybernetic researcher in a neon-lit cyberpunk laboratory...',
    contextPlaceholder: 'e.g., Suitable for Midjourney v6 or Stable Diffusion SDXL high-resolution rendering.',
    defaultTone: 'Creative & Engaging',
    defaultFormat: 'Code Block with Detailed Comments',
    constraintsPlaceholder: 'e.g., Specify camera lens (85mm f/1.8), lighting (volumetric, octane render), aspect ratio (--ar 16:9), negative prompt: blurry, deformed.',
    sample: {
      task: 'Generate an ultra-detailed, photorealistic key visual of a futuristic quantum supercomputer operating in a subterranean glass facility.',
      role: 'Master Visual Artist and Midjourney Prompt Engineer',
      context: 'Midjourney v6.0 prompt syntax with photorealistic rendering parameters.',
      tone: 'Creative & Engaging',
      format: 'Code Block with Detailed Comments',
      constraints: 'Specify cinematic volumetric lighting, 8k resolution, Unreal Engine 5 render, Hasselblad H6D-100c, 35mm lens, --ar 16:9 --style raw --v 6.0.'
    }
  },

  business: {
    name: 'Business & Productivity',
    badge: 'Business',
    defaultRole: 'Senior Management Consultant & Operations Strategist',
    suggestedRoles: [
      'McKinsey Strategy Consultant',
      'Chief of Staff & COO Advisor',
      'Product Management Director',
      'Agile Scrum Master & Agile Coach'
    ],
    taskPlaceholder: 'e.g., Conduct a thorough SWOT analysis for adopting generative AI coding assistants within an enterprise IT department...',
    contextPlaceholder: 'e.g., Enterprise with 500+ software developers evaluating security, compliance, and ROI.',
    defaultTone: 'Professional & Technical',
    defaultFormat: 'Markdown Table Summary',
    constraintsPlaceholder: 'e.g., Focus on IP protection, licensing costs, developer velocity metrics, and change management risks.',
    sample: {
      task: 'Conduct a comprehensive SWOT analysis and Risk Mitigation Matrix for integrating AI prompt engineering workflows into software development teams.',
      role: 'Senior Technology Consultant and Operations Director',
      context: 'Executive leadership meeting at a medium-sized enterprise software company.',
      tone: 'Executive & Persuasive',
      format: 'Markdown Table Summary',
      constraints: 'Provide 4 points per quadrant (Strengths, Weaknesses, Opportunities, Threats) plus concrete mitigation strategies with estimated timelines.'
    }
  }
};

/* ==========================================================================
   2. Application State Manager
   ========================================================================== */

class AppState {
  constructor() {
    this.currentTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME) || 'dark';
    this.activeTab = 'generator';
    this.selectedCategory = 'coding';
    this.savedPrompts = this.loadSavedPrompts();
    this.geminiApiKey = sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.API_KEY) || '';
    this.activeModel = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.API_MODEL) || APP_CONFIG.DEFAULT_MODEL;
    this.isEditingOutput = false;
    this.lastGeneratedPrompt = null;
    this.improverAiMode = false;
  }

  loadSavedPrompts() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PROMPTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse saved prompts from localStorage:', e);
      return [];
    }
  }

  persistSavedPrompts() {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PROMPTS, JSON.stringify(this.savedPrompts));
    } catch (e) {
      console.error('Failed to persist saved prompts:', e);
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
  }

  setGeminiKey(key) {
    this.geminiApiKey = key.trim();
    if (this.geminiApiKey) {
      sessionStorage.setItem(APP_CONFIG.STORAGE_KEYS.API_KEY, this.geminiApiKey);
    } else {
      sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.API_KEY);
    }
  }

  setModel(model) {
    this.activeModel = model;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.API_MODEL, model);
  }
}

// Global Application State Instance
const state = new AppState();

/* ==========================================================================
   3. DOM Elements Selector Cache
   ========================================================================== */

const DOM = {
  // Navigation & Header
  navTabs: document.querySelectorAll('.tab-btn'),
  tabViews: document.querySelectorAll('.tab-view'),
  savedCountBadge: document.getElementById('saved-count-badge'),
  btnThemeToggle: document.getElementById('btn-theme-toggle'),
  btnApiModal: document.getElementById('btn-api-modal'),
  headerApiStatus: document.getElementById('header-api-status'),
  footerApiStatus: document.getElementById('footer-api-status'),

  // Tab 1: Generator
  categoryCards: document.querySelectorAll('.category-card'),
  selectedCategoryPill: document.getElementById('selected-category-pill'),
  btnLoadSampleInputs: document.getElementById('btn-load-sample-inputs'),
  generatorForm: document.getElementById('generator-form'),
  inputTask: document.getElementById('input-task'),
  taskCharCounter: document.getElementById('task-char-counter'),
  taskErrorMsg: document.getElementById('task-error-msg'),
  inputRole: document.getElementById('input-role'),
  roleSuggestions: document.getElementById('role-suggestions'),
  inputContext: document.getElementById('input-context'),
  selectTone: document.getElementById('select-tone'),
  inputCustomTone: document.getElementById('input-custom-tone'),
  selectFormat: document.getElementById('select-format'),
  inputCustomFormat: document.getElementById('input-custom-format'),
  inputConstraints: document.getElementById('input-constraints'),
  btnGeneratePrompt: document.getElementById('btn-generate-prompt'),
  btnResetForm: document.getElementById('btn-reset-form'),

  // Output Deck
  outputEngineBadge: document.getElementById('output-engine-badge'),
  outputCategoryTag: document.getElementById('output-category-tag'),
  strengthScoreText: document.getElementById('strength-score-text'),
  strengthBarFill: document.getElementById('strength-bar-fill'),
  strengthVerdict: document.getElementById('strength-verdict'),
  outputPlaceholder: document.getElementById('output-placeholder'),
  outputContentWrapper: document.getElementById('output-content-wrapper'),
  outputTextarea: document.getElementById('output-textarea'),
  editingBanner: document.getElementById('editing-banner'),
  btnCopyPrompt: document.getElementById('btn-copy-prompt'),
  btnCopyText: document.getElementById('btn-copy-text'),
  btnEditPrompt: document.getElementById('btn-edit-prompt'),
  btnEditText: document.getElementById('btn-edit-text'),
  btnRegeneratePrompt: document.getElementById('btn-regenerate-prompt'),
  btnSavePrompt: document.getElementById('btn-save-prompt'),
  btnClearOutput: document.getElementById('btn-clear-output'),
  tipRole: document.getElementById('tip-role'),
  tipContext: document.getElementById('tip-context'),
  tipConstraints: document.getElementById('tip-constraints'),
  tipFormat: document.getElementById('tip-format'),

  // Tab 2: Improver
  improverEngineIndicator: document.getElementById('improver-engine-indicator'),
  improverModeText: document.getElementById('improver-mode-text'),
  inputRawPrompt: document.getElementById('input-raw-prompt'),
  btnLoadImproverSample: document.getElementById('btn-load-improver-sample'),
  btnClearImproverInput: document.getElementById('btn-clear-improver-input'),
  optInjectRole: document.getElementById('opt-inject-role'),
  optAddConstraints: document.getElementById('opt-add-constraints'),
  optEnforceFormat: document.getElementById('opt-enforce-format'),
  optAddCot: document.getElementById('opt-add-cot'),
  btnRunImprover: document.getElementById('btn-run-improver'),
  btnToggleAiMode: document.getElementById('btn-toggle-ai-mode'),
  btnAiModeText: document.getElementById('btn-ai-mode-text'),
  improverLoadingState: document.getElementById('improver-loading-state'),
  improverLoadingText: document.getElementById('improver-loading-text'),
  improverResultsContainer: document.getElementById('improver-results-container'),
  originalWordCount: document.getElementById('original-word-count'),
  displayOriginalPrompt: document.getElementById('display-original-prompt'),
  weaknessesList: document.getElementById('weaknesses-list'),
  improvedBadgeLabel: document.getElementById('improved-badge-label'),
  improvedWordCount: document.getElementById('improved-word-count'),
  displayImprovedPrompt: document.getElementById('display-improved-prompt'),
  improvementsList: document.getElementById('improvements-list'),
  btnCopyImproved: document.getElementById('btn-copy-improved'),
  btnSaveImproved: document.getElementById('btn-save-improved'),

  // Tab 3: Saved Library
  searchSavedPrompts: document.getElementById('search-saved-prompts'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  filterCategory: document.getElementById('filter-category'),
  sortSaved: document.getElementById('sort-saved'),
  savedPromptsGrid: document.getElementById('saved-prompts-grid'),
  libraryEmptyState: document.getElementById('library-empty-state'),
  btnEmptyGoGenerate: document.getElementById('btn-empty-go-generate'),
  btnExportPrompts: document.getElementById('btn-export-prompts'),
  btnClearAllPrompts: document.getElementById('btn-clear-all-prompts'),

  // Modals
  modalApiSettings: document.getElementById('modal-api-settings'),
  btnCloseApiModal: document.getElementById('btn-close-api-modal'),
  inputGeminiKey: document.getElementById('input-gemini-key'),
  btnToggleKeyVisibility: document.getElementById('btn-toggle-key-visibility'),
  selectGeminiModel: document.getElementById('select-gemini-model'),
  modalStatusDot: document.getElementById('modal-status-dot'),
  modalStatusText: document.getElementById('modal-status-text'),
  btnSaveApiKey: document.getElementById('btn-save-api-key'),
  btnRemoveApiKey: document.getElementById('btn-remove-api-key'),

  modalConfirm: document.getElementById('modal-confirm'),
  btnCloseConfirmModal: document.getElementById('btn-close-confirm-modal'),
  modalConfirmMsg: document.getElementById('modal-confirm-msg'),
  btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
  btnConfirmProceed: document.getElementById('btn-confirm-proceed'),

  toastContainer: document.getElementById('toast-container'),
};

/* ==========================================================================
   4. UI Utilities & Toast System
   ========================================================================== */

/**
 * Display an accessible floating toast message
 * @param {string} message - Message text
 * @param {'success'|'error'|'info'} type - Toast aesthetic type
 * @param {number} duration - Milliseconds before auto-dismiss
 */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  } else {
    iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/**
 * Helper to escape HTML and prevent XSS injection
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Copy text to clipboard with modern navigator API and legacy fallback
 */
async function copyToClipboard(text, successMsg = 'Prompt copied to clipboard!') {
  if (!text || !text.trim()) {
    showToast('Nothing to copy!', 'error');
    return false;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Legacy fallback for non-HTTPS or sandbox environments
      const tempArea = document.createElement('textarea');
      tempArea.value = text;
      tempArea.style.position = 'fixed';
      tempArea.style.left = '-9999px';
      document.body.appendChild(tempArea);
      tempArea.focus();
      tempArea.select();
      document.execCommand('copy');
      tempArea.remove();
    }
    showToast(successMsg, 'success');
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    showToast('Failed to copy to clipboard', 'error');
    return false;
  }
}

/**
 * Word count helper
 */
function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/* ==========================================================================
   5. Tab Navigation & Theme Management
   ========================================================================== */

function initNavigation() {
  DOM.navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  DOM.btnEmptyGoGenerate.addEventListener('click', () => {
    switchTab('generator');
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;

  // Update button active state
  DOM.navTabs.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget);
  });

  // Update tab panel visibility
  DOM.tabViews.forEach(view => {
    const isTarget = view.id === `view-${tabId}`;
    view.classList.toggle('active', isTarget);
    if (isTarget) {
      view.removeAttribute('hidden');
    } else {
      view.setAttribute('hidden', '');
    }
  });

  // If entering library tab, re-render saved cards
  if (tabId === 'library') {
    renderSavedPrompts();
  }
}

function initTheme() {
  // Apply saved theme
  state.setTheme(state.currentTheme);

  DOM.btnThemeToggle.addEventListener('click', () => {
    const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    state.setTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info', 1800);
  });
}

/* ==========================================================================
   6. Category Presets & Dynamic Form Customization
   ========================================================================== */

function initCategories() {
  DOM.categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const categoryId = card.getAttribute('data-category');
      selectCategory(categoryId);
    });
  });

  // Tone & Format custom input toggles
  DOM.selectTone.addEventListener('change', (e) => {
    DOM.inputCustomTone.classList.toggle('hidden', e.target.value !== 'custom');
    if (e.target.value === 'custom') DOM.inputCustomTone.focus();
    updateStrengthMeterLive();
  });

  DOM.selectFormat.addEventListener('change', (e) => {
    DOM.inputCustomFormat.classList.toggle('hidden', e.target.value !== 'custom');
    if (e.target.value === 'custom') DOM.inputCustomFormat.focus();
    updateStrengthMeterLive();
  });

  // Load sample demonstration inputs
  DOM.btnLoadSampleInputs.addEventListener('click', () => {
    loadCategorySample();
  });

  // Task Character Counter
  DOM.inputTask.addEventListener('input', () => {
    const len = DOM.inputTask.value.length;
    DOM.taskCharCounter.textContent = `${len}/${APP_CONFIG.MAX_TASK_CHARS}`;
    if (len > 0) {
      DOM.taskErrorMsg.textContent = '';
      DOM.inputTask.classList.remove('input-invalid');
    }
    updateStrengthMeterLive();
  });

  // Listen to other inputs for live quality score updates
  [DOM.inputRole, DOM.inputContext, DOM.inputConstraints].forEach(el => {
    el.addEventListener('input', updateStrengthMeterLive);
  });

  // Initialize initial category (Coding)
  selectCategory('coding');
}

function selectCategory(categoryId) {
  if (!CATEGORY_PRESETS[categoryId]) return;
  state.selectedCategory = categoryId;
  const preset = CATEGORY_PRESETS[categoryId];

  // Update UI category cards
  DOM.categoryCards.forEach(card => {
    const isSelected = card.getAttribute('data-category') === categoryId;
    card.classList.toggle('active', isSelected);
    card.setAttribute('aria-checked', isSelected);
  });

  // Update active pill and output category tag
  DOM.selectedCategoryPill.textContent = `Active: ${preset.name}`;
  DOM.outputCategoryTag.textContent = preset.badge;

  // Update Form Placeholders
  DOM.inputTask.setAttribute('placeholder', preset.taskPlaceholder);
  DOM.inputContext.setAttribute('placeholder', preset.contextPlaceholder);
  DOM.inputConstraints.setAttribute('placeholder', preset.constraintsPlaceholder);

  // Set default role if empty or was previously default
  if (!DOM.inputRole.value.trim()) {
    DOM.inputRole.setAttribute('placeholder', `e.g., ${preset.defaultRole}`);
  }

  // Populate Suggestion Chips for Persona
  DOM.roleSuggestions.innerHTML = '';
  preset.suggestedRoles.forEach(roleText => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggestion-chip';
    chip.textContent = roleText;
    chip.addEventListener('click', () => {
      DOM.inputRole.value = roleText;
      updateStrengthMeterLive();
    });
    DOM.roleSuggestions.appendChild(chip);
  });

  // Auto-select suggested format & tone
  if (preset.defaultTone) DOM.selectTone.value = preset.defaultTone;
  if (preset.defaultFormat) DOM.selectFormat.value = preset.defaultFormat;
  DOM.inputCustomTone.classList.add('hidden');
  DOM.inputCustomFormat.classList.add('hidden');

  updateStrengthMeterLive();
}

function loadCategorySample() {
  const preset = CATEGORY_PRESETS[state.selectedCategory];
  if (!preset || !preset.sample) return;

  DOM.inputTask.value = preset.sample.task;
  DOM.inputRole.value = preset.sample.role;
  DOM.inputContext.value = preset.sample.context;
  DOM.selectTone.value = preset.sample.tone;
  DOM.selectFormat.value = preset.sample.format;
  DOM.inputConstraints.value = preset.sample.constraints;

  DOM.inputCustomTone.classList.add('hidden');
  DOM.inputCustomFormat.classList.add('hidden');

  // Trigger char counter
  DOM.taskCharCounter.textContent = `${DOM.inputTask.value.length}/${APP_CONFIG.MAX_TASK_CHARS}`;
  DOM.taskErrorMsg.textContent = '';

  updateStrengthMeterLive();
  showToast(`Loaded sample inputs for ${preset.name}`, 'info', 2000);
}

/* ==========================================================================
   7. RTFC Prompt Engineering Compilation Engine
   ========================================================================== */

/**
 * Compiles prompt inputs into a structured RTFC prompt
 */
function compileStructuredPrompt(data) {
  const category = CATEGORY_PRESETS[data.category] || CATEGORY_PRESETS.coding;

  const role = data.role.trim() || category.defaultRole;
  const task = data.task.trim();
  const context = data.context.trim();
  const tone = data.tone === 'custom' ? (data.customTone.trim() || 'Professional') : data.tone;
  const format = data.format === 'custom' ? (data.customFormat.trim() || 'Structured Markdown') : data.format;
  const constraints = data.constraints.trim();

  // Special Prompt Structure for Image Generation
  if (data.category === 'image') {
    return buildImageGenerationPrompt(task, role, context, tone, constraints);
  }

  // Standard RTFC Prompt Structure
  const sections = [];

  // 1. Role Section (Persona)
  sections.push(`### 1. Role & Persona:\nYou are an authoritative, world-class ${role}. Approach this task with the highest level of domain excellence, rigor, and industry best practices.`);

  // 2. Primary Objective (Task)
  sections.push(`### 2. Primary Objective & Task:\n${task}`);

  // 3. Background Context & Target Audience (if provided)
  if (context) {
    sections.push(`### 3. Context & Target Audience:\n${context}`);
  }

  // 4. Execution Guardrails & Constraints
  const guardrails = [];
  guardrails.push(`- **Tone and Voice**: Maintain a ${tone} tone throughout.`);
  guardrails.push(`- **Precision**: Eliminate fluff, unnecessary disclaimers, and boilerplate introductions. Deliver immediate value.`);
  if (constraints) {
    guardrails.push(`- **Specific Constraints**: ${constraints}`);
  }
  guardrails.push(`- **Quality Standard**: Verify accuracy, completeness, and edge-case handling before finalizing.`);
  sections.push(`### 4. Instructions & Guardrails:\n${guardrails.join('\n')}`);

  // 5. Output Format
  sections.push(`### 5. Desired Output Structure:\nPresent your response strictly in the following format: **${format}**.\nEnsure logical flow, appropriate section headers, and seamless readability.`);

  return sections.join('\n\n');
}

/**
 * Specialized compiler for Image Generation prompts (Midjourney / SDXL format)
 */
function buildImageGenerationPrompt(task, role, context, tone, constraints) {
  const lines = [];
  lines.push(`// Midjourney / DALL-E 3 Structured Image Prompt`);
  lines.push(`// Crafted by PromptCraft for ${role}`);
  lines.push('');
  lines.push(`**Main Subject & Scene:**`);
  lines.push(task);
  lines.push('');
  if (context) {
    lines.push(`**Artistic Setting & Background Context:**`);
    lines.push(context);
    lines.push('');
  }
  lines.push(`**Visual Style, Lighting & Atmosphere:**`);
  lines.push(`${tone} aesthetic, volumetric lighting, photorealistic rendering, hyper-detailed textures, octane render, 8k resolution.`);
  lines.push('');
  if (constraints) {
    lines.push(`**Parameters & Negative Rules:**`);
    lines.push(constraints);
    lines.push('');
  }
  lines.push(`**Direct /imagine Command:**`);
  const cleanTask = task.replace(/\n/g, ' ').slice(0, 150);
  const cleanConstraints = constraints ? ` ${constraints}` : ' --ar 16:9 --v 6.0 --style raw';
  lines.push(`/imagine prompt: ${cleanTask}, ${tone.toLowerCase()} aesthetic, photorealistic, 8k, cinematic lighting${cleanConstraints}`);

  return lines.join('\n');
}

/* ==========================================================================
   8. Live Prompt Strength & Quality Scorer
   ========================================================================== */

/**
 * Calculates a 0-100% strength score based on prompt completeness heuristics
 */
function calculatePromptStrength(inputs) {
  let score = 0;
  const checklist = {
    hasTask: false,
    hasRole: false,
    hasContext: false,
    hasConstraints: false,
    hasFormat: false,
  };

  // 1. Task Objective (Up to 35 points)
  const taskLen = (inputs.task || '').trim().length;
  if (taskLen >= 15) {
    score += 20;
    checklist.hasTask = true;
    if (taskLen >= 50) score += 15;
  }

  // 2. Role / Persona (Up to 20 points)
  if ((inputs.role || '').trim().length >= 4) {
    score += 20;
    checklist.hasRole = true;
  }

  // 3. Context & Audience (Up to 15 points)
  if ((inputs.context || '').trim().length >= 15) {
    score += 15;
    checklist.hasContext = true;
  }

  // 4. Constraints & Guardrails (Up to 15 points)
  if ((inputs.constraints || '').trim().length >= 10) {
    score += 15;
    checklist.hasConstraints = true;
  }

  // 5. Output Format (Up to 15 points)
  if (inputs.format && inputs.format !== '') {
    score += 15;
    checklist.hasFormat = true;
  }

  let verdict = 'Needs more details';
  if (score >= 90) verdict = 'Enterprise Grade (Optimal)';
  else if (score >= 70) verdict = 'Strong & Highly Specified';
  else if (score >= 45) verdict = 'Moderate (Add Persona/Constraints)';
  else if (score > 0) verdict = 'Weak (Specify Task & Role)';

  return { score: Math.min(score, 100), checklist, verdict };
}

function updateStrengthMeterLive() {
  const currentInputs = {
    task: DOM.inputTask.value,
    role: DOM.inputRole.value,
    context: DOM.inputContext.value,
    constraints: DOM.inputConstraints.value,
    format: DOM.selectFormat.value,
  };

  const { score, checklist, verdict } = calculatePromptStrength(currentInputs);

  DOM.strengthScoreText.textContent = `${score}%`;
  DOM.strengthBarFill.style.width = `${score}%`;
  DOM.strengthVerdict.textContent = verdict;

  // Update checklist indicators
  DOM.tipRole.style.opacity = checklist.hasRole ? '0.4' : '1';
  DOM.tipContext.style.opacity = checklist.hasContext ? '0.4' : '1';
  DOM.tipConstraints.style.opacity = checklist.hasConstraints ? '0.4' : '1';
  DOM.tipFormat.style.opacity = checklist.hasFormat ? '0.4' : '1';
}

/* ==========================================================================
   9. Form Actions, Validation & Output Deck Controller
   ========================================================================== */

function initGeneratorActions() {
  // Form Submission
  DOM.generatorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePromptFromForm();
  });

  // Form Reset
  DOM.btnResetForm.addEventListener('click', () => {
    resetGeneratorForm();
  });

  // Copy Prompt
  DOM.btnCopyPrompt.addEventListener('click', () => {
    const text = DOM.outputTextarea.value;
    copyToClipboard(text, 'Generated prompt copied to clipboard!');
  });

  // Edit / Done Editing Toggle
  DOM.btnEditPrompt.addEventListener('click', () => {
    toggleOutputEditMode();
  });

  // Regenerate with stylistic variation
  DOM.btnRegeneratePrompt.addEventListener('click', () => {
    regeneratePromptWithVariation();
  });

  // Save Prompt to Library
  DOM.btnSavePrompt.addEventListener('click', () => {
    saveCurrentPromptToLibrary();
  });

  // Clear Output
  DOM.btnClearOutput.addEventListener('click', () => {
    clearOutputDeck();
  });
}

function generatePromptFromForm() {
  const taskVal = DOM.inputTask.value.trim();

  // Validation
  if (!taskVal) {
    DOM.taskErrorMsg.textContent = 'Please specify your primary task or objective.';
    DOM.inputTask.classList.add('input-invalid');
    DOM.inputTask.focus();
    showToast('Task objective is required!', 'error');
    return;
  }

  const formData = {
    category: state.selectedCategory,
    task: taskVal,
    role: DOM.inputRole.value,
    context: DOM.inputContext.value,
    tone: DOM.selectTone.value,
    customTone: DOM.inputCustomTone.value,
    format: DOM.selectFormat.value,
    customFormat: DOM.inputCustomFormat.value,
    constraints: DOM.inputConstraints.value,
  };

  const compiledPrompt = compileStructuredPrompt(formData);
  const { score } = calculatePromptStrength(formData);

  // Store in state
  state.lastGeneratedPrompt = {
    id: `pc_${Date.now()}`,
    title: taskVal.slice(0, 50) + (taskVal.length > 50 ? '...' : ''),
    category: CATEGORY_PRESETS[state.selectedCategory].name,
    categoryBadge: CATEGORY_PRESETS[state.selectedCategory].badge,
    formData: { ...formData },
    compiledPrompt,
    score,
    engine: 'template',
    createdAt: new Date().toISOString(),
  };

  // Render to Output Deck
  renderOutputDeck(compiledPrompt);
  showToast('Structured prompt generated successfully!', 'success');
}

function renderOutputDeck(promptText) {
  DOM.outputPlaceholder.classList.add('hidden');
  DOM.outputContentWrapper.classList.remove('hidden');
  DOM.outputTextarea.value = promptText;
  DOM.outputTextarea.readOnly = true;

  state.isEditingOutput = false;
  DOM.btnEditText.textContent = 'Edit Prompt';
  DOM.editingBanner.classList.add('hidden');

  // Enable action buttons
  DOM.btnCopyPrompt.disabled = false;
  DOM.btnEditPrompt.disabled = false;
  DOM.btnRegeneratePrompt.disabled = false;
  DOM.btnSavePrompt.disabled = false;
  DOM.btnClearOutput.disabled = false;

  DOM.outputEngineBadge.className = 'engine-badge template';
  DOM.outputEngineBadge.innerHTML = '<span class="dot"></span><span>Template Engine (Deterministic)</span>';
}

function toggleOutputEditMode() {
  state.isEditingOutput = !state.isEditingOutput;

  if (state.isEditingOutput) {
    DOM.outputTextarea.readOnly = false;
    DOM.outputTextarea.focus();
    DOM.btnEditText.textContent = 'Done Editing';
    DOM.editingBanner.classList.remove('hidden');
    showToast('In-place edit mode enabled. Customize the prompt directly.', 'info', 2000);
  } else {
    DOM.outputTextarea.readOnly = true;
    DOM.btnEditText.textContent = 'Edit Prompt';
    DOM.editingBanner.classList.add('hidden');
    if (state.lastGeneratedPrompt) {
      state.lastGeneratedPrompt.compiledPrompt = DOM.outputTextarea.value;
    }
    showToast('Edits locked in!', 'success', 2000);
  }
}

function regeneratePromptWithVariation() {
  if (!state.lastGeneratedPrompt) return;

  // Re-compile with subtle variations (e.g., adding explicit Chain-of-Thought or reasoning steps)
  const current = state.lastGeneratedPrompt.formData;
  let recompiled = compileStructuredPrompt(current);

  // Add a deterministic bonus reasoning instruction
  recompiled += `\n\n### 6. Chain-of-Thought Protocol:\nBefore generating the final answer, outline your internal reasoning in a brief preliminary scratchpad to ensure zero hallucinations and maximum logical consistency.`;

  state.lastGeneratedPrompt.compiledPrompt = recompiled;
  DOM.outputTextarea.value = recompiled;
  showToast('Regenerated with Chain-of-Thought reasoning!', 'info');
}

function saveCurrentPromptToLibrary() {
  if (!state.lastGeneratedPrompt) {
    showToast('No active prompt to save!', 'error');
    return;
  }

  // Update prompt text with any manual user edits
  state.lastGeneratedPrompt.compiledPrompt = DOM.outputTextarea.value;

  // Add to beginning of array
  state.savedPrompts.unshift({ ...state.lastGeneratedPrompt });
  state.persistSavedPrompts();
  updateSavedBadgeCount();

  showToast('Prompt saved to your Saved Library!', 'success');
}

function clearOutputDeck() {
  DOM.outputTextarea.value = '';
  DOM.outputPlaceholder.classList.remove('hidden');
  DOM.outputContentWrapper.classList.add('hidden');
  DOM.editingBanner.classList.add('hidden');
  state.isEditingOutput = false;
  state.lastGeneratedPrompt = null;

  DOM.btnCopyPrompt.disabled = true;
  DOM.btnEditPrompt.disabled = true;
  DOM.btnRegeneratePrompt.disabled = true;
  DOM.btnSavePrompt.disabled = true;
  DOM.btnClearOutput.disabled = true;
  DOM.btnEditText.textContent = 'Edit Prompt';
}

function resetGeneratorForm() {
  DOM.generatorForm.reset();
  DOM.taskCharCounter.textContent = `0/${APP_CONFIG.MAX_TASK_CHARS}`;
  DOM.taskErrorMsg.textContent = '';
  DOM.inputTask.classList.remove('input-invalid');
  DOM.inputCustomTone.classList.add('hidden');
  DOM.inputCustomFormat.classList.add('hidden');
  selectCategory(state.selectedCategory);
  clearOutputDeck();
  showToast('Form reset', 'info', 1500);
}

/* ==========================================================================
   10. Prompt Improver (Heuristic Analyzer & Gemini AI Integration)
   ========================================================================== */

function initImprover() {
  // Load sample vague prompt
  DOM.btnLoadImproverSample.addEventListener('click', () => {
    DOM.inputRawPrompt.value = 'write a python script to sort users by their age and email and print it';
    showToast('Loaded example under-specified prompt', 'info', 1500);
  });

  DOM.btnClearImproverInput.addEventListener('click', () => {
    DOM.inputRawPrompt.value = '';
    DOM.improverResultsContainer.classList.add('hidden');
  });

  // Run Improver
  DOM.btnRunImprover.addEventListener('click', () => {
    runPromptImprover();
  });

  // Toggle AI Mode / Open API Settings
  DOM.btnToggleAiMode.addEventListener('click', () => {
    toggleImproverAiMode();
  });

  // Copy & Save Improved buttons
  DOM.btnCopyImproved.addEventListener('click', () => {
    copyToClipboard(DOM.displayImprovedPrompt.value, 'Improved prompt copied to clipboard!');
  });

  DOM.btnSaveImproved.addEventListener('click', () => {
    saveImprovedPromptToLibrary();
  });
}

function toggleImproverAiMode() {
  if (!state.geminiApiKey) {
    // Open API Settings Modal to enter key
    openApiModal();
    showToast('Enter your Google Gemini API key to activate live AI mode.', 'info', 3500);
    return;
  }

  state.improverAiMode = !state.improverAiMode;
  updateImproverModeUI();
}

function updateImproverModeUI() {
  if (state.improverAiMode && state.geminiApiKey) {
    DOM.improverModeText.textContent = `Engine: Google Gemini AI (${state.activeModel})`;
    DOM.improverEngineIndicator.querySelector('.dot').style.backgroundColor = 'var(--accent-pink)';
    DOM.btnAiModeText.textContent = 'Switch to Offline Rule Engine';
  } else {
    DOM.improverAiMode = false;
    DOM.improverModeText.textContent = 'Engine: Rule-Based Heuristic (Offline)';
    DOM.improverEngineIndicator.querySelector('.dot').style.backgroundColor = 'var(--accent-emerald)';
    DOM.btnAiModeText.textContent = 'Switch to Gemini AI Mode';
  }
}

/**
 * Main Improver Executor: Routes to Heuristic or Gemini API
 */
async function runPromptImprover() {
  const rawPrompt = DOM.inputRawPrompt.value.trim();

  if (!rawPrompt) {
    showToast('Please enter an unoptimized prompt to improve!', 'error');
    DOM.inputRawPrompt.focus();
    return;
  }

  // Show loading indicator
  DOM.improverLoadingState.classList.remove('hidden');
  DOM.improverResultsContainer.classList.add('hidden');

  const options = {
    injectRole: DOM.optInjectRole.checked,
    addConstraints: DOM.optAddConstraints.checked,
    enforceFormat: DOM.optEnforceFormat.checked,
    addCot: DOM.optAddCot.checked,
  };

  try {
    if (state.improverAiMode && state.geminiApiKey) {
      // Execute live Gemini API call
      DOM.improverLoadingText.textContent = `Consulting Google Gemini (${state.activeModel}) via REST API...`;
      await runGeminiPromptImprover(rawPrompt, options);
    } else {
      // Execute deterministic offline heuristic engine
      DOM.improverLoadingText.textContent = 'Analyzing prompt semantics and applying RTFC engineering rules...';
      // Simulate micro-delay for realistic UI feedback
      await new Promise(resolve => setTimeout(resolve, 350));
      runHeuristicPromptImprover(rawPrompt, options);
    }
  } catch (error) {
    console.error('Error during prompt improvement:', error);
    showToast(`Error: ${error.message}. Falling back to offline engine.`, 'error');
    runHeuristicPromptImprover(rawPrompt, options);
  } finally {
    DOM.improverLoadingState.classList.add('hidden');
  }
}

/**
 * Deterministic Rule-Based Prompt Improver (Offline, Transparent)
 */
function runHeuristicPromptImprover(raw, options) {
  const weaknesses = [];
  const improvements = [];

  const lower = raw.toLowerCase();

  // Detect Domain
  let detectedDomain = 'General Technical';
  let suggestedRole = 'Principal Specialist and Domain Expert';
  if (/python|javascript|code|script|sql|html|css|bug|function|react|algorithm/.test(lower)) {
    detectedDomain = 'Software Engineering';
    suggestedRole = 'Staff Software Architect & Code Reviewer';
  } else if (/resume|career|interview|job|linkedin|hiring/.test(lower)) {
    detectedDomain = 'Career & Recruiting';
    suggestedRole = 'Executive Technical Recruiter & Career Strategist';
  } else if (/teach|explain|learn|student|study|concept/.test(lower)) {
    detectedDomain = 'Education';
    suggestedRole = 'Senior Academic Professor & Socratic Tutor';
  } else if (/marketing|article|blog|content|write|essay/.test(lower)) {
    detectedDomain = 'Content Creation';
    suggestedRole = 'Award-Winning Editorial Director and Copywriter';
  }

  // Weakness Analysis
  if (!/(you are|act as|as an? expert)/i.test(raw)) {
    weaknesses.push('Missing explicit Persona/Role: AI will default to generic, uncalibrated responses.');
    improvements.push(`Injected authoritative Persona: "${suggestedRole}".`);
  }

  if (raw.split(/\s+/).length < 15) {
    weaknesses.push('Under-specified Context: Lacks audience level, runtime environment, and purpose.');
    improvements.push('Expanded contextual grounding and operational objectives.');
  }

  if (!/(constraint|don't|do not|never|avoid|limit|only)/i.test(raw)) {
    weaknesses.push('Missing Negative Constraints & Guardrails: Increases hallucination risk and unchecked scope.');
    improvements.push('Enforced edge-case constraints, error handling, and performance boundaries.');
  }

  if (!/(format|json|table|bullet|step|markdown|code block)/i.test(raw)) {
    weaknesses.push('Unstructured Output Specification: Output layout will be unpredictable.');
    improvements.push('Mandated clean, structured Markdown output with clear section headers.');
  }

  // Construct Improved Prompt
  const improvedSections = [];

  if (options.injectRole) {
    improvedSections.push(`### Role & Persona:\nYou are a ${suggestedRole}. Approach this task with the highest level of technical precision, industry best practices, and modern standards.`);
  }

  improvedSections.push(`### Objective & Task:\nTransform the following user request into a complete, enterprise-grade deliverable:\n"${raw}"`);

  if (options.addConstraints) {
    improvedSections.push(`### Constraints & Guardrails:\n1. Adhere to production-grade quality standards with zero unnecessary fluff.\n2. Account for common edge cases, null or invalid inputs, and error states.\n3. Avoid generic placeholder comments (e.g., "# TODO: implement later"); provide fully working solutions.\n4. Maintain a clear, authoritative, and professional tone throughout.`);
  }

  if (options.addCot) {
    improvedSections.push(`### Chain-of-Thought Protocol:\nBegin by briefly stating your architectural strategy or assumptions in a 2-sentence preface before delivering the final response.`);
  }

  if (options.enforceFormat) {
    improvedSections.push(`### Desired Output Format:\nStructure the response clearly using Markdown headings, bulleted explanations, and formatted code blocks or data tables where appropriate.`);
  }

  const improvedPrompt = improvedSections.join('\n\n');

  // Render to DOM
  renderImproverResults(raw, improvedPrompt, weaknesses, improvements, 'Template Engine (Deterministic Heuristic)');
}

/**
 * Live Google Gemini API Integration via Fetch
 */
async function runGeminiPromptImprover(raw, options) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.activeModel}:generateContent?key=${state.geminiApiKey}`;

  const systemInstruction = `You are an elite Prompt Engineering Architect specializing in the RTFC (Role, Task, Format, Constraint) framework.
Your task is to take an unoptimized user prompt and rewrite it into an enterprise-grade prompt that produces optimal results from LLMs.

Rules:
1. Always assign a world-class Persona/Role suited to the domain.
2. Formulate explicit, detailed task objectives.
3. Provide realistic edge-case constraints, boundaries, and negative rules.
4. Mandate an explicit output format (e.g. structured markdown, code with tests, JSON schema).
${options.addCot ? '5. Include a Chain-of-Thought reasoning instruction.' : ''}
Return ONLY the final, improved prompt text without meta-commentary.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nUnoptimized Prompt to Improve:\n${raw}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Gemini API Error: ${message}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!candidate) {
    throw new Error('Gemini API returned an empty response.');
  }

  const weaknesses = [
    'Vague natural language instructions lacked clear role calibration.',
    'No defensive edge-case guardrails or parameter boundaries.',
    'Under-specified formatting allowed unpredictable output layouts.'
  ];

  const improvements = [
    `Rewritten via ${state.activeModel} using advanced chain-of-thought prompt engineering.`,
    'Embedded authoritative persona and domain-specific vocabulary.',
    'Calibrated negative constraints and structured output requirements.'
  ];

  renderImproverResults(raw, candidate.trim(), weaknesses, improvements, `Google Gemini AI (${state.activeModel})`);
}

function renderImproverResults(original, improved, weaknesses, improvements, engineLabel) {
  DOM.displayOriginalPrompt.textContent = original;
  DOM.originalWordCount.textContent = `${countWords(original)} words`;

  DOM.weaknessesList.innerHTML = '';
  weaknesses.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    DOM.weaknessesList.appendChild(li);
  });

  DOM.improvedBadgeLabel.textContent = `Improved via ${engineLabel}`;
  DOM.displayImprovedPrompt.value = improved;
  DOM.improvedWordCount.textContent = `${countWords(improved)} words`;

  DOM.improvementsList.innerHTML = '';
  improvements.forEach(imp => {
    const li = document.createElement('li');
    li.textContent = imp;
    DOM.improvementsList.appendChild(li);
  });

  DOM.improverResultsContainer.classList.remove('hidden');
  showToast('Prompt successfully analyzed and improved!', 'success');
}

function saveImprovedPromptToLibrary() {
  const improvedText = DOM.displayImprovedPrompt.value;
  if (!improvedText) return;

  const item = {
    id: `pc_imp_${Date.now()}`,
    title: 'Optimized: ' + DOM.inputRawPrompt.value.trim().slice(0, 45) + '...',
    category: 'Prompt Optimization',
    categoryBadge: 'Improved',
    compiledPrompt: improvedText,
    score: 95,
    engine: state.improverAiMode ? 'gemini' : 'heuristic',
    createdAt: new Date().toISOString(),
  };

  state.savedPrompts.unshift(item);
  state.persistSavedPrompts();
  updateSavedBadgeCount();
  showToast('Optimized prompt saved to Library!', 'success');
}

/* ==========================================================================
   11. Saved Prompts Library (LocalStorage CRUD, Search & Filtering)
   ========================================================================== */

function initLibrary() {
  // Search Input
  DOM.searchSavedPrompts.addEventListener('input', () => {
    const query = DOM.searchSavedPrompts.value.trim();
    DOM.btnClearSearch.classList.toggle('hidden', query.length === 0);
    renderSavedPrompts();
  });

  DOM.btnClearSearch.addEventListener('click', () => {
    DOM.searchSavedPrompts.value = '';
    DOM.btnClearSearch.classList.add('hidden');
    renderSavedPrompts();
  });

  // Category and Sort dropdowns
  DOM.filterCategory.addEventListener('change', renderSavedPrompts);
  DOM.sortSaved.addEventListener('change', renderSavedPrompts);

  // Clear All Prompts modal trigger
  DOM.btnClearAllPrompts.addEventListener('click', () => {
    if (state.savedPrompts.length === 0) {
      showToast('No saved prompts to clear!', 'info');
      return;
    }
    openConfirmModal(
      'Are you sure you want to permanently delete ALL saved prompts? This action cannot be undone.',
      () => {
        state.savedPrompts = [];
        state.persistSavedPrompts();
        updateSavedBadgeCount();
        renderSavedPrompts();
        showToast('All saved prompts have been removed.', 'info');
      }
    );
  });

  // Export as JSON backup
  DOM.btnExportPrompts.addEventListener('click', exportPromptsAsJSON);

  // Initial Badge count
  updateSavedBadgeCount();
}

function updateSavedBadgeCount() {
  const count = state.savedPrompts.length;
  DOM.savedCountBadge.textContent = count;
}

function renderSavedPrompts() {
  const searchQuery = DOM.searchSavedPrompts.value.trim().toLowerCase();
  const categoryFilter = DOM.filterCategory.value;
  const sortCriteria = DOM.sortSaved.value;

  // Filter Prompts
  let filtered = state.savedPrompts.filter(item => {
    // Category match
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    if (!matchCat) return false;

    // Search query match
    if (!searchQuery) return true;
    const titleMatch = (item.title || '').toLowerCase().includes(searchQuery);
    const bodyMatch = (item.compiledPrompt || '').toLowerCase().includes(searchQuery);
    return titleMatch || bodyMatch;
  });

  // Sort Prompts
  filtered.sort((a, b) => {
    if (sortCriteria === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortCriteria === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortCriteria === 'score') return (b.score || 0) - (a.score || 0);
    if (sortCriteria === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  // Handle Empty State
  if (filtered.length === 0) {
    DOM.savedPromptsGrid.innerHTML = '';
    DOM.libraryEmptyState.classList.remove('hidden');
    if (state.savedPrompts.length > 0) {
      document.getElementById('empty-state-title').textContent = 'No Matching Prompts';
      document.getElementById('empty-state-desc').textContent = 'Try adjusting your search query or category filter.';
      DOM.btnEmptyGoGenerate.classList.add('hidden');
    } else {
      document.getElementById('empty-state-title').textContent = 'No Saved Prompts Found';
      document.getElementById('empty-state-desc').textContent = 'You have not saved any prompts yet. Generate a structured prompt and click "Save to Library".';
      DOM.btnEmptyGoGenerate.classList.remove('hidden');
    }
    return;
  }

  DOM.libraryEmptyState.classList.add('hidden');
  DOM.savedPromptsGrid.innerHTML = '';

  // Render Cards
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'saved-prompt-card';

    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    card.innerHTML = `
      <div class="saved-card-header">
        <h4 class="saved-card-title">${escapeHtml(item.title)}</h4>
        <span class="saved-card-badge">${escapeHtml(item.categoryBadge || item.category)}</span>
      </div>
      <div class="saved-card-meta">
        <span>${formattedDate}</span>
        <span>&bull;</span>
        <span>Strength: <strong>${item.score || 85}%</strong></span>
      </div>
      <div class="saved-card-snippet">${escapeHtml(item.compiledPrompt)}</div>
      <div class="saved-card-actions">
        <button type="button" class="btn btn-secondary btn-sm-card btn-copy-saved" data-id="${item.id}" title="Copy to clipboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy</span>
        </button>
        <button type="button" class="btn btn-ghost btn-delete-saved" data-id="${item.id}" title="Delete prompt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;color:var(--accent-rose);"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    // Copy event listener
    card.querySelector('.btn-copy-saved').addEventListener('click', () => {
      copyToClipboard(item.compiledPrompt, `Copied "${item.title}" to clipboard!`);
    });

    // Delete event listener
    card.querySelector('.btn-delete-saved').addEventListener('click', () => {
      openConfirmModal(`Delete "${item.title}" from your saved library?`, () => {
        deleteSavedPrompt(item.id);
      });
    });

    DOM.savedPromptsGrid.appendChild(card);
  });
}

function deleteSavedPrompt(id) {
  state.savedPrompts = state.savedPrompts.filter(item => item.id !== id);
  state.persistSavedPrompts();
  updateSavedBadgeCount();
  renderSavedPrompts();
  showToast('Prompt deleted', 'info', 1500);
}

function exportPromptsAsJSON() {
  if (state.savedPrompts.length === 0) {
    showToast('No saved prompts available to export!', 'error');
    return;
  }

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    application: 'PromptCraft — AI Prompt Generator & Improver',
    version: '1.0.0',
    totalPrompts: state.savedPrompts.length,
    prompts: state.savedPrompts,
  };

  const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `promptcraft_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Exported prompts as JSON backup file!', 'success');
}

/* ==========================================================================
   12. API Settings & Confirmation Modals
   ========================================================================== */

let pendingConfirmAction = null;

function initModals() {
  // API Modal Triggers
  DOM.btnApiModal.addEventListener('click', openApiModal);
  DOM.btnCloseApiModal.addEventListener('click', closeApiModal);

  // Toggle API Key visibility
  DOM.btnToggleKeyVisibility.addEventListener('click', () => {
    const isPassword = DOM.inputGeminiKey.type === 'password';
    DOM.inputGeminiKey.type = isPassword ? 'text' : 'password';
  });

  // Save API Key
  DOM.btnSaveApiKey.addEventListener('click', () => {
    const key = DOM.inputGeminiKey.value;
    const model = DOM.selectGeminiModel.value;
    state.setGeminiKey(key);
    state.setModel(model);
    updateApiStatusUI();
    closeApiModal();
    showToast('Gemini API settings saved successfully!', 'success');
  });

  // Remove API Key
  DOM.btnRemoveApiKey.addEventListener('click', () => {
    DOM.inputGeminiKey.value = '';
    state.setGeminiKey('');
    updateApiStatusUI();
    closeApiModal();
    showToast('API Key removed. Switched to offline mode.', 'info');
  });

  // Confirmation Modal
  DOM.btnCloseConfirmModal.addEventListener('click', closeConfirmModal);
  DOM.btnConfirmCancel.addEventListener('click', closeConfirmModal);
  DOM.btnConfirmProceed.addEventListener('click', () => {
    if (typeof pendingConfirmAction === 'function') {
      pendingConfirmAction();
    }
    closeConfirmModal();
  });

  // Close modals on clicking backdrop or ESC key
  [DOM.modalApiSettings, DOM.modalConfirm].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeApiModal();
        closeConfirmModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeApiModal();
      closeConfirmModal();
    }
  });

  // Sync initial API status UI
  updateApiStatusUI();
}

function openApiModal() {
  DOM.inputGeminiKey.value = state.geminiApiKey;
  DOM.selectGeminiModel.value = state.activeModel;
  DOM.modalApiSettings.classList.remove('hidden');
}

function closeApiModal() {
  DOM.modalApiSettings.classList.add('hidden');
}

function updateApiStatusUI() {
  const hasKey = Boolean(state.geminiApiKey);

  if (hasKey) {
    DOM.headerApiStatus.style.backgroundColor = 'var(--accent-pink)';
    DOM.headerApiStatus.style.boxShadow = '0 0 6px var(--accent-pink)';
    DOM.headerApiStatus.title = `API Status: Online (${state.activeModel})`;
    DOM.footerApiStatus.textContent = `Gemini Online (${state.activeModel})`;
    DOM.modalStatusDot.style.backgroundColor = 'var(--accent-pink)';
    DOM.modalStatusText.textContent = `Status: Active (${state.activeModel})`;
  } else {
    DOM.headerApiStatus.style.backgroundColor = 'var(--accent-emerald)';
    DOM.headerApiStatus.style.boxShadow = '0 0 6px var(--accent-emerald)';
    DOM.headerApiStatus.title = 'API Status: Offline Template Engine';
    DOM.footerApiStatus.textContent = 'Offline Template & Heuristic Engine';
    DOM.modalStatusDot.style.backgroundColor = 'var(--accent-emerald)';
    DOM.modalStatusText.textContent = 'Status: Offline Template Engine Active (No API Key Required)';
  }

  updateImproverModeUI();
}

function openConfirmModal(message, onConfirm) {
  DOM.modalConfirmMsg.textContent = message;
  pendingConfirmAction = onConfirm;
  DOM.modalConfirm.classList.remove('hidden');
}

function closeConfirmModal() {
  DOM.modalConfirm.classList.add('hidden');
  pendingConfirmAction = null;
}

/* ==========================================================================
   13. Application Bootstrap Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCategories();
  initGeneratorActions();
  initImprover();
  initLibrary();
  initModals();

  console.log('🚀 PromptCraft initialized successfully. Zero external runtime dependencies.');
});
