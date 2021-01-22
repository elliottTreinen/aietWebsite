//// TODO: Update canves size on debounced window resize.

let emberBehavior = true;
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
  this.parallaxTarget = 0;

  //vars for the wander algorithm
  this.wanderPointer = angleMagVector((Math.random() * 2 * Math.PI) - Math.PI, 1);
  this.wanderOffset = Math.random() * .5 + 1;

  this.sz = size;
}

//=================================================each ember will draw themselves
Ember.prototype.draw = function() {
  if(vecLength(diffVector(this.pos.x, this.pos.y, this.lastPos.x, this.lastPos.y)) > this.sz){
    //pen.strokeStyle = "red";
    pen.lineWidth = this.sz;
    pen.beginPath();
    pen.moveTo(this.lastPos.x, this.lastPos.y);
    pen.lineTo(this.pos.x, this.pos.y);
    pen.stroke();
  }else{
    pen.lineWidth = this.sz;
    //pen.strokeStyle = "lime";
    pen.beginPath();
    pen.moveTo(this.pos.x, this.pos.y - this.sz * .5);
    pen.lineTo(this.pos.x, this.pos.y + this.sz * .5);
    pen.stroke();
  }
}

//=================================================each ember will update its own position
Ember.prototype.update = function() {
  this.lastPos.x = this.pos.x;
  this.lastPos.y = this.pos.y;

  let mouseVec = diffVector(mousePos.x, mousePos.y, this.pos.x, this.pos.y)
  let mouseDist = vecLength(mouseVec);

  if(emberBehavior){
    //update random wander vector
    rotateVec(this.wanderPointer, Math.random() * .5 - .25);

    //this is a loose application of the wander algorithm
    this.spd = addVectors(this.wanderPointer, angleMagVector(vecAngle(this.spd), this.wanderOffset));
    let draftSpeed = addVectors(this.spd, updraft);

    //if ember is within 100px of mouse, pull it to 45px away from mouse.
    setVecLength(mouseVec, (mouseDist < 100 ? (45 - mouseDist) / 4 : 0));

    //combine the embers speed with mouse influence
    this.pos = addVectors(this.pos, addVectors(draftSpeed, mouseVec));
  }else{
    //parallax behavior
    let parallaxAmt = this.parallaxTarget * .1
    this.pos.y -= parallaxAmt;
    this.parallaxTarget -= parallaxAmt;
  }

  //allow embers to loop around edges of screen.
  if (this.pos.y < 0) {
    this.pos.y += h;
    this.lastPos.y += h;
  }

  if (this.pos.y > h) {
    this.pos.y -= h;
    this.lastPos.y -= h;
  }

  if (this.pos.x < 0) {
    this.pos.x += w;
    this.lastPos.x += w;
  }

  if (this.pos.x > w) {
    this.pos.x -= w;
    this.lastPos.x -= w;
  }

  return mouseDist < 140;
}

Ember.prototype.parallax = function(amount){
  this.parallaxTarget += amount * this.sz / 2;
}

//=================================================create initial embers
for (let i = 0; i < numEmbers; i++) {
  emberSet.add(new Ember(Math.random() * w, Math.random() * h, 1 + Math.random() * 2));
}

//called when scroll updates in pageScrolling.js
function scrollEmbers(){
  let scrollDiff = scroll - lastScroll
  updraft.y -= scrollDiff;
  lastScroll = scroll;
  if(!emberBehavior){
    for (let ember of emberSet) {
      ember.parallax(scrollDiff);
    }
  }
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
