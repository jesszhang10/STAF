/* Called from 'View Chart' in the menu bar. Creates chart in a new window. */

const { ipcRenderer } = require('electron');
const Chart = require('chart.js');


// Create chart in new window
ipcRenderer.on('make-chart', function (e, fileContent)
{
    makeChart(fileContent);
});


// Function to create chart 
function makeChart(fileContent) {
    try {
        /* PART 1: READ DATA */
        // 1. Load in json data
        fileContent = JSON.parse(fileContent);

        // 2. Try to pull specs from json 
        var specs = fileContent['specifications'][0];

        // 3. Build up chart labels from targets, since targets will be in every json file
        var labels = [];
        for (let [label, value] of Object.entries(specs['targets'])) {
            if (!isNaN(value)) {
                labels.push(label);
            }
        }         
        
        // 4. Filter specs to only ones with data attributes (these will be dictionaries)    
        var datasets = [];
        var index = 0;

        for (let [specName, specValues] of Object.entries(specs)) {
            let datasetDict = {};

            if (isDict(specValues)) {    
                // a. Set label        
                datasetDict['label'] = specName;

                // b. Fill data (only numerical values)
                data = [];
                for (let [key, value] of Object.entries(specs[specName])) {
                    if (!isNaN(value)) {
                        data.push(value);
                    }
                }
                datasetDict['data'] = data;
                datasets.push(datasetDict);  

                // c. Set color
                var color = colors[index];
                var colorTransparent = colorsTransparent[index];

                datasetDict['fill'] = true;
                datasetDict['backgroundColor'] = colorTransparent;
                datasetDict['borderColor'] = color;
                datasetDict['pointBackgroundColor'] = color;
                datasetDict['pointHoverBackgroundColor'] = '#fff';
                datasetDict['pointHoverBorderColor'] = color;
                index += 1;
            }
        }


        /* PART 2: DRAW CHART */

        // 1. Clear content pages
        var chartPages = document.getElementById('myChartPages');
        chartPages.innerHTML = '';

        // 2. Create canvas for chart
        var canvas = document.createElement('canvas');
        canvas.className = 'chart';
        chartPages.appendChild(canvas);
        var ctx = canvas.getContext('2d');

        var chartData = {
            labels: labels,
            datasets: datasets
        };          

        Chart.defaults.color = '#dfe6f6';
        Chart.defaults.borderColor = '#dfe6f6';
        Chart.defaults.borderWidth = 0.5;

        // 3. Fill in chart
        var config = new Chart(ctx, {
            type: 'radar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                line: {
                    borderWidth: 3
                }
                },
                scales: {
                r: {
                    ticks: {
                    beginAtZero: true,
                    color: '#dfe6f6',
                    showLabelBackdrop: false
                    }
                    }
                }

            },
        }); 
    }

    catch {
        alert('Could not display chart for this data format.');
    }
}


// Color palette: Retro metro from https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data
// Up to 7 parameters enabled, defined by colors (could add more later):
// red, blue, yellow, green, orange, purple, pink
var colors = 
    ["#ea5545",
    "#27aeef",
    "#edbf33",
    "#87bc45",
    "#ef9b20",
    "#b33dc6",
    "#f46a9b"
    ];
var colorsTransparent = 
    ["#ea554566",
    "#27aeef66",
    "#edbf3366",
    "#87bc4566",
    "#ef9b2066",
    "#b33dc666",
    "#f46a9b66"
    ];


// Function to check if object is dict
function isDict(obj) {
    return typeof obj === 'object' && obj != null && !(obj instanceof Array) && !(obj instanceof String);
}


