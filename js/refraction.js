const simSection = document.getElementById("refractionSim");
let simBorder = simSection.getBoundingClientRect();
let simOrigin = new Vector(simBorder.x, simBorder.y);//sim box's location relative to screen
const simHeight = simBorder.height;
const simWidth = simBorder.width;

//vectors representing the edges of the sim container
const topBottom = new Vector(simWidth, 0);
const leftRight = new Vector(0, simHeight);

const maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);//furthest distance we'll have to check for collision
const relBeamOrigin = new Vector(2, simHeight / 2);//where the beam starts relative to the simOrigin

//these are the refractive indices being used
const air_n = 1;
const refractor_n = 1.5;//this makes the refractors about equivalent to glass

let inRefractor = false;
let onScreen = false;//this'll let us shut stuff down when offscreen
let beamVector = new Vector(1, 0);
let lastMouseY = simHeight / 2;
let lastMouseX = 100;
let beamColor = '#83bcfc';
let waver = 0;
let firstSegment = true;

//stores two vectors needed to check collision
function SimVector(_pos, _vec){
  this.pos = _pos;
  this.vec = _vec;
};

//we can check these vectors to see if the beam is at the edge of the sim
let borderSet = new Set();
borderSet.add(new SimVector(nullVector, topBottom));
borderSet.add(new SimVector(leftRight, topBottom));
borderSet.add(new SimVector(nullVector, leftRight));
borderSet.add(new SimVector(topBottom, leftRight));

//randomly generating refractor triangles based on sim size
let refractorRows = Math.floor(simHeight / 150);
let refractorCols = Math.floor(simWidth / 250);

let rowSpace = simHeight / (refractorRows - 1);
let colSpace = simWidth / (refractorCols - 1);

refractorRows--;
refractorCols--;

let refractorSet = new Set();
for(let i = 0; i < refractorCols; i ++)
{
  for(let j = 0; j < refractorRows; j ++)
  {
    if(i != 0 || refractorRows % 2 == 0 || j != Math.floor(refractorRows / 2)){
      let center = new Vector(colSpace / 2 + colSpace * i, rowSpace / 2 + rowSpace * j);
      let ang = Math.random() * Math.PI * 2;
      let p1 = addVectors(angleMagVector(ang, 70), center);
      ang += Math.PI / 3 + Math.random() * Math.PI * .4;
      let p2 = addVectors(angleMagVector(ang, 70), center);
      ang += Math.PI / 3 + Math.random() * Math.PI * .4;
      let p3 = addVectors(angleMagVector(ang, 70), center);

      refractorSet.add(new SimVector(p1, subVectors(p2, p1)));
      refractorSet.add(new SimVector(p2, subVectors(p3, p2)));
      refractorSet.add(new SimVector(p3, subVectors(p1, p3)));
    }
  }
}

//caching the refractor drawings on a second canvas
//(this was supposed to improve performance, I don't think it did.)
let refractorCanvas = document.createElement('canvas');
refractorCanvas.width = drawingCanvas.width;
refractorCanvas.height = drawingCanvas.height;

let refPen = refractorCanvas.getContext("2d");

refPen.lineWidth = 3;
refPen.strokeStyle = '#d7d7d7';

for(rfr of refractorSet){
  drawVector(rfr.pos, rfr.vec, refPen);
}


//updates the sim's position on the canvas to appear as though it's
//scrolling with the page elements. It kinda lags behind still which
//bugs me, but I can't figure out how to make it tighter.
function scrollRefraction(){
  simBorder = simSection.getBoundingClientRect();
  simOrigin.y = simBorder.y;
  onScreen = false;
  if(simBorder.top < h && simBorder.bottom > 0)
    onScreen = true;
}

//find where the beam intersects with the border of the sim and adjusts the beam accordingly.
function checkBorders(){
  for(let bdr of borderSet){
    sect = intersection(beamOrigin, beamVector, addVectors(simOrigin, bdr.pos), bdr.vec);
    if(sect != null)
    {
      beamVector = diffVector(beamOrigin.x, beamOrigin.y, sect.x, sect.y);
    }
  }
}

//checks to see if the beam collides with a refractor. if it does, refract.
function checkRefractors(){
  let closestRefractor = null;
  let closestDist = -1;

  //find the nearest collider the beam collides with
  for(refractor of refractorSet){
    let sect = intersection(beamOrigin, beamVector, addVectors(refractor.pos, simOrigin), refractor.vec);
    if(sect != null){
      let dist = vecLength(subVectors(sect, beamOrigin));
      if(closestDist == -1 || dist < closestDist){
        closestDist = dist;
        closestRefractor = refractor;
      }
    }
  }

  //if it hits a refractor, refract accordingly.
  if(closestDist != -1){
    refract(closestDist, closestRefractor);
    return true;
  }

  return false;
}

