const simSection = document.getElementById("refractionSim");
let simBorder = simSection.getBoundingClientRect();
let simOrigin = new Vector(simBorder.x, simBorder.y);//sim box's location relative to screen
let simHeight = simBorder.height;
let simWidth = simBorder.width;

//vectors representing the edges of the sim container
let topBottom = new Vector(simWidth, 0);
let leftRight = new Vector(0, simHeight);

let maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);//furthest distance we'll have to check for collision
let relBeamOrigin = new Vector(2, simHeight / 2);//where the beam starts relative to the simOrigin

//these are the refractive indices being used
const air_n = 1;
const refractor_n = 1.333;//this makes the refractors about equivalent to water

let inRefractor = false;
let onScreen = false;//this'll let us shut stuff down when offscreen
let beamVector = new Vector(1, 0);
let lastMouseY = simHeight / 2;
let lastMouseX = 100;
let beamColor = '#83bcfc';
let firstSegment = true;

//stores two vectors needed to check collision
function SimVector(_pos, _vec){
  this.pos = _pos;
  this.vec = _vec;
};

//we can check these vectors to see if the beam is at the edge of the sim
let borderSet = new Set();
function addBorders(){
  borderSet.clear();
  borderSet.add(new SimVector(nullVector, topBottom));
  borderSet.add(new SimVector(leftRight, topBottom));
  borderSet.add(new SimVector(nullVector, leftRight));
  borderSet.add(new SimVector(topBottom, leftRight));
}

let refractorSet = new Set();

//randomly generating refractor triangles based on sim size
function generateRefractors(){
  refractorSet.clear();
  let refractorRows = Math.floor(1.5 + simHeight / 300);
  let refractorCols = Math.floor(1.5 + simWidth / 300);

  let rowSpace = simHeight / (refractorRows);
  let colSpace = simWidth / (refractorCols);

  let triangleRadius = Math.min(rowSpace / 2 - (7 + simHeight / 50), colSpace / 2 - (7 + simWidth / 50));

  for(let i = 0; i < refractorCols; i ++)
  {
    for(let j = 0; j < refractorRows; j ++)
    {
      if(i != 0 || refractorRows % 2 == 0 || j != Math.floor(refractorRows / 2)){
        let center = new Vector(colSpace / 2 + colSpace * i, rowSpace / 2 + rowSpace * j);
        let ang = Math.random() * Math.PI * 2;
        let p1 = addVectors(angleMagVector(ang, triangleRadius), center);
        ang += Math.PI / 3 + Math.random() * Math.PI * .4;
        let p2 = addVectors(angleMagVector(ang, triangleRadius), center);
        ang += Math.PI / 3 + Math.random() * Math.PI * .4;
        let p3 = addVectors(angleMagVector(ang, triangleRadius), center);

        refractorSet.add(new SimVector(p1, subVectors(p2, p1)));
        refractorSet.add(new SimVector(p2, subVectors(p3, p2)));
        refractorSet.add(new SimVector(p3, subVectors(p1, p3)));
      }
    }
  }
}

//caching the refractor drawings on a second canvas
//(this was supposed to improve performance, I don't think it did.)
let refractorCanvas = document.createElement('canvas');
let refPen = refractorCanvas.getContext("2d");

function cacheRefractors(){
  refractorCanvas.width = drawingCanvas.width;
  refractorCanvas.height = drawingCanvas.height;

  refPen.lineWidth = 3;
  refPen.strokeStyle = '#d7d7d7';

  for(rfr of refractorSet){
    drawVector(rfr.pos, rfr.vec, refPen);
  }
}

//calling this reloads the simulation to fit the current screen size
function generateRefractionSim() {
    addBorders();
    generateRefractors();
    cacheRefractors();
}

generateRefractionSim();

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

