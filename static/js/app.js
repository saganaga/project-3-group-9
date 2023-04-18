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
        // y: sample.otu_ids.slice(0, 10).map((id) => `OTU ${id}`),
        text: seasonalPrecipData.map((d) => `${season} ${d.year}`),
        // text: sample.otu_labels.slice(0, 10),
    }];
    // var layout = {yaxis: {autorange: 'reversed'}};
    Plotly.newPlot("season", graphConfig);
}

optionChanged(d3.select("#selSeason").node().value);