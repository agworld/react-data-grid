/* @flow */
/**
 * @jsx React.DOM


 */
'use strict';

var React              = require('react');
var joinClasses         = require('classnames');
var ExcelColumn = require('../../grids/ExcelColumn');
var DEFINE_SORT = {
  ASC : 'ASC',
  DESC : 'DESC',
  NONE  : 'NONE'
}

class SortableHeaderCell extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    var direction;
    switch(this.props.sortDirection){
      case null:
      case undefined:
      case DEFINE_SORT.NONE:
        direction = DEFINE_SORT.ASC;
      break;
      case DEFINE_SORT.ASC:
        direction = DEFINE_SORT.DESC;
      break;
    case DEFINE_SORT.DESC:
        direction = DEFINE_SORT.NONE;
      break;
    }
    this.props.onSort(
      this.props.columnKey,
      direction);
  }

  getSortByText() {
    var unicodeKeys = {
      'ASC' : '9650',
      'DESC' : '9660',
      'NONE' : ''
    }
    return String.fromCharCode(unicodeKeys[this.props.sortDirection]);
  }

  render(): ?ReactElement {
    return (
      <div
        onClick={this.onClick}
        style={{cursor: 'pointer'}}>
        <span className="pull-left">{this.props.column.name}</span>
        <span className="pull-right">{this.getSortByText()}</span>
      </div>
    );
  }
}

SortableHeaderCell.propTypes = {
  columnKey : React.PropTypes.string.isRequired,
  onSort    : React.PropTypes.func.isRequired,
  sortDirection : React.PropTypes.oneOf(['ASC', 'DESC', 'NONE'])
};

module.exports = SortableHeaderCell;
