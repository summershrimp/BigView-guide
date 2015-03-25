(function(){

    var points = raw.models.points();

    points.dimensions().remove('size');
    points.dimensions().remove('label');
    points.dimensions().remove('color');

    var chart = raw.chart()
        .title('凸包')
        .description(
            "在数学里，凸包是包围了这个点集的最小凸多边形，适用于散点图。有助于辨识属于相同领域的点")
        .thumbnail("imgs/convexHull.png")
        .model(points)

    var width = chart.number()
        .title("宽度")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("高度")
        .defaultValue(500)

    var stroke = chart.number()
        .title("边线宽度")
        .defaultValue(32)

    chart.draw(function (selection, data){

        var x = d3.scale.linear().range([0,+width()-stroke()]).domain(d3.extent(data, function (d){ return d.x; })),
            y = d3.scale.linear().range([+height()-stroke(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
        
        var vertices = data.map(function (d){
          return [ x(d.x), y(d.y) ]
        })

        var g = selection
            .attr("width", +width())
            .attr("height", +height())
            .append("g")
            .attr("transform","translate(" + stroke()/2 + "," + stroke()/2 + ")")

        g.append("path")
            .datum(d3.geom.hull(vertices))
            .style("fill", "#bbb")
            .style("stroke","#bbb")
            .style("stroke-width", +stroke())
            .style("stroke-linejoin","round")
            .attr("d", function (d) { return "M" + d.join("L") + "Z"; });

        g.selectAll("circle")
            .data(vertices)
            .enter().append("circle")
                .attr("r", 2)
                .attr("transform", function (d) { return "translate(" + d + ")"; })
  })
})();