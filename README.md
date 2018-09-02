# Frogger-like Arcade Game

## Project Summary

This is the third project as part of my Front-End Web Development Nanodegree. It is a Frogger-like arcade game. The game is controlled using keyboard, and the moment, no touch support or optimizations for mobiles or tablets. In order to win the game, a player has to cross and reach the water without colliding with an enemy. The game can be played [here](https://abdusabri.github.io/fend-frogger-game-project/)

### Game Play Notes

- Before the game starts, a player selection screen is displayed

- After selecting a player, the game starts

- The player starts at the bottom row of grass, and in a random column

- Enemies are created with various speeds, and horizontally crosses the rocky area of the game

- Enemies keep changing speeds and rows each time they cross the game area

- The player moves 1 square/block with each arrow key press (once it is released/up), in the direction of the pressed key (up, down, left, right). Holding the key down won't move the player

- The player has to avoid colliding with enemies, and if does, the player is reset again to a random position at the bottom grass row

- Once the player makes it across to the water, the game is won

- After winning the game, a message is displayed asking whether to play again with the same player, or go back to the player selection screen

## Technical Implementation Notes

The game doesn't use any special frameworks, and no server-side code is used.