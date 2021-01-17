//USES DEBOUNCE METHOD FROM scrollDebounce.js !!!
let mouseX = 0;
let mouseY = 0;


let updateMouse = (event) => {
  //Found this bit online, apprently mouseEvents
  //are sent differently between browsers? Gross.
  if (event) {
    //FireFox
    mouseX = event.pageX;
    mouseY = event.pageY;
  } else {
    //IE
    xpos = window.event.x + document.body.scrollLeft - 2;
    ypos = window.event.y + document.body.scrollTop - 2;
  }
}

//I'm not entirely sure this is necessary,
//but better safe than sorry.
updateMouse = debounce(updateMouse, 50);

window.addEventListener('mousemove', updateMouse);
