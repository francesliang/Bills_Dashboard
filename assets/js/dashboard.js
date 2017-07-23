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

        console.log('bill name', value);

		var bill_overview = (
		    <BillOverview bill_name={value} url='/get_bill_overview/' />
		)

		var bill_history = (
		    <BillHistory bill_name={value} url='/get_bill_history/' />
		)

        ReactDOM.render(bill_overview, document.getElementById('billoverview'))
        ReactDOM.render(bill_history, document.getElementById('billhistory'))

		this.setState({
			[name]: value
		});


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
					<option disabled selected>Select your bill</option>
					{billList}
			</select>



		)
	}

});

var SideBar = React.createClass({
    render: function() {
        return (
            <div>
                <SideItem name='Overview' />
                <SideItem name='History' />
			</div>
        )
    }
});

var SideItem = React.createClass({
    getInitialState: function() {
        return {
            isSelected:false
        }
    },

    handleClick: function() {
        this.setState({
            isSelected: true
        })
    },

    render: function(){
        var isSelected = this.state.isSelected;
        var itemClass = "";
        if (isSelected) {
            itemClass = "active";
        }
        return (
            <li className={itemClass}><a href="#" onClick={this.handleClick}>{this.props.name}</a></li>
        )

    }
});

var BillOverview = React.createClass({
    getDefaultProps: function() {
		return {
			bill_name: '',
			width: 500,
			height: 300,
			chartId: 'billoverview'
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
			data: {
                due_dates: [],
                amounts: []
			},
			tooltip: null
		};
		return this.state;
	},

	componentDidUpdate: function(prevProps, prevState) {
	    if (prevProps.bill_name !== this.props.bill_name || !prevProps.bill_name) {
		    console.log('componentDidUpdate');
		    this.loadOverviewFromServer();
		}
	},

	componentDidMount: function(){
	    console.log('componentDidMount');
		this.loadOverviewFromServer();
	},

	buildBarData: function(){
		var data = this.state.data;
        bData = data.due_dates.map(function(d,i){
            return {name: d, value: data.amounts[i], note: ''}
        });

		return bData;
	},

	render: function() {
		var data = this.buildBarData();
        console.log('bData', data);
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

var BillHistory = React.createClass({
    getDefaultProps: function() {
		return {
			bill_name: '',
			chartId: 'billhistory'
		}
	},

    loadHistoryFromServer: function() {
		console.log('loadHistoryFromServer');
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
			data: {
                due_dates: [],
                amounts: []
			},
			tooltip: null
		};
		return this.state;
	},

	componentDidUpdate: function(prevProps, prevState) {
	    if (prevProps.bill_name !== this.props.bill_name || !prevProps.bill_name) {
	        console.log('componentDidUpdate');
		    this.loadHistoryFromServer();
	    }
	},

	componentDidMount: function(){
	    console.log('componentDidMount');
		this.loadHistoryFromServer();
	},

	buildTableData: function() {
		var data = this.state.data;
        var tData = data.due_dates.map(function(d,i){
            return <CustomRow key={i} No={i+1} DueDate={d} Amount={data.amounts[i]}/>
        });

		return tData;
	},

    render: function() {
	    var rows = this.buildTableData();
	    console.log('rows', rows);
	    return (

	        <div>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableStyle}>
                            <th style={tableStyle}>No.</th>
                            <th style={tableStyle} >Due Date</th>
                            <th style={tableStyle}>Amount($AUD)</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
      );
    }

});

var CustomRow = React.createClass({
    render: function() {
        return (
            <tr style={tableStyle}>
                <td style={tableStyle}>{this.props.No}</td>
                <td style={tableStyle}>{this.props.DueDate}</td>
                <td style={tableStyle}>{this.props.Amount}</td>
            </tr>
        );
    }
});

var tableStyle = {
    border: '1px solid rgba(0,0,0,0.08)',
    padding: '6px 13px',
};

ReactDOM.render(<BillSelect loadUrl='/list_bills/'/>, document.getElementById('bill_select'))
ReactDOM.render(<SideBar/>, document.getElementById('sidebar'))


