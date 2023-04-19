const seasonColors = {
    "Winter": "blue",
    "Spring": "green",
    "Summer": "orange",
    "Fall": "red"
};
tempUrl = `/api/v1.0/maxtemp`;

function optionChanged(selectedOption){
    dataUrl = `/api/v1.0/precipitation/seasonal/${selectedOption}`;
    d3.json(dataUrl).then(function(data){
        drawSeasonalPrecipGraph(selectedOption, data);
    });
}

// Create a line chart for seasonal precipitation with a dropdown menu to display the 4 seasons.
function drawSeasonalPrecipGraph(season, seasonalPrecipData){
    var graphConfig = [{
        type: "line",
        x: seasonalPrecipData.map((d) => d.year),
        y: seasonalPrecipData.map((d) => d.precip),
        text: seasonalPrecipData.map((d) => `${season} ${d.year}`),
        line: {
            color: seasonColors[season],
        }
    },{

    }];
    // var layout = {yaxis: {autorange: 'reversed'}};
    Plotly.newPlot("season", graphConfig);
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
    // var layout = {yaxis: {autorange: 'reversed'}};
    Plotly.newPlot("maxtemp", graphConfig);
};

}

optionChanged(d3.select("#selSeason").node().value);
d3.json(tempUrl).then(function(data){
    drawMaxTempGraph(data);
});

