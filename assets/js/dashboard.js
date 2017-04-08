var React = require('react');
var ReactDOM = require('react-dom');
//var LinkedStateMixin = require('react-addons-linked-state-mixin')
var d3 = require("d3");

var BarChart = require('./BarChart');

var BillSelect = React.createClass({
	loadBillListFromServer: function() {
		$.ajax({
			url: this.props.loadUrl,
			datatype: 'json',
			cach: false,
			success: function(data) {
				this.setState({existing_bills: data});
			}.bind(this)
		})
	},

	getInitialState: function() {
		this.state = {
			existing_bills: [],
			bill_name: ''
		};

		return this.state
	},

	componentDidMount: function() {
		this.loadBillListFromServer();
	},

	render: function() {

	}

});


ReactDOM.render(<BillSelect postUrl='/get_bill_detail/' loadUrl='/list_bills/'/>, document.getElementById('bill_select'))