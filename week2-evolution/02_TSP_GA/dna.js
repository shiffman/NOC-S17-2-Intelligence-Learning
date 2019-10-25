// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolve Traveling Salesperson

// A generic function to swap two elements in an array
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// A DNA object is an order through the cities
function DNA(total, order) {

  // Start assuming it's distance is infinity and fitness is zero
  this.dist = Infinity;
  this.fitness = 0;

  // Is this being made from another DNA object?
  if (order instanceof Array) {
    // Just copy the order
    this.order = order.slice();
    // Mutation
    // 5% of the time shuffle one spot to see if it improves
    if (random(1) < 0.05) {
      this.shuffle();
    }
  } else {

    // Create a random order
    this.order = [];
    for (var i = 0; i < total; i++) {
      this.order[i] = i;
    }

    // Shuffle randomly 100 times
    // Is this good enough for variation?
    for (var n = 0; n < 100; n++) {
      this.shuffle();
    }
  }
}

// Shuffle array one time
DNA.prototype.shuffle = function() {
  var i = floor(random(this.order.length));
  var j = floor(random(this.order.length));
  swap(this.order, i, j);
}

// How long is this particular path?
DNA.prototype.calcDistance = function() {
  var sum = 0;
  for (var i = 0; i < this.order.length - 1; i++) {
    var cityAIndex = this.order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = this.order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  this.dist = sum;
  return this.dist;
}

// Map the fitess where shortest is best, longest is worst
DNA.prototype.mapFitness = function(minD, maxD) {
  this.fitness = map(this.dist, minD, maxD, 1, 0);
  return this.fitness;
}

// Normalize against total fitness
DNA.prototype.normalizeFitness = function(total) {
  this.fitness /= total;
}

// Draw the path
DNA.prototype.show = function() {

  // Lines
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  // Cities
  fill(255);
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    ellipse(cities[n].x, cities[n].y, 8, 8);
  }
}

// This is one way to crossover two paths
DNA.prototype.crossover = function(other) {

  // Grab two orders
  var order1 = this.order;
  var order2 = other.order;

  // Pick a random start and endpoint
  var start = floor(random(order1.length));
  var end = floor(random(start + 1, order1.length + 1));

  // Grab part of the the first order
  var neworder = order1.slice(start, end);

  // How many spots do we need to add?
  var leftover = order1.length - neworder.length;

  // Go through order 2
  var count = 0;
  var i = 0;
  // As long as we aren't finished
  while (count < leftover) {
    // Take a city from order2
    var city = order2[i];
    // If it isn't part of the new child path yet
    if (!neworder.includes(city)) {
      // Add it!
      neworder.push(city);
      count++;
    }
    i++;
  }
  return neworder;
}


DNA.prototype.crossover2 = function(other) {
  var order1 = this.order;
  var order2 = other.order;

  var total = order1.length;
  // create an array of -1s
  var neworder = [];
  for (var i = 0; i < total; i++) {
    neworder[i] = -1;
  }

  // make a random city array
  var citychoice = [];
  for (var i = 0; i < total; i++) {
    citychoice[i] = i;
  }
  for (var n = 0; n < 100; n++) {
    shuffle(citychoice,true);
  }


for(i = 0; i<total; i++){
  //my own find function - can't find one in p5.js..
  var index1=-1;
  for(j = 0; j<total; j++){
    if (order1[j] == citychoice[i]){
      index1 = j;
    }
  }

  var index2=-1;
  for(j = 0; j<total; j++){
    if (order2[j] == citychoice[i]){
      index2 = j;
    }
  }

    //take the city from a parent based on fitness
    //if (random(sq(this.normalizeFitness)+sq(other.normalizeFitness))<sq(this.normalizeFitness)){  //square fitness parenting (fast hardening)
    //if (random((this.normalizeFitness)+(other.normalizeFitness))<(this.normalizeFitness)){  //linea fitness parenting (medium hardening)
    //if (random(sqrt(this.normalizeFitness)+sqrt(other.normalizeFitness))<sqrt(this.normalizeFitness)){  //sqrt fitness parenting (slow hardening)
    if (random(Math.pow(this.normalizeFitness,0.0001)+Math.pow(other.normalizeFitness,0.0001))<Math.pow(this.normalizeFitness,0.0001)){  //nth root fitness parenting (really slow hardening)
    //if(random(1)<0.5){    //equal opportunity parenting (no hardening)
      //put city into parent's index
      if (neworder[index1] == -1) {
        neworder[index1] = citychoice[i];
      }
      else if (neworder[index2] == -1) {
        neworder[index2] = citychoice[i];
      }
    }
    else {
      //put city into parent's index
      if (neworder[index2] == -1) {
        neworder[index2] = citychoice[i];
      }
      else if (neworder[index1] == -1) {
        neworder[index1] = citychoice[i];
      }
    }
  }

    // Randomly fill in gaps
  var gaps=[];
  for (var i = 0; i < total; i++) {
    if(!neworder.includes(i)){
      gaps.push(i);
    }
  }

  for (var n = 0; n < 10; n++) {
    shuffle(gaps,true);
  }

  var i=0;
  for (var j = 0; j < total; j++) {
    if (neworder[j]==-1) {
      neworder[j] = gaps[i];
      i++;
    }
  }
  return neworder;
}
