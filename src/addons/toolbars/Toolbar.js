/* @flow */
/**
* @jsx React.DOM

*/
'use strict';

var React = require('react');
var Row = require('../../Row');

class Toolbar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onAddRow = this.onAddRow.bind(this);
  }

  onAddRow() {
    if(this.props.onAddRow !== null && this.props.onAddRow instanceof Function){
      this.props.onAddRow({newRowIndex : this.props.numberOfRows});
    }
  }

  renderAddRowButton(): ReactElement {
    if(this.props.onAddRow){
      return(<button type="button" className="btn" onClick={this.onAddRow}>
        Add Row
      </button>)
    }
  }

  renderToggleFilterButton(): ReactElement {
    if(this.props.enableFilter){
      return(  <button type="button" className="btn" onClick={this.props.onToggleFilter}>
      Filter Rows
      </button>)
    }
  }

  render(): ?ReactElement {
    return (
      <div className="react-grid-Toolbar">
        <div className="tools">
          {this.renderAddRowButton()}
          {this.renderToggleFilterButton()}
        </div>
      </div>)
      }
}

Toolbar.defaultProps = {
  enableAddRow : true
};

Toolbar.propTypes = {
  onAddRow : React.PropTypes.func,
  onToggleFilter : React.PropTypes.func.isRequired,
  enableFilter : React.PropTypes.bool,
  numberOfRows : React.PropTypes.number.isRequired
};

module.exports = Toolbar;
