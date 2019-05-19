import 'chartjs-plugin-annotation';

function countTrendLine(data) {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];

    if(lastPoint.y > firstPoint.y)
        return {
            drawTime: 'afterDraw', // overrides annotation.drawTime if set
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: firstPoint.y,
            endValue: lastPoint.y,
            borderColor: 'green',
            borderWidth: 2,
        };
    else {
        return {
            drawTime: 'afterDraw', // overrides annotation.drawTime if set
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: firstPoint.y,
            endValue: lastPoint.y,
            borderColor: 'red',
            borderWidth: 2,
        };
    }
}

function countTrendLines(data, ammountOfTrendLines) {
    let trendLines = [];
    let lastIndex = 0;
    const dataLength = data.length;
    const numberOfPointsPerTrendLine = dataLength / ammountOfTrendLines;
    for(let i = 0; i < ammountOfTrendLines; i++) {
        trendLines.push(countTrendLine(data.slice(lastIndex, lastIndex + numberOfPointsPerTrendLine)));
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
 
        if(trendLines) {
            let trendLinesData = countTrendLines(data, 5);
            for(let trendLine of trendLinesData){
                myChart.options.annotation.annotations.push(trendLine);              
            }
            myChart.update();
        }
    },
};
