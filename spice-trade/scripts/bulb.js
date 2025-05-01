const coffee = "#472A28";

const bulb_margin = { top: 80, right: 30, bottom: 40, left: 180 },
      width = 900 - bulb_margin.left - bulb_margin.right,
      height = 500 - bulb_margin.top - bulb_margin.bottom;

const bulb_svg = d3.select("#chart")
  .attr("width", width + bulb_margin.left + bulb_margin.right)
  .attr("height", height + bulb_margin.top + bulb_margin.bottom)
.append("g")
  .attr("transform", `translate(${bulb_margin.left},${bulb_margin.top})`);

d3.csv("chilies.csv", d3.autoType).then(data => {
  // Scales
  const y = d3.scaleBand()
    .domain(data.map(d => d.Area))
    .range([0, height])
    .padding(0.2);

  const x = d3.scaleLog()
    .domain([1e5, 3e6])
    .range([0, width]);

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

  // Bars
  bulb_svg.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.Area))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", d => x(d.Production))
    .attr("fill", d => color(d.Type));

  // Title & Subtitle
  bulb_svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", coffee)
    .text("Many Countries are Major Producers of Dried Chilies but Lack Export Volume");

  bulb_svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", coffee)
    .text("Top 10 Producers of Dried Chillies in 2023");

  // Legend
  const legend = bulb_svg.append("g")
    .attr("transform", `translate(${width - 200}, -60)`);

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
});
