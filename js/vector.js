//vector class for sims
//I love vectors they're so neat

//I love being able to write vector classes
//because they're so simple but you can do
//some REALLY crazy powerful stuff with them.
//All from code YOU wrote. Dang.
function Vector(_x, _y) {
  this.x = _x;
  this.y = _y;
}

Vector.prototype.toString = function() {
  return `[ ${this.x}, ${this.y} ]`
};

let nullVector = new Vector(0, 0);

function diffVector(x1, y1, x2, y2){
  return new Vector(x2 - x1, y2 - y1);
}

//IT'S IN RADIANS. DON'T FORGET.
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

function vecLength(vec){
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function vecAngle(vec){
  return Math.atan2(vec.y, vec.x);
}

function addVectors(vec1, vec2) {
  return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
}

function subVectors(vec1, vec2) {
  return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
}

function multVector(vec, mult) {
  vec.x *= mult;
  vec.y *= mult;
}

function setVecLength(vec, length){
  mag = vecLength(vec);
  vec.x = (vec.x / mag) * length;
  vec.y = (vec.y / mag) * length;
}

function rotateVec(vec, angle){
  mag = vecLength(vec);
  ang = vecAngle(vec);
  vec.x = Math.cos(ang + angle) * mag;
  vec.y = Math.sin(ang + angle) * mag;
}

function dotProduct(vec1, vec2){
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

//2d, obviously
function crossProduct(vec1, vec2){
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

function vecAngleDiff(vec1, vec2){
  return Math.acos(dotProduct(vec1, vec2) / (vecLength(vec1) * vecLength(vec2)));
}

//interior angle of two vectors
function intVecAngle(vec1, vec2){
  let ang = vecAngle(vec1, vec2);

  if(ang > 0){
    if(ang > Math.PI / 2)
      return Math.PI - ang;
  }else{
    if(Math.abs(ang) > Math.PI / 2)
      return (-1 * Math.PI) - ang;
  }

  return ang;
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
