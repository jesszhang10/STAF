/* The main functionality for the application. Creates the browser window and menu bar. 
Renders main.html. */

var {app, BrowserWindow, dialog, Menu, MenuItem, ipcMain} = require('electron');
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


/* CREATE SECOND WINDOW WHEN 'View Chart' IS CALLED */

let secondWindow;

function createSecondWindow () {
  // let state = windowStateKeeper({
  //   defaultWidth: 900, defaultHeight: 750
  // })

  secondWindow = new BrowserWindow({
    // x: state.x, y: state.y,
    // width: state.width, height: state.height,
    // minWidth: 350, maxWidth: 1200, minHeight:300,
    width: 900, height: 750,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  secondWindow.loadFile('chart.html');
  // state.manage(mainWindow);

  secondWindow.webContents.openDevTools();

  secondWindow.on('closed',  () => {
    secondWindow = null
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
          try {
            [fileName, fileContent] = openFile();
            mainWindow.webContents.send('open-file', fileName, fileContent);
          } catch {
            console.log('No file was opened.');
          }
        }, 
      },

      {label: 'Open Folder',
        accelerator: 'CommandOrControl+K',},

      {label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => {
          try {
            mainWindow.webContents.send('save-file', fileContent);
            console.log('New file content: ');
            console.log(fileContent);
          } catch {
            console.log('No file to be saved.');
          } 
        }
      },
  
      {label: 'Save As',
        accelerator: 'CommandOrControl+Shift+S',
        click: () => {
          try {
            mainWindow.webContents.send('save-as');
            saveFileAs();
          } catch {
            console.log('No file name was specified.');
          }
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
      {label: 'View Chart', 
        accelerator: 'CmdorCtrl+Q',
        click: () => {
          createSecondWindow();
          secondWindow.webContents.send('make-chart', fileContent);
        }
      },
      {label: 'Search File',
        accelerator: 'CmdorCtrl+F',
      },,
      {label: 'Expand Editor'},
      {label: 'Expand File Panel'},
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

  // Get file name and content
  const file = files[0];
  const fileName = file.substring(file.lastIndexOf('\\') + 1);  // shortened file name
  var fileContent = fs.readFileSync(file).toString();

  return [fileName, fileContent];
}



/* SAVES FILE AS NEW FILE FROM MENU BAR, INCLUDING ANY UPDATED CONTENT */
function saveFileAs() {

  dialog.showSaveDialog({
  }).then(file => {

    if (!file.canceled) {
      fs.writeFile(file.filePath.toString(), fileContent, function (err) {
        if (err) throw err;
      });
    }

  }).catch(err => {
    console.log(err)
  });
  
}

