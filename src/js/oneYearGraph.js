const svg = d3.select('svg')
	.attr('height', 200)
	.attr('width', 900)

let width = +svg.attr('width'),
	height = +svg.attr('height'),
	margin = { top: 20, right: 20, bottom: 50, left: 30 },
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom,
	mainValue = d => d.month,
	dashValue = d => d.dashed,
	yValue = d => d.percent;

const xScale = d3.scaleTime()
	.range([0, innerWidth - 30]);

const yScale = d3.scaleLinear()
	.range([innerHeight, 0])
	.nice();

const lineGenerator = d3.line()		
    .x(d => xScale(mainValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(d3.curveCardinal);

const lineGeneratorDashed = d3.line()		
    .x(d => xScale(mainValue(d)))
    .y(d => yScale(dashValue(d)))
    .curve(d3.curveCardinal);


var svgDefs = svg.append('defs');
var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient');

mainGradient.append('stop')
    .attr('class', 'stop-right')
    // .attr('stop-opacity', 0.5)
    .attr('offset', '0%');

mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '10%');

mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '20%');

mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '30%');

mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '40%');

mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '52%');

mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '64%');

mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '76%');

mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '88%');

mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '100%');

svg.append('rect')
    .classed('filled', true)
    .attr('x', 15)
    .attr('y', 40)
    .attr("filter", "url(#blur)")
    .attr('height', innerHeight)
    .attr('width', innerWidth)

var svgDefs2 = svg.append('defs');
var mainGradient2 = svgDefs2.append('linearGradient')
    .attr('id', 'mainGradient2');
mainGradient2.append('stop')
    .attr('class', 'stop-right2')
    .attr('offset', '0');
mainGradient2.append('stop')
    .attr('class', 'stop-left2')
    .attr('offset', '5%');
svg.append('rect')
    .classed('filled2', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', innerHeight + 100)
    .attr('width', innerWidth + 100)
    .transition()
        .duration(3800)
        .ease(d3.easeQuadInOut)
		.attr('transform', 'translate(1000, 0)');

var filter = svgDefs
  .append("filter")
    .attr("id", "blur")
  .append("feGaussianBlur")
    .attr("stdDeviation", 7);

// svg.append('rect')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('height', innerHeight + 100)
//     .attr('width', innerWidth + 100)
//     .attr('fill', '#333333')
//     .transition()
//         .duration(4000)
// 		.attr('transform', 'translate(1000, 0)');

var parseDate = d3.timeParse("%m/%d/%Y");

svg.append('rect')
	.attr('fill', '#333333')
	.attr('class', 'topLeftMask')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 50)
    .attr('width', 50)
svg.append('rect')
	.attr('fill', '#333333')
	.attr('class', 'topRightMask')
    .attr('x', innerWidth)
    .attr('y', 0)
    .attr('height', 50)
    .attr('width', 50)

const render = data => {
	xScale
		.domain(d3.extent(data, mainValue))
		.nice(data.length);

	yScale.domain([
		d3.min(data, function(d) {
			return Math.min(yValue(d), dashValue(d)) - 10; }), 
		d3.max(data, function(d) {
			return Math.max(yValue(d), dashValue(d)); })
	]);


	var area = d3.area()
		.x(function(d) { return xScale(d.month) + 30})
    	.curve(d3.curveNatural)
		.y0(15)
		.y1(function(d) { return yScale(d.percent) + 20 });

	svg.append("path")
		.data([data])
		.attr("class", "area")
		.attr('fill', '#333333')
		.attr("d", area);

	const g = svg.append('g')
	  .attr('transform', `translate(${margin.left}, ${margin.top})`)

	const xAxis = d3.axisBottom(xScale)
		.tickSize(-innerHeight)
        .tickFormat(d3.timeFormat("%b"))
		.tickPadding(15);
	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight + 10})`)
		.attr('class', 'xAxis');

	// const yAxis = d3.axisLeft(yScale)
	// 	.tickSize(-innerWidth)
	// 	.tickPadding(15);
	// const yAxisG = g.append('g').call(yAxis);
	// yAxisG.selectAll('.domain').remove();




	var path = g.append('path')
		.attr('class', 'line-path')
	    .attr("ry", 20)
	    .attr("rx", 20)
		.attr('d', lineGenerator(data));

	var totalLength = path.node().getTotalLength();

	path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(3000)
        .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0);

	const lineGoal = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
    	.attr('class', 'lineGoal');
    lineGoal.append('line')
    	.attr('x1', 0)
    	.attr('y1', yScale(89.6))
    	.attr('y2', yScale(89.6))
        .transition()
	        .duration(1000)
    		.attr('x2', innerWidth - 15)
    lineGoal.append('text')
    	.attr('x', innerWidth - 10)
    	.attr('y', yScale(89.6) + 2)
    	.text('89,6%')
    	.attr('opacity', 0)
        .transition()
	        .duration(500)
	    	.delay(700)
    		.attr('opacity', 1);

    g.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr('width', 2)
		.attr('y', d => yScale(yValue(d)))
		.attr('x', d => xScale(mainValue(d)))
    	.attr('class', 'lineDropping')
	    .transition()
	    	.delay(function(d, i) { return i * 200; })
	    	.duration(1000)
        	.ease(d3.easeSin)
			.attr('height', d => innerHeight - yScale(yValue(d)))

	const dots = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
    dots.selectAll("dot")
		.data(data)
		.enter().append("circle")
		.attr("r", 5)
		.attr('opacity', 0)
		.attr('cx', d => xScale(mainValue(d)))
    	.attr('class', 'circles')
	    .transition()
	    	.delay(function(d, i) { return i * 200; })
	    	.duration(1000)
        	.ease(d3.easeSin)
			.attr('opacity', 1)
			.attr('cy', innerHeight)

	const xAxisPercent = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
    	.attr('class', 'percents');
	xAxisPercent.selectAll("text")
		.data(data)
		.enter().append("text")
		.attr('x', d => xScale(mainValue(d)) - 17)
		.attr('opacity', 0)
		.text(d => d.percent + '%')
	    .transition()
	    	.delay(function(d, i) { return i * 200; })
	    	.duration(1000)
        	.ease(d3.easeSin)
			.attr('opacity', 1)
			.attr('y', innerHeight + 20)

	if(data[0].dashed){
		var path = g.append('path')
			.attr('class', 'dashed-path')
		    .attr("fill", "none")
			.attr('d', lineGeneratorDashed(data))
			// .attr('transform', 'translate(30, 0)');

		var totalLength = path.node().getTotalLength();
		var dashing = "8, 8"

		var dashLength =
		    dashing
		        .split(/[\s,]/)
		        .map(function (a) { return parseFloat(a) || 0 })
		        .reduce(function (a, b) { return a + b });

		var dashCount = Math.ceil( totalLength / dashLength );

		var newDashes = new Array(dashCount).join( dashing + " " );

		var dashArray = newDashes + " 0, " + totalLength;

		path
		    .attr("stroke-dashoffset", totalLength)
	        .attr("stroke-dasharray", dashArray)
		    .transition()
	    	.duration(2000)
	    	.attr("stroke-dashoffset", 0);
	}

}

d3.csv('rails.csv').then(data => {
	data.forEach(d => {
      d.percent = +d.percent;
      d.dashed = +d.dashed;
      d.month = parseDate(d.month);

      // d.month = new Date(d.month);
	})
	render(data);
})

setTimeout(() => {
	document.getElementsByClassName('noWidth')[0].classList.add('resized');	
}, 100)
