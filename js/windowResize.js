let refractionCaption = document.getElementById("refraction p")

let w = window.innerWidth;
let h = window.innerHeight;

//so we can resize smoothly
function debounce(func) {
  let timeout = null;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func(...args);
    }, 100);
  }
}

function resize(){
  w = window.innerWidth;
  h = window.innerHeight;

  canvasResize();
  resizeEmbers();
  resizeRefraction();
  closeMenu();
}

window.addEventListener('resize', debounce(resize));
