var React = require('react');
var ReactDOM = require('react-dom');

var barChart = require('./d3Chart');


var Chart = React.createClass({
	propTypes: {
		data: React.PropTypes.array,
		domain: React.PropTypes.array
	},

	bars: {},

	componentDidMount: function() {
		var el = ReactDOM.findDOMNode(this);

		bars = barChart.create(el, {
	      width: this.props.width,
	      height: this.props.height
	    }, this.getChartState());

		console.log(barChart);
		console.log(this.getChartState());

		barChart.update(el, this.getChartState());
		
	},

	getChartState: function () {
		return {
			data: this.props.data,
			domain: this.props.domain
		};
	},

	componentWillUnmount: function() {
		var el = ReactDOM.findDOMNode(this);
		barChart.destroy(el)
	},

	render: function() {
		return (
			<div className="Chart"></div>
		);
	}

})

module.exports = Chart;