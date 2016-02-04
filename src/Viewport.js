/* @flow */
/**
 * @jsx React.DOM


 */
'use strict';

var React             = require('react');
var Canvas            = require('./Canvas');
var PropTypes            = React.PropTypes;

var ViewportScroll      = require('./ViewportScrollMixin');



var Viewport = React.createClass({
  propTypes: {
    rowOffsetHeight: PropTypes.number.isRequired,
    totalWidth: PropTypes.number.isRequired,
    columnMetrics: PropTypes.object.isRequired,
    rowGetter: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    selectedRows: PropTypes.array,
    expandedRows: PropTypes.array,
    rowRenderer: PropTypes.func,
    rowsCount: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    onRows: PropTypes.func,
    onScroll: PropTypes.func,
    minHeight : PropTypes.number,
    groupOnAttribute: PropTypes.array
  },

  mixins: [ViewportScroll],

  getDefaultProps: function() {
    var defaultGridSort = function(a, b) {
      if (a==null) return 1;
      if (b==null) return -1;
      return (a > b) ? 1 : -1;
    };
    return {
      onGridSort: defaultGridSort
    };
  },

  getInitialState: function() {
      return {
        rows: [],
      };
  },

  componentWillMount: function() {
    this.getGroupedRows();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.sortColumn != this.props.sortColumn
      || prevProps.sortDirection != this.props.sortDirection
      || prevProps.rowGetter != this.props.rowGetter) {
      this.getGroupedRows();
    }
  },

  onScroll(scroll: {scrollTop: number; scrollLeft: number}) {
    this.updateScroll(
      scroll.scrollTop, scroll.scrollLeft,
      this.state.height,
      this.props.rowHeight,
      this.props.rowsCount
    );

    if (this.props.onScroll) {
      this.props.onScroll({scrollTop: scroll.scrollTop, scrollLeft: scroll.scrollLeft});
    }
  },

  getAllRows: function() {
    if (Array.isArray(this.props.rowGetter)) {
      return this.props.rowGetter.slice(0, this.props.rowsCount);
    } else {
      var rows = [];
      for (var i = 0; i < this.props.rowsCount; i++){
        rows.push(this.props.rowGetter(i));
      }
      return rows;
    }
  },

  getGroupedRows: function() {
    var allRows = this.getAllRows();
    var groupedRows = this.groupByRowAttributes(this.props.groupOnAttribute, allRows);
    var rows = this.flattenGroupedRows(groupedRows, []);
    this.setState({rows: rows});
  },

  getScroll(): {scrollLeft: number; scrollTop: number} {
    return this.refs.canvas.getScroll();
  },

  setScrollLeft(scrollLeft: number) {
    this.refs.canvas.setScrollLeft(scrollLeft);
  },

  flattenGroupedRows: function(groupedRows, flattenedRows) {
    if ((typeof groupedRows === 'object') && (groupedRows instanceof Array == false)){
        Object.keys(groupedRows)
          .sort(function (l,r) {
            return l.localeCompare(r);
          }).map(function(groupName){
            flattenedRows.push({type: 'group', displayElement: groupedRows[groupName].groupHeaderDisplay});
            this.flattenGroupedRows(groupedRows[groupName]['rows'], flattenedRows);
        },this);
      return flattenedRows;
    } else {
      groupedRows.forEach((r) => flattenedRows.push({type:'single', data: r}));
      return  flattenedRows;
    }
  },

  groupByRowAttributes: function(attrs: any, rows: any) {
    if ((attrs instanceof Array == false) || !attrs.length > 0) {
      return this.sortRows(this.props.sortColumn, this.props.sortDirection, rows);
    }
    var groupedRows = {};
    var attributes = attrs.slice()
    var attribute = attributes.shift();

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (typeof(row) === 'undefined') continue;

      var attribute_name, attribute_value;
      switch (typeof(attribute)){
        case 'function':
          var reactComponent = <attribute row={row} />;
          attribute_name = row[reactComponent.props.name.toString()];
          attribute_value = reactComponent;
          break;
        case 'string':
          attribute_name = row[attribute];
          attribute_value = <div
            className="groupName"
            style={{padding: '6px', fontSize: '16px', fontWeight: 'bold'}}>{attribute_name.toString()}</div>;
          break;
        default:
          if (row[attribute] == 'undefined') return;
      }

      if (typeof(groupedRows[attribute_name]) === "undefined") groupedRows[attribute_name] = {groupHeaderDisplay: attribute_value, rows: []};
      groupedRows[attribute_name]['rows'].push(row);
    }

    Object.keys(groupedRows).map(function(groupName){
      groupedRows[groupName]['rows'] = this.groupByRowAttributes(attributes, groupedRows[groupName]['rows']);
    }, this);

    return groupedRows;
  },

  sortRows: function(sortColumn, sortDirection , rows){
    if(!sortColumn || !rows) return rows;
    var column = $.grep(this.props.columns, function(e){ return e.key == sortColumn; })[0];
    var onSort = column.hasOwnProperty("sortingFunction") ? column.sortingFunction : this.props.onGridSort;

    var that = this;
    var comparer = function(a, b) {
      if(sortDirection === 'ASC'){
        return onSort(a[sortColumn], b[sortColumn]);
      }else if(sortDirection === 'DESC'){
        return onSort(b[sortColumn], a[sortColumn]);
      }
    }
    return rows.sort(comparer);
  },

  render(): ?ReactElement {

    var style = {
      padding: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      position: 'absolute',
      top: this.props.rowOffsetHeight
    };

    return (
      <div
        className="react-grid-Viewport"
        style={style}>
        <Canvas
          ref="canvas"
          totalWidth={this.props.totalWidth}
          width={this.props.columnMetrics.width}
          rowsCount={this.state.rows.length}
          selectedRows={this.props.selectedRows}
          expandedRows={this.props.expandedRows}
          columns={this.props.columnMetrics.columns}
          rowRenderer={this.props.rowRenderer}
          visibleStart={this.state.visibleStart}
          visibleEnd={this.state.visibleEnd}
          displayStart={this.state.displayStart}
          displayEnd={Math.max(this.state.displayEnd, this.state.rows.length)}
          cellMetaData={this.props.cellMetaData}
          height={this.state.height}
          rowHeight={this.props.rowHeight}
          onScroll={this.onScroll}
          onRows={this.props.onRows}
          sortRows={this.sortRows(this.props.sortColumn, this.props.sortDirection)}
          groupOnAttribute={this.props.groupOnAttribute}
          groupedRows={this.state.rows}
          />
      </div>
    );
  }
});

module.exports = Viewport;
