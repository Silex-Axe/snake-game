/** TODO - 
 * Destruction -> self-eat & border
 *  - self collision -> check head position against every other position of the snake
 *  - border collision -> already fixed with the self collision algorithm :)
 * Not allowed go backwards
 * Add user interface
 * memory optimization: Save only the turning points as long as they are still there
 * Add bonuses (speed, duble score for a period?)
 * Restrict appearece of the food to non occupied spots
 */

//Game framerate
var FRAME_RATE = 20
//Scale of the game, the bigger it is, the 'pixels get bigger'
var ITEMS_SCALE = 10;
//Game object, it's all the main game
var game;

/*Set up the canvas and game objects (Executed by d3)*/
function setup() {
    createCanvas(600, 600);
    frameRate(FRAME_RATE);
    var cols = floor(width
         / ITEMS_SCALE)
    var rows = floor(height / ITEMS_SCALE)
    environment=new Environment(cols,rows);
    environment.init();
}



//Draw every tick of the clock (FRAME_RATE)
function draw() {
    background(51);
    environment.draw()
}

function keyPressed() {
    environment.manageInput(keyCode)    
}
/**Game object, holds the environment and all the related objects*/
function Game(cols,rows){
    started=false
    /* Initialize the snake and the food location */
    this.init = function(){
        this.snake = new Snake()
        this.pickFoodLocation();
    }
    this.start = function(){
        this.started = true;
    }
    this.pickFoodLocation = function() {
        this.food = createVector(floor(random(cols)), floor(random(rows)))
        this.food.mult(ITEMS_SCALE)
    }
    this.manageInput=function(keyCode){
        if (keyCode === UP_ARROW) {
            this.snake.dir(0, -1);
        } else if (keyCode === DOWN_ARROW) {
            this.snake.dir(0, 1);
        } else if (keyCode === RIGHT_ARROW) {
            this.snake.dir(1, 0);
        } else if (keyCode === LEFT_ARROW) {
            this.snake.dir(-1, 0);
        }
    }
/* draw the components of the game */
    this.draw = function(){
        if(this.started){
         this.snake.update();
        }
        this.snake.show();
        if (this.snake.eat(this.food)) {
            this.pickFoodLocation();
        }
        if(this.snake.checkSelfCollision()){
            this.started = false;
        }

        fill(255, 0, 200);
        rect(this.food.x, this.food.y, ITEMS_SCALE, ITEMS_SCALE);

    }
}
/** Environment object, holds the user interface with game options, credits and maybe score? */
function Environment(cols,rows){
    this.init=function(){
        this.game = new Game(cols,rows);
        this.game.init() 
    }

    this.manageInput = function(keyCode){
        if(this.game.started){
           this.game.manageInput(keyCode) 
        }  else if (keyCode === ENTER) {
            this.game.init();
            this.game.start();
        }
    }

    this.showGameOver=function(){
        let gameOverMessage = "GAME OVER" 
        let optionsMessage = "Press ENTER to play again"

        textSize(height / 8);
        textAlign(CENTER, CENTER);
        fill(200,0,0);
        text(gameOverMessage, width*0.1, height/4, width*0.8, height/6);
        
        textSize(height / 20);
        fill(200,180,0);
        text(optionsMessage, width*0.1, height/2, width*0.8, height/6);
    }
    this.draw=function(){
        if(this.game.started){
            this.game.draw()    
        }else{
            this.showGameOver()
        }
    }
}
/** Snake object, holds position of the snake, speed and every pixel of it */
function Snake() {
    this.x = 0;
    this.y = 0;

    this.xspeed = 1;
    this.yspeed = 0;

    this.total = 1;
    this.tail = [];

    this.dir = function (xdir, ydir) {  
        if(this.xspeed!=-xdir)  {
            this.xspeed = xdir;
        }
        if(this.yspeed != -ydir){
            this.yspeed = ydir;
        }
    }

    this.eat = function (pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.total++;
            return true;
        } else {
            return false;
        }
    }
    this.checkSelfCollision = function(){
        for (var i = 1; i < this.tail.length ; i++){
         if(this.tail[0].x==this.tail[i].x && this.tail[0].y==this.tail[i].y ) {
            console.log("I ate myself :(")
            return true;
         }
         return false;
        }
    }
    this.update = function () {
        //Move every point forward
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1]
            }
        }
        // New head point
        this.tail[this.total - 1] = createVector(this.x, this.y)
        this.x = this.x + this.xspeed * ITEMS_SCALE;
        this.y = this.y + this.yspeed * ITEMS_SCALE;
        this.x = constrain(this.x, 0, width - ITEMS_SCALE)
        this.y = constrain(this.y, 0, height - ITEMS_SCALE)
    }

    this.show = function () {
        fill(255)
        for (var i = 0; i < this.tail.length ; i++)
            rect(this.tail[i].x, this.tail[i].y, ITEMS_SCALE, ITEMS_SCALE)
        }
}