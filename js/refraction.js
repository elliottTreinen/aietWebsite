const simSection = document.getElementById("refractionSim");
let simBorder = simSection.getBoundingClientRect();
const simOrigin = new Vector(simBorder.x, simBorder.y);
const simHeight = simBorder.height;
const simWidth = simBorder.width;
const topBottom = new Vector(simWidth, 0);
const leftRight = new Vector(0, simHeight);
const maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);
const relBeamOrigin = new Vector(2, simHeight / 2);

//this'll let us shut stuff down when offscreen
let onScreen = false;

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



function scrollRefraction(){
  simBorder = simSection.getBoundingClientRect();
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

function drawRefractors(){
  pen.lineWidth = 3;
  pen.strokeStyle = '#d7d7d7';

  for(rfr of refractorSet){
    drawVector(addVectors(simOrigin, rfr.pos), rfr.vec, pen);
  }
}

function updateRefraction(){
  simBorder = simSection.getBoundingClientRect();
  simOrigin.y = simBorder.y;
  beamOrigin = addVectors (relBeamOrigin, simOrigin);
  beamVector = diffVector(beamOrigin.x, beamOrigin.y, mousePos.x, mousePos.y);
  setVecLength(beamVector, maxBeamLength);
}

function drawRefraction(){
  pen.lineWidth = 2;
  pen.strokeStyle = '#83bcfc';
  let inRefractor = false;


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
