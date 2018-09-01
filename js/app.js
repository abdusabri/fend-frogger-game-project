// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    // Member variables, used in prototype functions
    this.sprite = 'images/char-boy.png';
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
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'up':
            this.y -= this.SPRITE_HEIGHT;
            // Use <= to detect game winning once it happens
            if (this.y <= this.yMin) {
                this.y = this.yMin;
                // Fire a game winning event event, where the engine listens for
                document.dispatchEvent(new CustomEvent("game-won"));
                // TODO: Remove event listner once game is won
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


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
window.player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
