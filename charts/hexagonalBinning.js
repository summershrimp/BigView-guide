(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');
	points.dimensions().remove('color');

	var chart = raw.chart()
		.title('六角分级')
		.description(
			"在散点图上可视化的群集分布最密集的区域。可让大型散点图可读性更强。")
		.thumbnail("imgs/binning.png")
		.model(points)

	var width = chart.number()
		.title("宽度")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	var radius = chart.number()
		.title("半径")
		.defaultValue(20)

	var useZero = chart.checkbox()
		.title("原点设为(0, 0)")
		.defaultValue(false)

	var colors = chart.color()
		 .title("颜色")

	var showPoints = chart.checkbox()
		.title("显示数据点")
		.defaultValue(true)

	chart.draw(function (selection, data){

		// Retrieving dimensions from model
		var x = points.dimensions().get('x'),
			y = points.dimensions().get('y');
			
		var g = selection
			.attr("width", +width() )
			.attr("height", +height() )
			.append("g")

		var marginLeft = d3.max(data, function (d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9,
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero()? d3.extent(data, function (d){ return d.x; }) : [0, d3.max(data, function (d){ return d.x; })],
			yExtent = !useZero()? d3.extent(data, function (d){ return d.y; }) : [0, d3.max(data, function (d){ return d.y; })];

		var xScale = x.type() == "Date"
				? d3.time.scale().range([marginLeft,width()]).domain(xExtent)
				: d3.scale.linear().range([marginLeft,width()]).domain(xExtent),
			yScale = y.type() == "Date"
				? d3.time.scale().range([h, 0]).domain(yExtent)
				: d3.scale.linear().range([h, 0]).domain(yExtent),
			xAxis = d3.svg.axis().scale(xScale).tickSize(-h).orient("bottom"),
    		yAxis = d3.svg.axis().scale(yScale).ticks(10).tickSize(-w).orient("left");

		var hexbin = d3.hexbin()
		    .size([w, h])
		    .x(function(d){ return xScale(d.x); })
		    .y(function(d){ return yScale(d.y); })
		    .radius(+radius());

		var xAxis = d3.svg.axis()
		    .scale(xScale)
		    .orient("bottom")
		    .tickSize(6, -h);

		var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient("left")
		    .tickSize(6, -w);

		g.append("clipPath")
		    .attr("id", "clip")
		  	.append("rect")
			    .attr("class", "mesh")
			    .attr("width", w)
			    .attr("height", h)
			    .attr("transform", "translate(" + marginLeft + ",1)");

		colors.domain(hexbin(data), function (d){ return d.length; });

		g.append("g")
		    .attr("clip-path", "url(#clip)")
		  	.selectAll(".hexagon")
		    .data(hexbin(data))
		  	.enter().append("path")
			    .attr("class", "hexagon")
			    .attr("d", hexbin.hexagon())
			    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			    .style("fill", function(d) { return colors()(d.length); })
			    .attr("stroke","#000")
			    .attr("stroke-width",".5px")

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
				.attr("class","point")

		point.append("circle")
		  	.filter(function(){ return showPoints(); })
		    .style("fill", "#000")
		    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
		    .attr("r", 1);

		g.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate(" + marginLeft + ",0)")
		    .call(yAxis);

		g.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + h + ")")
		    .call(xAxis);

		g.selectAll(".axis")
			.selectAll("text")
			.style("font","10px Arial, Helvetica")

		g.selectAll(".axis")
			.selectAll("path")
			.style("fill","none")
			.style("stroke","#000000")
			.style("shape-rendering","crispEdges")

		g.selectAll(".axis")
			.selectAll("line")
			.style("fill","none")
			.style("stroke","#000000")
			.style("shape-rendering","crispEdges")
	})
})();
