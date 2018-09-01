/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime, 
        // Will be used to start the game with the user-selected player
        // Boy is selected by default
        isBoySelected = true; 

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        // Allow the user to select a player before starting the game
        handlePlayerSelection();
    }

    function handlePlayerSelection() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderPlayerSelectionText();
        renderBoyPlayer();
        renderGirlPlayer();
        
        document.addEventListener('keyup', handleKeyUpEventForPlayerSelection);
    }

    function renderPlayerSelectionText() {
        ctx.font = "40px Comic Sans MS";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText("Select a Player", canvas.width/2, 100);

        ctx.font = "40px Comic Sans MS";
        ctx.strokeText("Select a Player",canvas.width/2, 100);

        ctx.font = "18px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.fillText("Use Left and Right arrows, and then", canvas.width/2, 150);
        ctx.fillText("press Space to start the game", canvas.width/2, 170);
    }

    function renderBoyPlayer(selected = true) {
        // Position the boy sprite in the 2nd column and 4th row
        if (selected) {
            ctx.drawImage(Resources.get('images/Selector.png'), 1 * 101, 3 * 83);
        }
        ctx.drawImage(Resources.get('images/char-boy.png'), 1 * 101, 3 * 83);
    }

    function renderGirlPlayer(selected = false) {
        // Position the girl sprite in the 4th column and 4th row
        if (selected) {
            ctx.drawImage(Resources.get('images/Selector.png'), 3 * 101, 3 * 83);
        }
        ctx.drawImage(Resources.get('images/char-horn-girl.png'), 3 * 101, 3 * 83);
    }

    function handleKeyUpEventForPlayerSelection(e) {
        var allowedKeys = {
            37: 'left',
            39: 'right',
            32: 'space'
        };

        (function(key) {
            switch (key) {
                case 'left':
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    renderPlayerSelectionText();
                    renderBoyPlayer(true);
                    renderGirlPlayer(false);
                    isBoySelected = true;
                    break;
                
                case 'right':
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    renderPlayerSelectionText();
                    renderBoyPlayer(false);
                    renderGirlPlayer(true);
                    isBoySelected = false;
                    break;

                case 'space':
                    document.removeEventListener('keyup', handleKeyUpEventForPlayerSelection);
                    startGame(isBoySelected);
                    break;

                default:
                    break;
            }
        })(allowedKeys[e.keyCode]);
    }

    function startGame(isBoySelected) {
        // Now instantiate your objects.
        // Place all enemy objects in an array called allEnemies
        // Place the player object in a variable called player
        window.player = new Player((isBoySelected)? 'images/char-boy.png' : 'images/char-horn-girl.png');
        window.allEnemies = [new Enemy(), // Generate 5 enemies
            new Enemy(),
            new Enemy(),
            new Enemy(),
            new Enemy()
        ];

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

        // Listen to the game winning event, which will be fired from
        // the player object
        document.addEventListener('game-won', () => {
            // TODO: Show a meassge and ask to play again
            setTimeout(() => {
                player = new Player((isBoySelected)? 'images/char-boy.png' : 'images/char-horn-girl.png') 
            }, 750);
        });

        // Start the game normally as before
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    function checkCollisions() {
        // Factor to use to allow for some overlap between the sprites
        // before a collision is considered to have happened (not to early or too late)
        const COLL_FACTOR = 3;
        const SPRITE_WIDTH = 101;
        const SPRITE_HEIGHT = 83;

        // Use rectangles to check for collisions
        allEnemies.forEach(function(enemy) {
            let r1 = {
                left: enemy.x,
                right: (enemy.x + SPRITE_WIDTH) - (SPRITE_WIDTH/COLL_FACTOR),
                top: enemy.y,
                bottom: (enemy.y + SPRITE_HEIGHT) - (SPRITE_HEIGHT/COLL_FACTOR)
            };

            let r2 = {
                left: player.x,
                right: (player.x + SPRITE_WIDTH) - (SPRITE_WIDTH/COLL_FACTOR),
                top: player.y,
                bottom: (player.y + SPRITE_HEIGHT) - (SPRITE_HEIGHT/COLL_FACTOR)
            };

            if (intersectRect(r1, r2)) {
                player = new Player((isBoySelected)? 'images/char-boy.png' : 'images/char-horn-girl.png');
            }
        });

        // https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
        function intersectRect(r1, r2) {
            return !(r2.left > r1.right || 
                r2.right < r1.left || 
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        // I believe this method is not needed for the player object, unlike enemies,
        // the player will always remain in its position until an arrow is pressed, and then
        // the relevant x and y position updates are maanaged in the handleInput function.
        // I believe this is more efficient than implementing the logic in an update function that 
        // is called very frequently without effectively changing the player's position
        // player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Selector.png',
        'images/char-horn-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
