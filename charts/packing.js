(function(){

	var tree = raw.models.tree();

	var chart = raw.chart()
		.title('圆 Packing')
		.description(
            "用圆形的嵌套来表示层次结构，比较不同类别。 这种可视化方式通过不同类别的大小和位置可以有效的展示分层结构内的联系。")
		.thumbnail("imgs/circlePacking.png")
        .model(tree)

	var diameter = chart.number()
        .title("直径")
        .defaultValue(800)
        .fitToWidth(true)

	var padding = chart.number()
        .title("边距")
        .defaultValue(5)

	var sort = chart.checkbox()
        .title("按大小排序")
        .defaultValue(false)

	var colors = chart.color()
        .title("颜色")

	var showLabels = chart.checkbox()   
        .title("显示标签")
		.defaultValue(true)

	chart.draw(function (selection, data){

		if (!data.children.length) return;

		var margin = 10,
	    	outerDiameter = +diameter(),
	    	innerDiameter = outerDiameter - margin - margin;

		var x = d3.scale.linear()
		    .range([0, innerDiameter]);

		var y = d3.scale.linear()
		    .range([0, innerDiameter]);

		var pack = d3.layout.pack()
		    .padding(+padding())
		    .sort(function (a,b){ return sort() ? a.value-b.value : null; })
		    .size([innerDiameter, innerDiameter])
		    .value(function(d) { return +d.size; })

		var g = selection
		    .attr("width", outerDiameter)
		    .attr("height", outerDiameter)
            .append("g")
		    .attr("transform", "translate(" + margin + "," + margin + ")");

        var focus = data,
            nodes = pack.nodes(data);

        colors.domain(nodes.filter(function (d){ return !d.children; }), function (d){ return d.color; });

        g.append("g").selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("r", function (d) { return d.r; })
            .style("fill", function (d) { return !d.children ? colors()(d.color) : ''; })
            .style("fill-opacity", function (d){ return !d.children ? 1 : 0; })
            .style("stroke", '#ddd')
            .style("stroke-opacity", function (d) { return !d.children ? 0 : 1 })

        g.append("g").selectAll("text")
            .data(nodes.filter(function (d){ return showLabels(); }))
            .enter().append("text")
            .attr("text-anchor", "middle")
	   		.style("font-size","11px")
			.style("font-family","Arial, Helvetica")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .text(function (d) { return d.label ? d.label.join(", ") : d.name; });

	})
})();