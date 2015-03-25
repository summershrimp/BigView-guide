(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');
	points.dimensions().remove('color');

	var chart = raw.chart()
		.title('德洛内三角')
		.description(
            "德罗内三角，双沃罗诺伊镶嵌, 用给定的点集创建一个三角形网格平面。")
		.thumbnail("imgs/delaunay.png")
		.model(points)

	var width = chart.number()
		.title("宽度")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
			y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var delaunay = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    		.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		var path = g.selectAll("path")
			.data(delaunay.triangles(data), polygon)
			.enter().append("path")
	      	.style("fill", "#bbb")
	      	.style("stroke","#fff")
	      	.attr("d", polygon);

		function polygon(d) {
			if(!d) return;
			var s = d.map(function (a){ return [x(a.x), y(a.y)]  } )
		  	return "M" + s.join("L") + "Z";
		}

	})
})();
