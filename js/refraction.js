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

//stores two vectors needed to check collision
function SimVector(_pos, _vec){
  this.pos = _pos;
  this.vec = _vec;
};

let borderSet = new Set();
borderSet.add(new SimVector(nullVector, topBottom));
borderSet.add(new SimVector(leftRight, topBottom));
borderSet.add(new SimVector(nullVector, leftRight));
borderSet.add(new SimVector(topBottom, leftRight));

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

let refractorCanvas = document.createElement('canvas');
refractorCanvas.width = drawingCanvas.width;
refractorCanvas.height = drawingCanvas.height;

let refPen = refractorCanvas.getContext("2d");

refPen.lineWidth = 3;
refPen.strokeStyle = '#d7d7d7';

for(rfr of refractorSet){
  drawVector(rfr.pos, rfr.vec, refPen);
}



function scrollRefraction(){
  simBorder = simSection.getBoundingClientRect();
  simOrigin.y = simBorder.y;
  onScreen = false;
  if(simBorder.top < h && simBorder.bottom > 0)
    onScreen = true;
}

//find where the beam intersects with the border of the sim.
function checkBorders(){
  for(let bdr of borderSet){
    sect = intersection(beamOrigin, beamVector, addVectors(simOrigin, bdr.pos), bdr.vec);
    if(sect != null)
    {
      beamVector = diffVector(beamOrigin.x, beamOrigin.y, sect.x, sect.y);
    }
  }
}

function clamp(min, max, val) {
  return Math.min(Math.max(val, min), max);
};

function checkRefractors(){
  let closestRefractor = null;
  let closestDist = -1;

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

  if(closestDist != -1){
    refract(closestDist, closestRefractor);

    return true;
  }

  return false;
}

function drawRefractors(){
  pen.drawImage(refractorCanvas, simOrigin.x, simOrigin.y);
}

function updateRefraction(){
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
  beamVector = diffVector(beamOrigin.x, beamOrigin.y, mousePos.x, mousePos.y);
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

  let newOffset = .1; //makes sure we don't hit the same refrator again

  if(isNaN(theta2)){
    theta2 = Math.PI - theta1;
    newOffset *= -1;
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

  pen.strokeStyle = '#83bcfc';
  setVecLength(beamVector, beamLength + newOffset);
  drawVector(beamOrigin, beamVector, pen);
  beamOrigin = addVectors(beamOrigin, beamVector);
  beamVector = angleMagVector(vecAngle(normalVec) + theta2, maxBeamLength);
}

function drawRefraction(){
  pen.lineWidth = 3;
  pen.strokeStyle = '#d7d7d7';
  //pen.setLineDash([8, 6]);
  pen.strokeRect(simOrigin.x, simOrigin.y, simWidth, simHeight);

  pen.lineWidth = 2;
  //pen.setLineDash([]);
  pen.strokeStyle = '#83bcfc';
  let refractions = 0;

  while(checkRefractors() && refractions < 100){
    refractions++;
  }

  checkBorders();

  drawVector(beamOrigin, beamVector, pen);

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
