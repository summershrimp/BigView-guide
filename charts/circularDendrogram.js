(function(){

    var tree = raw.models.tree();

    tree.dimensions().remove('size');
    tree.dimensions().remove('color');
    tree.dimensions().remove('label');

    var chart = raw.chart()
        .title('环形树状图')
        .description(
            "树状图是一种用于表示不同等级群集分布状态的树形的图表。由每个结点所表现出的不同的深度等级可以在一个二维水平面上直观地展示，同时它在非加权等级体系的可视化中十分有用。")
        .thumbnail("imgs/circularDendrogram.png")
        .model(tree)
    
    var diameter = chart.number ()  
        .title("半径")
        .defaultValue(1000)
        .fitToWidth(true)

chart.draw(function (selection, data){

    var g = selection
        .attr("width", +diameter() )
        .attr("height", +diameter() )
        .append("g")
        .attr("transform", "translate(" + diameter()/2 + "," + diameter()/2 + ")");
    
    var cluster = d3.layout.cluster()
        .size([360, diameter()/2-120]);

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
    
    var nodes = cluster.nodes(data);

    var link = g.selectAll("path.link")
        .data(cluster.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .style("fill","none")
        .style("stroke","#cccccc")
        .style("stroke-width","1px")
        .attr("d", diagonal);
    
    var node = g.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    node.append("circle")
        .attr("r", 4.5)
        .style("fill", "#eeeeee")
        .style("stroke","#999999")
        .style("stroke-width","1px");

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.name; })
        .style("font-size","11px")
        .style("font-family","Arial, Helvetica")

  })
})();
