// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Seed text from user
var textInput;
// Temperature slider
var tempSlider;
// Length to generate slider
var lengthSlider;

// Maxlen paramter from the model
var maxlen = 40;

// Variable to stop the sketch from querying the server too often
var waiting = false;

var modelToUse;

function setup() {
  noCanvas();

  // Grab the DOM elements
  textInput = select('#textInput');
  lengthSlider = select('#lenSlider');
  tempSlider = select('#tempSlider');

  // Run generate anytime something changes
  textInput.input(generate);
  lengthSlider.input(generate);
  tempSlider.input(generate);

}

function generate() {

  // Update the length and temperature span elements
  select('#length').html(lengthSlider.value())
  select('#temperature').html(tempSlider.value())

  // Which model to use
  modelToUse = document.querySelector('input[name="model"]:checked').value;

  // Grab the original text
  var original = textInput.value();
  // Make it to lower case
  var txt = original.toLowerCase();

  // Here is the data to post
  var data = {
    seed: txt,
    temperature: tempSlider.value(),
    length: lengthSlider.value(),
    model: modelToUse
  }

  // If we aren't waiting for previous results, go ahead and post
  if (!waiting && original.length > 1) {
    // Now we are waiting
    waiting = true;
    console.log('Posting seed: ' + txt);
    console.log(data);
    // Post to the server
    httpPost('/upload', data, success, error);
  }

  // WE got a reply
  function success(reply) {
    var result = JSON.parse(reply);
    console.log(result);
    // Update the DOM elements
    select('#original').html(original);
    select('#prediction').html(result.sentence);
    // We're not waiting anymore
    waiting = false;
  }

  // Error
  function error(reply) {
    console.log(reply);
  }
}
