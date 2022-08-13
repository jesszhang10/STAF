
export default function openFile() {
    const files = dialog.showOpenDialogSync(mainWindow, {
      properties: ['openFile'],
      filters: [{name: "All Files", extensions: ['*'] }]
    })
  
    if (!files) return;
  
    // Get fileName and fileContent: to be used elsewhere
    const file = files[0];
    const fileName = file.substring(file.lastIndexOf('\\') + 1);  
    const fileContent = fs.readFileSync(file).toString();
}
  