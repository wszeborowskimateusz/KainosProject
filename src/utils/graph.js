import 'chartjs-plugin-annotation';

function countTrendLine(pointsData, firstPointLabelIndex, lastPointLabelIndex, dataLength) {
    const firstPoint = pointsData[0];
    const lastPoint = pointsData[pointsData.length - 1];
    let data = [];
    console.log(`first: ${firstPointLabelIndex} last: ${lastPointLabelIndex}`);
    for(let i = 0; i < dataLength; i++) {
        if(i === firstPointLabelIndex)
            data.push(firstPoint);
        else if(i === lastPointLabelIndex)
            data.push(lastPoint);
        else
            data.push({});
    }
    if(lastPoint.y > firstPoint.y)
        return {
            backgroundColor: 'rgba(0, 250, 0, 0.2)',
            borderColor: 'rgb(0, 250, 0)',
            spanGaps: true,
            fill: false,
            data,
        };
    else {
        return {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderColor: 'rgb(255, 0, 0)',
            spanGaps: true,
            fill: false,
            data,
        };
    }
}

function countTrendLines(data, ammountOfTrendLines) {
    let trendLines = [];
    let lastIndex = 0;
    const dataLength = data.length;
    const numberOfPointsPerTrendLine = Math.floor(dataLength / ammountOfTrendLines);
    for(let i = 0; i < ammountOfTrendLines; i++) {
        trendLines.push(countTrendLine(data.slice(lastIndex, lastIndex + numberOfPointsPerTrendLine), 
            lastIndex, lastIndex + numberOfPointsPerTrendLine - 1, dataLength ));
        lastIndex += numberOfPointsPerTrendLine;
    }
    return trendLines;
}

function getDataFromJson(jsonData, interval) {
    let chartPoints = [];
    let chartLabels = [];

    let numberOfSamples = -1;

    switch(interval) {
        case '12h':
            numberOfSamples = 144;
            break;
        case '1D':
            numberOfSamples = 96;
            break;
        case '1W':
            numberOfSamples = 168;
            break;
        case '1M':
            numberOfSamples = 30;
            break;
        case '1Y':
            numberOfSamples = 120;
            break;
        case '2Y':
            numberOfSamples = 24;
            break;
        case '5Y':
            numberOfSamples = 60;
            break;
        case '10Y':
            numberOfSamples = 120;
            break;
    }
    
    var keys = Object.keys( jsonData );
    var dates = Object.keys(jsonData[keys[1]]);
    let i = 0;
    for(let date of dates) {
        if(i > numberOfSamples)
            break;
        chartLabels.push(date);
        chartPoints.push({x: i, y: jsonData[keys[1]][date]['4. close']});
        i++;
    }

    return [chartPoints.reverse(), chartLabels.reverse()];
}

export default {
    createCurrencyGraph(jsonData, interval, trendLines) {
        const [data, labels] = getDataFromJson(jsonData, interval); 
        const Chart = require('chart.js');
        const ctx = document.getElementById('currencyChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    backgroundColor: 'rgba(169, 169, 169, 0.2)',
                    borderColor: 'rgb(169, 169, 169)',
                    data,
                }],
            },
            options: {
                responsive: false,
                annotation: {
                    annotations: [],
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: 'Historical Exchange Chart',
                    fontSize: '16',
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        type: 'category',
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5,
                        }, 
                    }],
                },
            },
        });
 
        // var data = {
        //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        //     datasets: [{
        //         label: "Stock A",
        //         fill: false,
        //         lineTension: 0.1,
        //         backgroundColor: "rgba(225,0,0,0.4)",
        //         borderColor: "red", // The main line color
        //         borderCapStyle: 'square',
        //         borderDash: [], // try [5, 15] for instance
        //         borderDashOffset: 0.0,
        //         borderJoinStyle: 'miter',
        //         pointBorderColor: "black",
        //         pointBackgroundColor: "white",
        //         pointBorderWidth: 1,
        //         pointHoverRadius: 8,
        //         pointHoverBackgroundColor: "yellow",
        //         pointHoverBorderColor: "brown",
        //         pointHoverBorderWidth: 2,
        //         pointRadius: 4,
        //         pointHitRadius: 10,
        //         // notice the gap in the data and the spanGaps: true
        //         data: [65, 59, 80, 81, 56, 55, 40, ,60,55,30,78],
        //         spanGaps: true,
        //       }, {
        //         label: "Stock B",
        //         fill: true,
        //         lineTension: 0.1,
        //         backgroundColor: "rgba(167,105,0,0.4)",
        //         borderColor: "rgb(167, 105, 0)",
        //         borderCapStyle: 'butt',
        //         borderDash: [],
        //         borderDashOffset: 0.0,
        //         borderJoinStyle: 'miter',
        //         pointBorderColor: "white",
        //         pointBackgroundColor: "black",
        //         pointBorderWidth: 1,
        //         pointHoverRadius: 8,
        //         pointHoverBackgroundColor: "brown",
        //         pointHoverBorderColor: "yellow",
        //         pointHoverBorderWidth: 2,
        //         pointRadius: 4,
        //         pointHitRadius: 10,
        //         // notice the gap in the data and the spanGaps: false
        //         data: [10, 20, 60, 95, 64, 78, 90,,70,40,70,89],
        //         spanGaps: false,
        //       }
          
        //     ]
        //   };
          

        if(trendLines) {
            let trendLinesData = countTrendLines(data, 5);
            console.log(trendLinesData);
            for(let trendLine of trendLinesData){
                myChart.data.datasets.push(trendLine);              
            }
            myChart.update();
        }
    },
};
