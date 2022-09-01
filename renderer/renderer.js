/* Renderer functions to enable opening and saving files. */

var { ipcRenderer } = require('electron');

var fileName = ''; // stores the most recently loaded or recently clicked file
var buttonToContent = {}; // maps each button to its file content
var currentClickedBtn = null;

/* The renderer takes the file and adds its name as a button to the sidebar. 
It stores that the file's content in the buttonToContent dictionary.
When the button is clicked, its content is loaded in content pages. */

ipcRenderer.on('open-file', function (e, filename, fileContent)
{
    // 1. Set fileName to most recently opened file
    fileName = filename;

    // 2. Load content pages
    document.getElementById("myContentPages").innerHTML = "<pre><code>" + fileContent +"</code></pre>";

    // 3. Create button for each file with unique ID
    createButton(filename, fileContent);
});


/* The renderer saves the file and updates the file's content locally
and in the buttonToContent dictionary. */

ipcRenderer.on('save-file', function (e, fileContent)
{
    // Retrieve updated fileContent from editor
    fileContent = document.getElementById('myContentPages').innerText;
    buttonToContent[fileName] = fileContent;

    // Overwrite file with new changes
    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.log(err);
        }
    }); 

    // Send fileContent back to main.js in order to store changes (97)
    e.sender.send('file-saved', fileContent);
});


/* Receives the call to save file as another file. */
ipcRenderer.on('save-as', function (e)
{
    // Update fileContent to be what's in the editor
    var contentPages = document.getElementById('myContentPages');
    fileContent = contentPages.innerText;
});


/* Function that creates a button given file name and content. */
function createButton(filename, fileContent) {
    fileName = filename;

    if (!(fileName in buttonToContent)) {
        var fileBtn = document.createElement('div');
        fileBtn.className = 'fileButton';
        fileBtn.id = fileName;
        fileBtn.innerHTML = fileName;

        // Map file name (button) to its content
        buttonToContent[fileName] = fileContent;

        // Highlight recently opened file in sidebar
        if (currentClickedBtn) {
            currentClickedBtn.style.backgroundColor = '#00223B';
        }
        fileBtn.style.backgroundColor = '#2c456e';
        currentClickedBtn = fileBtn;
        
        // When another file is clicked or loaded in, highlight that button & display its file content
        fileBtn.onclick = function() {
            // Set old button back to main color
            if (currentClickedBtn) {
                currentClickedBtn.style.backgroundColor = '#00223B';
            }
            // Set newly clicked button to brighter color
            fileBtn.style.backgroundColor = '#2c456e';
            currentClickedBtn = fileBtn;

            // Display file content in editor
            fileName = fileBtn.id;
            document.getElementById("myContentPages").innerHTML = "<pre><code>" + buttonToContent[fileName] +"</code></pre>";     
        }

        // Create close button for each file 
        var closeBtn = document.createElement('button');
        closeBtn.className = 'closeButton';  
        closeBtn.innerHTML = '&times';
        fileBtn.appendChild(closeBtn);

        // When close is clicked, remove child
        closeBtn.onclick = function() {
            document.getElementById("mySidebar").removeChild(fileBtn);          
            // Remove from dictionary of buttons for this session
            delete buttonToContent[filename];

            fileContent = '';
            // Needs fix: this line should clear editor instead of setting it to 'undefined'
            document.getElementById("myContentPages").innerHTML = fileContent;
        }

        document.getElementById("mySidebar").appendChild(fileBtn);
    }
}