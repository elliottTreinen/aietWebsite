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

let borders = new Array(4);
borders[0] = new SimVector(simOrigin, topBottom);
borders[1] = new SimVector(addVectors(simOrigin, leftRight), topBottom);
borders[2] = new SimVector(simOrigin, leftRight);
borders[3] = new SimVector(addVectors(simOrigin, topBottom), leftRight);

function scrollRefraction(){
  simBorder = simSection.getBoundingClientRect();
  onScreen = false;
  if(simBorder.top < h && simBorder.bottom > 0)
    onScreen = true;
}

function updateRefraction(){
  simBorder = simSection.getBoundingClientRect();
  simOrigin.y = simBorder.y;
  beamOrigin = addVectors (relBeamOrigin, simOrigin);
  beamVector = diffVector(beamOrigin.x, beamOrigin.y, mousePos.x, mousePos.y);
  setVecLength(beamVector, maxBeamLength);

  borders[1].pos = addVectors(simOrigin, leftRight);
  borders[3].pos = addVectors(simOrigin, topBottom);
}

function drawRefraction(){
  let refractionFinished = false;

  pen.lineWidth = 2;
  pen.strokeStyle = '#83bcfc';


  for(bdr of borders){
    sect = intersection(beamOrigin, beamVector, bdr.pos, bdr.vec);
    if(sect != null)
    {
      beamVector = diffVector(beamOrigin.x, beamOrigin.y, sect.x, sect.y);
      refractionFinished = true;
    }
  }

  drawVector(beamOrigin, beamVector, pen);
}

//called every frame in canvasManager.js
function refractionSim(){
  if(onScreen)
  {
    updateRefraction();
    drawRefraction();
  }
}
