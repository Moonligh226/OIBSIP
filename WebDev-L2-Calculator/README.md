# CALIBRE — Calculatrice Web (OIBSIP Niveau 2, Tâche 1)

Application web de calculatrice réalisée dans le cadre du programme de stage **Oasis Infobyte (OIBSIP — Web Development & Designing, Niveau 2 · Tâche 1)**.

---

## ✨ Fonctionnalités

- **Interface Liquid Glass & géométrie nette** : Boîtier en verre dépoli avec liseré spéculaire, 4 ambiances de couleur au choix (*Aurora*, *Cyber*, *Émeraude*, *Solaire*) et typographie **Space Grotesk** + **Space Mono** avec chiffres tabulaires.
- **Bilingue FR / EN** : Switch instantané Français / Anglais dans la barre de navigation, sauvegardé dans `localStorage`.
- **Contrôle clavier complet** : Pavé numérique (`0-9`), opérateurs (`+`, `-`, `*`, `/`), `Entrée` / `=` pour calculer, `Échap` pour tout effacer, `⌫ Retour` pour corriger, `%`, et `.` ou `,` pour la virgule.
- **Constantes usuelles & fonctions rapides** : Insertion en un clic de $\pi$, $e$, $\varphi$, $\sqrt{2}$, $\tau$, plus $\sqrt{x}$, $x^2$, $1/x$ et `RND`.
- **Copie en 1 clic & Historique** : Bouton *Copier* directement sur l'écran, et tiroir d'historique mémorisant les 20 derniers calculs dans `localStorage`.
- **Moteur sûr (zéro `eval()`)** : Arithmétique déterministe avec correction des arrondis flottants IEEE 754 et protection contre la division par zéro.
- **Audio discret & Accessibilité** : Clics synthétisés via Web Audio API (désactivables), anneaux `:focus-visible`, attributs ARIA et prise en charge complète de `prefers-reduced-motion`.

---

## 📁 Architecture des fichiers

```text
WebDev-L2-Calculator/
├── index.html     # Structure sémantique, navbar FR/EN, calculatrice et footer
├── style.css      # Thèmes dynamiques, verre dépoli, grille responsive & accessibilité
├── script.js      # Moteur de calcul, i18n FR/EN, tilt 3D, Web Audio API et localStorage
└── README.md      # Documentation du projet
```

---

## 🚀 Exécution

Ouvrir `index.html` directement dans votre navigateur ou servir le dossier en local :

```bash
cd WebDev-L2-Calculator
python -m http.server 8000
```
