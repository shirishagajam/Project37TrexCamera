//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, ground2, invisibleGround2;

var gameOver,restart;
var gameOverimg,restartimg;

var cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,dist;
var flag = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth - 20,windowHeight);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided);
  
  gameOver = createSprite(300,140);
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;

  //Putting another ground when the 1st ground reaches its end
  ground2 = createSprite(200,180,400,20);
  ground2.addImage("ground",groundImage);
  ground2.x = ground.width + ground.width/2;
  
  invisibleGround = createSprite(ground.x,190,ground.width,10);
  invisibleGround.visible = false;

  //Putting another invisible ground when the 1st ground reaches its end
  invisibleGround2 = createSprite(ground2.x,190,ground.width,10);
  invisibleGround2.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  dist = ground.width;
}


function draw() {
  background(180);
  if(gameState == PLAY) {

    trex.velocityX = 5;
    score = score + Math.round(getFrameRate()/60);
    text("Score: "+ score, trex.x+200,50);
    
    if(keyDown("space")) {
      trex.velocityY = -14;
    }
    
    trex.velocityY = trex.velocityY + 0.8

    //moving game camera with trex =>  +500 so that camera is ahead of trex
    //+500 trex seems to be at the left of the screen
    camera.position.x = trex.x+500;

    /* dist variable shows where the current ground ends
       if trex is reaching the end=>put grounds alternatively ahead of the previous ground
       flag variable helps in putting ground/ground/2 alternatively
    */
    if (trex.x >= dist-displayWidth){
      if(flag == 0){
        ground2.x = dist+ground.width/2;
        invisibleGround2.x = ground2.x;
        flag = 1;
      }
      else{
        ground.x = dist+ground.width/2;
        invisibleGround.x = ground.x;
        flag=0;
      }
      dist+=ground.width;
    }
    
    trex.collide(invisibleGround);
    trex.collide(invisibleGround2);
    spawnClouds();
    spawnObstacles();

    if(trex.isTouching(obstaclesGroup)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    gameOver.x = trex.x+200;
    restart.x = trex.x+200;
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)) {
      reset();
    }
   
    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //change the trex animation
    trex.changeAnimation("collided");
  }
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  
  trex.changeAnimation("running");
  
  count = 0;
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(trex.x+displayWidth-100,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth/trex.velocityX+30;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    //note obstacle.x
    var obstacle = createSprite(trex.x+displayWidth-100,165,10,40);
    //obstacle.velocityX = -4;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    //note obstacle.lifetime
    obstacle.lifetime = displayWidth/trex.velocityX+30;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}