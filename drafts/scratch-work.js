
// RENDERER.JS
// const { ipcRenderer } = require( "electron" );

// ipcRenderer.on('open-file', function (filename)
// {
//     console.log('hello');
//     // console.log(filename);
// });


// MAIN.HTML
// <div id="myTerminal" class="terminal"> 
//   <button id="btn" class="openTerminal" onclick="openTerminal()">^</button>
// </div>


// SIDEBAR-TERMINAL-BUTTONS.JS
// var timesTermClicked = 0;

// // Allows you to expand and close thse sidebar using the '^' icon. 
// function openTerminal() {
//   if (timesTermClicked % 2 == 0) {
//     document.getElementById("myTerminal").style.height = "4%";
//     document.getElementById("myContentPages").style.height = "96%";
//   } else {
//     document.getElementById("myTerminal").style.height = "20%";
//     document.getElementById("myContentPages").style.height = "80%";
//   }
//   timesTermClicked++;
// }


// MAIN.CSS
// .contentArea > .terminal{
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 80%;
//   height: 20%;
//   background-color: #1b4b7f;
//   transition: 0.4s;
// }

// .terminal .openTerminal{
//   position: absolute;
//   right: 1px;
//   top: 1px;
//   font-size: 20px;
//   color: #dfe6f6;
//   background-color: #1b4b7f;
//   border: none;
// }


// MAIN.JS
// let terminalMenu = new MenuItem(
//     { 
//       label: 'Terminal',
//       submenu: [
//         {label: 'New Terminal'},
//         {label: 'Split Terminal'},
//         {label: 'Run Task'}
//       ]
//     }
//   )

