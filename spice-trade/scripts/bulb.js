// Lollipop chart for spice production data
const coffee = "#472A28";
const bulb_margin = { top: 80, right: 30, bottom: 40, left: 180 },
      bulbwidth = 900 - bulb_margin.left - bulb_margin.right,
      bulbheight = 500 - bulb_margin.top - bulb_margin.bottom;

const bulb_svg = d3.select("#bulbChart")
  .attr("width", bulbwidth + bulb_margin.left + bulb_margin.right)
  .attr("height", bulbheight + bulb_margin.top + bulb_margin.bottom)
  .append("g")
  .attr("transform", `translate(${bulb_margin.left},${bulb_margin.top})`);

d3.csv("https://icebox00.github.io/spice-trade/spice_brk.csv").then(data => {
  data.forEach(d => d.Production = +d.Production);
  // Scales
  const y = d3.scaleBand()
    .domain(data.map(d => d.Area))
    .range([0, bulbheight])
    .padding(0.4);
  const x = d3.scaleLog()
    .domain([1e5, 3e6])
    .range([0, bulbwidth]);
  const color = d3.scaleOrdinal()
    .domain(["Major Exporter", "Non-Major Exporter"])
    .range(["#88000c", "#a64008"]);
  // Axes
  bulb_svg.append("g")
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll("text")
    .attr("fill", coffee);
  bulb_svg.append("g")
    .call(d3.axisTop(x)
      .tickValues([1e5, 2e5, 5e5, 1e6, 2e6, 3e6])
      .tickFormat(d3.format(".2s")))
    .selectAll("text")
    .attr("fill", coffee);
  // Segments (Lines)
  bulb_svg.selectAll(".segment")
    .data(data)
    .join("line")
    .attr("class", "segment")
    .attr("y1", d => y(d.Area) + y.bandwidth() / 2)
    .attr("y2", d => y(d.Area) + y.bandwidth() / 2)
    .attr("x1", 0)
    .attr("x2", d => x(d.Production))
    .attr("stroke", d => color(d.Type))
    .attr("stroke-width", 2);
  // Dots (Circles)
  bulb_svg.selectAll(".dot")
    .data(data)
    .join("circle")
    .attr("class", "dot")
    .attr("cy", d => y(d.Area) + y.bandwidth() / 2)
    .attr("cx", d => x(d.Production))
    .attr("r", 6)
    .attr("fill", d => color(d.Type));
  // Title & Subtitle
  bulb_svg.append("text")
    .attr("x", bulbwidth / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", coffee)
    .text("Many Countries are Major Producers of Dried Chilies but Lack Export Volume");
  bulb_svg.append("text")
    .attr("x", bulbwidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", coffee)
    .text("Top 10 Producers of Dried Chillies in 2023");
  // Legend
  const legend = bulb_svg.append("g")
    .attr("transform", `translate(${bulbwidth - 200}, -60)`);
  ["Major Exporter", "Non-Major Exporter"].forEach((label, i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    g.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color(label));
    g.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(label)
      .attr("fill", coffee)
      .style("font-size", "13px");
  });
})