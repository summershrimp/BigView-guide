(function(){

	var points = raw.models.points();

	var chart = raw.chart()
		.title('散点图')
		.description(
            "散点图表示因变量随自变量而变化的大致趋势，据此可以选择合适的函数对数据点进行拟合。用两组数据构成多个坐标点，考察坐标点的分布，判断两变量之间是否存在某种关联或总结坐标点的分布模式。散点图将序列显示为一组点。值由点在图表中的位置表示。类别由图表中的不同标记表示。散点图通常用于比较跨类别的聚合数据。")
		.thumbnail("imgs/scatterPlot.png")
		.model(points)

	var width = chart.number()
		.title("宽度")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	var maxRadius = chart.number()
		.title("最大半径")
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

		var marginLeft = d3.max([maxRadius(),(d3.max(data, function (d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9)]),
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero()? d3.extent(data, function (d){ return d.x; }) : [0, d3.max(data, function (d){ return d.x; })],
			yExtent = !useZero()? d3.extent(data, function (d){ return d.y; }) : [0, d3.max(data, function (d){ return d.y; })];

		var xScale = x.type() == "Date"
				? d3.time.scale().range([marginLeft,width()-maxRadius()]).domain(xExtent)
				: d3.scale.linear().range([marginLeft,width()-maxRadius()]).domain(xExtent),
			yScale = y.type() == "Date"
				? d3.time.scale().range([h-maxRadius(), maxRadius()]).domain(yExtent)
				: d3.scale.linear().range([h-maxRadius(), maxRadius()]).domain(yExtent),
			sizeScale = d3.scale.linear().range([1, Math.pow(+maxRadius(),2)*Math.PI]).domain([0, d3.max(data, function (d){ return d.size; })]),
			xAxis = d3.svg.axis().scale(xScale).tickSize(-h+maxRadius()*2).orient("bottom")//.tickSubdivide(true),
    		yAxis = d3.svg.axis().scale(yScale).ticks(10).tickSize(-w+maxRadius()).orient("left");


        g.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
        	.style("font-size","10px")
        	.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (h-maxRadius()) + ")")
            .call(xAxis);

      	g.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
            .style("font-size","10px")
			.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + marginLeft + "," + 0 + ")")
            .call(yAxis);

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
         	.style("shape-rendering","crispEdges")
         	.style("fill","none")
         	.style("stroke","#ccc")

		var circle = g.selectAll("g.circle")
			.data(data)
			.enter().append("g")
			.attr("class","circle")

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class","point")

		colors.domain(data, function(d){ return d.color; });

    	circle.append("circle")
            .style("fill", function(d) { return colors() ? colors()(d.color) : "#eeeeee"; })
            .style("fill-opacity", .9)
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    	    .attr("r", function (d){ return Math.sqrt(sizeScale(d.size)/Math.PI); });

    	point.append("circle")
            .filter(function(){ return showPoints(); })
            .style("fill", "#000")
            .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
            .attr("r", 1);

    	circle.append("text")
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    		.attr("text-anchor", "middle")
    		.style("font-size","10px")
    		.attr("dy", 15)
    		.style("font-family","Arial, Helvetica")
    	  	.text(function (d){ return d.label? d.label.join(", ") : ""; });

	})

})();