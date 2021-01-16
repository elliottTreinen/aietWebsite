let scroll = 0;

//debounce the scroll event so my site doesn't
//suffocate under a mountain of parchment

function debounce(func, freq){
  let set = false;
  return function () {
    if(!set){
      setTimeout(function(){
        set = false;
        func();
      }, freq)
      set = true;
    }
  }
}

let count = 0;

function updateScrollY(){
  scroll = window.scrollY;
  updateContent();
}

//at freq = 200 the scroll attribute will update 5 times a second.
//kind of a lot but better than 100 times.

updateScrollY = debounce(updateScrollY, 200);

window.addEventListener('scroll', updateScrollY);
