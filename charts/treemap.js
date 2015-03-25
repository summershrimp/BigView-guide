(function(){

	var tree = raw.models.tree();

	var chart = raw.chart()
        .title('树形图')
		.description(
            "一种空间填充数据的层次结构和元素之间比例的可视化图标。 不同层级通过细分成矩形比例为每一个元素创建可视的群集。树形图有助于展示不同比例的嵌套层次数据结构")
		.thumbnail("imgs/treemap.png")
		.model(tree)

	var width = chart.number()
		.title('宽度')
		.defaultValue(100)
		.fitToWidth(true)
	
	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	var padding = chart.number()
		.title("边距")
		.defaultValue(5)

	var colors = chart.color()
		.title("颜色")

	chart.draw(function (selection, data){
		
		var format = d3.format(",d");

		var layout = d3.layout.treemap()
			.sticky(true)
            .padding(+padding())
            .size([+width(), +height()])
            .value(function(d) { return d.size; })

		var g = selection
    	    .attr("width", +width())
    	    .attr("height", +height())
    	  	.append("g")
    	    .attr("transform", "translate(.5,.5)");

		var nodes = layout.nodes(data)
	  	    .filter(function(d) { return !d.children; });

        colors.domain(nodes, function (d){ return d.color; });

		var cell = g.selectAll("g")
    	    .data(nodes)
    	    .enter().append("g")
    	    .attr("class", "cell")
    	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    		
		cell.append("svg:rect")
    	    .attr("width", function (d) { return d.dx; })
    	    .attr("height", function (d) { return d.dy; })
    	    .style("fill", function (d) { return colors()(d.color); })
    	    .style("fill-opacity", function (d) {  return d.children ? 0 : 1; })
			.style("stroke","#fff")
		
		cell.append("svg:title")
			.text(function(d) { return d.name + ": " + format(d.size); });

		cell.append("svg:text")
    	    .attr("x", function(d) { return d.dx / 2; })
    	    .attr("y", function(d) { return d.dy / 2; })
    	    .attr("dy", ".35em")
    	    .attr("text-anchor", "middle")
	  //  .attr("fill", function (d) { return raw.foreground(color()(d.color)); })
    	   	.style("font-size","11px")
    		.style("font-family","Arial, Helvetica")
    	    .text(function(d) { return d.label ? d.label.join(", ") : d.name; });

	})
})();