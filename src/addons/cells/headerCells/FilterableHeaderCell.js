/* @flow  */
/**
 * @jsx React.DOM


 */
'use strict';

var React              = require('react');
var ExcelColumn        = require('../../grids/ExcelColumn');

class FilterableHeaderCell extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {filterTerm : ''};
  }

  handleChange(e: Event) {
    var val = e.target.value;
    this.setState({filterTerm : val });
    this.props.onChange({filterTerm : val, columnKey : this.props.column.key});
  }

  render(): ?ReactElement {
    return (
      <div>
        <div className="form-group">
          {this.renderInput()}
        </div>
      </div>
    );
  }

  renderInput(): ?ReactElement {
    if(this.props.column.filterable === false){
      return <span/>;
    }else{
      var input_key = 'header-filter-' + this.props.column.key;
      return (<input key={input_key} type="text" className="form-control input-sm" placeholder="Search" value={this.state.filterTerm} onChange={this.handleChange}/>)
    }

  }
}

FilterableHeaderCell.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  column: React.PropTypes.shape(ExcelColumn).isRequired
};

module.exports = FilterableHeaderCell;
