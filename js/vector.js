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

function diffVector(x1, y1, x2, y2){
  return new Vector(x2 - x1, y2 - y1);
}

//IT'S IN RADIANS. DON'T FORGET.
function angleMagVector(angle, mag){
  return new Vector(Math.cos(angle) * mag, Math.sin(angle) * mag);
}

function drawVector(x1, y1, vec, ctx){
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.lineTo(x1 + vec.x, y1 + vec.y);
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

function vecAngleDiff(vec1, vec2){
  return Math.acos(dotProduct(vec1, vec2) / (vecLength(vec1) * vecLength(vec2)));
}

//interior angle of two vectors
function intVecAngle(vec1, vec2){
  let ang = vecAngle(vec1, vec2);

  if(ang > Math.PI / 2)
    return Math.PI - ang;

  return ang;
}
