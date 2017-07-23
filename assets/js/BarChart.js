var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require("d3");
var d3Tip = require("d3-tip");

var ANIMATION_DURATION = 400;

var BarChart=React.createClass({
	getDefaultProps: function() {
        return {
            width: 500,
            height: 300,
            data: undefined,
            chartId: 'chart',
            yaxis: 'y',
            barColor: 'steelblue'
        };
    },

    getInitialState:function(){
        return {
        };
    },

    buildChart: function(){
    	var data = this.props.data;

        var width = this.props.width;
        var height = this.props.height;
    	var margin = {top: 40, right: 40, bottom: 30, left: 40};

		var svg = d3.select('#'+this.props.chartId + ' svg');
		if ( !svg.empty() ){
		    svg.remove();
		}

		var svg = d3.select('#'+this.props.chartId).append('svg')
			.attr('class', 'd3')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', "translate(" + margin.left + "," + margin.top + ")");

	    var x = d3.scaleBand()
		.range([0, width])
		.padding(0.1)
		.domain(data.map(function(d) { return d.name; }));

		var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(data, function(d) { return d.value; })]);

		var xAxis = d3.axisBottom()
			.scale(x);

		var yAxis = d3.axisLeft()
			.scale(y)
			.tickFormat(d3.format(",.2f"));

		var tip = d3Tip()
			.attr('class', 'd3-tip')
			//.offset([-10 0])
			.html(function(d) {
				return "<strong>Amount:</strong> <span style='color:blue'>" + d.value + "</span><br>" +
					"<strong>Due:</strong> <span style='color:blue'>" + d.note + "</span>";
			});

		svg.call(tip);

		svg.append("g")
			.attr('class', 'x axis')
		  	.attr('transform', 'translate(0,' + height + ')')
		  	.call(xAxis);

		svg.append("g")
			.attr('class', 'y axis')
		  	.call(yAxis)
		   .append("text")
		   	.attr("transform", "rotate(-90)")
		   	.attr("fill", "#000")
		   	.attr('y', 6)
		   	.attr("dy", ".71em")
		   	.style("text-anchor", "end")
		   	.text(this.props.yaxis);

		svg.selectAll('.bar')
			.data(data)
			.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', function(d) { return x(d.name); })
			.attr('y', function(d) { return y(d.value); })
			.attr('fill',this.props.barColor)
			.attr("width", function(d) { return x.bandwidth(); })
			.attr("height", function(d) { return height - y(d.value); })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.transition()
				.duration(ANIMATION_DURATION)
				.attr('x', function(d) { return x(d.name); });
	},

	render:function(){
		this.buildChart();
    	return(
    		<div></div>
    	);
    }

})

module.exports = BarChart;
