/* The renderer takes the open file and adds the name as a button
to the side bar. When the button is clicked, its content is loaded
in content pages. */

const { ipcRenderer } = require('electron');

// fileName stores the most recently loaded or recently clicked file
var fileName = '';

// Receives the call to open file
ipcRenderer.on('open-file', function (e, filename, fileContent)
{
    // Set fileName for global use
    fileName = filename;

    // Create button for each file with unique ID
    var fileBtn = document.createElement('div');
    fileBtn.className = 'fileButton';
    fileBtn.id = fileName;
    fileBtn.innerHTML = fileName;

    // If button is clicked, load text into content pages
    fileBtn.onclick = function() {
        document.getElementById("myContentPages").innerHTML = fileContent;
        fileName = fileBtn.id;
    }

    document.getElementById("mySidebar").appendChild(fileBtn);

    // By default, load text of recently uploaded file into content pages
    document.getElementById("myContentPages").innerHTML = fileContent;
});



// Receives the call to save file
ipcRenderer.on('save-file', function (e, filename)
{
    let updatedContent = document.getElementById('myContentPages').innerHTML;
    console.log(updatedContent);

    // [TODO: fix formatting of content as saved in VSCode & set fileContent to updatedContent]
    fs.writeFile(filename, updatedContent, (err) =>  {   
        if (err) {
            console.log('error');  
        }     
    });   
});



