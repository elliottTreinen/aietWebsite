//USES THROTTLE METHOD FROM scrollThrottle.js !!!
let mousePos = new Vector(0, 0);


let updateMouse = (event) => {
  //Found this bit online, apprently mouseEvents
  //are sent differently between browsers? Gross.
  if (event) {
    //FireFox
    mousePos.x = event.pageX;
    mousePos.y = event.pageY - scroll;
  } else {
    //IE
    mousePos.x = window.event.x + document.body.scrollLeft - 2;
    mousePos.y = window.event.y + document.body.scrollTop - 2 - scroll;
  }

  //console.log(`mX: ${mousePos.x}   mY: ${mousePos.y}`);
}

//I'm not entirely sure this is necessary,
//but better safe than sorry.
//updateMouse = throttle(updateMouse);

window.addEventListener('mousemove', updateMouse);
