const seasonColors = {
    "Winter": "blue",
    "Spring": "green",
    "Summer": "orange",
    "Fall": "red"
};

function optionChanged(selectedOption){
    console.log(selectedOption);
    dataUrl = `/api/v1.0/precipitation/seasonal/${selectedOption}`;
    d3.json(dataUrl).then(function(data){
        drawSeasonlPrecipGraph(selectedOption, data);
    });
}

function drawSeasonlPrecipGraph(season, seasonalPrecipData){
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
