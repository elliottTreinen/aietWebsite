let scroll = 0;

//debounce the scroll event so my site doesn't
//suffocate under a mountain of parchment

//Also I think this might actually be a throttling
//function, not debounce.

function debounce(func, freq) {
  let set = false;
  return function(...args) {
    if (!set) {
      window.requestAnimationFrame(function() {
        set = false;
        func(...args);
      }, freq)
      set = true;
    }
  }
}

let count = 0;

function updateScrollY() {
  scroll = window.scrollY;
  updateContent();
}

//at freq = 50 the scroll attribute will update 20 times a second
//while scrolling. kind of a lot but better than 100 times.

updateScrollY = debounce(updateScrollY);

window.addEventListener('scroll', updateScrollY);
