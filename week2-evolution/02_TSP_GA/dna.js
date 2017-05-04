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
    // 50% of the time shuffle one spot to see if it improves
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
