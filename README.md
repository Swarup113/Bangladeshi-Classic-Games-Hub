# Bangladeshi‑Classic‑Games‑Hub

### *A digital hub bringing classic Bangladeshi childhood games to life*

Play six unique multiplayer browser games – from strategic word battles and cricket simulations to classic Tic‑Tac‑Toe variants and role‑based guessing games. Built with pure HTML, CSS, and JavaScript. No downloads, no frameworks – just pure nostalgic fun.

---

## Overview

**Bangladeshi‑Classic‑Games‑Hub** is a collection of six hand‑crafted local multiplayer games. Each game runs entirely in the browser and supports pass‑and‑play (hot‑seat) gameplay. The hub is fully responsive and works on desktops, tablets, and mobile devices.

The six games included are:

| Game | Description |
|------|-------------|
| **Chor Dakat Babu Pulish** | 4‑player guessing game with rotating secret roles (Police, Thief, Bandit, Babu) and point‑based scoring. |
| **CricSpin** | 2‑player cricket game with a 14‑segment spinning wheel, coin toss, overs & wickets settings, and Super Over tie‑breaker. |
| **GoalDao** | Strategic football passing game using HTML5 Canvas – pass between teammates, avoid interceptions, and score goals. |
| **Qub** | 10×10 word battle game – form valid English words, earn points for longest word, 15‑second turn timer. |
| **LettR** | 2‑player timed vocabulary duel – fill Name, Place, Movie, Thing starting with a random letter; real‑time dictionary validation. |
| **kaTakuTi** | Multi‑grid Tic‑Tac‑Toe (3×3, 5×5, 7×7) with dynamic win conditions (3, 4, or 5 in a row). |

---

## Live Demo

 [**https://swarup113.github.io/Bangladeshi-Classic-Games-Hub/**](https://swarup113.github.io/Bangladeshi-Classic-Games-Hub/)

---

## Features

| Feature | Description |
|---------|-------------|
| Six Classic Games | A diverse collection covering word games, sports, strategy, and party games. |
| Local Multiplayer | All games are pass‑and‑play – perfect for two to four players on one device. |
| No Installation | Runs in any modern browser – no backend, no database, no sign‑up. |
| Responsive Design | Every game adapts to desktop, tablet, and mobile screens. |
| Pure Vanilla Stack | Built with HTML5, CSS3, and ES6+ JavaScript – zero frameworks or external libraries. |
| Real‑time APIs | Qub and LettR use the Free Dictionary API for word validation. |
| Canvas Graphics | GoalDao uses Canvas API for smooth animations and collision detection. |
| Custom Match Settings | CricSpin allows adjustable overs (1‑50) and wickets (1‑10). |

---

## How to Play / Rules (Per Game)

### Chor Dakat Babu Pulish

| Aspect | Details |
|--------|---------|
| Players | 4 (hot‑seat) |
| Objective | The Pulish (Police) must identify the culprit (Chor or Dakat) each round. |
| Roles | Babu (immune, always 100 points), Pulish (guesser), Chor (thief target), Dakat (bandit target). |
| Rounds | 10 rounds (alternating Chor / Dakat rounds). |
| Scoring | Babu: 100; Pulish correct: 80; Pulish wrong: 0; Target caught: 0; Target escapes: Chor 40 / Dakat 60. |
| Timer | 30 seconds for Pulish to guess. |

[Play Chor Dakat Babu Pulish](https://swarup113.github.io/chor-dakat-babu-pulish/)

---

### CricSpin

| Aspect | Details |
|--------|---------|
| Players | 2 (hot‑seat) |
| Match Settings | Overs (1‑50), Wickets (1‑10) |
| Toss | Heads / Tails → choose Bat or Bowl. |
| Wheel Segments | Runs (0,1,2,3,4,6), Extras (Wide, No Ball, Leg By), Wickets (Caught, Bowled, Stumped, Run Out, Hit Out). |
| Special Rules | No Ball → Free Hit next delivery. Bowler changes after 6 legal deliveries. |
| Tie‑breaker | Super Over (1 over, 2 wickets) with a fresh toss. |

[Play CricSpin](https://swarup113.github.io/CricSpin/)

---

### GoalDao – Strategic Football Passing Game

| Aspect | Details |
|--------|---------|
| Players | 2 (hot‑seat) |
| Gameplay | Click teammates to pass; click opponent’s goal area to shoot. |
| Interception | Pass line that touches any opponent → turnover. |
| Goalkeepers | Start with ball after a goal is conceded. |
| Match Duration | 1‑10 minutes (selectable). |
| Field | 20 outfield players + 2 GKs, penalty areas, top/bottom goals. |
| Win Condition | Most goals when timer ends. |

[Play GoalDao](https://swarup113.github.io/GoalDao/)

---

### Qub – Word Battle Game

| Aspect | Details |
|--------|---------|
| Players | 2 (hot‑seat) |
| Grid | 10×10 |
| Turn Timer | 15 seconds (timeout = –1 point). |
| Word Validation | Dictionary API + built‑in 2‑letter word list. |
| Scoring | Points = length of longest valid word formed in your turn. |
| Unique Word Rule | Repeating a word scores 0 points. |
| Turn Order | Form a valid word → keep turn; otherwise turn passes. |

[Play Qub](https://swarup113.github.io/Qub/)

---

### LettR – Word Duels

| Aspect | Details |
|--------|---------|
| Players | 2 (hot‑seat) |
| Rounds | 5 |
| Per Round | Each player receives a different random letter. |
| Categories | Name, Place, Movie, Thing (all must start with the letter). |
| Validation | Name/Place/Movie: min 2 characters, correct first letter. Thing: real English word via Dictionary API. |
| Scoring | 1 point for completing all fields correctly. |
| Speed Bonus | +1 point if both score in the same round (faster player). |
| Turn Timer | 60 seconds. |

[Play LettR](https://swarup113.github.io/LettR/)

---

### kaTakuTi – Battle in Squares

| Aspect | Details |
|--------|---------|
| Players | 2 (hot‑seat) |
| Grid Sizes | 3×3, 5×5, 7×7 |
| Win Conditions | 3×3 → 3 in a row; 5×5 → 4 in a row; 7×7 → 5 in a row. |
| Scoring | Winner of round gets 1 point. Scores persist across rounds. |
| Draw | No points awarded. |
| Controls | Back button, finish game, new game, quit. |

[Play kaTakuTi](https://swarup113.github.io/kaTakuTi/)

---

## Tech Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure, semantic markup, modals, forms. |
| CSS3 | Flexbox, Grid, responsive layouts, animations, glass‑morphism, neon themes. |
| JavaScript (ES6+) | Game logic, state management, timers, API integration, Canvas rendering, event handling. |
| Canvas API | Real‑time rendering for GoalDao (field, players, ball, pass lines). |
| Free Dictionary API | Word validation for Qub and LettR. |
| Google Fonts | Orbitron, Space Grotesk, JetBrains Mono for modern typography. |

No backend, no databases, no external frameworks – pure front‑end implementation.

---

## License

All games in this collection are released under the **MIT License**. You are free to use, modify, and distribute them with attribution.

---

*Created by [Swarup Dewanjee](https://github.com/Swarup113)*
