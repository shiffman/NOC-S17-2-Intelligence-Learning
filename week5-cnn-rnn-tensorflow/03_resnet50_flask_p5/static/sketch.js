var elephant;
var resultP;

function preload() {
  elephant = loadImage('data/elephant.jpg');
}

function setup() {
  var c = createCanvas(200, 200);
  resultP = createP('');
  image(elephant, 0, 0, width, height);
  classify(elephant);

  // Add an event for when a file is dropped onto the canvas
  c.drop(gotFile);
  
  // Add the same event for the file input
  var fileInput = createFileInput(gotFile);
}

function classify(img) {

  var base64;
  if (typeof(img) == 'string') {
    base64 = img;
  } else if (img instanceof p5.Image) {
    base64 = img.canvas.toDataURL();
  } else {
    return;
  }

  var cleaned = base64.replace(/data:image\/(png|jpeg|jpg|gif);base64,/, '');
  var data = {
    img: cleaned
  }
  httpPost('/upload', data, success, error);
  function success(reply) {
    var result = JSON.parse(reply);
    console.log(result);
    var report = '';
    for (var i = 0; i < result.prediction.length; i++) {
      var term = result.prediction[i].term;
      var confidence = result.prediction[i].score;
      report += term + ' (confidence: ' + nf(100 * confidence, 2, 1) + '%) <br/>';
    }
    resultP.html(report);
  }

  function error(reply) {
    console.log(reply);
    resultP.html('error');
  }
}

function gotFile(file) {
  // If it's an image file
  if (file.type === 'image') {
    var data = file.data;
    classify(data);
    // Create an image DOM element but don't show it
    img = createImg(data, ready);

    function ready() {
      img.hide();
      background(0);
      image(img, 0, 0, width, height);
    }
    // Draw the image onto the canvas
  } else {
    console.log('Not an image file!');
  }
}
