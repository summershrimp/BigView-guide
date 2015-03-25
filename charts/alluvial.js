(function(){

	var graph = raw.models.graph();

	var chart = raw.chart()
		.title('冲积图 (Fineo-like)')
		.description(
            "冲积图可以呈现数据的流动并看到绝对维度之间的关联，形象的展示有相同属性的元素之间的数量相关。群集的变迁展示是非常有用的(例如人群之间的流动)。通过把集群当作维度使用，这种图表也可以展示双边关系。")
		.thumbnail("imgs/alluvial.png")
		.model(graph)

	var width = chart.number()
		.title("宽度")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("高度")
		.defaultValue(500)

	var nodeWidth = chart.number()
		.title("节点宽度")
		.defaultValue(10)

	var sortBy = chart.list()
        .title("排序依据")
        .values(['大小','名称','自动'])
        .defaultValue('大小')

	var colors = chart.color()
		.title("颜色")

	chart.draw(function (selection, data){

		var formatNumber = d3.format(",.0f"),
		    format = function(d) { return formatNumber(d); };

		var g = selection
		    .attr("width", +width() )
		    .attr("height", +height() )
		  	.append("g")
		    .attr("transform", "translate(" + 0 + "," + 0 + ")");

		// Calculating the best nodePadding

		var nested = d3.nest()
	    	.key(function (d){ return d.group; })
	    	.rollup(function (d){ return d.length; })
	    	.entries(data.nodes)

	    var maxNodes = d3.max(nested, function (d){ return d.values; });

		var sankey = d3.sankey()
		    .nodeWidth(+nodeWidth())
		    .nodePadding(d3.min([10,(height()-maxNodes)/maxNodes]))
		    .size([+width(), +height()]);

		var path = sankey.link(),
			nodes = data.nodes,
			links = data.links;

		sankey
	   		.nodes(nodes)
	    	.links(links)
	    	.layout(32);

	    // Re-sorting nodes

	    nested = d3.nest()
	    	.key(function(d){ return d.group; })
	    	.map(nodes)

	    d3.values(nested)
	    	.forEach(function (d){
		    	var y = ( height() - d3.sum(d,function(n){ return n.dy+sankey.nodePadding();}) ) / 2 + sankey.nodePadding()/2;
		    	d.sort(function (a,b){ 
		    		if (sortBy() == "自动") return b.y - a.y;
		    		if (sortBy() == "大小") return b.dy - a.dy;
		    		if (sortBy() == "名称") return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;		
		    	})
		    	d.forEach(function (node){
		    		node.y = y;
		    		y += node.dy +sankey.nodePadding();
		    	})
		    })

	    // Resorting links

		d3.values(nested).forEach(function (d){

			d.forEach(function (node){

	    		var ly = 0;
	    		node.sourceLinks
		    		.sort(function (a,b){
		    			return a.target.y - b.target.y;
		    		})
		    		.forEach(function (link){
		    			link.sy = ly;
		    			ly += link.dy;
		    		})
		    	
		    	ly = 0;

		    	node.targetLinks
		    		.sort(function(a,b){ 
		    			return a.source.y - b.source.y;
		    		})
		    		.forEach(function (link){
		    			link.ty = ly;
		    			ly += link.dy;
		    		})
			})
		})
	   
	 	colors.domain(links, function (d){ return d.source.name; });

		var link = g.append("g").selectAll(".link")
	    	.data(links)
	   		.enter().append("path")
			    .attr("class", "link")
			    .attr("d", path )
			    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			    .style("fill","none")
			    .style("stroke", function (d){ return colors()(d.source.name); })
			    .style("stroke-opacity",".4")
			    .sort(function(a, b) { return b.dy - a.dy; });

		var node = g.append("g").selectAll(".node")
	    	.data(nodes)
	    	.enter().append("g")
		      	.attr("class", "node")
		      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		node.append("rect")
		    .attr("height", function(d) { return d.dy; })
		    .attr("width", sankey.nodeWidth())
		    .style("fill", function (d) { return d.sourceLinks.length ? colors(d.name) : "#666"; })
		    .append("title")
		    	.text(function(d) { return d.name + "\n" + format(d.value); });

		node.append("text")
		    .attr("x", -6)
	      	.attr("y", function (d) { return d.dy / 2; })
	      	.attr("dy", ".35em")
	      	.attr("text-anchor", "end")
	      	.attr("transform", null)
			    .text(function(d) { return d.name; })
			    .style("font-size","11px")
				.style("font-family","Arial, Helvetica")
			    .style("pointer-events","none")
			    .filter(function(d) { return d.x < +width() / 2; })
			    .attr("x", 6 + sankey.nodeWidth())
		     	.attr("text-anchor", "start");

	})

})();