/* Hardcoded chart that was initially used to test the display of a radar chart. */

var chartData = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 55],
      fill: true,

      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'My Second Dataset',
      data: [28, 48, 40, 19, 96, 27],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};
  

var config = new Chart(ctx, {
    type: 'radar',
    data: chartData,
    options: {
        elements: {
        line: {
            borderWidth: 3
        }
        }
    },
}); 