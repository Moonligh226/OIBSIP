// ============================================================
// 1. LOCALIZATION DICTIONARY (FR / EN)
// ============================================================
const translations = {
    fr: {
        nav_converter: "Convertisseur",
        nav_benchmarks: "Points de Repère",
        nav_formulas: "Formules",
        hero_tag: "Convertisseur de Température Haute Précision",
        hero_title_part1: "Chaque degré compte.",
        hero_title_part2: "Conversion instantanée & précise.",
        hero_subtitle: "Convertissez facilement vos mesures entre Celsius, Fahrenheit et Kelvin avec détection du zéro absolu et visualisation thermique.",
        pill_freeze: "0 °C (Fusion de l'eau)",
        pill_body: "37 °C (Corps humain)",
        pill_boil: "100 °C (Ébullition)",
        card_caption: "Calculateur en direct",
        label_temp: "Température",
        placeholder_temp: "Ex: 21.5",
        label_unit: "Échelle source",
        btn_calc: "Convertir",
        btn_reset: "Effacer",
        results_heading: "Échelles équivalentes calculées",
        desc_metric: "Système Métrique",
        desc_imperial: "Système Impérial",
        desc_si: "Système International",
        gauge_label: "Niveau thermique",
        benchmarks_sub: "Physique & Sciences",
        benchmarks_title: "Points de repère fondamentaux",
        benchmarks_desc: "Cliquez sur une carte pour charger instantanément sa valeur dans le convertisseur",
        card_zero_title: "Zéro Absolu",
        card_zero_desc: "La température la plus basse possible de l'univers où tout mouvement moléculaire s'arrête.",
        card_ice_title: "Point de Fusion",
        card_ice_desc: "Transition de l'eau pure de l'état solide (glace) vers l'état liquide sous 1 atmosphère.",
        card_body_title: "Corps Humain",
        card_body_desc: "Température corporelle moyenne d'un adulte en bonne santé régulée par le corps.",
        card_boil_title: "Ébullition de l'eau",
        card_boil_desc: "Vaporisation de l'eau liquide sous pression atmosphérique standard au niveau de la mer.",
        card_hint: "Tester cette valeur →",
        formulas_sub: "Sciences & Algorithmes",
        formulas_title: "Formules Mathématiques Appliquées",
        formulas_desc: "Les formules scientifiques exactes programmées dans le code JavaScript",
        footer_desc: "Projet officiel conçu et développé pour le stage Oasis Infobyte (OIBSIP) — Filière Web Development & Designing.",
        footer_nav: "Navigation",
        footer_intern: "Informations Stagiaire",
        error_empty: "Veuillez saisir une valeur numérique de température.",
        error_nan: "Valeur invalide. Seuls les chiffres et décimales sont autorisés.",
        error_zero: "Impossible : la température est inférieure au zéro absolu",
        gauge_subzero: "Glacial (Négatif)",
        gauge_cold: "Frais",
        gauge_mild: "Tempéré (Ambiant)",
        gauge_warm: "Chaud",
        gauge_hot: "Extrême (Ébullition)",
        lang_btn_text: "EN"
    },
    en: {
        nav_converter: "Converter",
        nav_benchmarks: "Benchmarks",
        nav_formulas: "Formulas",
        hero_tag: "High-Precision Temperature Converter",
        hero_title_part1: "Every degree matters.",
        hero_title_part2: "Instant & Accurate Conversion.",
        hero_subtitle: "Effortlessly convert temperature values between Celsius, Fahrenheit, and Kelvin with absolute zero validation and thermal visualizer.",
        pill_freeze: "0 °C (Freezing Point)",
        pill_body: "37 °C (Human Body)",
        pill_boil: "100 °C (Boiling Point)",
        card_caption: "Live Calculator",
        label_temp: "Temperature",
        placeholder_temp: "Ex: 70.7",
        label_unit: "Source Scale",
        btn_calc: "Convert",
        btn_reset: "Clear",
        results_heading: "Calculated equivalent scales",
        desc_metric: "Metric System",
        desc_imperial: "Imperial System",
        desc_si: "International System (SI)",
        gauge_label: "Thermal level",
        benchmarks_sub: "Physics & Science",
        benchmarks_title: "Fundamental Benchmarks",
        benchmarks_desc: "Click on any benchmark card to immediately load its value into the converter",
        card_zero_title: "Absolute Zero",
        card_zero_desc: "The lowest possible physical temperature in the universe where all molecular motion ceases.",
        card_ice_title: "Freezing Point",
        card_ice_desc: "Transition of pure water from solid (ice) to liquid state under 1 atmosphere.",
        card_body_title: "Human Body",
        card_body_desc: "Normal core body temperature of a resting human adult regulated by homeostasis.",
        card_boil_title: "Boiling Point",
        card_boil_desc: "Vaporization of liquid water under standard atmospheric pressure at sea level.",
        card_hint: "Test this value →",
        formulas_sub: "Science & Algorithms",
        formulas_title: "Applied Mathematical Formulas",
        formulas_desc: "The exact scientific formulas programmed into the JavaScript code",
        footer_desc: "Official project engineered for the Oasis Infobyte (OIBSIP) Internship — Web Development & Designing Track.",
        footer_nav: "Navigation",
        footer_intern: "Intern Details",
        error_empty: "Please enter a numeric temperature value.",
        error_nan: "Invalid input. Only numeric digits and decimals are allowed.",
        error_zero: "Impossible: temperature cannot be below absolute zero",
        gauge_subzero: "Sub-Zero",
        gauge_cold: "Cool",
        gauge_mild: "Ambient (Room)",
        gauge_warm: "Warm",
        gauge_hot: "Extreme (Boiling)",
        lang_btn_text: "FR"
    }
};

