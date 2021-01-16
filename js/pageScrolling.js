const welcome = document.getElementById("welcome");
const bio = document.getElementById("bio");
const elliott = document.getElementById("elliott");
const menuBar = document.getElementById("menuBar");
const integerRect = document.getElementById("integer").getBoundingClientRect();

//make sure page starts at top after reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

//This function is called from scrollDebounce.js whenever
//the (debounced) scroll height is updated.

function updateContent() {
  if (scroll > 0) {
    bio.style.transform = "translateY(-20vh)";
    elliott.style.transform = "translateY(25vh)";
    welcome.style.transform = "translateY(-50vh)";
    menuBar.style.boxShadow = "0 0 10px #000";
  } else {
    bio.style.transform = "none";
    elliott.style.transform = "none";
    welcome.style.transform = "none";
    menuBar.style.boxShadow = "none";
  }

  console.log(`SCROLL: ${scroll} TOP:${integerRect.top} WINDOW: ${window.innerHeight}`);
  console.log(`COMPARING: ${scroll} > ${integerRect.top - window.innerHeight / 2}`);

  if(scroll > integerRect.top - window.innerHeight / 2)
  {
    document.body.style.background = "black";
  }else{
    document.body.style.background = "var(--bgColor)";
  }
}
