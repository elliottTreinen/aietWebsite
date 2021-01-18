//// TODO: Update canves size on debounced window resize.

let embersUpdating = true;
let lastScroll = scroll;

//drawing with this gradient gives the embers a nice
//"rising away from the fire" feel.
let gradient = pen.createLinearGradient(0, 0, 0, h);
gradient.addColorStop(1, '#83bcfc');
gradient.addColorStop(0, '#2c2a2c');

//uh oh, is this an easter egg?
let gradient2 = pen.createLinearGradient(0, 0, 0, h);
gradient2.addColorStop(1, '#ffcf86');
gradient2.addColorStop(0, '#2c2a2c');

let currentGradient = gradient;

//set to store all embers in
let emberSet = new Set();
let numEmbers = w * h * (.00005);

//Simulation vectors
let updraft = new Vector(0, -3);

//=================================================object to store data on each ember
function Ember(startX, startY, size) {
  this.pos = new Vector(startX, startY);
  this.lastPos = new Vector(startX, startY);
  this.spd = angleMagVector((Math.random() * 2 * Math.PI) - Math.PI, 1);

  //vars for the wander algorithm
  this.wanderPointer = angleMagVector((Math.random() * 2 * Math.PI) - Math.PI, 1);
  this.wanderOffset = Math.random() * .5 + 1;

  this.sz = size;
}

//=================================================each ember will draw themselves
Ember.prototype.draw = function() {
  pen.lineWidth = this.sz;
  pen.beginPath();
  pen.moveTo(this.lastPos.x, this.lastPos.y);
  pen.lineTo(this.pos.x, this.pos.y);
  pen.stroke();
}

//=================================================each ember will update its own position
Ember.prototype.update = function() {
  this.lastPos.x = this.pos.x;
  this.lastPos.y = this.pos.y;

  //update random wander vector
  rotateVec(this.wanderPointer, Math.random() * .5 - .25);

  //this is a loose application of the wander algorithm
  this.spd = addVectors(this.wanderPointer, angleMagVector(vecAngle(this.spd), this.wanderOffset));
  let draftSpeed = addVectors(this.spd, updraft);

  //if ember is within 100px of mouse, pull it to 40px away from mouse.
  let mouseVec = diffVector(mousePos.x, mousePos.y, this.pos.x, this.pos.y)
  let mouseDist = vecLength(mouseVec);
  setVecLength(mouseVec, (mouseDist < 100 ? (40 - mouseDist) / 4 : 0));

  //combine the embers speed with mouse influence
  if(embersUpdating)
    this.pos = addVectors(this.pos, addVectors(draftSpeed, mouseVec));

  //allow embers to loop around edges of screen.
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

  return mouseDist < 140;
}

//=================================================create initial embers
for (let i = 0; i < numEmbers; i++) {
  emberSet.add(new Ember(Math.random() * w, Math.random() * h, 1 + Math.floor(Math.random() * 3)));
}

//called when scroll updates in pageScrolling.js
function scrollEmbers(){
  updraft.y -= scroll - lastScroll;
  lastScroll = scroll;
}

//update ember positions
function updateEmbers() {
  let allCap = true; //this is for the easter egg
  for (let ember of emberSet) {
    allCap = ember.update() && allCap;
  }

  if(allCap)
    currentGradient = gradient2;

  updraft.y = -3;
}

//draw the embers.
function renderEmbers() {
  pen.strokeStyle = currentGradient;
  for (let ember of emberSet) {
    ember.draw();
  }
}

//=================================================this is called every frame in canvasManager.js.
function emberSim(){
  updateEmbers();
  renderEmbers();
}
