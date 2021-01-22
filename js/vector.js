//vector class for sims

//I love being able to write vector classes
//because they're so simple but you can do
//some REALLY crazy cool stuff with them.
//All from code YOU wrote. Dang.
function Vector(_x, _y) {
  this.x = _x;
  this.y = _y;
}

Vector.prototype.toString = function() {
  return `[ ${this.x}, ${this.y} ]`
};

const nullVector = new Vector(0, 0);

//returns a vector that points from point 1 to point 2
function diffVector(x1, y1, x2, y2){
  return new Vector(x2 - x1, y2 - y1);
}

//IT'S IN RADIANS. DON'T FORGET.
//creates a vector with a direction of angle and a magnitude of mag
function angleMagVector(angle, mag){
  return new Vector(Math.cos(angle) * mag, Math.sin(angle) * mag);
}

//draws vec positioned with its origin at posVec using ctx.
function drawVector(posVec, vec, ctx){
  pen.beginPath();
  pen.moveTo(posVec.x, posVec.y);
  pen.lineTo(posVec.x + vec.x, posVec.y + vec.y);
  pen.stroke();
}

//returns the length of vec
function vecLength(vec){
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

//returns the angle of vec (-π at [-1, 0] up to π going clockwise)
function vecAngle(vec){
  return Math.atan2(vec.y, vec.x);
}

//returns a vector equal to vec1 + vec2
function addVectors(vec1, vec2) {
  return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
}

//returns a vector equal to vec1 - vec2
function subVectors(vec1, vec2) {
  return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
}

//modifies vec so its magnitude is mult times the original size
function multVector(vec, mult) {
  vec.x *= mult;
  vec.y *= mult;
}

//modifies vec so its magnitude is length
function setVecLength(vec, length){
  mag = vecLength(vec);
  vec.x = (vec.x / mag) * length;
  vec.y = (vec.y / mag) * length;
}

//modifies vec so its direction increases by angle
function rotateVec(vec, angle){
  mag = vecLength(vec);
  ang = vecAngle(vec);
  vec.x = Math.cos(ang + angle) * mag;
  vec.y = Math.sin(ang + angle) * mag;
}

//returns vec1·vec2
function dotProduct(vec1, vec2){
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

//returns vec1×vec2
function crossProduct(vec1, vec2){
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

//This is just for debugging, my brain can't
//handle radians without pi.
function radToDeg(rads){
  return rads * (180/Math.PI);
}

//returns the angle between vec1 and vec2
function vecAngleDiff(vec1, vec2){
  return Math.acos(dotProduct(vec1, vec2) / (vecLength(vec1) * vecLength(vec2)));
}

//see if vec1 positioned at pos1 intersects with vec2 positioned at pos2.
//returns the point of intersection stored in a vector or null.
function intersection(pos1, vec1, pos2, vec2){
  //This function is based on this math:
  //https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  // pos1 == p
  // vec1 == r
  // pos2 == q
  // vec2 == s

  let denom = crossProduct(vec1, vec2); //(r × s)
  let num1 = crossProduct(subVectors(pos2, pos1) , vec2); //(q − p) × s
  let num2 = crossProduct(subVectors(pos2, pos1) , vec1); //(q − p) × r

  if(denom == 0) //don't really care if they're parallel for my purposes.
    return null;

  let t = num1 / denom;
  let u = num2 / denom;

  if(t > 0 && t < 1 && u > 0 && u < 1) {
    let offset = new Vector(vec1.x, vec1.y);
    multVector(offset, t);
    return addVectors(pos1, offset);
  }

  return null;
}
