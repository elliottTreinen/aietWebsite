//This script is intended to allow both simulateScroll
//(embers and refraction) to use a single canvas while
//keeping drawing code organized.

const hasMouse = matchMedia('(pointer:fine)').matches;
const drawingCanvas = document.getElementById("drawingCanvas");

//These end up being used as shorthand
//throught both sim scripts.

drawingCanvas.width = w;
drawingCanvas.height = h;

let pen = drawingCanvas.getContext('2d');

function canvasResize() {
  drawingCanvas.width = w;
  drawingCanvas.height = h;
  pen = drawingCanvas.getContext('2d');
}

function canvasUpdate() {
  pen.clearRect(0, 0, w, h);

  //defined in embers.js
    emberSim();

  //defined in refraction.js
  refractionSim();

  window.requestAnimationFrame(canvasUpdate);
}

window.requestAnimationFrame(canvasUpdate);
