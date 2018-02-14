var height = 1500, width = 1000
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(670,270)");

var y = d3.scaleLinear().range([0, width]);

    
d3.csv("https://dylan0d.github.io/nightingale-data.csv", function(data) {
  return {
    month : data["Month"],
    army_size : +data["Average size of army"],
    zymotic : +data["Zymotic diseases"],
    wounds : +data["Wounds & injuries"],
    all_causes : +data["All other causes"],
    zymotic_1000 : +data["Zymotic diseases per 1000"],
    wounds_1000 : +data["Wounds & injuries per 1000"],
    all_causes_1000 : +data["All other causes per 1000"]
  };
}, function(data) {

    y.domain([0, 2761]);

    var arc = d3.arc()
        .innerRadius(function(d) { return d.innerRadius})
        .outerRadius(function(d) {return d.outerRadius})
        .startAngle(function(d) {return d.startAngle * (Math.PI/180)}) //convert from degs to radians
        .endAngle(function(d) {return d.endAngle * (Math.PI/180)}) //just radians

    svg.selectAll("segment")
        .data(data.slice(0,12))
      .enter().append("path")
        .attr("fill", "red")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr( "d", function (d, i) { return arc({innerRadius:0, outerRadius:y(d.wounds), startAngle:30*i, endAngle:30*(i+1)})})
        .attr( "transform", "rotate(270,0,0)")

    svg.selectAll("segment")
        .data(data.slice(0,12))
      .enter().append("path")
        .attr("fill", "black")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr( "d", function (d, i) { return arc({innerRadius:y(d.wounds), outerRadius:y(d.all_causes), startAngle:30*i, endAngle:30*(i+1)})})
        .attr( "transform", "rotate(270,0,0)")

    svg.selectAll("segment")
        .data(data.slice(0,12))
      .enter().append("path")
        .attr("fill", "blue")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr( "d", function (d, i) {return arc({ innerRadius:y(d3.max([d.wounds, d.all_causes])), outerRadius:y(d.zymotic), startAngle:30*i, endAngle:30*(i+1)})})
        .attr( "transform", "rotate(270,0,0)")
    
    var circle = svg.append("line")
        .attr("x1", 5)
        .attr("y1", 5)
        .attr("x2", 50)
        .attr("y2", 50)
        .attr("transform", "translate(-700,-300)")
        .attr("stroke", "green")
        .attr("stroke-width", "5");

    });