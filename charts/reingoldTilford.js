(function(){

    var tree = raw.models.tree();

    tree.dimensions().remove('size');
    tree.dimensions().remove('color');
    tree.dimensions().remove('label');

    var chart = raw.chart()
        .title('莱因戈尔德-蒂尔福德树')
        .description(
            "树的布局实现了整洁高效的安排莱因戈尔德-迪尔福德算法的分层节点。由于节点的深度是从根节点开始计算，所以这种图示有着凹凸不平的外观")
        .thumbnail("imgs/reingoldTilford.png")
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

        var layout = d3.layout.tree()
            .size([+height(), +width() -160]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var nodes = layout.nodes(data),
            links = layout.links(nodes);

        var link = g.selectAll("path.link")
            .data(links)
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
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .style("fill", "#eeeeee")
            .style("stroke","#999999")
            .style("stroke-width","1px")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .style("font-size","11px")
            .style("font-family","Arial, Helvetica")
            .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function (d){ return d.name; });

    })
})();
