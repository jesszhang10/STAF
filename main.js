/* The main process for the application. Creates the browser window and menu bar. 
Renders main.html, and chart.html if the user selects 'View Chart' from the menu bar. */

const {app, BrowserWindow, dialog, Menu, MenuItem, ipcMain} = require('electron');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const { StringDecoder } = require('string_decoder');
const { getHeapCodeStatistics } = require('v8');

/* CREATE MAIN WINDOW */

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: true
    }
  })

  mainWindow.loadFile('renderer/main.html');
  // state.manage(mainWindow);

  // Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(mainMenu);
  
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}


/* CREATE SECOND WINDOW WHEN 'View Chart' IS SELECTED */

let secondWindow;

function createSecondWindow () {

  secondWindow = new BrowserWindow({
    width: 900, height: 750,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  secondWindow.loadFile('chart-window/chart.html');

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
            ipcMain.once('file-saved', (e, content) => {
              fileContent = content;
            })
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
            saveFileAs(fileContent);
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

/* Opens file from menu bar, returns file name & content */
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



/* Saves file as new file from menu bar, including any updated content */
function saveFileAs(fileContent) {

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


/* Create new file when 'new-file' icon is clicked. */
ipcMain.on('create-new-file', (event) => {
  var fileContent = '';
  saveFileAs(fileContent);
  console.log('here');
  console.log(fileName);
  event.sender.send('filename', fileName);
});


/* Download file when 'download' icon is clicked. */
ipcMain.on('download-file', (event) => {
  saveFileAs(fileContent);
});


