// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolve Traveling Salesperson

// Cities
var cities = [];
var totalCities = 50;

// Best path overall
var recordDistance = Infinity;
var bestEver;

// Population of possible orders
var population = [];
var popTotal = 200;
var apocalypse_counter = 9;

function setup() {
  createCanvas(600, 600);

  // Make random cities
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(10, width - 10), random(10, height / 2 - 10));
    cities[i] = v;
  }

  // Create population
  for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(totalCities);
  }

}

function draw() {
  background(0);

  // Each round let's find the best and worst
  var minDist = Infinity;
  var maxDist = 0;

  // Search for the best this round and overall
  var bestNow;
  for (var i = 0; i < population.length; i++) {
    var d = population[i].calcDistance();

    // Is this the best ever?
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }

    // Is this the best this round?
    if (d < minDist) {
      minDist = d;
      bestNow = population[i];
    }

    // Is this the worst?
    if (d > maxDist) {
      maxDist = d;
    }
  }

  weightmap()
  // Show the best this round
  //bestNow.show();

  translate(0, height / 2);
  line(0, 0, width, 0);
  // Show the best ever!
  bestEver.show();
  translate(width/2, 0);
  line(0, 0, -width, 0);


  // Map all the fitness values between 0 and 1
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }

  // Normalize them to a probability between 0 and 1
  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }

  // Selection

  // A new population
  var newPop = [];

  apocalypse_counter++;
  if (apocalypse_counter>200){
    apocalypse_counter = 0;
    print('apocalypse')
  }
  // Sam population size
  for (var i = 0; i < population.length; i++) {

    // Pick two
    var a = pickOne(population);
    var b = pickOne(population);

    // Crossover!
    var order = a.crossover2(b);
    order = mutate(order,0.20,1);
      if (apocalypse_counter < 2){
        order = mutate(order,0.999,1);
      }
    newPop[i] = new DNA(totalCities, order);
  }

  // New population!
  population = newPop;
  population[1] = bestEver;
}

// This is a new algorithm to select based on fitness probability!
// It only works if all the fitness values are normalized and add up to 1
function pickOne() {
  // Start at 0
  var index = 0;

  // Pick a random number between 0 and 1
  var r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= population[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  return population[index];
}

function weightmap(){

  //generate population map
  var citymap = []
  for (var x = 0; x < totalCities; x++) {
    citymap[x] = []; // create nested array
    for (var y = 0; y < totalCities; y++) {
      citymap[x][y] = 0;
    }
  }

  //generate weights map, note it is directional - we fix that next
  for (var i = 0; i < population.length; i++) {
    for (var j = 1; j < totalCities; j++) {
      citymap[population[i].order[j]][population[i].order[j-1]] += 1;
    }
  }

//make map symmetric (nondirectional)
  for (var i = 0; i < totalCities; i++) {
    for (var j = i+1; j < totalCities; j++) {
      citymap[i][j] += citymap[j][i];
      citymap[j][i] = citymap[i][j];
    }
  }

  // Lines
  stroke(255);
  noFill();
  for (var i = 0; i < totalCities; i++) {
    for (var j = i+1; j < totalCities; j++) {
      strokeWeight(0.1*citymap[i][j]);
      beginShape();
      vertex(cities[i].x, cities[i].y);
      vertex(cities[j].x, cities[j].y);
      endShape();
    }
  }
  strokeWeight(1);
}

function mutate(array,p,n) {
  var diminish = 1;
  var temp = 0;
  var a = 0;
  var b = 0;
  var citytemp = [];
  var outarray = array;
  if ((random(1) < p )&&(n<1+diminish*5)) {
  var r =random(1);
    //insert a random city chain somewhere leaving rest unchanged - spike avoidance
    if(r<0.10) {
      a=floor(random(array.length));
      b=floor(random(array.length));
      temp = max(a,b);
      a = min(a,b);
      b = temp;
      citytemp = array.slice(a,b);
      outarray = concat(array.slice(0,a),array.slice(b));
      splice(outarray,reverse(citytemp),random(array.length));
      if (outarray.length!=array.length){
        print('mut1')
      }
      outarray = mutate(outarray,p,n+diminish);
    }
    //connect start and end and delete random arc - longest arc deletion
    else if(r<0.20){
      a=floor(random(array.length));
      outarray = concat(array.slice(a),array.slice(0,a));
      if (outarray.length!=array.length){
        print('mut2')
      }
      outarray = mutate(outarray,p,n+diminish);
    }
    //reverse a random sequence - line crossing removal
    else if(r<0.90){
      a=floor(random(array.length));
      b=floor(random(array.length));
      temp = min(a,b);
      b = max(a,b);
      a = temp;
      outarray = concat(array.slice(0,a),reverse(array.slice(a,b)));
      outarray = concat(outarray,(array.slice(b)));
      if (outarray.length!=array.length){
        print('mut3')
      }
      outarray = mutate(outarray,p,n+diminish);
    }
    //swap 2 random cities
    else if (r<1){
      a=floor(random(array.length));
      b=floor(random(array.length));
      temp = array[a];
      array[a] = array[b];
      array[b] = temp;
      if (outarray.length!=array.length){
        print('mut4')
      }
      outarray = mutate(outarray,p,n+diminish);
    }
    return outarray
  }
  else{
    return outarray
  }
}
