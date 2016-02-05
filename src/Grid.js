const React                = require('react');
const PropTypes            = React.PropTypes;
const Header               = require('./Header');
const Viewport             = require('./Viewport');
const ExcelColumn = require('./addons/grids/ExcelColumn');
const GridScrollMixin      = require('./GridScrollMixin');
const DOMMetrics           = require('./DOMMetrics');

const Grid = React.createClass({

  propTypes: {
    rowGetter: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    columns:  PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    minHeight: PropTypes.number,
    headerRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    rowHeight: PropTypes.number,
    rowRenderer: PropTypes.func,
    expandedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    selectedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    rowsCount: PropTypes.number,
    onRows: PropTypes.func,
    sortColumn : React.PropTypes.string,
    sortDirection : React.PropTypes.oneOf(['ASC', 'DESC', 'NONE']),
    rowOffsetHeight: PropTypes.number.isRequired,
    onViewportKeydown : PropTypes.func.isRequired,
    onViewportDragStart : PropTypes.func.isRequired,
    onViewportDragEnd : PropTypes.func.isRequired,
    onViewportDoubleClick : PropTypes.func.isRequired,
    groupOnAttribute: PropTypes.array
  },

  mixins: [
    GridScrollMixin,
    DOMMetrics.MetricsComputatorMixin
  ],


  getStyle: function(): { overflow: string; outline: number; position: string; minHeight: number } {
    return{
      overflow: 'hidden',
      outline: 0,
      position: 'relative',
      minHeight: this.props.minHeight
    }
  },

  render(): ?ReactElement {
    var headerRows = this.props.headerRows || [{ref : 'row'}];
    return (
      <div {...this.props} style={this.getStyle()} className="react-grid-Grid">
        <Header
          ref="header"
          columnMetrics={this.props.columnMetrics}
          onColumnResize={this.props.onColumnResize}
          height={this.props.rowHeight}
          totalWidth={this.props.totalWidth}
          headerRows={headerRows}
          sortColumn={this.props.sortColumn}
          sortDirection={this.props.sortDirection}
          onSort={this.props.onSort}
          />
        <div ref="viewPortContainer" onKeyDown={this.props.onViewportKeydown} onDoubleClick={this.props.onViewportDoubleClick}   onDragStart={this.props.onViewportDragStart} onDragEnd={this.props.onViewportDragEnd}>
            <Viewport
              ref="viewport"
              width={this.props.columnMetrics.width}
              rowHeight={this.props.rowHeight}
              rowRenderer={this.props.rowRenderer}
              rowGetter={this.props.rowGetter}
              rowsCount={this.props.rowsCount}
              selectedRows={this.props.selectedRows}
              expandedRows={this.props.expandedRows}
              columnMetrics={this.props.columnMetrics}
              totalWidth={this.props.totalWidth}
              onScroll={this.onScroll}
              onRows={this.props.onRows}
              cellMetaData={this.props.cellMetaData}
              rowOffsetHeight={this.props.rowOffsetHeight || this.props.rowHeight * headerRows.length}
              minHeight={this.props.minHeight}
              groupOnAttribute={this.props.groupOnAttribute}
              sortColumn={this.props.sortColumn}
              sortDirection={this.props.sortDirection}
              columns={this.props.columnMetrics.columns}
              onGridSort={this.props.onGridSort}
              />
          </div>
      </div>
    );
  },

  getDefaultProps() {
    return {
      rowHeight: 35,
      minHeight: 350
    };
  },
});

module.exports = Grid;
