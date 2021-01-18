const simBorder = document.getElementById("refractionSim").getBoundingClientRect();
const simOrigin = new Vector(simBorder.x, simBorder.y - scroll);
const simHeight = simBorder.height;
const simWidth = simBorder.width;
const maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);
const relBeamOrigin = new Vector(0, simHeight / 2);

//this'll let us shut stuff down when offscreen
let onScreen = false;

let mouseVector = new Vector(1, 0);

function scrollRefraction(){
  onScreen = false;
  if(scroll > simBorder.top - h && scroll < simBorder.bottom)
    onScreen = true;
}

function updateRefraction(){
  simOrigin.y = simBorder.y - scroll;
  beamOrigin = addVectors (relBeamOrigin, simOrigin);
  mouseVector = diffVector(beamOrigin.x, beamOrigin.y, mousePos.x, mousePos.y);
  //setVecLength(mouseVector, 2000);
}

function drawRefraction(){
  pen.lineWidth = 4;
  pen.strokeStyle = 'black';
  pen.beginPath();
  pen.rect(simOrigin.x, simOrigin.y, simWidth, simHeight);
  pen.stroke();

  pen.strokeStyle = '#83bcfc';
  drawVector(beamOrigin, mouseVector, pen);
}

//called every frame in canvasManager.js
function refractionSim(){
  if(onScreen)
  {
    updateRefraction();
    drawRefraction();
  }
}
