(function(){

    var model = raw.model();

    var list = model.dimension()
        .title('轴划分')
        .multiple(true)
        .types(Number)

    var color = model.dimension()
        .title("颜色")

    model.map(function (data){
        if (!list()) return;
        return data.map(function (d){
            var obj = { dimensions: {}, color: color(d) };
            list().forEach(function (l){
                obj.dimensions[l] = d[l];
            })
            return obj;
        })
    })

    var chart = raw.chart()
        .title('平行坐标图')
        .description(
            "平行坐标图是多维几何可视化和多维数据分析常用的图表。在等高和等宽的n条平行线上，显示n维空间中的点集. n维空间中的一个点用平行轴上的顶点和折现来表示。在第i个轴的顶点对应于这个点的第i个坐标。")
        .thumbnail("imgs/parallelCoordinates.png")
        .model(model)

    var width = chart.number()
        .title("宽度")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("高度")
        .defaultValue(500)

    var colors = chart.color()
        .title("颜色")

    chart.draw(function (selection, data){

        var m = [30, 40, 10, 40],
            w = +width() - m[1] - m[3],
            h = +height() - m[0] - m[2];

        var x = d3.scale.ordinal().rangePoints([0, w], 0),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())
            .append("g")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .style("font-size","10px")
                .style("font-family","Arial, Helvetica")
                    .append("svg:g")    
                        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        x.domain(dimensions = d3.keys(data[0].dimensions).filter(function (d) {
          return d != "name" && (y[d] = d3.scale.linear()
              .domain(d3.extent(data, function(p) { return +p.dimensions[d]; }))
              .range([h, 0]));
        }));

        colors.domain(data, function (d){ return d.color; });

        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
                .enter().append("svg:path")
                    .style('fill','none')
                    .style('stroke', function (d){ return colors()(d.color); })
                    .style('stroke-opacity','.4')
                    .attr("d", path);

        var g = svg.selectAll(".dim")
            .data(dimensions)
            .enter().append("svg:g")
                .attr("class", "dim")
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
                .attr("text-anchor", "middle")
                .style("font-size","10px")
                .style("font-family","Arial, Helvetica")
                .attr("y", -9)
                .text(String);

        d3.selectAll('text')
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")

        d3.selectAll(".axis line, .axis path")
            .style('fill', 'none')
            .style('stroke', '#000')
            .style('stroke-width', '1px')
            .style('shape-rendering','crispEdges')

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function path(d) {
            return line(dimensions.map(function(p) { return [position(p), y[p](d.dimensions[p])]; }));
        }

    });

})();