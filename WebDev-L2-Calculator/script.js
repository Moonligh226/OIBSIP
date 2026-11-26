/**
 * LIQUID GLASS CALCULATOR — OASIS INFOBYTE LEVEL 2 (TASK 1)
 * Moteur arithmétique 64-bit, constantes scientifiques, thèmes dynamiques,
 * effets 3D Tilt, Ripple fluide et Audio haptique Web Audio API.
 */

class LiquidCalculator {
    constructor() {
        // Éléments du DOM
        this.primaryDisplay = document.getElementById('primaryDisplay');
        this.equationDisplay = document.getElementById('equationDisplay');
        this.calculatorCard = document.getElementById('calculatorCard');
        this.glassGlare = document.getElementById('glassGlare');
        this.keys = document.querySelectorAll('.key');
        
        // Contrôles supérieurs & Historique
        this.soundToggleBtn = document.getElementById('soundToggleBtn');
        this.historyToggleBtn = document.getElementById('historyToggleBtn');
        this.historyDrawer = document.getElementById('historyDrawer');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.historyList = document.getElementById('historyList');
        this.copyResultBtn = document.getElementById('copyResultBtn');

        // Constantes, touches scientifiques, thèmes et langue
        this.constantPills = document.querySelectorAll('.constant-pill');
        this.scientificButtons = document.querySelectorAll('.sci-btn');
        this.themeDots = document.querySelectorAll('.theme-dot');
        this.langButtons = document.querySelectorAll('.lang-btn');

        // État de calcul
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetScreen = false;
        this.lastEquation = '';
        this.history = JSON.parse(localStorage.getItem('oibsip_calc_history') || '[]');

        // Configuration Audio & Préférences
        this.soundEnabled = localStorage.getItem('oibsip_calc_sound') !== 'false';
        this.currentTheme = localStorage.getItem('oibsip_calc_theme') || 'aurora';
        this.currentLang = localStorage.getItem('oibsip_calc_lang') || 'fr';
        this.audioCtx = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTiltEffect();
        this.setupSoundState();
        this.setupTheme();
        this.setupLanguage();
        this.renderHistory();
        this.updateDisplay();
    }

