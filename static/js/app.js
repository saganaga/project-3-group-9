const seasonColors = {
    "Winter": "blue",
    "Spring": "green",
    "Summer": "orange",
    "Fall": "red"
};
tempUrl = `/api/v1.0/maxtemp`;
snowUrl = `/api/v1.0/snowfall`;

function optionChanged(selectedOption){
    dataUrl = `/api/v1.0/precipitation/seasonal/${selectedOption}`;
    d3.json(dataUrl).then(function(data){
        drawSeasonalPrecipGraph(selectedOption, data, true);
    });
};

// Create a line chart for seasonal precipitation with a dropdown menu to display the 4 seasons.
function drawSeasonalPrecipGraph(season, seasonalPrecipData, showRegression = false){
    var graphConfig = [{
        type: "line",
        name: "seasonal precipitation",
        x: seasonalPrecipData.map((d) => d.year),
        y: seasonalPrecipData.map((d) => d.precip),
        text: seasonalPrecipData.map((d) => `${season} ${d.year}`),
        line: {
            color: seasonColors[season],
        }
    }]
    
    if (showRegression === true) {
        //Compute the line regression
        var statsVars = {
            year: 'metric',
            precip: 'metric'
        };
        
        var stats = new Statistics(seasonalPrecipData, statsVars);
        var regression = stats.linearRegression('year', 'precip');
        
        function regressionLine(yr) {
            return regression.regressionFirst.beta1 + regression.regressionFirst.beta2 * yr;
        }
        // Add the regression line to the graph
        graphConfig.push({
            // 
            type: "line",
            x: [1890,2020],
            name: "linear regression",
            y: [regressionLine(1890), regressionLine(2020)],
            // text: seasonalPrecipData.map((d) => `${season} ${d.year}`),
            line: {
                color: "black",
            }
        });
    }
    var layout = {
        title: {
            text: 'Twin Cities Seasonal Precipitation 1890-2019',
            size: 24
        },
        yaxis: {
            title: {
                text: 'Inches',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        }
    };

    Plotly.newPlot("season", graphConfig, layout);
};

// Create a line chart that displays the maximum of the maximum temperatures.      
function drawMaxTempGraph(yearlyTempData){
    var graphConfig = [{
        type: "line",
        x: yearlyTempData.map((d) => d.year),
        y: yearlyTempData.map((d) => d.maxTemp),
        // text: yearlyTempData.map((d) => `${d.year} ${d.maxTemp}degreeF`),
        line: {
            color: "red",
        }
    }]   
    var layout = {
        title: {
            text: 'Twin Cities Maximum Temperatures 1890-2019',
            size: 24
        },
        yaxis: {
            title: {
                text: 'Temperature (F)',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        }
    };

    Plotly.newPlot("maxtemp", graphConfig, layout);
};

// Create a line chart that displays the total snowfall.
function drawSnowfallGraph(snowfallByYear){
    var graphConfig = [{
        type: "scatter",
        mode: 'markers',
        x: snowfallByYear.map((d) => d.year),
        y: snowfallByYear.map((d) => d.snowfall),
        // text: snowfallByYear.map((d) => `${season} ${d.year}`),
        marker: {
        color: "blue",
        size: snowfallByYear.map((d) => d.snowfall)
        }
    }]

    var layout = {
        title: {
            text: 'Twin Cities Total Snowfall 1890-2019',
            size: 24
        },
        yaxis: {
            title: {
                text: 'Inches',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        }
    };

    Plotly.newPlot("snowfall", graphConfig, layout);
};

optionChanged(d3.select("#selSeason").node().value);
d3.json(tempUrl).then(function(data){
    drawMaxTempGraph(data);
});

d3.json(snowUrl).then(function(data){
    drawSnowfallGraph(data);
});
