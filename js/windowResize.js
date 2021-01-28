let refractionCaption = document.getElementById("refraction p")

let w = window.innerWidth;
let h = window.innerHeight;

//so we can resize smoothly and not every frame.
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

  //defined in canvasManager.js
  canvasResize();
  //defined in embers.js
  resizeEmbers();
  //defined in refraction.js
  resizeRefraction();
  //defined in navMenu.js
  closeMenu();
}

window.addEventListener('resize', debounce(resize));