    /* ==========================================================================
       GESTION DES ÉVÉNEMENTS
       ========================================================================== */
    setupEventListeners() {
        // Touches principales de la calculatrice
        this.keys.forEach(key => {
            key.addEventListener('click', (e) => {
                this.createRipple(e, key);
                this.handleKeyInput(key);
            });
        });

        // Touches de la barre scientifique d'appoint
        this.scientificButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRipple(e, btn);
                const action = btn.dataset.sci;
                this.executeScientificAction(action);
            });
        });

        // Dock de constantes scientifiques
        this.constantPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const val = pill.dataset.value;
                this.injectConstant(val);
            });
        });

        // Sélecteur de thèmes d'ambiance
        this.themeDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const theme = dot.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Sélecteur de langue (FR / EN)
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLanguage(btn.dataset.lang);
            });
        });

        // Mise en évidence douce lors de la navigation par ancres du footer
        document.querySelectorAll('.footer-links a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (!targetEl) return;

                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

                const highlightTargets = targetId === 'comfortSection'
                    ? targetEl.querySelectorAll('.comfort-card')
                    : targetId === 'calculatorSection'
                        ? [this.calculatorCard]
                        : [targetEl];

                highlightTargets.forEach(el => {
                    el.classList.add('nav-highlight');
                    setTimeout(() => el.classList.remove('nav-highlight'), 1100);
                });
            });
        });

        // Raccourcis clavier physiques
        window.addEventListener('keydown', (e) => this.handleKeyboardInput(e));

        // Bouton Son & Copie
        this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
        if (this.copyResultBtn) {
            this.copyResultBtn.addEventListener('click', () => this.copyResult());
        }

        // Tiroir Historique
        this.historyToggleBtn.addEventListener('click', () => this.toggleHistory(true));
        this.closeHistoryBtn.addEventListener('click', () => this.toggleHistory(false));
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Fermeture automatique de l'historique lors d'un clic en dehors
        document.addEventListener('click', (e) => {
            if (this.historyDrawer.classList.contains('open') &&
                !this.historyDrawer.contains(e.target) &&
                !this.historyToggleBtn.contains(e.target)) {
                this.toggleHistory(false);
            }
        });
    }

    /* ==========================================================================
       GESTION DU THÈME D'AMBIANCE DYNAMIQUE
       ========================================================================== */
    setupTheme() {
        this.setTheme(this.currentTheme);
    }

    setTheme(themeName) {
        this.currentTheme = themeName;
        document.documentElement.dataset.theme = themeName;
        localStorage.setItem('oibsip_calc_theme', themeName);

        this.themeDots.forEach(dot => {
            if (dot.dataset.theme === themeName) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        this.playSound('operator');
    }

    /* ==========================================================================
       GESTION DE LA LANGUE (FR / EN)
       ========================================================================== */
    setupLanguage() {
        this.setLanguage(this.currentLang, false);
    }

    setLanguage(lang, playFeedback = true) {
        const translations = {
            fr: {
                page_title: 'CALIBRE — Calculatrice',
                theme_label: 'Ambiance',
                project_ref: 'OIBSIP · N2 / T1',
                hero_eyebrow: 'Calculatrice de bureau',
                hero_title_1: 'Précise, rapide,',
                hero_title_2: 'sans encombre.',
                hero_desc: 'Un outil de calcul pensé pour être agréable au quotidien : lisible au premier coup d\'œil, pilotable entièrement au clavier et avec vos constantes usuelles à portée de clic.',
                constants_title: 'Constantes usuelles',
                constants_hint: 'Cliquer pour insérer',
                shortcuts_title: 'Raccourcis clavier',
                shortcuts_hint: 'Pavé numérique ou clavier',
                sc_calc: 'Calculer le résultat',
                sc_calc_key: 'Entrée / =',
                sc_clear: 'Remettre à zéro',
                sc_clear_key: 'Échap',
                sc_del: 'Effacer le dernier chiffre',
                sc_del_key: '⌫ Retour',
                sc_pct: 'Pourcentage',
                sc_dec: 'Virgule décimale',
                sc_dec_key: '. ou ,',
                model_label: 'MODÈLE C-01',
                copy_btn: 'Copier',
                history_title: 'Historique',
                history_clear: 'Vider',
                history_empty_title: 'Aucun calcul enregistré',
                history_empty_sub: 'Vos dernières opérations apparaîtront ici.',
                comfort_eyebrow: 'Pensé pour l\'usage',
                comfort_heading: 'Ce qui change vraiment quand on s\'en sert',
                c1_title: 'Tout passe par le clavier',
                c1_text: 'Tapez vos opérations directement au pavé numérique, validez avec Entrée, corrigez avec Retour ou repartez de zéro avec Échap sans toucher à la souris.',
                c2_title: 'Vos calculs restent en mémoire',
                c2_text: 'Besoin de vérifier un montant tapé il y a cinq minutes ? Ouvrez l\'historique, cliquez sur le résultat et reprenez votre calcul là où vous l\'aviez laissé.',
                c3_title: 'Lisible et discret',
                c3_text: 'Chiffres alignés, copie du résultat en un clic, quatre ambiances de couleur selon votre humeur et un léger clic sonore désactivable à tout moment.',
                footer_desc: 'Calculatrice web réalisée dans le cadre du programme de stage Oasis Infobyte (OIBSIP — Développement Web, Niveau 2 · Tâche 1).',
                footer_nav: 'Navigation',
                nav_calc: 'Calculatrice',
                nav_const: 'Constantes usuelles',
                nav_comfort: 'Confort d\'usage',
                footer_proj: 'Projet',
                footer_repo: 'Dépôt GitHub (OIBSIP)',
                footer_profile: 'Profil @Moonligh226',
                footer_program: 'Programme Oasis Infobyte'
            },
            en: {
                page_title: 'CALIBRE — Calculator',
                theme_label: 'Theme',
                project_ref: 'OIBSIP · L2 / T1',
                hero_eyebrow: 'Desktop calculator',
                hero_title_1: 'Accurate, fast,',
                hero_title_2: 'uncluttered.',
                hero_desc: 'A calculator built for everyday use: easy to read at a glance, fully keyboard-driven, with your everyday constants one click away.',
                constants_title: 'Common constants',
                constants_hint: 'Click to insert',
                shortcuts_title: 'Keyboard shortcuts',
                shortcuts_hint: 'Numpad or keyboard',
                sc_calc: 'Calculate result',
                sc_calc_key: 'Enter / =',
                sc_clear: 'Clear all',
                sc_clear_key: 'Esc',
                sc_del: 'Delete last digit',
                sc_del_key: '⌫ Backspace',
                sc_pct: 'Percentage',
                sc_dec: 'Decimal point',
                sc_dec_key: '. or ,',
                model_label: 'MODEL C-01',
                copy_btn: 'Copy',
                history_title: 'History',
                history_clear: 'Clear',
                history_empty_title: 'No calculations yet',
                history_empty_sub: 'Your recent operations will appear here.',
                comfort_eyebrow: 'Built for daily use',
                comfort_heading: 'What actually matters when you use it',
                c1_title: 'Full keyboard control',
                c1_text: 'Type directly on your numpad, press Enter to compute, Backspace to fix a digit, or Esc to clear — without reaching for the mouse.',
                c2_title: 'Your history stays handy',
                c2_text: 'Need to double-check a number from five minutes ago? Open the history drawer, click any past result, and pick up right where you left off.',
                c3_title: 'Clear and unobtrusive',
                c3_text: 'Aligned digits, one-click result copy, four color themes to match your setup, and a subtle key click you can mute anytime.',
                footer_desc: 'Web calculator built for the Oasis Infobyte Internship Program (OIBSIP — Web Development, Level 2 · Task 1).',
                footer_nav: 'Navigation',
                nav_calc: 'Calculator',
                nav_const: 'Common constants',
                nav_comfort: 'Daily comfort',
                footer_proj: 'Project',
                footer_repo: 'GitHub Repository (OIBSIP)',
                footer_profile: '@Moonligh226 Profile',
                footer_program: 'Oasis Infobyte Program'
            }
        };

        const dict = translations[lang] || translations.fr;
        this.currentLang = lang === 'en' ? 'en' : 'fr';
        document.documentElement.lang = this.currentLang;
        document.title = dict.page_title;
        localStorage.setItem('oibsip_calc_lang', this.currentLang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        this.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });

        if (playFeedback) {
            this.playSound('number');
        }
    }

    /* ==========================================================================
       INJECTION DE CONSTANTES & FONCTIONS SCIENTIFIQUES
       ========================================================================== */
    injectConstant(value) {
        this.currentValue = value;
        this.shouldResetScreen = false;
        this.updateDisplay();
        this.playSound('equals');
    }

    executeScientificAction(action) {
        const current = parseFloat(this.currentValue);
        if (isNaN(current)) return;

        let result = 0;
        let equationLabel = '';

        switch (action) {
            case 'sqrt':
                if (current < 0) {
                    this.triggerErrorAnimation("Racine impossible");
                    return;
                }
                result = Math.sqrt(current);
                equationLabel = `√(${this.currentValue})`;
                break;

            case 'square':
                result = current * current;
                equationLabel = `sqr(${this.currentValue})`;
                break;

            case 'inverse':
                if (current === 0) {
                    this.triggerErrorAnimation("Division par 0");
                    return;
                }
                result = 1 / current;
                equationLabel = `1/(${this.currentValue})`;
                break;

            case 'random':
                result = Math.round(Math.random() * 10000) / 10000;
                equationLabel = `rand()`;
                break;
        }

        const formatted = this.formatNumber(result);
        this.addHistoryItem(equationLabel, formatted);
        this.lastEquation = `${equationLabel} =`;
        this.currentValue = formatted;
        this.shouldResetScreen = true;
        this.updateDisplay();
        this.playSound('operator');
    }

    /* ==========================================================================
       LOGIQUE D'ENTRÉE CLAVIER & BOUTONS
       ========================================================================== */
    handleKeyInput(keyElement) {
        const number = keyElement.dataset.number;
        const operator = keyElement.dataset.operator;
        const action = keyElement.dataset.action;

        if (number !== undefined) {
            this.appendNumber(number);
            this.playSound('number');
        } else if (operator !== undefined) {
            this.setOperator(operator);
            this.playSound('operator');
        } else if (action !== undefined) {
            this.executeAction(action);
        }
    }

    handleKeyboardInput(e) {
        if (['/', '*', '+', '-', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
            e.preventDefault();
        }

        let targetKey = null;

        if (!isNaN(e.key) && e.key !== ' ') {
            targetKey = document.querySelector(`.key[data-number="${e.key}"]`);
            this.appendNumber(e.key);
            this.playSound('number');
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            targetKey = document.querySelector(`.key[data-operator="${e.key}"]`);
            this.setOperator(e.key);
            this.playSound('operator');
        } else if (e.key === 'Enter' || e.key === '=') {
            targetKey = document.querySelector(`.key[data-action="calculate"]`);
            this.executeAction('calculate');
        } else if (e.key === 'Backspace') {
            targetKey = document.querySelector(`.key[data-action="delete"]`);
            this.executeAction('delete');
        } else if (e.key === 'Escape') {
            targetKey = document.querySelector(`.key[data-action="all-clear"]`);
            this.executeAction('all-clear');
        } else if (e.key === '.' || e.key === ',') {
            targetKey = document.querySelector(`.key[data-action="decimal"]`);
            this.executeAction('decimal');
        } else if (e.key === '%') {
            targetKey = document.querySelector(`.key[data-action="percent"]`);
            this.executeAction('percent');
        }

        if (targetKey) {
            targetKey.classList.add('keyboard-active');
            setTimeout(() => targetKey.classList.remove('keyboard-active'), 180);
        }
    }

    executeAction(action) {
        switch (action) {
            case 'all-clear':
                this.allClear();
                this.playSound('clear');
                break;
            case 'delete':
                this.deleteDigit();
                this.playSound('delete');
                break;
            case 'decimal':
                this.appendDecimal();
                this.playSound('number');
                break;
            case 'negate':
                this.toggleNegate();
                this.playSound('operator');
                break;
            case 'percent':
                this.calculatePercent();
                this.playSound('operator');
                break;
            case 'calculate':
                this.calculateResult();
                this.playSound('equals');
                break;
        }
    }

    /* ==========================================================================
       MOTEUR DE CALCUL MATHÉMATIQUE
       ========================================================================== */
    appendNumber(number) {
        if (this.currentValue === '0' || this.shouldResetScreen) {
            this.currentValue = number;
            this.shouldResetScreen = false;
        } else {
            if (this.currentValue.replace(/[^0-9]/g, '').length >= 15) return;
            this.currentValue += number;
        }
        this.updateDisplay();
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentValue = '0.';
            this.shouldResetScreen = false;
            this.updateDisplay();
            return;
        }
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
            this.updateDisplay();
        }
    }

    deleteDigit() {
        if (this.shouldResetScreen) return;
        if (this.currentValue.length === 1 || (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
            this.currentValue = '0';
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        this.updateDisplay();
    }

    toggleNegate() {
        if (this.currentValue === '0') return;
        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.substring(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }
        this.updateDisplay();
    }

    calculatePercent() {
        const val = parseFloat(this.currentValue);
        if (isNaN(val)) return;

        let result;
        if (this.previousValue !== null && this.operator) {
            const prev = parseFloat(this.previousValue);
            result = (prev * val) / 100;
        } else {
            result = val / 100;
        }
        this.currentValue = this.formatNumber(result);
        this.updateDisplay();
    }

    setOperator(op) {
        if (this.operator !== null && !this.shouldResetScreen) {
            this.calculateResult(false);
        }

        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetScreen = true;
        this.highlightActiveOperator();
        this.updateDisplay();
    }

    calculateResult(recordHistory = true) {
        if (this.operator === null || this.previousValue === null) return;

        const prev = parseFloat(this.previousValue);
        const curr = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(curr)) return;

        if (this.operator === '/' && curr === 0) {
            this.triggerErrorAnimation("Division impossible");
            return;
        }

        let result;
        switch (this.operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/': result = prev / curr; break;
            default: return;
        }

        const formattedResult = this.formatNumber(result);
        const operatorSymbol = this.getOperatorSymbol(this.operator);
        const equationText = `${this.previousValue} ${operatorSymbol} ${this.currentValue}`;

        if (recordHistory) {
            this.addHistoryItem(equationText, formattedResult);
            this.lastEquation = `${equationText} =`;
            this.operator = null;
            this.previousValue = null;
        } else {
            this.lastEquation = `${formattedResult} ${this.getOperatorSymbol(this.operator)}`;
            this.previousValue = formattedResult;
        }

        this.currentValue = formattedResult;
        this.shouldResetScreen = true;
        this.highlightActiveOperator();
        this.updateDisplay();
    }

    allClear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetScreen = false;
        this.lastEquation = '';
        this.highlightActiveOperator();
        this.updateDisplay();
    }

    formatNumber(num) {
        const precision = 1e12;
        const rounded = Math.round((num + Number.EPSILON) * precision) / precision;
        return rounded.toString();
    }

    getOperatorSymbol(op) {
        switch (op) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return op;
        }
    }

    highlightActiveOperator() {
        document.querySelectorAll('.key.operator').forEach(btn => {
            if (this.operator && btn.dataset.operator === this.operator && this.shouldResetScreen) {
                btn.classList.add('operator-active');
            } else {
                btn.classList.remove('operator-active');
            }
        });
    }

    triggerErrorAnimation(message) {
        this.currentValue = message;
        this.primaryDisplay.classList.add('shake-error');
        this.updateDisplay();

        setTimeout(() => {
            this.primaryDisplay.classList.remove('shake-error');
            this.allClear();
        }, 1200);
    }

    /* ==========================================================================
       AFFICHAGE & TAILLE DE POLICE AUTO-AJUSTÉE
       ========================================================================== */
    updateDisplay() {
        this.primaryDisplay.textContent = this.currentValue;

        if (this.previousValue !== null && this.operator !== null) {
            this.equationDisplay.textContent = `${this.previousValue} ${this.getOperatorSymbol(this.operator)}`;
        } else if (this.lastEquation) {
            this.equationDisplay.textContent = this.lastEquation;
        } else {
            this.equationDisplay.textContent = '';
        }

        const len = this.currentValue.length;
        if (len > 12) {
            this.primaryDisplay.style.fontSize = '1.75rem';
        } else if (len > 8) {
            this.primaryDisplay.style.fontSize = '2.2rem';
        } else {
            this.primaryDisplay.style.fontSize = '2.75rem';
        }
    }

    /* ==========================================================================
       HISTORIQUE DES CALCULS (LOCALSTORAGE)
       ========================================================================== */
    addHistoryItem(equation, result) {
        const item = { equation, result, timestamp: Date.now() };
        this.history.unshift(item);
        if (this.history.length > 20) this.history.pop();
        localStorage.setItem('oibsip_calc_history', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        if (!this.historyList) return;

        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-history">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 14 14"></polyline>
                    </svg>
                    <p>Aucun calcul pour le moment</p>
                    <span>Vos opérations s'afficheront ici.</span>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = '';
        this.history.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'history-item';
            card.innerHTML = `
                <div class="history-equation">${item.equation} =</div>
                <div class="history-result">${item.result}</div>
            `;
            card.addEventListener('click', () => {
                this.currentValue = item.result;
                this.shouldResetScreen = false;
                this.updateDisplay();
                this.toggleHistory(false);
            });
            this.historyList.appendChild(card);
        });
    }

    toggleHistory(open) {
        if (open) {
            this.historyDrawer.classList.add('open');
            this.historyDrawer.setAttribute('aria-hidden', 'false');
            this.historyToggleBtn.classList.add('active');
            this.closeHistoryBtn.focus();
        } else {
            this.historyDrawer.classList.remove('open');
            this.historyDrawer.setAttribute('aria-hidden', 'true');
            this.historyToggleBtn.classList.remove('active');
            this.historyToggleBtn.focus();
        }
    }

    async copyResult() {
        if (!this.copyResultBtn) return;
        try {
            await navigator.clipboard.writeText(this.currentValue);
            const iconCopy = this.copyResultBtn.querySelector('.icon-copy');
            const iconCheck = this.copyResultBtn.querySelector('.icon-check');
            const label = this.copyResultBtn.querySelector('.copy-label');

            this.copyResultBtn.classList.add('copied');
            if (iconCopy) iconCopy.classList.add('hidden');
            if (iconCheck) iconCheck.classList.remove('hidden');
            if (label) label.textContent = this.currentLang === 'en' ? 'Copied' : 'Copié';
            this.playSound('operator');

            clearTimeout(this.copyTimeout);
            this.copyTimeout = setTimeout(() => {
                this.copyResultBtn.classList.remove('copied');
                if (iconCopy) iconCopy.classList.remove('hidden');
                if (iconCheck) iconCheck.classList.add('hidden');
                if (label) label.textContent = this.currentLang === 'en' ? 'Copy' : 'Copier';
            }, 1800);
        } catch (err) {
            // Silencieux si le presse-papier n'est pas disponible
        }
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('oibsip_calc_history');
        this.renderHistory();
        this.playSound('delete');
    }

    /* ==========================================================================
       EFFET 3D TILT & POINT LUMINEUX DYNAMIQUE
       ========================================================================== */
    setupTiltEffect() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const card = this.calculatorCard;
        const maxTilt = 8;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            card.style.setProperty('--glare-x', `${(x / rect.width * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${(y / rect.height * 100).toFixed(1)}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            card.style.setProperty('--glare-x', '50%');
            card.style.setProperty('--glare-y', '20%');
        });
    }

    /* ==========================================================================
       EFFET D'ONDE FLUIDE (RIPPLE EFFECT)
       ========================================================================== */
    createRipple(event, button) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
        const y = event.clientY ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    /* ==========================================================================
       SYNTHÈSE AUDIO HAPTIQUE (WEB AUDIO API)
       ========================================================================== */
    setupSoundState() {
        this.updateSoundButtonUI();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('oibsip_calc_sound', this.soundEnabled);
        this.updateSoundButtonUI();
        if (this.soundEnabled) this.playSound('number');
    }

    updateSoundButtonUI() {
        const soundOnIcon = this.soundToggleBtn.querySelector('.sound-on');
        const soundOffIcon = this.soundToggleBtn.querySelector('.sound-off');

        if (this.soundEnabled) {
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
            this.soundToggleBtn.classList.remove('active');
        } else {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
            this.soundToggleBtn.classList.add('active');
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        try {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            const now = this.audioCtx.currentTime;

            switch (type) {
                case 'number':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(820, now);
                    osc.frequency.exponentialRampToValueAtTime(540, now + 0.05);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;

                case 'operator':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(1050, now);
                    osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    osc.start(now);
                    osc.stop(now + 0.06);
                    break;

                case 'equals':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(900, now);
                    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.12);
                    gain.gain.setValueAtTime(0.07, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;

                case 'clear':
                case 'delete':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(480, now);
                    osc.frequency.exponentialRampToValueAtTime(280, now + 0.07);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
                    osc.start(now);
                    osc.stop(now + 0.07);
                    break;
            }
        } catch (err) {
            // Silencieux
        }
    }
}

// Initialisation au chargement du document
document.addEventListener('DOMContentLoaded', () => {
    new LiquidCalculator();
});
