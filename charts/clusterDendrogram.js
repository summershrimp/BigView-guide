(function(){

    var tree = raw.models.tree();

    tree.dimensions().remove('size');
    tree.dimensions().remove('color');
    tree.dimensions().remove('label');

    var chart = raw.chart()
        .title('群集树状图')
        .description(
            "树状图是一种用于表示不同等级群集分布状态的树形的图表。由每个结点所表现出的不同的深度等级可以在一个二维水平面上直观地展示，同时它在非加权等级体系的可视化中十分有用。")
        .thumbnail("imgs/dendrogram.png")
        .model(tree)

    var width = chart.number()
        .title("宽度")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("高度")
        .defaultValue(500)

    chart.draw(function (selection, data){
      
        var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")
            .attr("transform", "translate(40,0)");

        var cluster = d3.layout.cluster()
          .size([+height(), +width() - 160]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var nodes = cluster.nodes(data),
            links = cluster.links(nodes);

        var link = g.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .style("fill","none")
            .style("stroke","#cccccc")
            .style("stroke-width","1px")
            .attr("d", diagonal);

        var node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .attr("r", 4.5)
            .style("fill", "#eeeeee")
            .style("stroke","#999999")
            .style("stroke-width","1px")

        node.append("text")
            .style("font-size","11px")
            .style("font-family","Arial, Helvetica")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .text(function(d) { return d.name; });

  })
})();