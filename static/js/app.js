const seasonColors = {
    "Winter": "blue",
    "Spring": "green",
    "Summer": "orange",
    "Fall": "red"
};

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
}

optionChanged(d3.select("#selSeason").node().value);
