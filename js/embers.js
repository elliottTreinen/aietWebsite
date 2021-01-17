
console.log(`TESTING VECTORS`);
vec1 = new Vector(2, 7);
console.log(`CREATED VECTOR ${vec1}`);
vec2 = new Vector(12, -6);
console.log(`CREATED VECTOR ${vec2}`);
vec3 = addVectors(vec1, vec2);
console.log(`SUM OF VECTORS ${vec3}`);
vec4 = subVectors(vec1, vec2);
console.log(`DIF OF VECTORS ${vec4}`);

//set up drawing canvas
const emberCanvas = document.getElementById("emberCanvas");

emberCanvas.width = window.innerWidth;
emberCanvas.height = window.innerHeight;


//set drawing options
let pen = emberCanvas.getContext('2d');

pen.fillStyle = 'green';
pen.strokeStyle = 'red';

//set to store all embers in
let emberSet = new Set();
let numEmbers = 10;

//object to store data on each ember
function Ember(startX, startY, size){
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

  if(this. y < 0){
    this.y = emberCanvas.height;
    this.lastY = this.y;
  }

  if(this. x < 0){
    this.x = emberCanvas.width - 1;
    this.lastX = this.x;
  }

  if(this. x > emberCanvas.width){
    this.x = 1;
    this.lastX = this.x;
  }
}

for(let i = 0; i < numEmbers; i++)
{
  emberSet.add(new Ember((window.innerWidth / numEmbers) * i, window.innerHeight, 2));
}

function renderEmbers(){
  pen.clearRect(0, 0, emberCanvas.width, emberCanvas.height);
  pen.beginPath();
  for(let ember of emberSet){
    ember.draw();
  }
  pen.stroke();
}

function updateEmbers(){
  for(let ember of emberSet){
    ember.update();
  }
}


//this is called to update simulation
function simStep(){
  updateEmbers();
  renderEmbers();
  window.requestAnimationFrame(simStep);
}

window.requestAnimationFrame(simStep);

//Apparently this isn't as efficient.
//setInterval(simStep, 50);
