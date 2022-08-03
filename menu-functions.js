// const {dialog} = require('electron')
// const fs = require('fs');
// import {mainWindow} from './main.js'

// function openFile() {
//   const files = dialog.showOpenDialogSync(mainWindow, {
//     properties: ['openFile'],
//     filters: [{name: "All Files", extensions: ['*'] }]
//   })
//   if (!files) return;

//   const file = files[0];
//   console.log(file)
//   const fileContent = fs.readFileSync(file).toString();
//   console.log(fileContent);
//   // save file to sidebar
//   sidebar.style.width="40%"

// }

// module.exports = {openFile}