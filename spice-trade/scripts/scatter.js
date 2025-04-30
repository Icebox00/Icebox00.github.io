// set the dimensions and margins of the graph
let margin = {top: 10, right: 10, bottom: 30, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#myChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",`translate(${margin.left}, ${margin.top})`);

//Read the data

d3.csv("https://icebox00.github.io/spice-trade/exporters.csv").then(data => {
  data.forEach(d => d.Export = +d.Export);

  // Convert flat data into hierarchy
  const root = d3.hierarchy({children: data})
    .sum(d => d.Export);

  d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(1)
    (root);

    const n = data.length > 11 ? 11 : data.length;
    const colorRange = Array.from({ length: n }, (_, i) => d3.interpolateOranges(1-i / (n - 1)));

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.Area))
      .range(colorRange);
  
  svg.selectAll("rect")
    .data(root.leaves())
    .join("rect")
        .attr("fill", d => color(d.data.Area)) // or whatever color scale you're using
        .attr("fill-opacity", 0.5)
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.Area))
      .append("title")
        .text(d => `${d.data.Area}\n${d.data.Export}`);

  svg.selectAll("text")
    .data(root.leaves())
    .text(d => d.data.Area)
    .style("fill", "black") 
    .join("text")
      .attr("x", d => d.x0 + 2)
      .attr("y", d => d.y0 + 12)
      .text(d => d.data.Area)
      .attr("font-size",  d => {
        const logExport = Math.log(d.data.Export);
        return (logExport * 2 + 8) + "px"; // tweak multiplier and offset
      })
      .attr("fill", "black");
});