//now this just draws the pre-drawn canvas onto the main canvas
function drawRefractors(){
  pen.drawImage(refractorCanvas, simOrigin.x, simOrigin.y);
}

//this basically just resets all the variables between each frame
//of simulation.
function updateRefraction(){
  waver = (waver + 1) % (2 * Math.PI);
  beamOrigin = addVectors (relBeamOrigin, simOrigin);
  //I accidentally removed the above line and the result is really
  //cool, the origin of the beam doesn't get reset between frames
  //so each frome the origin is left at the last place it touched
  //a refractor.
  //This means it wildly bounces around until it finally settles
  //in a location where it doesn't touch any refractors before
  //hitting the sim boundary. You can kinda get the beam to "hop"
  //from refractor to refractor. I bet there's a game that could
  //be made from that.

  //make sure mouse is inside sim before tracking it
  if(mousePos.x > simOrigin.x && mousePos.x < simOrigin.x + simWidth && mousePos.y > simOrigin.y && mousePos.y < simOrigin.y + simHeight){
    lastMouseX = mousePos.x - simOrigin.x;
    lastMouseY = mousePos.y - simOrigin.y;
    //subtracting then re-adding simOrigin since it will be updated
    //every frame when scrolling
  }
  beamVector = diffVector(beamOrigin.x, beamOrigin.y, lastMouseX + simOrigin.x, lastMouseY + simOrigin.y);
  setVecLength(beamVector, maxBeamLength);
  inRefractor = false;
}

function refract(beamLength, refractor){
  let n1 = (inRefractor ? refractor_n : air_n);
  let n2 = (inRefractor ? air_n : refractor_n);

  let normalVec = angleMagVector(vecAngle(refractor.vec) + Math.PI / 2, 10);
  if(vecAngleDiff(beamVector, normalVec) > Math.PI / 2) {
    multVector(normalVec, -1);
  }

  let theta1 = vecAngleDiff(beamVector, normalVec);
  let theta2 = Math.asin((n1 * Math.sin(theta1)) / n2);

  let offShoot = .1; //makes sure we don't hit the same refractor again

  if(isNaN(theta2)){
    theta2 = Math.PI - theta1;
    offShoot *= -1;
  }else{
    inRefractor = !inRefractor;
  }

  let normalAngle = vecAngle(normalVec);
  let beamAngle = vecAngle(beamVector);

  if(normalAngle < 0){
    if(!(beamAngle > normalAngle && beamAngle < normalAngle + Math.PI))
      theta2 *= -1;
  }else{
    if(beamAngle < normalAngle && beamAngle > normalAngle - Math.PI)
      theta2 *= -1;
  }

  let startOffset = 0;
  if(firstSegment)
    startOffset = 30;

  pen.lineWidth = 1.5 + .3 * Math.sin(waver);
  pen.strokeStyle = beamColor;
  setVecLength(beamVector, beamLength + offShoot);
  drawVector(addVectors(beamOrigin, angleMagVector(vecAngle(beamVector), startOffset)), angleMagVector(vecAngle(beamVector), beamLength + offShoot - startOffset), pen);
  beamOrigin = addVectors(beamOrigin, beamVector);
  beamVector = angleMagVector(vecAngle(normalVec) + theta2, maxBeamLength);
  firstSegment = false;
}

function drawRefraction(){
  pen.lineWidth = 3;
  pen.strokeStyle = '#d7d7d7';
  pen.strokeRect(simOrigin.x, simOrigin.y, simWidth, simHeight);
  pen.beginPath();
  pen.arc(beamOrigin.x - 2, beamOrigin.y, 30, -.5 * Math.PI, .5 * Math.PI);
  pen.stroke();

  pen.lineWidth = 1.5 + .3 * Math.sin(waver);
  pen.strokeStyle = beamColor;
  firstSegment = true;
  let refractions = 0;

  while(checkRefractors() && refractions < 100){
    refractions++;
  }

  checkBorders();

  let startOffset = 0;
  if(firstSegment)
    startOffset = 30;
  //these drawVector calls are so convoluted to accomodate the arc drawn at the start of the beam.
  drawVector(addVectors(beamOrigin, angleMagVector(vecAngle(beamVector), startOffset)), angleMagVector(vecAngle(beamVector), vecLength(beamVector) - startOffset), pen);

  drawRefractors();
}

//called every frame in canvasManager.js
function refractionSim(){
  if(onScreen)
  {
    updateRefraction();
    drawRefraction();
  }
}
