// Modules
const {app, BrowserWindow, dialog, Menu, MenuItem} = require('electron')
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const { StringDecoder } = require('string_decoder');
const { getHeapCodeStatistics } = require('v8');
const fetch = require("node-fetch");
// const lib = require("./menu-functions.js")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// import openFile from './open-file.js'
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // Win state keeper

  // let state = windowStateKeeper({
  //   defaultWidth: 1000, defaultHeight: 800
  // })

  mainWindow = new BrowserWindow({
    // x: state.x, y: state.y,
    // width: state.width, height: state.height,
    // minWidth: 350, maxWidth: 1200, minHeight:300,
    width: 1000, height: 800,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // // Manage new window state
  // state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(mainMenu)
  
  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

let mainMenu = new Menu()

let fileMenu = new MenuItem(
  { 
    label: 'File',
    submenu: [
      {label: 'Open File',
       accelerator: 'CommandOrControl+N',
       click() {
          openFile();
       }
      },
      {label: 'Open Folder'},
      {label: 'Save'},
      {label: 'Save As'},
      {label: 'Close File'},
      {label: 'Close Folder'},
      {label: 'Revert File'}
    ]
  }
)

let editMenu = new MenuItem(
  { 
    label: 'Edit',
    role: 'editMenu'
    // label: 'Edit',
    // submenu: [
    //   {label: 'Undo',      
    //    role: 'undo'
    //   }, 
    //   {label: 'Redo'},
    //   {label: 'Cut'},
    //   {label: 'Copy'},
    //   {label: 'Paste'},
    //   {label: 'Find'},
    //   {label: 'Replace'}
    // ]
  }
)

let viewMenu = new MenuItem(
  { 
    label: 'View',
    submenu: [
      {label: 'Search File'},
      {label: 'Expand File Panel'},
      {label: 'Expand Editor'},
      {label: 'Expand Terminal'},
      {label: 'Close File Panel'},
      {label: 'Close Terminal'}
    ]
  }
)

let terminalMenu = new MenuItem(
  { 
    label: 'Terminal',
    submenu: [
      // add shortcuts later
      {label: 'New Terminal'},
      {label: 'Split Terminal'},
      {label: 'Run Task'}
    ]
  }
)

mainMenu.append(fileMenu)
mainMenu.append(editMenu)
mainMenu.append(viewMenu)
mainMenu.append(terminalMenu)

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; 

// test ing for adding text to sidebar
function addText() {
  document.getElementById('mySidebar').innerHTML += "Next file<br/><br/>";
}


// open file from menu bar
function openFile() {
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{name: "All Files", extensions: ['*'] }]
  })

  if (!files) return;

  const file = files[0];
  const fileName = file.substring(file.lastIndexOf('\\') + 1);  // shortened file name

  const fileContent = fs.readFileSync(file).toString();
  console.log(fileContent);

  // print something to sidebar as a result -> *blocker: cannot access html element*
  // fetch('renderer/main.html')
  //   .then(result => { return result.text(); })
  //   .then(content => document.getElementById("mySidebar").innerHTML = content)
  document.getElementById('mySidebar').innerHTML += "Opened file<br/><br/>";
}
 