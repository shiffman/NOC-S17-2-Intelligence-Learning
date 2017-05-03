// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolutionary "Steering Behavior" Simulation

// An array of vehicles
var population = [];

var explosions = [];

// An array of "food"
var food = [];
// An array of "poison"
var poison = [];

// How good is food, how bad is poison?
var nutrition = [0.1, -1];

// Show additional info on DNA?
var debug;

//Images URLS
var imgURL = "http://i.imgur.com/A70F5bI.png";
var explosionURL =  "http://i.imgur.com/fGgMuJH.png"; 

//Sprite images variables 
var explosion;
var misile;

function preload(){
//Load images
misile = loadImage(imgURL);
explosion = loadImage(explosionURL);
}

function setup() {
//Create sprite images
misile = new Sprite(misile,46,15);
misile.load();

explosion = new Sprite(explosion,100,100);
explosion.load();

  // Add canvas and grab checkbox
  var canvas = createCanvas(800, 600);
  canvas.parent('canvascontainer');
  debug = select('#debug');


  // Create 10 vehicles
  angleMode(RADIANS);
  for (var i = 0; i < 10; i++) {
    population[i] = new Vehicle(width / 2, height / 2);
  }
  // Start with some food
  for (var i = 0; i < 10; i++) {
    food[i] = createVector(random(width), random(height));
  }
  // Start with some poison
  for (var i = 0; i < 5; i++) {
    poison[i] = createVector(random(width), random(height));
  }
}

// Add new vehicles by dragging mouse
function mouseDragged() {
  population.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  background(0);

  // 10% chance of new food
  if (random(1) < 0.1) {
    food.push(createVector(random(width), random(height)));
  }

  // 1% chance of new poison
  if (random(1) < 0.01) {
    poison.push(createVector(random(width), random(height)));
  }

  // Go through all vehicles
  for (var i = population.length - 1; i >= 0; i--) {
    var v = population[i];

    // Eat the food (index 0)
    v.eat(food, 0);
    // Eat the poison (index 1)
    v.eat(poison, 1);
    // Check boundaries
    v.boundaries();

    // Update and draw
    v.update();
    v.display();

    // If the vehicle has died, remove
    if (v.dead()) {
	  explosions.push(new Explosion(v));
      population.splice(i, 1);
    } else {
      // Every vehicle has a chance of cloning itself
      var child = v.birth();
      if (child != null) {
        population.push(child);
      }
    }
  }

  for(var i=explosions.length-1;i>=0;i--){
  var e = explosions[i];
  e.update();
  e.display();
  if(!e.alive){
  explosions.splice(i,1);
  }
 }
  
  // Draw all the food and all the poison
  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4);
  }

  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4);
  }
}
