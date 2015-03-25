(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');

	var chart = raw.chart()
		.title('沃罗努瓦剖分')
		.description(
            "沃罗努瓦剖分围绕给定的两个变量定义的点创建最小面积。当与散点图共同使用时，可以有效的显示两点间的距离。")
		.thumbnail("imgs/voronoi.png")
		.model(points)

	var width = chart.number()
		.title("宽度")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	var colors = chart.color()
		.title("颜色")

	var showPoints = chart.checkbox()
		.title("显示数据点")
		.defaultValue(true)

	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
			y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var voronoi = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    		.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		colors.domain(data, function (d){ return d.color; });

		var path = g.selectAll("path")
			.data(voronoi(data), polygon)
			.enter().append("path")
	      	.style("fill",function (d){ return d && colors()? colors()(d.point.color) :  "#dddddd"; })
	      	.style("stroke","#fff")
	      	.attr("d", polygon);

	  	path.order();

	  	g.selectAll("circle")
		    .data(data.filter(function(){ return showPoints() }))
		  	.enter().append("circle")
			  	.style("fill","#000000")
			  	.style("pointer-events","none")
			    .attr("transform", function (d) { return "translate(" + x(d.x) + ", " + y(d.y) + ")"; })
			    .attr("r", 1.5);

		function polygon(d) {
			if(!d) return;
		  return "M" + d.join("L") + "Z";
		}

	})
})();
