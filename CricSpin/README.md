# CricSpin
A 2-player cricket game featuring a 14-segment spinning wheel, coin toss, and customizable match settings.

## Features
- Customizable Teams: Set team names or use defaults (Team 1, Team 2)
- Adjustable Match Settings: Configure overs (1-50) and wickets (1-10)
- Coin Toss: Head/Tail toss with bat/bowl choice
- 14-Segment Spinning Wheel: Random outcomes including runs, extras, and wickets
- Player Stats: Track batter runs, balls, fours, sixes and bowler overs, runs, wickets
- Super Over: Automatic tie-breaker with new toss

## Live: https://swarup113.github.io/CricSpin/

## Wheel Segments
| Runs Scored | Extras | Dismissals (Wickets) |
| :--- | :--- | :--- |
| **0** (Dot Ball) | Wide | Catch Out |
| **1** | No Ball | Bowled Out |
| **2** | Leg By | Stumped |
| **3** | | Run Out |
| **4** | | Hit Out |
| **6** | | |

### Game Rules

| Category | Description |
| :--- | :--- |
| **Runs** | Scores of **0, 1, 2, 3, 4, or 6** are added to both the team total and the current batter's score. |
| **Wide** | Awards **+1 extra run**; the ball is not counted toward the over. |
| **No Ball** | Awards **+1 extra run**; the ball is not counted. The next delivery is a **Free Hit** (only Run Out is possible). |
| **Leg By** | Awards **+1 extra run**; the ball is counted toward the over. |
| **Wickets** | Includes **Caught, Bowled, Stumped, Run Out, or Hit Out**. The batter is removed and the next one enters. |
| **Bowler Change** | Occurs automatically after every **6 legal deliveries**. |
| **Innings End** | Triggered once all overs are completed or all wickets are lost. |
| **Tie** | Resulting in a **Super Over** (1 over, 2 wickets). |

### How to Play

1. **Launch:** Open `https://swarup113.github.io/CricSpin/` in any web browser.
2. **Setup:** * Enter team names (optional).
    * Configure the number of **Overs** and **Wickets**.
3. **Start:** Click the **"Start Match"** button.
4. **The Toss:** Call **Heads** or **Tails**, then choose to **Bat** or **Bowl** first.
5. **Gameplay:** Click the **"Play"** button to spin the wheel and generate match events.
6. **The Objective:** The first team sets a target; the second team must chase it down before they run out of balls or wickets.
