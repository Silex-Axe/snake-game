//Game framerate - Right now is also the speed of the snake
const FRAME_RATE = 20
//Scale of the game, the bigger it is, the 'pixels' get bigger
const ITEMS_SCALE = 10;

const COIN_SOUND_PATH = 'assets/coin.mp3'
const GAME_FONT_PATH = 'assets/game_over.ttf'
//Game object, it's all the main game
let game;
let coin_sound 
let game_font
function preload() {
    coin_sound  = loadSound(COIN_SOUND_PATH);
    game_font = loadFont(GAME_FONT_PATH);
}

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



/*Draw every tick of the clock (FRAME_RATE)*/
function draw() {
    background(51);
    environment.draw()
}

function keyPressed() {
    environment.manageInput(keyCode)    
}

/** 
 * Environment object, holds the user interface and the game 
 * */
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
        textFont(game_font);
        textSize(height / 6);
        textAlign(CENTER, CENTER);
        fill(200,0,0);
        text(gameOverMessage, width*0.1, height/4, width*0.8, height/6);
        
        textSize(height / 10);
        fill(200,0,180);
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
/**
 * Game object, holds the game related objects
 * */
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
/* Draw the components of the game */
    this.draw = function(){
        if(this.started){
         this.snake.update();
        }
        this.snake.show();
        if (this.snake.eat(this.food)) {
            this.pickFoodLocation();
            if (coin_sound.isPlaying()) {
                coin_sound.stop();
              } 
            coin_sound.play();
              
        }
        if(this.snake.checkSelfCollision()){
            this.started = false;
        }

        fill(255, 200, 0);
        rect(this.food.x, this.food.y, ITEMS_SCALE, ITEMS_SCALE);

    }
}
/** 
 * Snake object, holds position of the snake, speed and every pixel of it 
 * */
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