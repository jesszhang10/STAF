/* The main functionality for the application. Creates the browser window and menu bar. 
Renders main.html. */

const {app, BrowserWindow, dialog, Menu, MenuItem, ipcMain} = require('electron');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const { StringDecoder } = require('string_decoder');
const { getHeapCodeStatistics } = require('v8');


/* CREATE MAIN WINDOW */

let mainWindow;

function createWindow () {
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

  mainWindow.loadFile('main.html');

  // state.manage(mainWindow);

  // Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}


/* CREATE MENU BAR */

let mainMenu = new Menu();

let fileMenu = new MenuItem(
  { 
    label: 'File',
    submenu: [

      {label: 'Open File',
        accelerator: 'CommandOrControl+O',
        click: () => {
          [fileName, fileContent] = openFile();
          mainWindow.webContents.send('open-file', fileName, fileContent);
        }, 
      },

      {label: 'Open Folder',
        accelerator: 'CommandOrControl+K',},

      {label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => {
          try {
            mainWindow.webContents.send('save-file', fileName);
          } catch {
            console.log('No file to be saved.');
          } 
        }
      },
  
      {label: 'Save As',
        accelerator: 'CommandOrControl+Shift+S',
        click: () => {
          saveFileAs();
        }
      },

      {label: 'Close File',
        accelerator: 'CmdorCtrl+W'},

      {label: 'Close Folder',
        accelerator: 'CmdorCtrl+U',
    },
    ]
  }
)

let editMenu = new MenuItem(
  { 
    label: 'Edit',
    role: 'editMenu'
  }
)

let viewMenu = new MenuItem(
  { 
    label: 'View',
    submenu: [
      {label: 'Search File'},
      {label: 'Expand File Panel'},
      {label: 'Expand Editor'},
      {label: 'Close File Panel'},
    ]
  }
)

mainMenu.append(fileMenu);
mainMenu.append(editMenu);
mainMenu.append(viewMenu);


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; 



/* MENU BAR FUNCTIONS BELOW */

/* OPENS FILE FROM MENU BAR, RETURNS FILE NAME & CONTENT */

function openFile() {
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{name: 'All Files', extensions: ['*'] }]
  })

  if (!files) return;

  const file = files[0];
  const fileName = file.substring(file.lastIndexOf('\\') + 1);  // shortened file name
  
  // Put fileContent in pretty json
  var content = fs.readFileSync(file).toString();
  var fileContent = JSON.stringify(content, null, 2).replace(/\\r\\n/g, '<br/>');
  fileContent = fileContent.replace(/\\/g, '');
  fileContent = "<pre>" + fileContent.slice(1, -1) + "</pre>";

  return [fileName, fileContent];
}



/* SAVES FILE AS NEW FILE FROM MENU BAR, INCLUDING ANY UPDATED CONTENT */
// [TODO: implement functionality]
function saveFileAs(fileName) {
  // [later] pull content from content pages

  // let filename = dialog.showSaveDialog(mainWindow, {
  //   title: 'Download File',
  //   filters: [{name: 'All Files', extensions: ['*'] }]
  // });


    // let options = {
    //   buttons: ['Close']
    // };
}




