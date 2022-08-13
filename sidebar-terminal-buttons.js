/* Functions for sidebar and terminal buttons. */

var timesNavClicked = 0;

// Allows you to expand and close thse sidebar using the 'menu' icon. 
function openNav() {
  if (timesNavClicked % 2 == 0) {
    document.getElementById("myContentPages").style.width = "96%";
    document.getElementById("mySidebar").style.width = "4%";
  } else {
    document.getElementById("myContentPages").style.width = "80%";
    document.getElementById("mySidebar").style.width = "20%";
  };
  timesNavClicked++;
}

