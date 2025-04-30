d3.csv("https://icebox00.github.io/spice-trade/exporters.csv").then(data => {
    data.forEach(d => d.Export = +d.Export)

    const labels = csvData.map(d => d.Area);
    const values = csvData.map(d => d.Export);

    const data = [{
        type: "treemap",
        labels: labels,
        values: values,
        textinfo: "label+value",
        hoverinfo: "label+value+percent entry",
        marker: { colorscale: 'Reds' }
    }];

    Plotly.newPlot('treemap', data)
})