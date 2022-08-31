
Introduction:
The overarching goal of this application is to guide users to make better design decisions by presenting data in a concise visual format. Complex datasheets are often difficult to read and understand, and STAF simplifies the process by enabling users to compare features of different systems in a radar chart. The application also serves as an editor, allowing users to view, edit, save, and share data files.


Prototype:
https://www.figma.com/proto/qrVAl5Yg7ACpn185JdYXed/STAF?node-id=91%3A794&scaling=min-zoom&page-id=0%3A1


Getting Started:
The platform was developed using Electron v16.15.1. Currently, users can load in files, edit and save files, save them as different files, and view charts.


User Flow:
A typical user flow might look like:
1. Loading in a file
2. Clicking 'Load Chart' to see the attributes. User can click on one of the systems in the legend to cross it out and observe the others.
3. Going back to the text file by clicking on it in the sidebar.
4. Saving or editing that file, or loading in another file.


Code:
Main.js: 
    - Creates the browser windows and menu bar. It renders renderer/main.html for the main window, and chart-window/chart.html for the second window (if the user selects View > View Chart from the menu bar).
Renderer:
    - Main.html: Architecture for the application
    - Main.css: Styling for main.html
    - Renderer.js: Completes the calls from the menu bar to open and save files
    - Create-chart.js: Draws the chart in the main window
    - Layout-functions: Intended to allow users to expand and shrink the sidebar (not yet implemented)
Chart-window (chart appears in new window when the user selects View > View Chart):
    - (Note (8/31): currently there is a bug preventing the chart from being loaded but this has
      previously worked before)
    - Chart.html: Architecture for the second window
    - Chart.css: Styling for chart.html
    - Chart-renderer.js: Renders display of chart in new window
Test-files:
    - Files you can use to test the drawing of the chart


Build and Test:
'npm start’ from your current directory allows you to see the application. You can log objects into dev tools and the console to test out code.


Contribute:
The application has potential for more features that would make it a better experience for users.
    - Splash page (outlined in Figma) with manual
    - Implementation of sidebar icons:
        1. Profile: connect with Git/Azure
        2. New file: create new file (done)
        3. Download: download file (done)
        4. Search: search for files
        5. Home: bring you home to splash page
    - Ability to export charts
    - A custom menu bar that fits the darker theme



