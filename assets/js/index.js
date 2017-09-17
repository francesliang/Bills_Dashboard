var React = require('react');
var ReactDOM = require('react-dom');
var DjangoCSRFToken = require('django-react-csrftoken')
//var LinkedStateMixin = require('react-addons-linked-state-mixin')
var d3 = require("d3");

var BarChart = require('./BarChart');
var PieChart = require('./PieChart');

var BillForm = React.createClass({

	//mixins: [LinkedStateMixin],

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
			bill_name: '',
			due_date: undefined,
			amount: 0,
			showInputBill: false
		};

		return this.state
	},

	componentDidMount: function() {
		this.loadBillListFromServer();
		//setInterval(this.loadBillsFromServer, this.props.pollInterval)
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

	handleSubmit: function(event) {
		alert('A bill was submitted: ' + this.state.bill_name);
		var post_data = this.state;
		past_data.csrfmiddlewaretoken = DjangoCSRFToken;
		//event.preventDefault();
		$.ajax({
			url: this.props.postUrl,
			datatype: 'json',
			type: 'POST',
			data: post_data,
			cach: false,
			success: function(data) {
				console.log('submit succeeded', data);
			}
		})
	},

	onClick: function(e) {
		e.preventDefault();
		this.setState({
			showInputBill: true
		})
	},

	render: function() {
		var inputBill;
		var lineBreak;

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
			<form onSubmit={this.handleSubmit}>
			<select name="bill_name" className="form-control" id="billList" style={{width:'85%', display:'inline'}}
			onChange={this.handleInputChange} value={this.state.value} required="" autoFocus="">
				<option defaultValue="" disabled selected>Select your bill</option>
				{billList}
			</select>
			<button type="button" className="btn btn-default" style={{height:'34px', float:'right'}} onClick={this.onClick}>
				<i className="fa fa-plus" aria-hidden="true"></i>
			</button>
			<br></br><br></br>

			{inputBill}
			<br></br>

			<input name="due_date" type="date" id="dueDate" className="form-control" placeholder="Due date" 
			value={this.state.name} onChange={this.handleInputChange} required="" autoFocus=""/>
			<br></br><br></br>

			<input name="amount" type="number" step="0.01" id="amount" className="form-control" placeholder="Amount" 
			value={this.state.name} onChange={this.handleInputChange} required="" autoFocus=""/>
			<br></br><br></br>

			<button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>

			</form>
		);
	}
})


var LastBillBarChart = React.createClass ({
	getDefaultProps: function() {
		return {
			width: 600,
			height: 400,
			chartId: 'billbar'
		}
	},

	loadBillsFromServer: function() {
		console.log('loadBillsFromServer');
		$.ajax({
			url: this.props.url,
			datatype: 'json',
			cach: false,
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
		this.loadBillsFromServer();
	},

	buildChartData: function(){
		console.log('state', this.state)
		var data = this.state.data;
		var bData = Object.keys(data).map(function(k,i){
			return {name: k, value: data[k].amount, note: data[k].due_date}
		})
		return bData;
	},

	render: function() {
		var data = this.buildChartData();
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

})


var SummaryPieChart = React.createClass ({
	getDefaultProps: function() {
		return {
			width: 600,
			height: 480,
			chartId: 'billpie'
		}
	},

	loadBillsFromServer: function() {
		console.log('loadBillsFromServer');
		$.ajax({
			url: this.props.url,
			datatype: 'json',
			cach: false,
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
		this.loadBillsFromServer();
	},

	buildChartData: function(){
		console.log('state', this.state)
		var data = this.state.data;
		var bData = Object.keys(data).map(function(k,i){
			return {key: i, name: k, value: data[k]}
		})
		return bData;
	},

	render: function() {
		var data = this.buildChartData();
		console.log('pie chart data', data);
		return(

				<PieChart
					height={this.props.height}
					width={this.props.width}
					chartId={this.props.chartId}
					data={data}
				/>
		)
	}

})


ReactDOM.render(<BillForm postUrl='/insert_bill/' loadUrl='/list_bills/'/>, document.getElementById('billform'))
ReactDOM.render(<LastBillBarChart url='/get_last_bills/' />, document.getElementById('billbar'))
ReactDOM.render(<SummaryPieChart url='/get_bills_summary/' />, document.getElementById('billpie'))

