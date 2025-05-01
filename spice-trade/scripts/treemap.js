// set the dimensions and margins of the graph
let margin = {top: 10, right: 10, bottom: 30, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#myChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
function abbreviate(area) {
    const map = {
      "Germany": "Ger.",
      "Tunisia": "Tun.",
      "Netherlands": "Nld.",
      "Pakistan": "Pak.",
      "Thailand": "Thl.",
      "Myanmar": "Nam.",
      "Thailand": "Thl.",
      // Add more custom mappings as needed
    };
    return map[area] || area.split(" ").map(w => w[0]).join("");  // fallback to initials
  }

  

d3.csv("https://icebox00.github.io/spice-trade/exporters.csv").then(data => {
  data.forEach(d => d.Export = +d.Export);

  // Convert flat data into hierarchy
  const root = d3.hierarchy({children: data})
    .sum(d => d.Export);

  d3.treemap()
    .size([width, height])
    .padding(2)
    .paddingTop(60)
    .paddingBottom(30)
    (root);

    const n = data.length > 11 ? 11 : data.length;
    const colorRange = Array.from({ length: n }, (_, i) => d3.interpolateRdBu(i / (2 * (n - 1))));

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.Area))
      .range(colorRange);
  

    const colorPicker = d3.scaleThreshold()
      .domain([10000, 30000, 100000])
      .range(["#a3d359", "#e39d19", "#a64008", "#88000c"]);

    // Define the tooltip container
    const tooltip = d3.select("#myChart")
    .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#cea18d")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
        .style("border", "1px solid #472A28")
        .style("font-size", "14px")
        .style("color", "#472A28");

    svg.selectAll("rect")
    .data(root.leaves())
    .join("rect")
        .attr("fill", d => colorPicker(d.data.Export)) // or whatever color scale you're using
        .attr("fill-opacity", 0.7)
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .on("mouseover", function(event, d) {
            const centerX = d.x0 + (d.x1 - d.x0) / 2;  // Calculate center X of the rectangle
            const centerY = d.y0 + (d.y1 - d.y0) / 2; 
            // Show tooltip on hover
            setTimeout(() => {
                tooltip.style("visibility", "visible")
                    .html(`${d.data.Area}:<br>${d.data.Export} mt`)
                    .style("left", (centerX) + "px")
                    .style("top", (centerY) + "px")
                    .transition()
                    .duration(400)
                    .style("opacity", 1)}, 200);
            })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden")
                .transition()
                .duration(400)
                .style("opacity", 0);
            });
    const defs = svg.append("defs")

    svg.selectAll("clipPath")
    .data(root.leaves())
    .join("clipPath")
        .attr("id", d => "clip-" + d.data.Area.replace(/\s+/g, "-"))  // sanitize ID
    .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    const fontSizeScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range(["12px", "15px", "18px", "24px"]);

    const gapXSizeScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range([1.5, 2, 4, 6]);

    const gapYSizeScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range([12, 15, 18, 25]);

    const textColor = d3.scaleThreshold()
        .domain([100000])
        .range(["#472A28", "#cea18d"]);

        
    
    const pctSizeScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range(["10px", "10px", "13px", "19px"]);
        
    const diffXScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range([1.5, 2, 3, 6]);

    const diffYScale = d3.scaleThreshold()
        .domain([10000, 30000, 100000])
        .range([3, 3, 5, 7]);

        
    svg.selectAll("text")
    .data(root.leaves())
    .join("text")
      .attr("x", d => d.x0 + gapXSizeScale(d.data.Export))
      .attr("y", d => d.y0 + gapYSizeScale(d.data.Export))
      .attr("clip-path", d => `url(#clip-${d.data.Area.replace(/\s+/g, "-")})`)
      .text(function(d) {
        const boxWidth = d.x1 - d.x0;
        const fullTextWidth = d.data.Area.length * 7; // estimate
        const fits = fullTextWidth < boxWidth - 4;
        return fits ? d.data.Area : abbreviate(d.data.Area);
      })
      .attr("font-size", d => fontSizeScale(d.data.Export))
      .attr("fill", d => textColor(d.data.Export));
    
    const totalExport = d3.sum(root.leaves(), d => d.data.Export);
    
    svg.selectAll("text.percent")
      .data(root.leaves())
      .join("text")
        .attr("class", "percent")
        .attr("x", d => d.x1 - diffXScale(d.data.Export)) // near top-right
        .attr("y", d => d.y1 - diffYScale(d.data.Export))
        .attr("text-anchor", "end")
        .attr("clip-path", d => `url(#clip-${d.data.Area.replace(/\s+/g, "-")})`)
        .text(d => `${((d.data.Export / totalExport) * 100).toFixed(1)}%`)
        .attr("font-size", d => pctSizeScale(d.data.Export))
        .attr("fill", d => textColor(d.data.Export));
      
    svg.selectAll("image")
      .data([root.leaves()[0], root.leaves()[1]])
      .join("image")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0 + 30)
          .attr("width", d => 30) // Make the image fill the box
          .attr("height", d => 30)
          .attr("href", "https://images.emojiterra.com/openmoji/v13.1/512px/1f336.png") // Replace with your chili pepper image URL
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("opacity", 0.8); // Optional: Adjust opacity for better visibility

    svg.append("line")
      .attr("x1", 0)
      .attr("x2", 800)
      .attr("y1", 50)
      .attr("y2", 50)
      .attr("stroke", "#472A28")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.3);

    svg.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .text("China and India Dominate the Supply of Global Dried Chili Markets")
      .attr("font-size", "24px")
      .attr("fill",  "#472A28" )
      .attr("opacity", 0.8);

    svg.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .text("2023's 10 Largest Exporters of Dried Chilies (shares of export market in metric tons)")
      .attr("font-size", "12px")
      .attr("fill",  "#472A28" )
      .attr("opacity", 0.8);

    svg.append("text")
      .attr("x", 0)
      .attr("y", height + margin.top + margin.bottom - 25) 
      .text("Source: Kaggle sourced from FAOSTAT")
      .attr("font-size", "12px")
      .attr("fill",  "#4f4e4e" );
});