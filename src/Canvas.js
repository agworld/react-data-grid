/* @flow */
/**
 * @jsx React.DOM
 */
"use strict";
var React           = require('react');
var joinClasses     = require('classnames');
var PropTypes       = React.PropTypes;
var cloneWithProps  = require('react/lib/cloneWithProps');
var shallowEqual    = require('react/lib//shallowEqual');
var emptyFunction   = require('react/lib/emptyFunction');
var ScrollShim      = require('./ScrollShim');
var Row             = require('./Row');
var ExcelColumn     = require('./addons/grids/ExcelColumn');
var RowContainer    = require('./RowContainer');

var Canvas = React.createClass({
  mixins: [ScrollShim],

  propTypes: {
    rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    rowHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    displayStart: PropTypes.number.isRequired,
    displayEnd: PropTypes.number.isRequired,
    rowsCount: PropTypes.number.isRequired,
    rowGetter: PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.array.isRequired
    ]),
    onRows: PropTypes.func,
    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    groupOnAttribute: PropTypes.array
  },

  render(): ?ReactElement {
    var displayStart = this.state.displayStart;
    var displayEnd = this.state.displayEnd;
    var rowHeight = this.props.rowHeight;
    var length = this.props.rowsCount;
    var groupOnAttribute = this.props.groupOnAttribute;
console.log('rendering canvas');
    var rows = this.props.groupedRows.slice(displayStart, displayEnd)
        .map((row,idx) => this.renderRow(row,idx));

    this._currentRowsLength = rows.length;

    if (displayStart > 0) {
      rows.unshift(this.renderPlaceholder('top', displayStart * rowHeight));
    }

    if (length - displayEnd > 0) {
      rows.push(
        this.renderPlaceholder('bottom', (length - displayEnd) * rowHeight));
    }

    var style = {
      position: 'absolute',
      top: 0,
      left: 0,
      overflowX: 'auto',
      overflowY: 'scroll',
      width: this.props.totalWidth + this.state.scrollbarWidth,
      height: this.props.height,
      transform: 'translate3d(0, 0, 0)'
    };

    return (
      <div
        style={style}
        onScroll={this.onScroll}
        className={joinClasses("react-grid-Canvas", this.props.className, {opaque : this.props.cellMetaData.selected && this.props.cellMetaData.selected.active})}>
        <div style={{width: this.props.width, overflow: 'hidden'}}>
          {rows}
        </div>
      </div>
    )
  },

  renderRow(row, idx) {
    var rowHeight = this.props.rowHeight;
    var length = this.props.rowsCount;
    switch (row.type) {
      case 'single':
        return this.renderSingleRow({
          key: this.props.displayStart + idx,
          ref: idx,
          idx: this.props.displayStart + idx,
          row: row.data,
          height: rowHeight,
          columns: this.props.columns,
          isSelected : this.isRowSelected(this.props.displayStart + idx),
          expandedRows : this.props.expandedRows,
          cellMetaData : this.props.cellMetaData
        });
        break;
      case 'group':
        return this.renderGroupRow({displayElement: row.displayElement});
    }
  },

  renderSingleRow(props: any) {
    var RowsRenderer = this.props.rowRenderer;
    if(typeof RowsRenderer === 'function') {
      return <RowsRenderer {...props}/>;
    }
    else if (React.isValidElement(this.props.rowRenderer)) {
      return cloneWithProps(this.props.rowRenderer, props);
    }
  },

  renderGroupRow(props: any) {
    return <RowContainer
      height={this.props.rowHeight}
      width={this.props.width}
      renderer={props.displayElement}
    />
  },

  renderPlaceholder(key: string, height: number): ?ReactElement {
    return (
      <div key={key} style={{height: height}}>
        {this.props.columns.map(
          (column, idx) => <div style={{width: column.width}} key={idx} />
        )}
      </div>
    );
  },

  getDefaultProps() {
    return {
      rowRenderer: Row,
      onRows: emptyFunction
    };
  },

  isRowSelected(rowIdx: number): boolean{
   return this.props.selectedRows && this.props.selectedRows[rowIdx] === true;
  },

  _currentRowsLength : 0,
  _currentRowsRange : { start: 0, end: 0 },
  _scroll : { scrollTop : 0, scrollLeft: 0 },

  getInitialState() {
    return {
      shouldUpdate: true,
      displayStart: this.props.displayStart,
      displayEnd: this.props.displayEnd,
      scrollbarWidth: 0
    };
  },

  componentWillMount() {
    this._currentRowsLength = 0;
    this._currentRowsRange = {start: 0, end: 0};
    this._scroll = {scrollTop : 0, scrollLeft: 0};
  },

  componentDidMount() {
    this.onRows();
  },

  componentDidUpdate(nextProps: any) {
    if (this._scroll !== {start: 0, end: 0}) {
      this.setScrollLeft(this._scroll.scrollLeft);
    }
    this.onRows();
  },

  componentWillUnmount() {
    this._currentRowsLength = 0;
    this._currentRowsRange = {start: 0, end: 0};
    this._scroll = {scrollTop : 0, scrollLeft: 0};
  },

  componentWillReceiveProps(nextProps: any) {
    if(nextProps.rowsCount > this.props.rowsCount){
      React.findDOMNode(this).scrollTop =nextProps.rowsCount * this.props.rowHeight;
    }
    var scrollbarWidth = this.getScrollbarWidth();
    var shouldUpdate = !(nextProps.visibleStart > this.state.displayStart
                        && nextProps.visibleEnd < this.state.displayEnd)
                        || nextProps.rowsCount !== this.props.rowsCount
                        || nextProps.rowHeight !== this.props.rowHeight
                        || nextProps.columns !== this.props.columns
                        || nextProps.groupedRows !== this.props.groupedRows
                        || nextProps.width !== this.props.width
                        || nextProps.cellMetaData !== this.props.cellMetaData
                        || !shallowEqual(nextProps.style, this.props.style);

    if (shouldUpdate) {
      this.setState({
        shouldUpdate: true,
        displayStart: nextProps.displayStart,
        displayEnd: nextProps.displayEnd,
        scrollbarWidth: scrollbarWidth
      });
    } else {
      this.setState({shouldUpdate: false, scrollbarWidth: scrollbarWidth});
    }
  },

  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return !nextState || nextState.shouldUpdate;
  },

  onRows() {
    if (this._currentRowsRange !== {start: 0, end: 0}) {
      this.props.onRows(this._currentRowsRange);
      this._currentRowsRange = {start: 0, end: 0};
    }
  },

  getScrollbarWidth() {
    var scrollbarWidth = 0;
    // Get the scrollbar width
    var canvas = this.getDOMNode();
    scrollbarWidth  = canvas.offsetWidth - canvas.clientWidth;
    return scrollbarWidth;
  },

  setScrollLeft(scrollLeft: number) {
    if (this._currentRowsLength !== 0) {
      if(!this.refs) return;
      for (var i = 0, len = this._currentRowsLength; i < len; i++) {
        if(this.refs[i] && this.refs[i].setScrollLeft) {
          this.refs[i].setScrollLeft(scrollLeft);
        }
      }
    }
  },

  getScroll(): {scrollTop: number; scrollLeft: number} {
    var {scrollTop, scrollLeft} = React.findDOMNode(this);
    return {scrollTop, scrollLeft};
  },

  onScroll(e: any) {
    this.appendScrollShim();
    var {scrollTop, scrollLeft} = e.target;
    var scroll = {scrollTop, scrollLeft};
    this._scroll = scroll;
    this.props.onScroll(scroll);
  }
});


module.exports = Canvas;
