//http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require("d3");
var EventEmitter = require('events').EventEmitter;

var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;

var barChart = module.exports = {};

barChart.create = function(element, props, state) {
	var margin = {top: 20, right: 20, bottom: 30, left: 40};

	var svg = d3.select(element).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width - margin.left - margin.right)
		.attr('height', props.height - margin.top - margin.bottom);

	svg.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('class', 'bar');
	//svg.append('g').attr('class', 'd3-tooltips');
	var dispatcher = new EventEmitter();

	this.update(element, state, dispatcher);

	return dispatcher;
};

barChart.update = function(element, state, dispatcher) {
	// Re-compute the scales, and render the data points
	var scales = this._scales(element, state.data);
	this._drawBars(element, scales, state.data, dispatcher);
	//this._drawTooltips(element, scales, state.tooltips);
};

barChart.destroy = function(element) {
	// Any clean-up would go here
};

barChart._scales = function(el, domain) {
	if (!domain) {
		return null;
	}
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	var x = d3.scaleBand()
		.range([0, width])
		.padding(0.1)
		.domain(domain.map(function(d) { return d[0]; }));

	var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(domain, function(d) { return d[1]; })]);

	return {x: x, y: y};
};

barChart._drawBars = function(element, scales, data, dispatcher){
	console.log('draw bars', data);
	var height = 300
	var width = 500

	var barColor = 'steelblue';

	var xAxis = d3.axisBottom()
		.scale(scales.x);

	var yAxis = d3.axisLeft()
		.scale(scales.y)
		.tickFormat(d3.format(",.2f"));

	var g = d3.select(element).selectAll('.bar');

	g.attr('class', 'x axis')
	  .attr('transform', 'translate(0,' + height + ')')
	  .call(xAxis);

	g.attr('class', 'y axis')
	  .call(yAxis);

	var point = g.selectAll('.bar')
		.data(data, function(d) {return d.id});

	// ENTER
	point.enter().append('rect')
		.attr('class', 'bar')
		.attr('x', function(d) { return scales.x(d[0])})
		//.attr('x', function(d) { return d.x})
		.attr('y', function(d) { return scales.y(d[1]); })
		//.attr('y', function(d) { return d.y; })
		.attr('fill',barColor)
		.attr("width", function(d) { return scales.x.bandwidth(); })
		.attr("height", function(d) { return height - scales.y(d[1]); })
		.on('mouseover', function(d) {
        	dispatcher.emit('point:mouseover', d);
      	  })
		.on('mouseout', function(d) {
	        dispatcher.emit('point:mouseout', d);
	      })
		.transition()
			.duration(ANIMATION_DURATION)
			.attr('x', function(d) { return scales.x(d.x); });


	// EXIT
	point.exit().remove();

};

barChart._drawTooltips= function(el, scales, tooltips) {
	var g = d3.select(el).selectAll('.d3-tooltips');
	console.log(g);

	var tooltipRect = g.selectAll('.d3-tooltip-rect')
		.data(tooltips, function(d) { return d.id; });
	console.log(tooltipRect);

	tooltipRect.enter().append('rect')
		.attr('class', 'd3-tooltip-rect')
		.attr('width', TOOLTIP_WIDTH)
		.attr('height', TOOLTIP_HEIGHT)
		.attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
		.transition()
			.duration(ANIMATION_DURATION)
			.attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; });

	tooltipRect.attr('y', function(d) { return scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT; })
		.transition()
			.duration(ANIMATION_DURATION)
			.attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; });

	tooltipRect.exit().remove();

	var tooltipText = g.selectAll('.d3-tooltip-text')
		.data(tooltips, function(d) { return d.id; });

	tooltipText.enter().append('text')
		.attr('class', 'd3-tooltip-text')
		.attr('dy', '0.35em')
		.attr('text-anchor', 'middle')
		.text(function(d) { return d.z; })
		.attr('x', function(d) { scales.x(d.x); })
		.transition()
			.duration(ANIMATION_DURATION)
			.attr('x', function(d) { scales.x(d.x); });

	tooltipText.attr('y', function(d) { return scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT/2; })
		.transition()
			.duration(ANIMATION_DURATION)
			.attr('x', function(d) { return scales.x(d.x); });

	tooltipText.exit().remove();
};

//module.exports = barChart;





