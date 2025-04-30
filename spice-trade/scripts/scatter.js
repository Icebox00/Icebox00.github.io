// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#myChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",`translate(${margin.left}, ${margin.top})`);

//Read the data

d3.csv("exporters.csv").then(data => {
  data.forEach(d => d.Export = +d.Export);

  // Convert flat data into hierarchy
  const root = d3.hierarchy({children: data})
    .sum(d => d.Export);

  d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(2)
    (root);

  const color = d3.scaleOrdinal(d3.schemeReds[data.length > 9 ? 9 : data.length]);

  svg.selectAll("rect")
    .data(root.leaves())
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.Area))
      .append("title")
        .text(d => `${d.data.Area}\n${d.data.Export}`);

  svg.selectAll("text")
    .data(root.leaves())
    .join("text")
      .attr("x", d => d.x0 + 5)
      .attr("y", d => d.y0 + 20)
      .text(d => d.data.Area)
      .attr("font-size", "12px")
      .attr("fill", "white");
});