// ============================================================
// 2. DOM ELEMENT SELECTION
// ============================================================
// Input fields and triggers
const tempInput = document.getElementById('temperature-input');
const unitSelect = document.getElementById('unit-select');
const unitSymbolIndicator = document.getElementById('unit-symbol-indicator');
const btnConvert = document.getElementById('btn-convert');
const btnReset = document.getElementById('btn-reset');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const resultsContainer = document.getElementById('results-container');

// Navbar controls
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langDisplay = document.getElementById('lang-display');

// Thermal level gauge components
const gaugeContainer = document.getElementById('gauge-container');
const gaugeFill = document.getElementById('gauge-fill');
const gaugeStatus = document.getElementById('gauge-status');

// Display targets for converted values
const valCelsius = document.getElementById('val-celsius');
const valFahrenheit = document.getElementById('val-fahrenheit');
const valKelvin = document.getElementById('val-kelvin');

// Target card boxes for active state styling
const boxCelsius = document.getElementById('box-celsius');
const boxFahrenheit = document.getElementById('box-fahrenheit');
const boxKelvin = document.getElementById('box-kelvin');

// Interactive cards and preset chips
const benchmarkCards = document.querySelectorAll('.benchmark-card');
const quickPills = document.querySelectorAll('.pill-chip');
const revealElements = document.querySelectorAll('.reveal');

// Physical lower bounds (Absolute Zero)
const ABSOLUTE_ZERO = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0
};

// ============================================================
// 3. THEME TOGGLE (DARK / LIGHT MODE WITH PERSISTENCE)
// ============================================================
function initTheme() {
    // Default to dark theme for modern presentation, check localStorage first
    const savedTheme = localStorage.getItem('oibsip_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('oibsip_theme', newTheme);
}

themeToggleBtn.addEventListener('click', toggleTheme);
initTheme();

// ============================================================
// 4. LANGUAGE SWITCHER (i18n ENGINE)
// ============================================================
let currentLang = localStorage.getItem('oibsip_lang') || 'fr';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('oibsip_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Swap text for all elements marked with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update input placeholder and toggle button label
    tempInput.setAttribute('placeholder', translations[lang].placeholder_temp);
    langDisplay.textContent = translations[lang].lang_btn_text;

    // Refresh active conversion result if already visible
    if (!resultsContainer.classList.contains('hidden') && tempInput.value.trim() !== '') {
        convertTemperature();
    }
}

function toggleLanguage() {
    const nextLang = currentLang === 'fr' ? 'en' : 'fr';
    setLanguage(nextLang);
}

langToggleBtn.addEventListener('click', toggleLanguage);
setLanguage(currentLang);

// ============================================================
// 5. HELPER FUNCTIONS
// ============================================================
function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    gaugeContainer.classList.add('hidden');
}

function clearError() {
    errorText.textContent = '';
    errorMessage.classList.add('hidden');
}

// Format numbers cleanly: keep whole integers clean, round floats to 2 decimal places
function formatNumber(num) {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}

// Update the symbol hint inside the temperature input
function updateUnitIndicator() {
    const unit = unitSelect.value;
    if (unit === 'celsius') unitSymbolIndicator.textContent = '°C';
    else if (unit === 'fahrenheit') unitSymbolIndicator.textContent = '°F';
    else if (unit === 'kelvin') unitSymbolIndicator.textContent = 'K';
}

