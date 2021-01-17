
//vector class for sims
//I love vectors they're so neat

function Vector(_x, _y){
  this.x = _x;
  this.y = _y;
}

Vector.prototype.toString = function(){return `[ ${this.x}, ${this.y} ]`};

function addVectors(vec1, vec2){
  return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
}

function subVectors(vec1, vec2){
  return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
}