//only resize if sim size has changed by more than 15% in either direction
//this will hopefully prevent it from constantly regenerating on mobile
function resizeRefraction(){
  let tempBorder = simSection.getBoundingClientRect();
  let newWidth = tempBorder.width;
  let newHeight = tempBorder.height;

  if(Math.abs(simWidth - newWidth) > simWidth * .15 || Math.abs(simHeight - newHeight) > simHeight * .15){
    simBorder = tempBorder;
    simWidth = newWidth;
    simHeight = newHeight;
    simOrigin.x = simBorder.x;
    simOrigin.y = simBorder.y;
    topBottom.x = simWidth;
    leftRight.y = simHeight;
    maxBeamLength = Math.sqrt(simHeight * simHeight + simWidth * simWidth);//furthest distance we'll have to check for collision
    relBeamOrigin.y = simHeight / 2;

    generateRefractionSim();
  }
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
  if(hasMouse){
    if(mousePos.x > simOrigin.x && mousePos.x < simOrigin.x + simWidth && mousePos.y > simOrigin.y && mousePos.y < simOrigin.y + simHeight){
      lastMouseX = mousePos.x - simOrigin.x;
      lastMouseY = mousePos.y - simOrigin.y;
      //subtracting then re-adding simOrigin since it will be updated
      //every frame when scrolling
    }
  }else{
    lastMouseX = 30 + simOrigin.x;
    lastMouseY = (h / 2) - simOrigin.y;
  }
  beamVector = diffVector(beamOrigin.x, beamOrigin.y, lastMouseX + simOrigin.x, lastMouseY + simOrigin.y);
  setVecLength(beamVector, maxBeamLength);
  inRefractor = false;
}

//the heart of the simulation. Takes a reference to the refractor hit
//by the beam and how far away the collision is from the beam origin.
//Uses vector math and Snell's law to calculate the angle of incidence
//followed by the angle of refraction. Rotates the beam accordingly
//and sets the origin so it's ready to look for the next refractor.
function refract(beamLength, refractor){
  let n1 = (inRefractor ? refractor_n : air_n);
  let n2 = (inRefractor ? air_n : refractor_n);

  //get the vector normal to the refractor, pointing away from the  beam origin.
  let normalVec = angleMagVector(vecAngle(refractor.vec) + Math.PI / 2, 10);
  if(vecAngleDiff(beamVector, normalVec) > Math.PI / 2) {
    multVector(normalVec, -1);
  }

  //calculate angles of incidence and refraction
  let theta1 = vecAngleDiff(beamVector, normalVec);
  let theta2 = Math.asin((n1 * Math.sin(theta1)) / n2);

  let offShoot = .1; //makes sure we don't hit the same refractor again

  //check for total internal refraction
  if(isNaN(theta2)){
    theta2 = Math.PI - theta1;
    offShoot *= -1;
  }else{
    inRefractor = !inRefractor;
  }

  let normalAngle = vecAngle(normalVec);
  let beamAngle = vecAngle(beamVector);
  //make sure the beam refracts in the right direction and doesn't
  //"double back" on itself.
  if(normalAngle < 0){
    if(!(beamAngle > normalAngle && beamAngle < normalAngle + Math.PI))
      theta2 *= -1;
  }else{
    if(beamAngle < normalAngle && beamAngle > normalAngle - Math.PI)
      theta2 *= -1;
  }

  //accomodate the arc at the start of the beam.
  let startOffset = 0;
  if(firstSegment)
    startOffset = 30;

  //draw last beam segment and rotate for the next
  pen.lineWidth = 2;
  pen.strokeStyle = beamColor;
  setVecLength(beamVector, beamLength + offShoot);
  drawVector(addVectors(beamOrigin, angleMagVector(vecAngle(beamVector), startOffset)), angleMagVector(vecAngle(beamVector), beamLength + offShoot - startOffset), pen);
  beamOrigin = addVectors(beamOrigin, beamVector);
  beamVector = angleMagVector(vecAngle(normalVec) + theta2, maxBeamLength);
  firstSegment = false;
}

//draws the whole simulation
function drawRefraction(){
  pen.lineWidth = 3;
  pen.strokeStyle = '#d7d7d7';
  pen.beginPath();
  pen.arc(beamOrigin.x - 2, beamOrigin.y, 30, -.5 * Math.PI, .5 * Math.PI);
  pen.stroke();

  pen.lineWidth = 2;
  pen.strokeStyle = beamColor;
  firstSegment = true;
  let refractions = 0;

  //draws each segment of the beam, capped at 100 to be safe.
  while(checkRefractors() && refractions < 100){
    refractions++;
  }

  //find where the beam hits the edge of the sim
  checkBorders();

  let startOffset = 0;
  if(firstSegment)
    startOffset = 30;
  
  //these drawVector calls are so convoluted to accomodate the arc drawn at the start of the beam.
  drawVector(addVectors(beamOrigin, angleMagVector(vecAngle(beamVector), startOffset)), angleMagVector(vecAngle(beamVector), vecLength(beamVector) - startOffset), pen);

  pen.lineWidth = 3;
  pen.strokeStyle = '#d7d7d7';
  pen.strokeRect(simOrigin.x, simOrigin.y, simWidth, simHeight);

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
