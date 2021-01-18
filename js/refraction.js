const simSection = document.getElementById("refractionSim");
let simBorder = simSection.getBoundingClientRect();
const simOrigin = new Vector(simBorder.x, simBorder.y);
const simHeight = simBorder.height;
const simWidth = simBorder.width;
const maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);
const relBeamOrigin = new Vector(2, simHeight / 2);

let testVec = new Vector(500, 500);

//this'll let us shut stuff down when offscreen
let onScreen = false;

let mouseVector = new Vector(1, 0);

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
  mouseVector = diffVector(beamOrigin.x, beamOrigin.y, mousePos.x, mousePos.y);
  setVecLength(mouseVector, maxBeamLength);
}

function drawRefraction(){
  let refractionFinished = false;

  pen.lineWidth = 2;
  pen.strokeStyle = '#83bcfc';

  drawVector(beamOrigin, mouseVector, pen);
  drawVector(simOrigin, testVec, pen);

  sect = intersection(beamOrigin, mouseVector, simOrigin, testVec);

  if(sect != null){
    pen.beginPath();
    pen.arc(sect.x, sect.y, 10, 0, 2 * Math.PI);
    pen.stroke();
  }
}

//called every frame in canvasManager.js
function refractionSim(){
  if(onScreen)
  {
    updateRefraction();
    drawRefraction();
  }
}
