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

	handleInputChange: function(event) {
		const target = event.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value
		});

		console.log('input', this.state)
	},

	render: function() {
		if (this.state.existing_bills) {
			var bills = this.state.existing_bills;
			var billList = bills.map(function(bill, i){
				return <option key={i} value={bill}> {bill}</option>
			})
		}

		if (this.state.showInputBill) {
			inputBill = <input name="bill_name" type="text" id="inputBill" className="form-control" placeholder="Bill name"	value={this.state.name} onChange={this.handleInputChange} required="" autoFocus=""/>
		}

		return (
			<select name="bill_name" className="form-control" id="billList" style={{width:'85%', display:'inline'}} 
				onChange={this.handleInputChange} value={this.state.value} required="" autoFocus="">
					<option defaultValue="" disabled selected>Select your bill</option>
					{billList}
			</select>
		)
	}

});

var BillOverview = React.createClass({
    getDefaultProps: function() {
		return {
			bill_name: 'Electricity'
		}
	},

    loadOverviewFromServer: function() {
		console.log('loadOverviewFromServer');
		$.ajax({
			url: this.props.url,
			datatype: 'json',
			cach: false,
			data: {'bill_name': this.props.bill_name},
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(request, status, error) {
				console.log(request.responseText, error);
				alert(request.responseText);
			}
		})
	},

	getInitialState: function(){
		this.state = {
			data: {},
			tooltip: null
		};
		return this.state;
	},

	componentDidMount: function() {
		console.log('componentDidMount');
		this.loadOverviewFromServer();
	},

	buildBarData: function(){
		console.log('state', this.state)
		var data = this.state.data;
		var bData = data.due_dates.map(function(d,i){
			return {name: d, value: data.amounts[k], note: ''}
		})
		return bData;
	},

	render: function() {
		var data = this.buildBarData();
		return(
				<BarChart
					height={this.props.height}
					width={this.props.width}
					chartId={this.props.chartId}
					yaxis='Amount($AUD)'
					data={data}
				/>
		)
	}
});


ReactDOM.render(<BillSelect loadUrl='/list_bills/'/>, document.getElementById('bill_select'))
ReactDOM.render(<BillOverview url='/get_bill_overview/'/>, document.getElementById('billoverview'))



