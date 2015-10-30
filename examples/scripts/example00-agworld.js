var ReactGrid             = require('../build/react-data-grid');
var QuickStartDescription = require('../components/QuickStartDescription')
var ReactPlayground       = require('../assets/js/ReactPlayground');

var SimpleExample = `
//helper to generate a random date
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}

//generate a fixed number of rows and set their properties
function createRows(numberOfRows){
  var _rows = [];
  for (var i = 1; i < numberOfRows; i++) {
    _rows.push({
      id: i,
      property : ["And's Farm", 'Grow Joe', 'Grow Moe'][Math.floor((Math.random() * 3))],
      paddock : 'Field ' + Math.floor((Math.random() * 100) + 1),
      task: 'Task ' + i,
      priority : ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
      issueType : ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
      startDate: randomDate(new Date(2015, 3, 1), new Date()),
      completeDate: randomDate(new Date(), new Date(2016, 0, 1))
    });
  }
  return _rows;
}

var RowSelectHander = function(selectedRows){
  console.log("Selected rows: ", selectedRows);
}

//Custom Formatter component
var ButtonActionFormatter = React.createClass({
  render:function(){
    return (
      <button onClick={this._onClick}>Click here</button>
    );
  },
  _onClick:function(){
    console.log("handleClick: ", this.props.value);
  }
});

//Columns definition
var columns = [
{
  key: 'id',
  name: 'ID',
  width: 80
},
{
  key: 'task',
  name: 'Title',
  editable : true,
  sortable: true
},
{
  key: 'priority',
  name: 'Priority',
  editable : true,
  sortable: true
},
{
  key: 'issueType',
  name: 'Issue Type',
  editable : true,
  sortable: true
},
{
  key: 'id',
  name: 'Action',
  editable : true,
  formatter : ButtonActionFormatter
},
{
  key: 'startDate',
  name: 'Start Date',
  editable : true,
  sortable: true
},
{
  key: 'completeDate',
  name: 'Expected Complete',
  editable : true,
  sortable: true
}
]


// This component groups the rows by using the name property (this.props.name set in getDefaultProps)
// You can customize the rendering of this group title by using the getValueFromRow() within the render() method.
var PropertyGroupTitleComponentRow = React.createClass({
    propTypes: {
      name: React.PropTypes.string,
      row: React.PropTypes.object
    },
    getDefaultProps: function() {
      //name: Mandatory field that specify on what data of the row this should be group on
      return {
        name: 'property',
      };
    },
    // Mandatory method that get the row later on when the table is displayed
    getValueFromRow: function(){
      return this.props.row[this.props.name];
    },
    render: function() {
      var value = this.getValueFromRow();
      return <div class='groupName'>Hello {value}</div>;
    }
});

// Pass an array of attributes you want the rows to be grouped by
// i.e:
// [ReactComponentThatGroupAndCustomRender, 'string representing an attribute to group the rows on']
// This array can group 'in order' with as many levels as this uses recursivity
// In case of a string passed then the group title will be a div with the class='groupName'
// In case of a Reactcomponent passed then the rendering is customized. See above.
var attribute = [PropertyGroupTitleComponentRow, 'paddock'];

var Example = React.createClass({

  getInitialState: function(){
    var originalRows = createRows(100);
    var rows = originalRows.slice(0);
    //store the original rows array, and make a copy that can be used for modifying eg.filtering, sorting
    return {originalRows : originalRows, rows : rows};
  },

  rowGetter : function(rowIdx){
    return this.state.rows[rowIdx];
  },

  handleRowUpdated : function(e){
    debugger;
    //merge updated row with current row and rerender by setting state
    var rows = this.state.rows;
    Object.assign(rows[e.rowIdx], e.updated);
    this.setState({rows: rows});
  },

  handleGridSort: function(sortColumn, sortDirection){
    var comparer = function(a, b) {
      if(sortDirection === 'ASC'){
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      }else if(sortDirection === 'DESC'){
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }
    var rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
    this.setState({rows : rows});
  },

  render: function() {
    return(<ReactDataGrid
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        groupOnAttribute={attribute}
        enableCellSelect={true}
        onRowUpdated={this.handleRowUpdated}
        enableRowSelect={true}
        onRowSelect={RowSelectHander}
        onGridSort={this.handleGridSort} />);
  }
});

React.render(<Example />, mountNode);
`;

module.exports = React.createClass({

  render:function(){
    return(
      <div>
        <h3>Custom Formatter Example</h3>
        <p>Its possible to create your own formatters for a given column by setting its <code>formatter</code> property. Here a React component is used to format the %complete column. A custom formatter will always receive a <code>value</code> prop, the value of the cell and this can be used however needed. Here we render a progress bar based on the <code>props.value</code></p>
        <ReactPlayground codeText={SimpleExample} />
      </div>
    )
  }

});
