const welcome = document.getElementById("welcome");
const bio = document.getElementById("bio");
const elliott = document.getElementById("elliott");
const menuBar = document.getElementById("menuBar");
const integerRect = document.getElementById("integer").getBoundingClientRect();

//make sure page starts at top after reload.
//sometimes this doesn't work, but it does if
//I remove the first if/else in updateContent.
//I tried resetting the transitions and transforms,
//but it still scrolls down a bit sometimes.
//completely stumped.
window.onbeforeunload = function () {
  bio.style.transition = "none";
  elliott.style.transition = "none";
  welcome.style.transition = "none";
  bio.style.transform = "none";
  elliott.style.transform = "none";
  welcome.style.transform = "none";
  window.scrollTo(0, 0);
}

welcome.innerHTML = "<h1>Welcome to my page.</h1>";

//This function is called from scrollDebounce.js whenever
//the (debounced) scroll height is updated.
function updateContent() {
  //console.log(`SCROLL: ${scroll}`);

  if (scroll > 10) {
    bio.style.transform = "translateY(-20vh)";
    elliott.style.transform = "translateY(25vh)";
    welcome.style.transform = "translateY(-60vh)";
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
  closeMenu();
}
