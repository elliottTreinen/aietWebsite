let menu = document.getElementById("menuBar");
let expanded = false;

closeMenu();

function toggleMenu(){
  if(expanded){
    closeMenu();
  }else{
    openMenu();
  }
}

function closeMenu(){
  if(window.innerWidth <= 850){
    menu.style.display = "none";
    expanded = false;
  }else{
    openMenu();
  }
}

function openMenu(){
  menu.style.display = "block";
  expanded = true;
}
