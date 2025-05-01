// set the dimensions and margins of the graph
let linemargin = {top: 10, right: 10, bottom: 30, left: 10},
    linewidth = 1200 - linemargin.left - linemargin.right,
    lineheight = 650 - linemargin.top - linemargin.bottom;

// append the svg object to the body of the page
let linesvg = d3.select("#lineChart")
    .append("linesvg")
        .attr("width", linewidth + linemargin.left + linemargin.right)
        .attr("height", lineheight + linemargin.top + linemargin.bottom)
    .append("g")
        .attr("transform", `translate(${linemargin.left}, ${linemargin.top})`);


d3.csv("spice_exports.csv").then(data => {
    
    data.forEach(d => {
        d.Year = +d.Year;
        d.total_exports = +d.total_exports;
    });


    const nested = d3.group(data, d => d.Item);


    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);


    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_exports)]).nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([...nested.keys()]);


    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.total_exports));


  for (const [spice, values] of nested) {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", color(spice))
            .attr("stroke-width", 2)
            .attr("class", "line")
            .attr("d", line);


        svg.append("text")
            .datum(values[values.length - 1])
            .attr("x", d => x(d.Year) + 5)
            .attr("y", d => y(d.total_exports))
            .text(spice)
            .attr("fill", color(spice))
            .attr("class", "legend");
  }


  svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("class", "axis-label")
        .text("Year");

  svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -20)
        .attr("y", -20)
        .attr("transform", "rotate(-90)")
        .attr("class", "axis-label")
        .text("Global Exports (mt)");
});