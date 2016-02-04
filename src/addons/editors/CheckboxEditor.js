/* @flow */
/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react');

var CheckboxEditor = React.createClass({

  PropTypes : {
    value : React.PropTypes.bool.isRequired,
    rowIdx : React.PropTypes.number.isRequired,
    column: React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      onCellChange: React.PropTypes.func.isRequired
    }).isRequired
  },

  handleChange(e: Event){
    this.props.column.onCellChange(this.props.rowIdx, this.props.column.key, e);
  },

  render(): ? ReactElement {
    var checked = this.props.value != null ? this.props.value : false;
    return (<input className="react-grid-CheckBox" type="checkbox" checked={checked} onChange={this.handleChange} />);
  }
});

module.exports = CheckboxEditor;
