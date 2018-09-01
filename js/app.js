// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.SPRITE_WIDTH = 101; // The width of the sprites/images
    this.SPRITE_HEIGHT = 83; // The width of the sprites/images

    // Vertical displacement to position enemy objcts relatively centered on
    // the game scene's blocks (grass, rock, water) 
    this.Y_DISPLACEMENT = 25;

    this.x = -this.SPRITE_WIDTH; // Enemies always start just off-canvas
    // Pick a random row as a start position for the enemy
    // generate a random number excluding 0 (water row) and 3 (just before the grass rows)
    this.y = ((Math.floor(Math.random() * Math.floor(3)) + 1) * 
        this.SPRITE_HEIGHT) - this.Y_DISPLACEMENT;

    // Default speed for an enemy object in pixels (2 sprites-width)
    this.NORMAL_SPEED = 202;
    // Different speed options to be randomly assigned to each enemy object when created
    this.SPEED_OPTIONS = [0.5, 1, 1.5, 1.75, 2];
    // Randomly pick a speed factor from the speed options array
    this.speedFactor = this.SPEED_OPTIONS[Math.floor(Math.random() * this.SPEED_OPTIONS.length)];

    // Will be used to stop enemy movements once the game is one
    this.stop = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.stop) {
        return;
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.NORMAL_SPEED * this.speedFactor * dt;
    
    // If the object goes off-canvas, reset X and randomly assign Y location. 
    // Also, randomly change the speed factor
    if (this.x > 505) { // 505 is the canvas width 
        this.speedFactor = this.SPEED_OPTIONS[Math.floor(Math.random() * this.SPEED_OPTIONS.length)];
        this.x = -this.SPRITE_WIDTH;
        this.y = ((Math.floor(Math.random() * Math.floor(3)) + 1) * 
            this.SPRITE_HEIGHT) - this.Y_DISPLACEMENT;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Regarding the update function:
// I believe this method is not needed for the player object, unlike enemies,
// the player will always remain in its position until an arrow is pressed, and then
// the relevant x and y position updates are maanaged in the handleInput function.
// I believe this is more efficient than implementing the logic in an update function that 
// is called very frequently without effectively changing the player's position
let Player = function(sprite = 'images/char-boy.png') {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    // Member variables, used in prototype functions
    this.sprite = sprite;
    this.SPRITE_WIDTH = 101; // The width of the sprites/images
    this.SPRITE_HEIGHT = 83; // The width of the sprites/images

    // Vertical displacement to position the player objct relatively centered on
    // the game scene's blocks (grass, rock, water) 
    this.Y_DISPLACEMENT = 32;

    this.xMin = 0;
    this.xMax = 4 * this.SPRITE_WIDTH; // 5th column (max) (5 - 1 image width)
    this.yMin = -this.Y_DISPLACEMENT; // Top row (1st)
    this.yMax = (5 * this.SPRITE_HEIGHT) - this.Y_DISPLACEMENT; // Bottom row (6th)

    // Player always starts at the bottom row (6th)
    this.y = this.yMax;
    // Pick a random column as a start position for the player (5 columns total)
    this.x = (Math.floor(Math.random() * Math.floor(5))) * this.SPRITE_WIDTH;

    // Will be used to stop player movements once the game is won
    this.stop = false;
};

Player.prototype.handleInput = function(key) {
    if (this.stop) {
        return;
    }

    switch (key) {
        case 'up':
            this.y -= this.SPRITE_HEIGHT;
            // Use <= to detect game winning once it happens
            if (this.y <= this.yMin) {
                this.y = this.yMin;
                // Fire a game winning event event, where the engine listens for
                document.dispatchEvent(new CustomEvent("game-won"));
            }
            break;

        case 'down':
            this.y += this.SPRITE_HEIGHT;
            if (this.y > this.yMax) {
                this.y = this.yMax;
            }
            break;

        case 'left':
            this.x -= this.SPRITE_WIDTH;
            if (this.x < this.xMin) {
                this.x = this.xMin;
            }
            break;

        case 'right':
            this.x += this.SPRITE_WIDTH;
            if (this.x > this.xMax) {
                this.x = this.xMax;
            }
            break;

        default:
            break;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

