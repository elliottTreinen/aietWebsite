
//set up drawing canvas
const emberCanvas = document.getElementById("emberCanvas");

let w = window.innerWidth;
let h = window.innerHeight;

emberCanvas.width = w;
emberCanvas.height = h;


//set drawing options
let pen = emberCanvas.getContext('2d');

pen.fillStyle = 'green';
pen.strokeStyle = 'red';

//set to store all embers in
let emberSet = new Set();
let numEmbers = 10;

//object to store data on each ember
function Ember(startX, startY, size) {
  this.x = startX;
  this.y = startY;

  this.lastX = startX;
  this.lastY = startY;

  this.sz = size;
}

//each ember will draw themselves
Ember.prototype.draw = function() {
  pen.lineWidth = this.sz;
  pen.moveTo(this.lastX, this.lastY);
  pen.lineTo(this.x, this.y);
}

//each ember will update its own position
Ember.prototype.update = function() {
  this.lastX = this.x;
  this.lastY = this.y;
  this.y -= 9 + Math.random() * 3;
  this.x += (6 * Math.random()) - 3;

  if (this.y < 0) {
    this.y = h;
    this.lastY = this.y;
  }

  if (this.x < 0) {
    this.x = w - 1;
    this.lastX = this.x;
  }

  if (this.x > w) {
    this.x = 1;
    this.lastX = this.x;
  }
}

for (let i = 0; i < numEmbers; i++) {
  emberSet.add(new Ember((w / numEmbers) * i, h, 2));
}

function renderEmbers() {
  pen.clearRect(0, 0, w, h);
  pen.beginPath();
  for (let ember of emberSet) {
    ember.draw();
  }
  pen.stroke();
}

function updateEmbers() {
  for (let ember of emberSet) {
    ember.update();
  }
}


//this is called to update simulation
function simStep() {
  updateEmbers();
  renderEmbers();
  mouseVector = diffVector(w / 2, h / 2, )
  window.requestAnimationFrame(simStep);
}

window.requestAnimationFrame(simStep);

//Apparently this isn't as efficient.
//setInterval(simStep, 50);
