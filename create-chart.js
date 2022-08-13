/* Given a json file, this function displays a radar chart for all data. */

const { contextBridge } = require("electron");

function drawChart(filename) {

    try {
        /* PART 1: READ DATA */

        // 1. Load in json data
        filename = './' + filename;
        const jsonData = require(filename);

        // 2. Try to pull specs from json. 
        var specs = jsonData['specifications'][0];

        // 3. Build up chart labels from targets, since targets will be in every json
        labels = [];
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
                color = colors[index];
                colorTransparent = colorsTransparent[index];
                datasetDict['fill'] = true;
                datasetDict['backgroundColor'] = colorTransparent;
                datasetDict['borderColor'] = color;
                datasetDict['pointBackgroundColor'] = color;
                datasetDict['pointHoverBackgroundColor'] = '#fff';
                datasetDict['pointHoverBorderColor'] = color;
                index += 1;
            }
        }


        /* PART 2: BUILD RADAR CHART */

        // [LATER] place chart in new pop-up window
        // 1. Clear content pages
        var contentPages = document.getElementById('myContentPages');
        contentPages.innerHTML = '';

        // 2. Create canvas for chart
        var canvas = document.createElement('canvas');
        canvas.className = 'chart';
        contentPages.appendChild(canvas);

        var ctx = canvas.getContext('2d');

        var chartData = {
            labels: labels,
            datasets: datasets
        };          

        Chart.defaults.color = '#dfe6f6';
        Chart.defaults.borderColor = '#5a6783';
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


// Up to 7 parameters, defined by colors:
// red, blue, yellow, green, orange, purple, pink
const colors = 
    ["#ea5545",
    "#27aeef",
    "#edbf33",
    "#87bc45",
    "#ef9b20",
    "#b33dc6",
    "#f46a9b"
    ];
const colorsTransparent = 
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