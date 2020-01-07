var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
  if (err) throw err;

  // parse data
  data.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.income) * 0.8,
    d3.max(data, d => d.income) * 1.2
  ])
  .range([0, width]);


  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(data, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "lightblue")
    .attr("opacity", ".75");

  circlesGroup.append("g")
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d.state)
    .attr('font-size',8)//font size
    .attr('dx', 0)//positions text towards the left of the center of the circle
    .attr('dy',4);

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") 
    .classed("active", true)
    .text("Income (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (%)");

}).catch(function(error) {
  console.log(error);
});
