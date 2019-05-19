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
    createCurrencyGraph(jsonData, interval) {
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
    },
};
