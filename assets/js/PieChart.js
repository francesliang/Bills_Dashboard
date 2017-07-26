var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require("d3");
var d3Tip = require("d3-tip");

var PieChart = React.createClass({
	getDefaultProps: function() {
        return {
            width: 500,
            height: 300,
            data: undefined,
            chartId: 'chart',
            title: ''
        };
    },

    getInitialState:function(){
        return {
        };
    },

    buildChart: function() {

        var data = this.props.data;
        var width = this.props.width;
        var height = this.props.height;

        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70)

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        var svg = d3.select('#'+this.props.chartId + ' svg');
		if ( !svg.empty() ){
		    svg.remove();
		}

		var svg = d3.select('#'+this.props.chartId).append('svg')
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('transform', "translate(" + width/2 + "," + height/2 + ")");

        var path  = svg.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr(
                "fill", function(d, i) { return color(d.data.name);}
            )
            .attr("d", arc);


        var text = svg.selectAll("text")
            .data(pie(data))
            .enter().append("text")
            .transition().duration(200)
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.name + ': ' + d.data.value + "%"; });

    },

    render: function(){
        this.buildChart();
        return (
            <div></div>
        )
    }

});

module.exports = PieChart;