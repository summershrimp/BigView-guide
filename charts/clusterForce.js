(function(){

    var nodes = raw.model();

    var cluster = nodes.dimension()
        .title("群集");

    var size = nodes.dimension()
        .title("大小")
        .types(Number)

    var label = nodes.dimension()
        .title("标签")

    var color = nodes.dimension()
        .title("颜色")

    nodes.map(function (data){

        var nodeClusters = d3.nest()
            .key(function (d) { return cluster(d); })
            .rollup(function (d){
                return { 
                    type: 'cluster',
                    cluster: cluster(d[0]),
                    size: 0,
                } 
            })
            .map(data);

        var nodeElements = data.map(function (d) {
          return { 
                type : 'node',
                label : label(d),
                cluster: cluster(d),
                clusterObject : nodeClusters[cluster(d)],
                size: size() ? +size(d) : 1,
                color: color(d)
            };
        });

        return nodeElements.concat(d3.values(nodeClusters));

    })


    var chart = raw.chart()
        .title('聚类图')
        .description(
            "用圆形的嵌套来表示层次结构，比较不同类别。 这种可视化方式通过不同类别的大小和位置可以有效的展示分层结构内的联系。")
        .thumbnail("imgs/clusterForce.png")
        .model(nodes)

    var width = chart.number()
        .title("宽度")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("高度")
        .defaultValue(500)

    var nodePadding = chart.number()
        .title("点间距")
        .defaultValue(2)

    var clusterPadding = chart.number()
        .title("群集间距")
        .defaultValue(10)

    var colors = chart.color()
         .title("颜色")

    chart.draw(function (selection, data){

        d3.layout.pack()
            .sort(null)
            .size([+width(), +height()])
            .padding(d3.max([nodePadding(),clusterPadding()]))
            .children(function (d) { return d.values; })
            .value(function (d) { return +d.size; })
            .nodes({
                values: d3.nest()
                    .key(function (d) { return d.cluster; })
                    .entries(data)
                }
            );

    var force = d3.layout.force()
        .nodes(data)
        .size([+width(), +height()])
        .gravity(.01)
        .charge(0)
        .on("tick", tick)
        .start();

    var g = selection
        .attr("width", width)
        .attr("height", height);

    colors.domain(data.filter(function (d){ return d.type == "node"; }), function (d){ return d.color; });

    var node = g.selectAll("circle")
        .data(data.filter(function (d){ return d.type == "node"; }))
        .enter().append("circle")
            .style("fill", function(d) { return d.color ? colors()(d.color) : colors()(null); })
            .call(force.drag);

    node.transition()
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
            var i = d3.interpolate(0, +d.r);
            return function(t) { return d.radius = i(t); };
        });

    var text = g.selectAll("text")
        .data(data.filter(function (d){ return d.type == "node"; }))
        .enter().append("text")
            .text(function (d){ return d.label; })
            .attr("text-anchor", "middle")
            .attr("dy","4")
            .style("font-size","11px")
            .style("font-family","Arial, Helvetica")
            .call(force.drag);

    function tick(e) {
        node
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
        text
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    }

    function cluster(alpha) {
        return function(d) {
            if (d.type != "node") return;
            var cluster = d.clusterObject;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.r + cluster.r;
            if (l != r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              cluster.x += x;
              cluster.y += y;
            }
        };
    }

    function collide(alpha) {
        var quadtree = d3.geom.quadtree(data);
        return function(d) {
            var r = d.r + Math.max(+nodePadding(), +clusterPadding()),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.r + quad.point.radius + (d.cluster === quad.point.cluster ? +nodePadding() : +clusterPadding());
                    if (l < r) {
                      l = (l - r) / l * alpha;
                      d.x -= x *= l;
                      d.y -= y *= l;
                      quad.point.x += x;
                      quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
  
  })

})();