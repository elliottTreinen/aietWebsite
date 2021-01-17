
//set up drawing canvas
const emberCanvas = document.getElementById("emberCanvas");

let w = window.innerWidth;
let h = window.innerHeight;

emberCanvas.width = w;
emberCanvas.height = h;


//set drawing options
let pen = emberCanvas.getContext('2d');

let gradient = pen.createLinearGradient(0, 0, 0, h);
gradient.addColorStop(1, '#83bcfc');
gradient.addColorStop(0, '#2c2a2c');

//set to store all embers in
let emberSet = new Set();
let numEmbers = w * h * (.00015);

//Simulation vectors
let updraft = new Vector(0, -3);

//object to store data on each ember
function Ember(startX, startY, size) {
  this.pos = new Vector(startX, startY);
  this.lastPos = new Vector(startX, startY);
  this.spd = angleMagVector((Math.random() * 2 * Math.PI) - Math.PI, 1);

  //vars for the wander algorithm
  this.wanderPointer = angleMagVector((Math.random() * 2 * Math.PI) - Math.PI, 1);
  this.wanderOffset = Math.random() * .5 + 1;

  this.sz = size;
}

//each ember will draw themselves
Ember.prototype.draw = function() {
  pen.lineWidth = this.sz;
  pen.beginPath();
  pen.moveTo(this.lastPos.x, this.lastPos.y);
  pen.lineTo(this.pos.x, this.pos.y);
  pen.stroke();
}

//each ember will update its own position
Ember.prototype.update = function() {
  this.lastPos.x = this.pos.x;
  this.lastPos.y = this.pos.y;

  //wander
  rotateVec(this.wanderPointer, Math.random() * .5 - .25);

  this.spd = addVectors(this.wanderPointer, angleMagVector(vecAngle(this.spd), this.wanderOffset));
  let draftSpeed = addVectors(this.spd, updraft);
  let mouseVec = diffVector(mouseX, mouseY, this.pos.x, this.pos.y)
  let mouseDist = vecLength(mouseVec);
  //setVecLength(mouseVec, Math.min(15, 350 / mouseDist)); //version 1
  setVecLength(mouseVec, (mouseDist < 140 ? (90 - mouseDist) / 2 : 0)); //version 2
  this.pos = addVectors(this.pos, addVectors(draftSpeed, mouseVec));

  if (this.pos.y < 0) {
    this.pos.y = h - 1;
    this.lastPos.y = this.pos.y;
  }

  if (this.pos.y > h) {
    this.pos.y = 1;
    this.lastPos.y = this.pos.y;
  }

  if (this.pos.x < 0) {
    this.pos.x = w - 1;
    this.lastPos.x = this.pos.x;
  }

  if (this.pos.x > w) {
    this.pos.x = 1;
    this.lastPos.x = this.pos.x;
  }
}

//create initial embers
for (let i = 0; i < numEmbers; i++) {
  emberSet.add(new Ember(Math.random() * w, Math.random() * h, 1 + Math.floor(Math.random() * 3)));
}

function renderEmbers() {
  pen.strokeStyle = gradient;
  pen.clearRect(0, 0, w, h);
  for (let ember of emberSet) {
    ember.draw();
  }
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

  // mouseVector = new diffVector(w / 2, h / 2, mouseX, mouseY);
  // drawVector(w / 2, h / 2, mouseVector, pen);
  //
  // console.log(`ANGLE: ${vecAngle(mouseVector)}`);

  window.requestAnimationFrame(simStep);
}

window.requestAnimationFrame(simStep);

//Apparently this isn't as efficient.
//setInterval(simStep, 50);
