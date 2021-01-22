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
//updateScrollY = throttle(updateScrollY);

//UPDATE: So I tested it out and throttling the scrolling/mouse position
//didn't have an impact on the script time in chrome on my computer. after
//removing them the animations were a frame or two snappier, which is
//weird because I thought requestAnimationFrame ran before the next frame.
//Either way, I'm gonna leave it off until I can test it on a few mobile
//devices since that's probably where it'd be an issue.

window.addEventListener('scroll', updateScrollY);
