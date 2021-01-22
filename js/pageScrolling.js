const welcome = document.getElementById("welcome");
const bio = document.getElementById("bio");
const elliott = document.getElementById("elliott");
const menuBar = document.getElementById("menuBar");
const integerRect = document.getElementById("integer").getBoundingClientRect();

//make sure page starts at top after reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

welcome.innerHTML = "<h1>Welcome to my page.</h1>";

//This function is called from scrollDebounce.js whenever
//the (debounced) scroll height is updated.

function updateContent() {
  //console.log(`SCROLL: ${scroll}  TOP: ${integerRect.top}  OFFSET: ${window.innerHeight * (2/3)}`);
  if (scroll > 0) {
    bio.style.transform = "translateY(-20vh)";
    elliott.style.transform = "translateY(25vh)";
    welcome.style.transform = "translateY(-50vh)";
    menuBar.style.background = "#262626";
  } else {
    bio.style.transform = "none";
    elliott.style.transform = "none";
    welcome.style.transform = "none";
    menuBar.style.background = "#2c2a2c";
  }

  if(scroll > integerRect.top - window.innerHeight * (2/3))
  {
    document.body.style.background = "black";
    emberBehavior = false;
  }else{
    document.body.style.background = "var(--bgColor)";
    emberBehavior = true;
  }

  scrollEmbers();
  scrollRefraction();
}
