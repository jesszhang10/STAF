/* The renderer takes the open file and adds the name as a button
to the side bar. When the button is clicked, its content is loaded
in content pages. */

const { ipcRenderer } = require('electron');


// fileName stores the most recently loaded or recently clicked file
var fileName = '';
var fileContent = '';
// Maps each button to its file content
var buttonToContent = {};
var currentClickedBtn = null;


// Receives the call to open file
ipcRenderer.on('open-file', function (e, filename, fileContent)
{
    // 1. Set fileName to most recently opened file
    fileName = filename;

    // 2. Load content pages
    document.getElementById("myContentPages").innerHTML = "<pre><code>" + fileContent +"</code></pre>";

    // 3. Create button for each file with unique ID
    if (!(fileName in buttonToContent)) {
        var fileBtn = document.createElement('div');
        fileBtn.className = 'fileButton';
        fileBtn.id = fileName;
        fileBtn.innerHTML = fileName;
        
        buttonToContent[fileName] = fileContent;

        // When a file is clicked, highlight button and display the file content
        fileBtn.onclick = function() {
            if (currentClickedBtn) {
                currentClickedBtn.style.backgroundColor = '#00223B';
            }
            fileBtn.style.backgroundColor = '#2c456e';
            currentClickedBtn = fileBtn;

            fileName = fileBtn.id;
            document.getElementById("myContentPages").innerHTML = "<pre><code>" + buttonToContent[fileName] +"</code></pre>";
        }
        document.getElementById("mySidebar").appendChild(fileBtn);

        // close button to make the whole button close
    }
});


// Receives the call to save file
ipcRenderer.on('save-file', function (e, fileContent)
{
    fileContent = document.getElementById('myContentPages').innerText;
    buttonToContent[fileName] = fileContent;
    
    // make fileContent changes persists

    // Overwrite file with new changes
    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.log(err);
        }
    }); 
});



// Receives the call to save file as another file
ipcRenderer.on('save-as', function (e)
{
    var contentPages = document.getElementById('myContentPages');
    fileContent = contentPages.innerText;
});