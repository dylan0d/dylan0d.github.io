importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

onmessage = function(event) {
  var nodes = event.data.nodes,
      links = event.data.links;

width = 1200
height = 660

//   var simulation = d3.forceSimulation(nodes)
//         .force("link", d3.forceLink(links).distance(null).strength(function(d) { return d.weight/20 }))
//         .force("charge", d3.forceManyBody().strength(-80).distanceMax(100))
//         .force("center", d3.forceCenter(width / 2, height / 2))
//         .force('collision', d3.forceCollide().radius(function(d) { return d.radius*2 }))
//         .alphaMin(0.001)

    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-80).distanceMax(100))
        .force("link", d3.forceLink(links).distance(20).strength(function(d) { return d.weight/20 }))
        .force("center", d3.forceCenter(width / 2, height / 2))
        //.force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        //.force('collision', d3.forceCollide().radius(function(d) { return d.radius*2 }))
        .stop();


  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    postMessage({type: "tick", progress: i / n});
    simulation.tick();
  }

  postMessage({type: "end", nodes: nodes, links: links});
};