// ============================================================
// 6. THERMAL GAUGE LOGIC
// ============================================================
function updateThermalGauge(celsiusValue) {
    gaugeContainer.classList.remove('hidden');

    // Map temperature between -50°C and 150°C to percentage
    const minRange = -50;
    const maxRange = 150;
    let percentage = ((celsiusValue - minRange) / (maxRange - minRange)) * 100;
    percentage = Math.max(5, Math.min(100, percentage)); // Clamp between 5% and 100%

    gaugeFill.style.width = `${percentage}%`;

    const dict = translations[currentLang];

    // Color and status label based on temperature bracket
    if (celsiusValue < 0) {
        gaugeStatus.textContent = dict.gauge_subzero;
        gaugeStatus.style.color = 'var(--cyan-ice)';
    } else if (celsiusValue <= 15) {
        gaugeStatus.textContent = dict.gauge_cold;
        gaugeStatus.style.color = '#38bdf8';
    } else if (celsiusValue <= 25) {
        gaugeStatus.textContent = dict.gauge_mild;
        gaugeStatus.style.color = 'var(--emerald-life)';
    } else if (celsiusValue <= 50) {
        gaugeStatus.textContent = dict.gauge_warm;
        gaugeStatus.style.color = 'var(--amber-warm)';
    } else {
        gaugeStatus.textContent = dict.gauge_hot;
        gaugeStatus.style.color = 'var(--rose-heat)';
    }
}

// ============================================================
// 7. CORE CONVERSION CALCULATION
// ============================================================
function convertTemperature() {
    clearError();
    const dict = translations[currentLang];

    const rawValue = tempInput.value.trim();
    const selectedUnit = unitSelect.value;

    // Check for empty input
    if (rawValue === '') {
        showError(dict.error_empty);
        tempInput.focus();
        return;
    }

    // Parse string to float
    const temp = parseFloat(rawValue);

    // Validate valid number
    if (isNaN(temp)) {
        showError(dict.error_nan);
        return;
    }

    // Physical constraint: reject inputs below absolute zero
    if (temp < ABSOLUTE_ZERO[selectedUnit]) {
        const unitSymbol = selectedUnit === 'kelvin' ? 'K' : '°' + selectedUnit.charAt(0).toUpperCase();
        showError(`${dict.error_zero} (${ABSOLUTE_ZERO[selectedUnit]} ${unitSymbol}).`);
        return;
    }

    let c, f, k;

    // Apply exact conversion formulas
    switch (selectedUnit) {
        case 'celsius':
            c = temp;
            f = (temp * 9 / 5) + 32;
            k = temp + 273.15;
            break;

        case 'fahrenheit':
            c = (temp - 32) * 5 / 9;
            f = temp;
            k = (temp - 32) * 5 / 9 + 273.15;
            break;

        case 'kelvin':
            c = temp - 273.15;
            f = (temp - 273.15) * 9 / 5 + 32;
            k = temp;
            break;

        default:
            return;
    }

    // Render results
    valCelsius.textContent = `${formatNumber(c)} °C`;
    valFahrenheit.textContent = `${formatNumber(f)} °F`;
    valKelvin.textContent = `${formatNumber(k)} K`;

    // Highlight the box matching the user's input scale
    boxCelsius.classList.remove('active');
    boxFahrenheit.classList.remove('active');
    boxKelvin.classList.remove('active');

    if (selectedUnit === 'celsius') boxCelsius.classList.add('active');
    if (selectedUnit === 'fahrenheit') boxFahrenheit.classList.add('active');
    if (selectedUnit === 'kelvin') boxKelvin.classList.add('active');

    // Show container and animate gauge
    resultsContainer.classList.remove('hidden');
    updateThermalGauge(c);
}

// ============================================================
// 8. RESET & EVENT LISTENERS
// ============================================================
function resetForm() {
    tempInput.value = '';
    unitSelect.value = 'celsius';
    updateUnitIndicator();
    clearError();
    resultsContainer.classList.add('hidden');
    gaugeContainer.classList.add('hidden');
    tempInput.focus();
}

btnConvert.addEventListener('click', convertTemperature);
btnReset.addEventListener('click', resetForm);
unitSelect.addEventListener('change', updateUnitIndicator);

// Enter key shortcut
tempInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        convertTemperature();
    }
});

// Benchmark cards quick-load
benchmarkCards.forEach(card => {
    card.addEventListener('click', () => {
        const val = card.getAttribute('data-val');
        const unit = card.getAttribute('data-unit');

        tempInput.value = val;
        unitSelect.value = unit;
        updateUnitIndicator();

        document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
        convertTemperature();
    });
});

// Hero pills quick-load
quickPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
        e.preventDefault();
        const val = pill.getAttribute('data-preset');
        const unit = pill.getAttribute('data-unit');

        tempInput.value = val;
        unitSelect.value = unit;
        updateUnitIndicator();

        document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
        convertTemperature();
    });
});

// Scroll reveal using native IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

