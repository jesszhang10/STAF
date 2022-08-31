/* Functions that set up the layout of the app. */

var timesNavClicked = 0;

// Function to expand and shrink the sidebar. (not yet implemented)
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


