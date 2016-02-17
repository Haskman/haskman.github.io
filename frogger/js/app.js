// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-car.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 500*dt;
    if (this.x > 505){
        this.x = -101;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


var Player = function(x, y, lives, score){

    this.x = x;
    this.y = y;
    this.lives = lives;
    this.score = score;
    this.sprite = 'images/char-frog.png'
    }

Player.prototype.update = function() {
    //Collision detection for each enemy in allEnemies and the player
    for (i in allEnemies){
        enemy = allEnemies[i];
        if (this.x < (enemy.x+140) && this.x > (enemy.x - 70) && this.y < (enemy.y+20) && this.y > (enemy.y - 20))
            {
                //Reset player position and take off a life
                this.x = 200;
                this.y = 300;
                this.lives -= 1;
                //Reset game if lives are equal to 0
                if (this.lives === 0) {
                    init();
                }
            }
        }
    //Detect if player is on water, add to score, return to initial position, generate new set of enemies
    if (this.y < 35){
            this.score += 1000;
            this.x = 200;
            this.y = 300;
            generateEnemies();
        }
}

Player.prototype.render = function(){
    //Render player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //Update player score
    document.getElementById("score").innerHTML = "Your score is: " + this.score;
    //Update number of lives
    document.getElementById("lives").innerHTML = "Lives left: " + this.lives;
}

Player.prototype.handleInput = function(key){
    if(key === 'left' && this.x > 35){
        this.x -=100;
    }
    if(key === 'up' && this.y > 35){
        this.y -= 82.5;
    }
    if(key === 'right' && this.x < 390){
        this.x += 100;
    }
    if(key === 'down' && this.y < 355){
        this.y +=82.5;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies;
var player;

var generateEnemies = function(){
    allEnemies = [/*new Enemy(200*Math.random()*2, 50)*/, new Enemy(100*Math.random()*2, 200), new Enemy(300*Math.random()*2, 50),
        new Enemy(400*Math.random()*2, 150)];
}

var init = function() {
    generateEnemies();
    player = new Player(200, 300,3, 0);
}


init();

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
