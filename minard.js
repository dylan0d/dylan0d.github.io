var height = 900, width = 1300

var size = d3.scaleLinear()
    .range([3, 90])
    .domain([0,340000]);

var w_scale = d3.scaleLinear()
    .range([50, width-100])
    .domain([24, 37.6]);

var h_scale = d3.scaleLinear()
    .range([0.4*height, 100])
    .domain([53.9, 55.8]);

var temp_scale = d3.scaleLinear()
    .range([100,0])
    .domain([-21,0])

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")

d3.csv("https://dylan0d.github.io/minard-data.csv", function(data) {
  return {
    longitude : +data["LONC"],
    latitude : +data["LATC"],
    city : data["CITY"],
    long_home_temp : +data["LONT"],
    temp : +data["TEMP"],
    days : +data["DAYS"],
    month : data["MON"],
    day : +data["DAY"],
    longitude_army: +data["LONP"],
    latitude_army: +data["LATP"],
    num_survivors: +data["SURV"],
    direction: data["DIR"],
    div: +data["DIV"]
  };
}, function(data) {

    var troops = svg.selectAll("line") //TROOPS
        .data(data)
    .enter()
    
    troops.append("line")
    .attr("x1", function(d, i) { return w_scale(d.longitude_army)})
    .attr("y1", function(d, i) { return h_scale(d.latitude_army)})
    .attr("x2", function(d, i) { return (i < data.length-1 ? (w_scale(data[i+1]["longitude_army"])):(w_scale(d.longitude_army)))})
    .attr("y2", function(d, i) { return (i < data.length-1 ? (h_scale(data[i+1]["latitude_army"])):(h_scale(d.latitude_army)))})
    .attr("stroke-width", function (d, i) {return (i < data.length-1 ? (d.div === data[i+1]["div"] ? size(d.num_survivors):0):0 )})
    .attr("stroke", function(d) {return (d.direction === "A" ? "orange":"pink")})
    .attr("stroke-linecap", "round");
    
    troops.append("line")
    .attr("x1", function(d, i) { return w_scale(d.longitude_army)})
    .attr("y1", function(d, i) { return h_scale(d.latitude_army)})
    .attr("x2", function(d, i) { return (i < data.length-1 ? (w_scale(data[i+1]["longitude_army"])):(w_scale(d.longitude_army)))})
    .attr("y2", function(d, i) { return (i < data.length-1 ? (h_scale(data[i+1]["latitude_army"])):(h_scale(d.latitude_army)))})
    .attr("stroke-width", function (d, i) {return (i < data.length-1 ? (d.div === data[i+1]["div"] ? 1:0 ):0)})
    .attr("stroke", function(d) {return (d.div === 1 ? "green":d.div === 2 ? "red":"black")});

    var cities = svg.selectAll("circle") //CITIES
        .data(data.slice(0,20))
      .enter()
      
    cities.append("circle")
        .attr("cx", function(d) { return w_scale(d.longitude) })
        .attr("cy", function(d) { return h_scale(d.latitude)})
        .attr("r", "4")
        .attr("fill", "blue")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    cities.append("text")
    .text(function(d) { return d.city; })
    .attr("x", function(d) { return w_scale(d.longitude)-25 })
    .attr("y", function (d, i) { return h_scale(d.latitude)-10 });

     var temp = svg.selectAll("temp") //TEMP LINES
        .data(data.slice(0,9))
    .enter()
    
    temp.append("line") //TEMP LINE
    .attr("x1", function(d, i) { return w_scale(d.long_home_temp)})
    .attr("y1", function(d, i) { return temp_scale(d.temp)})
    .attr("x2", function(d, i) { return (i < 8 ? (w_scale(data[i+1]["long_home_temp"])):(w_scale(d.long_home_temp)))})
    .attr("y2", function(d, i) { return (i < 8 ? temp_scale(data[i+1]["temp"]):temp_scale(d.temp))})
    .attr("stroke-width", 3)
    .attr("stroke", "black")
    .attr("transform", "translate(0,"+0.5*height+")");
    
    temp.append("text") //TEMP TEXT
    .text(function(d) { return d.temp; })
    .attr("x", function(d) { return w_scale(d.long_home_temp) })
    .attr("y", function(d) { return temp_scale(d.temp) })
    .attr("transform", "translate(0,"+(0.5*height+20)+")")
    
    temp.append("text") //TEMP DATE
    .text(function(d) { return d.day+"/"+d.month; })
    .attr("x", function(d) { return w_scale(d.long_home_temp) })
    .attr("y", function(d) { return temp_scale(d.temp) })
    .attr("transform", "translate(-30,"+(0.5*height-20)+")")
    
    temp.append("circle") //TEMP CIRCLES
        .attr("cx", function(d) { return w_scale(d.long_home_temp) })
        .attr("cy", function(d) { return temp_scale(d.temp)})
        .attr("r", "4")
        .attr("fill", "red")
        .attr("stroke-width", 1)
        .attr("stroke", "red")
        .attr("transform", "translate(0,"+0.5*height+")");

    var line = svg.append("line") //DIVIDING LINE
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height*0.43)
        .attr("y2", height*0.43)
        .attr("stroke", "green")
        .attr("stroke-width", "5")
        .attr("stroke-linecap", "arrow")
    
    var text = svg.append("text") //LEGEND
        .text("Temperature - Celsius - Return Journey")
        .attr("x", width - 300)
        .attr("y", height - 400)

    var longtext = svg.append("text")
        .text("Longitude")
        .attr("x", 10)
        .attr("y", 0.5*height-70)

    var longtext = svg.append("text")
        .text("Longitude")
        .attr("x", 10)
        .attr("y", 0.5*height-45)

    var titleText = svg.append("text")
        .text("Yellow = Arriving - Pink = Leaving")
        .attr("x", 10)
        .attr("y", 20)
    
        var titleText = svg.append("text")
        .text("Thickness = Army Size")
        .attr("x", 10)
        .attr("y", 35)

        var titleText = svg.append("text")
        .text("Green = Division 1")
        .attr("x", 10)
        .attr("y", 50)

        var titleText = svg.append("text")
        .text("Red = Division 2")
        .attr("x", 10)
        .attr("y", 65)

        var titleText = svg.append("text")
        .text("Black = Division 3")
        .attr("x", 10)
        .attr("y", 80)
});