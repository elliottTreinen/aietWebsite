let scroll = 0;

//I know you're supposed to debounce this, but
//the draw of smooth animations is too strong...

function throttle(func) {
  let set = false;
  return function(...args) {
    if (!set) {
      window.requestAnimationFrame(function() {
        set = false;
        func(...args);
      })
      set = true;
    }
  }
}

let count = 0;

function updateScrollY() {
  scroll = window.scrollY;
  updateContent();
}
updateScrollY = throttle(updateScrollY);

window.addEventListener('scroll', updateScrollY);
