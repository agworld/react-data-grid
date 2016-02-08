(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactDataGrid"] = factory(require("react"), require("react-dom"));
	else
		root["ReactDataGrid"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);
	module.exports.Editors = __webpack_require__(39);
	module.exports.Formatters = __webpack_require__(43);
	module.exports.Toolbar = __webpack_require__(45);
	module.exports.Row = __webpack_require__(22);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var PropTypes = React.PropTypes;
	var BaseGrid = __webpack_require__(3);
	var Row = __webpack_require__(22);
	var ExcelColumn = __webpack_require__(15);
	var KeyboardHandlerMixin = __webpack_require__(25);
	var CheckboxEditor = __webpack_require__(34);
	var FilterableHeaderCell = __webpack_require__(35);
	var cloneWithProps = React.cloneElement;
	var DOMMetrics = __webpack_require__(32);
	var ColumnMetricsMixin = __webpack_require__(36);
	var RowUtils = __webpack_require__(38);
	var ColumnUtils = __webpack_require__(10);

	if (!Object.assign) {
	  Object.assign = __webpack_require__(37);
	}


	var ReactDataGrid = React.createClass({
	  displayName: 'ReactDataGrid',


	  propTypes: {
	    rowHeight: React.PropTypes.number.isRequired,
	    minHeight: React.PropTypes.number.isRequired,
	    width: React.PropTypes.number,
	    enableRowSelect: React.PropTypes.bool,
	    onRowUpdated: React.PropTypes.func,
	    rowGetter: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
	    rowsCount: React.PropTypes.number.isRequired,
	    toolbar: React.PropTypes.element,
	    enableCellSelect: React.PropTypes.bool,
	    columns: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
	    onFilter: React.PropTypes.func,
	    onCellCopyPaste: React.PropTypes.func,
	    onCellsDragged: React.PropTypes.func,
	    onAddFilter: React.PropTypes.func,
	    onRowSelect: React.PropTypes.func,
	    groupOnAttribute: React.PropTypes.array
	  },

	  mixins: [ColumnMetricsMixin, DOMMetrics.MetricsComputatorMixin, KeyboardHandlerMixin],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      enableCellSelect: false,
	      tabIndex: -1,
	      rowHeight: 35,
	      enableRowSelect: false,
	      minHeight: 350
	    };
	  },


	  getInitialState: function getInitialState() {
	    var columnMetrics = this.createColumnMetrics(true);
	    var initialState = { columnMetrics: columnMetrics, selectedRows: this.getInitialSelectedRows(), copied: null, expandedRows: [], canFilter: false, columnFilters: {}, sortDirection: null, sortColumn: null, dragged: null, scrollOffset: 0 };
	    if (this.props.enableCellSelect) {
	      initialState.selected = { rowIdx: 0, idx: 0 };
	    } else {
	      initialState.selected = { rowIdx: -1, idx: -1 };
	    }
	    return initialState;
	  },

	  getInitialSelectedRows: function getInitialSelectedRows() {
	    var selectedRows = [];
	    for (var i = 0; i < this.props.rowsCount; i++) {
	      selectedRows.push(false);
	    }
	    return selectedRows;
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.rowsCount === this.props.rowsCount + 1) {
	      this.onAfterAddRow(nextProps.rowsCount + 1);
	    }
	  },

	  componentDidMount: function componentDidMount() {
	    var scrollOffset = 0;
	    var canvas = this.getDOMNode().querySelector('.react-grid-Canvas');
	    if (canvas != null) {
	      scrollOffset = canvas.offsetWidth - canvas.clientWidth;
	    }
	    this.setState({ scrollOffset: scrollOffset });
	  },


	  render: function render() {
	    var cellMetaData = {
	      selected: this.state.selected,
	      dragged: this.state.dragged,
	      onCellClick: this.onCellClick,
	      onCellDoubleClick: this.onCellDoubleClick,
	      onCommit: this.onCellCommit,
	      onCommitCancel: this.setInactive,
	      copied: this.state.copied,
	      handleDragEnterRow: this.handleDragEnter,
	      handleTerminateDrag: this.handleTerminateDrag
	    };

	    var toolbar = this.renderToolbar();
	    var gridWidth = this.props.width;
	    if (gridWidth == null) {
	      gridWidth = this.DOMMetrics.gridWidth();
	    }
	    var containerWidth = gridWidth - this.state.scrollOffset;

	    return React.createElement(
	      'div',
	      { className: 'react-grid-Container', style: { width: containerWidth } },
	      toolbar,
	      React.createElement(
	        'div',
	        { className: 'react-grid-Main' },
	        React.createElement(BaseGrid, _extends({
	          ref: 'base'
	        }, this.props, {
	          headerRows: this.getHeaderRows(),
	          columnMetrics: this.state.columnMetrics,
	          rowGetter: this.props.rowGetter,
	          rowsCount: this.props.rowsCount,
	          rowHeight: this.props.rowHeight,
	          cellMetaData: cellMetaData,
	          selectedRows: this.state.selectedRows,
	          expandedRows: this.state.expandedRows,
	          rowOffsetHeight: this.getRowOffsetHeight(),
	          sortColumn: this.state.sortColumn,
	          sortDirection: this.state.sortDirection,
	          onSort: this.handleSort,
	          minHeight: this.props.minHeight,
	          totalWidth: gridWidth,
	          onViewportKeydown: this.onKeyDown,
	          onViewportDragStart: this.onDragStart,
	          onViewportDragEnd: this.handleDragEnd,
	          onViewportDoubleClick: this.onViewportDoubleClick,
	          onColumnResize: this.onColumnResize }))
	      )
	    );
	  },

	  renderToolbar: function renderToolbar() {
	    var Toolbar = this.props.toolbar;
	    if (React.isValidElement(Toolbar)) {
	      return cloneWithProps(Toolbar, { onToggleFilter: this.onToggleFilter, numberOfRows: this.props.rowsCount });
	    }
	  },


	  onSelect: function onSelect(selected) {
	    if (this.props.enableCellSelect) {
	      if (this.state.selected.rowIdx === selected.rowIdx && this.state.selected.idx === selected.idx && this.state.selected.active === true) {} else {
	        var idx = selected.idx;
	        var rowIdx = selected.rowIdx;
	        if (idx >= 0 && rowIdx >= 0 && idx < ColumnUtils.getSize(this.state.columnMetrics.columns) && rowIdx < this.props.rowsCount) {
	          this.setState({ selected: selected });
	        }
	      }
	    }
	  },

	  onCellClick: function onCellClick(cell) {
	    this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx });
	  },

	  onCellDoubleClick: function onCellDoubleClick(cell) {
	    this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx });
	    this.setActive('Enter');
	  },

	  onViewportDoubleClick: function onViewportDoubleClick(e) {
	    this.setActive();
	  },

	  onPressArrowUp: function onPressArrowUp(e) {
	    this.moveSelectedCell(e, -1, 0);
	  },
	  onPressArrowDown: function onPressArrowDown(e) {
	    this.moveSelectedCell(e, 1, 0);
	  },
	  onPressArrowLeft: function onPressArrowLeft(e) {
	    this.moveSelectedCell(e, 0, -1);
	  },
	  onPressArrowRight: function onPressArrowRight(e) {
	    this.moveSelectedCell(e, 0, 1);
	  },
	  onPressTab: function onPressTab(e) {
	    this.moveSelectedCell(e, 0, e.shiftKey ? -1 : 1);
	  },
	  onPressEnter: function onPressEnter(e) {
	    this.setActive(e.key);
	  },
	  onPressDelete: function onPressDelete(e) {
	    this.setActive(e.key);
	  },
	  onPressEscape: function onPressEscape(e) {
	    this.setInactive(e.key);
	  },
	  onPressBackspace: function onPressBackspace(e) {
	    this.setActive(e.key);
	  },
	  onPressChar: function onPressChar(e) {
	    if (this.isKeyPrintable(e.keyCode)) {
	      this.setActive(e.keyCode);
	    }
	  },
	  onPressKeyWithCtrl: function onPressKeyWithCtrl(e) {
	    var keys = {
	      KeyCode_c: 99,
	      KeyCode_C: 67,
	      KeyCode_V: 86,
	      KeyCode_v: 118
	    };

	    var idx = this.state.selected.idx;
	    if (this.canEdit(idx)) {
	      if (e.keyCode == keys.KeyCode_c || e.keyCode == keys.KeyCode_C) {
	        var value = this.getSelectedValue();
	        this.handleCopy({ value: value });
	      } else if (e.keyCode == keys.KeyCode_v || e.keyCode == keys.KeyCode_V) {
	        this.handlePaste();
	      }
	    }
	  },
	  onDragStart: function onDragStart(e) {
	    var value = this.getSelectedValue();
	    this.handleDragStart({ idx: this.state.selected.idx, rowIdx: this.state.selected.rowIdx, value: value });
	    //need to set dummy data for FF
	    if (e && e.dataTransfer && e.dataTransfer.setData) e.dataTransfer.setData('text/plain', 'dummy');
	  },
	  moveSelectedCell: function moveSelectedCell(e, rowDelta, cellDelta) {
	    // we need to prevent default as we control grid scroll
	    //otherwise it moves every time you left/right which is janky
	    e.preventDefault();
	    var rowIdx = this.state.selected.rowIdx + rowDelta;
	    var idx = this.state.selected.idx + cellDelta;
	    this.onSelect({ idx: idx, rowIdx: rowIdx });
	  },
	  getSelectedValue: function getSelectedValue() {
	    var rowIdx = this.state.selected.rowIdx;
	    var idx = this.state.selected.idx;
	    var cellKey = this.getColumn(this.state.columnMetrics.columns, idx).key;
	    var row = this.props.rowGetter(rowIdx);
	    return RowUtils.get(row, cellKey);
	  },
	  setActive: function setActive(keyPressed) {
	    var rowIdx = this.state.selected.rowIdx;
	    var idx = this.state.selected.idx;
	    if (this.canEdit(idx) && !this.isActive()) {
	      var selected = Object.assign(this.state.selected, { idx: idx, rowIdx: rowIdx, active: true, initialKeyCode: keyPressed });
	      this.setState({ selected: selected });
	    }
	  },
	  setInactive: function setInactive() {
	    var rowIdx = this.state.selected.rowIdx;
	    var idx = this.state.selected.idx;
	    if (this.canEdit(idx) && this.isActive()) {
	      var selected = Object.assign(this.state.selected, { idx: idx, rowIdx: rowIdx, active: false });
	      this.setState({ selected: selected });
	    }
	  },
	  canEdit: function canEdit(idx) {
	    var col = this.getColumn(this.props.columns, idx);
	    return this.props.enableCellSelect === true && (col.editor != null || col.editable);
	  },
	  isActive: function isActive() {
	    return this.state.selected.active === true;
	  },
	  onCellCommit: function onCellCommit(commit) {
	    var selected = Object.assign({}, this.state.selected);
	    selected.active = false;
	    if (commit.key === 'Tab') {
	      selected.idx += 1;
	    }
	    var expandedRows = this.state.expandedRows;
	    // if(commit.changed && commit.changed.expandedHeight){
	    //   expandedRows = this.expandRow(commit.rowIdx, commit.changed.expandedHeight);
	    // }
	    this.setState({ selected: selected, expandedRows: expandedRows });
	    this.props.onRowUpdated(commit);
	  },


	  setupGridColumns: function setupGridColumns() {
	    var cols = this.props.columns.slice(0);
	    if (this.props.enableRowSelect) {
	      var selectColumn = {
	        key: 'select-row',
	        name: '',
	        formatter: React.createElement(CheckboxEditor, null),
	        onCellChange: this.handleRowSelect,
	        filterable: false,
	        headerRenderer: React.createElement('input', { type: 'checkbox', onChange: this.handleCheckboxChange }),
	        width: 60,
	        locked: true
	      };
	      var unshiftedCols = cols.unshift(selectColumn);
	      cols = unshiftedCols > 0 ? cols : unshiftedCols;
	    }
	    return cols;
	  },

	  handleCheckboxChange: function handleCheckboxChange(e) {
	    var allRowsSelected;
	    if (e.currentTarget instanceof HTMLInputElement && e.currentTarget.checked === true) {
	      allRowsSelected = true;
	    } else {
	      allRowsSelected = false;
	    }
	    var selectedRows = [];
	    for (var i = 0; i < this.props.rowsCount; i++) {
	      selectedRows.push(allRowsSelected);
	    }
	    this.setState({ selectedRows: selectedRows });
	    this.handleRowSelectPropagation(selectedRows);
	  },

	  // columnKey not used here as this function will select the whole row,
	  // but needed to match the function signature in the CheckboxEditor
	  handleRowSelect: function handleRowSelect(rowIdx, columnKey, e) {
	    e.stopPropagation();
	    if (this.state.selectedRows != null && this.state.selectedRows.length > 0) {
	      var rowSelectionStates = this.state.selectedRows.slice();
	      if (rowSelectionStates[rowIdx] == null || rowSelectionStates[rowIdx] == false) {
	        rowSelectionStates[rowIdx] = true;
	      } else {
	        rowSelectionStates[rowIdx] = false;
	      }
	      this.setState({ selectedRows: rowSelectionStates });
	      this.handleRowSelectPropagation(rowSelectionStates);
	    }
	  },
	  handleRowSelectPropagation: function handleRowSelectPropagation(rowSelectionStates) {
	    if (this.props.onRowSelect != null) {
	      var selectedRows = [];
	      for (var i = 0; i < this.props.rowsCount; i++) {
	        if (rowSelectionStates[i] === true) {
	          var row = this.props.rowGetter(i);
	          selectedRows.push(row);
	        }
	      }
	      this.props.onRowSelect(selectedRows);
	    }
	  },


	  //EXPAND ROW Functionality - removing for now till we decide on how best to implement
	  // expandRow(row: Row, newHeight: number): Array<Row>{
	  //   var expandedRows = this.state.expandedRows;
	  //   if(expandedRows[row]){
	  //     if(expandedRows[row]== null || expandedRows[row] < newHeight){
	  //       expandedRows[row] = newHeight;
	  //     }
	  //   }else{
	  //     expandedRows[row] = newHeight;
	  //   }
	  //   return expandedRows;
	  // },
	  //
	  // handleShowMore(row: Row, newHeight: number) {
	  //   var expandedRows = this.expandRow(row, newHeight);
	  //   this.setState({expandedRows : expandedRows});
	  // },
	  //
	  // handleShowLess(row: Row){
	  //   var expandedRows = this.state.expandedRows;
	  //   if(expandedRows[row]){
	  //       expandedRows[row] = false;
	  //   }
	  //   this.setState({expandedRows : expandedRows});
	  // },
	  //
	  // expandAllRows(){
	  //
	  // },
	  //
	  // collapseAllRows(){
	  //
	  // },

	  onAfterAddRow: function onAfterAddRow(numberOfRows) {
	    // Unclear what this was supposed to do, at the time it only draws a blue rectangle aroung a cell
	    // this.setState({selected : {idx : 1, rowIdx : numberOfRows - 2}});
	  },

	  onToggleFilter: function onToggleFilter() {
	    this.setState({ canFilter: !this.state.canFilter });
	  },
	  getHeaderRows: function getHeaderRows() {
	    var rows = [{ ref: "row", height: this.props.rowHeight }];
	    if (this.state.canFilter === true) {
	      rows.push({
	        ref: "filterRow",
	        headerCellRenderer: React.createElement(FilterableHeaderCell, { onChange: this.props.onAddFilter, column: this.props.column }),
	        height: 45
	      });
	    }
	    return rows;
	  },
	  getRowOffsetHeight: function getRowOffsetHeight() {
	    var offsetHeight = 0;
	    this.getHeaderRows().forEach(function (row) {
	      return offsetHeight += parseFloat(row.height, 10);
	    });
	    return offsetHeight;
	  },


	  handleSort: function handleSort(columnKey, direction) {
	    this.setState({ sortDirection: direction, sortColumn: columnKey });
	  },

	  copyPasteEnabled: function copyPasteEnabled() {
	    return this.props.onCellCopyPaste !== null;
	  },

	  handleCopy: function handleCopy(args) {
	    if (!this.copyPasteEnabled()) {
	      return;
	    }
	    var textToCopy = args.value;
	    var selected = this.state.selected;
	    var copied = { idx: selected.idx, rowIdx: selected.rowIdx };
	    this.setState({ textToCopy: textToCopy, copied: copied });
	  },
	  handlePaste: function handlePaste() {
	    if (!this.copyPasteEnabled()) {
	      return;
	    }
	    var selected = this.state.selected;

	    var cellKey = this.getColumn(this.state.columnMetrics.columns, this.state.selected.idx).key;
	    if (this.props.onCellCopyPaste) {
	      this.props.onCellCopyPaste({ cellKey: cellKey, rowIdx: selected.rowIdx, value: this.state.textToCopy, fromRow: this.state.copied.rowIdx, toRow: selected.rowIdx });
	    }
	    this.setState({ copied: null });
	  },


	  dragEnabled: function dragEnabled() {
	    return this.props.onCellsDragged !== null;
	  },

	  handleDragStart: function handleDragStart(dragged) {
	    if (!this.dragEnabled()) {
	      return;
	    }
	    var idx = dragged.idx;
	    var rowIdx = dragged.rowIdx;
	    if (idx >= 0 && rowIdx >= 0 && idx < this.getSize() && rowIdx < this.props.rowsCount) {
	      this.setState({ dragged: dragged });
	    }
	  },
	  handleDragEnter: function handleDragEnter(row) {
	    if (!this.dragEnabled()) {
	      return;
	    }
	    var selected = this.state.selected;
	    var dragged = this.state.dragged;
	    dragged.overRowIdx = row;
	    this.setState({ dragged: dragged });
	  },
	  handleDragEnd: function handleDragEnd() {
	    if (!this.dragEnabled()) {
	      return;
	    }
	    var fromRow, toRow;
	    var selected = this.state.selected;
	    var dragged = this.state.dragged;
	    var cellKey = this.getColumn(this.state.columnMetrics.columns, this.state.selected.idx).key;
	    fromRow = selected.rowIdx < dragged.overRowIdx ? selected.rowIdx : dragged.overRowIdx;
	    toRow = selected.rowIdx > dragged.overRowIdx ? selected.rowIdx : dragged.overRowIdx;
	    if (this.props.onCellsDragged) {
	      this.props.onCellsDragged({ cellKey: cellKey, fromRow: fromRow, toRow: toRow, value: dragged.value });
	    }
	    this.setState({ dragged: { complete: true } });
	  },
	  handleTerminateDrag: function handleTerminateDrag() {
	    if (!this.dragEnabled()) {
	      return;
	    }
	    this.setState({ dragged: null });
	  },
	  clearSelectedRows: function clearSelectedRows() {
	    this.setState({ selectedRows: this.getInitialSelectedRows() });
	  }
	});

	module.exports = ReactDataGrid;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var PropTypes = React.PropTypes;
	var Header = __webpack_require__(4);
	var Viewport = __webpack_require__(19);
	var GridScrollMixin = __webpack_require__(33);
	var DOMMetrics = __webpack_require__(32);

	var Grid = React.createClass({
	  displayName: 'Grid',


	  propTypes: {
	    rowGetter: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
	    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	    minHeight: PropTypes.number,
	    headerRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	    rowHeight: PropTypes.number,
	    rowRenderer: PropTypes.func,
	    expandedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	    selectedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	    rowsCount: PropTypes.number,
	    onRows: PropTypes.func,
	    sortColumn: React.PropTypes.string,
	    sortDirection: React.PropTypes.oneOf(['ASC', 'DESC', 'NONE']),
	    rowOffsetHeight: PropTypes.number.isRequired,
	    onViewportKeydown: PropTypes.func.isRequired,
	    onViewportDragStart: PropTypes.func.isRequired,
	    onViewportDragEnd: PropTypes.func.isRequired,
	    onViewportDoubleClick: PropTypes.func.isRequired,
	    groupOnAttribute: PropTypes.array
	  },

	  mixins: [GridScrollMixin, DOMMetrics.MetricsComputatorMixin],

	  getStyle: function getStyle() {
	    return {
	      overflow: 'hidden',
	      outline: 0,
	      position: 'relative',
	      minHeight: this.props.minHeight
	    };
	  },

	  render: function render() {
	    var headerRows = this.props.headerRows || [{ ref: 'row' }];
	    return React.createElement(
	      'div',
	      _extends({}, this.props, { style: this.getStyle(), className: 'react-grid-Grid' }),
	      React.createElement(Header, {
	        ref: 'header',
	        columnMetrics: this.props.columnMetrics,
	        onColumnResize: this.props.onColumnResize,
	        height: this.props.rowHeight,
	        totalWidth: this.props.totalWidth,
	        headerRows: headerRows,
	        sortColumn: this.props.sortColumn,
	        sortDirection: this.props.sortDirection,
	        onSort: this.props.onSort
	      }),
	      React.createElement(
	        'div',
	        { ref: 'viewPortContainer', onKeyDown: this.props.onViewportKeydown, onDoubleClick: this.props.onViewportDoubleClick, onDragStart: this.props.onViewportDragStart, onDragEnd: this.props.onViewportDragEnd },
	        React.createElement(Viewport, {
	          ref: 'viewport',
	          width: this.props.columnMetrics.width,
	          rowHeight: this.props.rowHeight,
	          rowRenderer: this.props.rowRenderer,
	          rowGetter: this.props.rowGetter,
	          rowsCount: this.props.rowsCount,
	          selectedRows: this.props.selectedRows,
	          expandedRows: this.props.expandedRows,
	          columnMetrics: this.props.columnMetrics,
	          totalWidth: this.props.totalWidth,
	          onScroll: this.onScroll,
	          onRows: this.props.onRows,
	          cellMetaData: this.props.cellMetaData,
	          rowOffsetHeight: this.props.rowOffsetHeight || this.props.rowHeight * headerRows.length,
	          minHeight: this.props.minHeight,
	          groupOnAttribute: this.props.groupOnAttribute,
	          sortColumn: this.props.sortColumn,
	          sortDirection: this.props.sortDirection,
	          columns: this.props.columnMetrics.columns,
	          onGridSort: this.props.onGridSort
	        })
	      )
	    );
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      rowHeight: 35,
	      minHeight: 350
	    };
	  }
	});

	module.exports = Grid;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(5);
	var joinClasses = __webpack_require__(6);
	var shallowCloneObject = __webpack_require__(7);
	var ColumnMetrics = __webpack_require__(8);
	var ColumnUtils = __webpack_require__(10);
	var HeaderRow = __webpack_require__(12);
	var PropTypes = React.PropTypes;

	var Header = React.createClass({
	  displayName: 'Header',

	  propTypes: {
	    columnMetrics: PropTypes.shape({ width: PropTypes.number.isRequired, columns: PropTypes.any }).isRequired,
	    totalWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	    height: PropTypes.number.isRequired,
	    headerRows: PropTypes.array.isRequired,
	    sortColumn: PropTypes.string,
	    sortDirection: PropTypes.oneOf(['ASC', 'DESC', 'NONE']),
	    onSort: PropTypes.func,
	    onColumnResize: PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    return { resizing: null };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps() {
	    this.setState({ resizing: null });
	  },


	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    var update = !ColumnMetrics.sameColumns(this.props.columnMetrics.columns, nextProps.columnMetrics.columns, ColumnMetrics.sameColumn) || this.props.totalWidth !== nextProps.totalWidth || this.props.headerRows.length !== nextProps.headerRows.length || this.state.resizing !== nextState.resizing || this.props.sortColumn !== nextProps.sortColumn || this.props.sortDirection !== nextProps.sortDirection;
	    return update;
	  },

	  onColumnResize: function onColumnResize(column, width) {
	    var state = this.state.resizing || this.props;

	    var pos = this.getColumnPosition(column);

	    if (pos != null) {
	      var _resizing = {
	        columnMetrics: shallowCloneObject(state.columnMetrics)
	      };
	      _resizing.columnMetrics = ColumnMetrics.resizeColumn(_resizing.columnMetrics, pos, width);

	      // we don't want to influence scrollLeft while resizing
	      if (_resizing.columnMetrics.totalWidth < state.columnMetrics.totalWidth) {
	        _resizing.columnMetrics.totalWidth = state.columnMetrics.totalWidth;
	      }

	      _resizing.column = ColumnUtils.getColumn(_resizing.columnMetrics.columns, pos);
	      this.setState({ resizing: _resizing });
	    }
	  },
	  onColumnResizeEnd: function onColumnResizeEnd(column, width) {
	    var pos = this.getColumnPosition(column);
	    if (pos !== null && this.props.onColumnResize) {
	      this.props.onColumnResize(pos, width || column.width);
	    }
	  },
	  getHeaderRows: function getHeaderRows() {
	    var _this = this;

	    var columnMetrics = this.getColumnMetrics();
	    var resizeColumn = undefined;
	    if (this.state.resizing) {
	      resizeColumn = this.state.resizing.column;
	    }
	    var headerRows = [];
	    this.props.headerRows.forEach(function (row, index) {
	      var headerRowStyle = {
	        position: 'absolute',
	        top: _this.getCombinedHeaderHeights(index),
	        left: 0,
	        width: _this.props.totalWidth,
	        overflow: 'hidden'
	      };

	      headerRows.push(React.createElement(HeaderRow, {
	        key: row.ref,
	        ref: row.ref,
	        style: headerRowStyle,
	        onColumnResize: _this.onColumnResize,
	        onColumnResizeEnd: _this.onColumnResizeEnd,
	        width: columnMetrics.width,
	        height: row.height || _this.props.height,
	        columns: columnMetrics.columns,
	        resizing: resizeColumn,
	        headerCellRenderer: row.headerCellRenderer,
	        sortColumn: _this.props.sortColumn,
	        sortDirection: _this.props.sortDirection,
	        onSort: _this.props.onSort
	      }));
	    });
	    return headerRows;
	  },
	  getColumnMetrics: function getColumnMetrics() {
	    var columnMetrics = undefined;
	    if (this.state.resizing) {
	      columnMetrics = this.state.resizing.columnMetrics;
	    } else {
	      columnMetrics = this.props.columnMetrics;
	    }
	    return columnMetrics;
	  },
	  getColumnPosition: function getColumnPosition(column) {
	    var columnMetrics = this.getColumnMetrics();
	    var pos = -1;
	    columnMetrics.columns.forEach(function (c, idx) {
	      if (c.key === column.key) {
	        pos = idx;
	      }
	    });
	    return pos === -1 ? null : pos;
	  },
	  getCombinedHeaderHeights: function getCombinedHeaderHeights(until) {
	    var stopAt = this.props.headerRows.length;
	    if (typeof until !== 'undefined') {
	      stopAt = until;
	    }

	    var height = 0;
	    for (var index = 0; index < stopAt; index++) {
	      height += this.props.headerRows[index].height || this.props.height;
	    }
	    return height;
	  },
	  getStyle: function getStyle() {
	    return {
	      position: 'relative',
	      height: this.getCombinedHeaderHeights(),
	      overflow: 'hidden'
	    };
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    var node = ReactDOM.findDOMNode(this.refs.row);
	    node.scrollLeft = scrollLeft;
	    this.refs.row.setScrollLeft(scrollLeft);
	    if (this.refs.filterRow) {
	      var nodeFilters = this.refs.filterRow.getDOMNode();
	      nodeFilters.scrollLeft = scrollLeft;
	      this.refs.filterRow.setScrollLeft(scrollLeft);
	    }
	  },
	  render: function render() {
	    var className = joinClasses({
	      'react-grid-Header': true,
	      'react-grid-Header--resizing': !!this.state.resizing
	    });
	    var headerRows = this.getHeaderRows();

	    return React.createElement(
	      'div',
	      _extends({}, this.props, { style: this.getStyle(), className: className }),
	      headerRows
	    );
	  }
	});

	module.exports = Header;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	function classNames() {
		var classes = '';
		var arg;

		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}

	// safely export classNames for node / browserify
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}

	// safely export classNames for RequireJS
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function shallowCloneObject(obj) {
	  var result = {};
	  for (var k in obj) {
	    if (obj.hasOwnProperty(k)) {
	      result[k] = obj[k];
	    }
	  }
	  return result;
	}

	module.exports = shallowCloneObject;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var shallowCloneObject = __webpack_require__(7);
	var sameColumn = __webpack_require__(9);
	var ColumnUtils = __webpack_require__(10);
	var getScrollbarSize = __webpack_require__(11);

	function setColumnWidths(columns, totalWidth) {
	  return columns.map(function (column) {
	    var colInfo = Object.assign({}, column);
	    if (column.width) {
	      if (/^([0-9]+)%$/.exec(column.width.toString())) {
	        colInfo.width = Math.floor(column.width / 100 * totalWidth);
	      }
	    }
	    return colInfo;
	  });
	}

	function setDefferedColumnWidths(columns, unallocatedWidth, minColumnWidth) {
	  var defferedColumns = columns.filter(function (c) {
	    return !c.width;
	  });
	  return columns.map(function (column) {
	    if (!column.width) {
	      if (unallocatedWidth <= 0) {
	        column.width = minColumnWidth;
	      } else {
	        column.width = Math.floor(unallocatedWidth / ColumnUtils.getSize(defferedColumns));
	      }
	    }
	    return column;
	  });
	}

	function setColumnOffsets(columns) {
	  var left = 0;
	  return columns.map(function (column) {
	    column.left = left;
	    left += column.width;
	    return column;
	  });
	}

	/**
	 * Update column metrics calculation.
	 *
	 * @param {ColumnMetricsType} metrics
	 */
	function recalculate(metrics) {
	  // compute width for columns which specify width
	  var columns = setColumnWidths(metrics.columns, metrics.totalWidth);

	  var unallocatedWidth = columns.filter(function (c) {
	    return c.width;
	  }).reduce(function (w, column) {
	    return w - column.width;
	  }, metrics.totalWidth);
	  unallocatedWidth -= getScrollbarSize();

	  var width = columns.filter(function (c) {
	    return c.width;
	  }).reduce(function (w, column) {
	    return w + column.width;
	  }, 0);

	  // compute width for columns which doesn't specify width
	  columns = setDefferedColumnWidths(columns, unallocatedWidth, metrics.minColumnWidth);

	  // compute left offset
	  columns = setColumnOffsets(columns);

	  return {
	    columns: columns,
	    width: width,
	    totalWidth: metrics.totalWidth,
	    minColumnWidth: metrics.minColumnWidth
	  };
	}

	/**
	 * Update column metrics calculation by resizing a column.
	 *
	 * @param {ColumnMetricsType} metrics
	 * @param {Column} column
	 * @param {number} width
	 */
	function resizeColumn(metrics, index, width) {
	  var column = ColumnUtils.getColumn(metrics.columns, index);
	  var metricsClone = shallowCloneObject(metrics);
	  metricsClone.columns = metrics.columns.slice(0);

	  var updatedColumn = shallowCloneObject(column);
	  updatedColumn.width = Math.max(width, metricsClone.minColumnWidth);

	  metricsClone = ColumnUtils.spliceColumn(metricsClone, index, updatedColumn);

	  return recalculate(metricsClone);
	}

	function areColumnsImmutable(prevColumns, nextColumns) {
	  return typeof Immutable !== 'undefined' && prevColumns instanceof Immutable.List && nextColumns instanceof Immutable.List;
	}

	function compareEachColumn(prevColumns, nextColumns, isSameColumn) {
	  var i = undefined;
	  var len = undefined;
	  var column = undefined;
	  var prevColumnsByKey = {};
	  var nextColumnsByKey = {};

	  if (ColumnUtils.getSize(prevColumns) !== ColumnUtils.getSize(nextColumns)) {
	    return false;
	  }

	  for (i = 0, len = ColumnUtils.getSize(prevColumns); i < len; i++) {
	    column = prevColumns[i];
	    prevColumnsByKey[column.key] = column;
	  }

	  for (i = 0, len = ColumnUtils.getSize(nextColumns); i < len; i++) {
	    column = nextColumns[i];
	    nextColumnsByKey[column.key] = column;
	    var prevColumn = prevColumnsByKey[column.key];
	    if (prevColumn === undefined || !isSameColumn(prevColumn, column)) {
	      return false;
	    }
	  }

	  for (i = 0, len = ColumnUtils.getSize(prevColumns); i < len; i++) {
	    column = prevColumns[i];
	    var nextColumn = nextColumnsByKey[column.key];
	    if (nextColumn === undefined) {
	      return false;
	    }
	  }
	  return true;
	}

	function sameColumns(prevColumns, nextColumns, isSameColumn) {
	  if (areColumnsImmutable(prevColumns, nextColumns)) {
	    return prevColumns === nextColumns;
	  }

	  return compareEachColumn(prevColumns, nextColumns, isSameColumn);
	}

	module.exports = { recalculate: recalculate, resizeColumn: resizeColumn, sameColumn: sameColumn, sameColumns: sameColumns };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isValidElement = __webpack_require__(2).isValidElement;

	module.exports = function sameColumn(a, b) {
	  var k = undefined;

	  for (k in a) {
	    if (a.hasOwnProperty(k)) {
	      if (typeof a[k] === 'function' && typeof b[k] === 'function' || isValidElement(a[k]) && isValidElement(b[k])) {
	        continue;
	      }
	      if (!b.hasOwnProperty(k) || a[k] !== b[k]) {
	        return false;
	      }
	    }
	  }

	  for (k in b) {
	    if (b.hasOwnProperty(k) && !a.hasOwnProperty(k)) {
	      return false;
	    }
	  }

	  return true;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  getColumn: function getColumn(columns, idx) {
	    if (Array.isArray(columns)) {
	      return columns[idx];
	    } else if (typeof Immutable !== 'undefined') {
	      return columns.get(idx);
	    }
	  },
	  spliceColumn: function spliceColumn(metrics, idx, column) {
	    if (Array.isArray(metrics.columns)) {
	      metrics.columns.splice(idx, 1, column);
	    } else if (typeof Immutable !== 'undefined') {
	      metrics.columns = metrics.columns.splice(idx, 1, column);
	    }
	    return metrics;
	  },
	  getSize: function getSize(columns) {
	    if (Array.isArray(columns)) {
	      return columns.length;
	    } else if (typeof Immutable !== 'undefined') {
	      return columns.size;
	    }
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var size = undefined;

	function getScrollbarSize() {
	  if (size === undefined) {
	    var outer = document.createElement('div');
	    outer.style.width = '50px';
	    outer.style.height = '50px';
	    outer.style.position = 'absolute';
	    outer.style.top = '-200px';
	    outer.style.left = '-200px';

	    var inner = document.createElement('div');
	    inner.style.height = '100px';
	    inner.style.width = '100%';

	    outer.appendChild(inner);
	    document.body.appendChild(outer);

	    var outerWidth = outer.clientWidth;
	    outer.style.overflowY = 'scroll';
	    var innerWidth = inner.clientWidth;

	    document.body.removeChild(outer);

	    size = outerWidth - innerWidth;
	  }

	  return size;
	}

	module.exports = getScrollbarSize;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var shallowEqual = __webpack_require__(13);
	var HeaderCell = __webpack_require__(14);
	var getScrollbarSize = __webpack_require__(11);
	var ExcelColumn = __webpack_require__(15);
	var ColumnUtilsMixin = __webpack_require__(10);
	var SortableHeaderCell = __webpack_require__(18);
	var PropTypes = React.PropTypes;

	var HeaderRowStyle = {
	  overflow: React.PropTypes.string,
	  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	  height: React.PropTypes.number,
	  position: React.PropTypes.string
	};

	var DEFINE_SORT = ['ASC', 'DESC', 'NONE'];

	var HeaderRow = React.createClass({
	  displayName: 'HeaderRow',

	  propTypes: {
	    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	    height: PropTypes.number.isRequired,
	    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	    onColumnResize: PropTypes.func,
	    onSort: PropTypes.func.isRequired,
	    onColumnResizeEnd: PropTypes.func,
	    style: PropTypes.shape(HeaderRowStyle),
	    sortColumn: PropTypes.string,
	    sortDirection: React.PropTypes.oneOf(DEFINE_SORT),
	    cellRenderer: PropTypes.func,
	    headerCellRenderer: PropTypes.func,
	    resizing: PropTypes.func
	  },

	  mixins: [ColumnUtilsMixin],

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    return nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.columns !== this.props.columns || !shallowEqual(nextProps.style, this.props.style) || this.props.sortColumn !== nextProps.sortColumn || this.props.sortDirection !== nextProps.sortDirection;
	  },
	  getHeaderRenderer: function getHeaderRenderer(column) {
	    if (column.sortable) {
	      var sortDirection = this.props.sortColumn === column.key ? this.props.sortDirection : DEFINE_SORT.NONE;
	      return React.createElement(SortableHeaderCell, { columnKey: column.key, onSort: this.props.onSort, sortDirection: sortDirection });
	    }

	    return this.props.headerCellRenderer || column.headerRenderer || this.props.cellRenderer;
	  },
	  getStyle: function getStyle() {
	    return {
	      overflow: 'hidden',
	      width: '100%',
	      height: this.props.height,
	      position: 'absolute'
	    };
	  },
	  getCells: function getCells() {
	    var cells = [];
	    var lockedCells = [];

	    for (var i = 0, len = this.getSize(this.props.columns); i < len; i++) {
	      var column = this.getColumn(this.props.columns, i);
	      var cell = React.createElement(HeaderCell, {
	        ref: i,
	        key: i,
	        height: this.props.height,
	        column: column,
	        renderer: this.getHeaderRenderer(column),
	        resizing: this.props.resizing === column,
	        onResize: this.props.onColumnResize,
	        onResizeEnd: this.props.onColumnResizeEnd
	      });
	      if (column.locked) {
	        lockedCells.push(cell);
	      } else {
	        cells.push(cell);
	      }
	    }

	    return cells.concat(lockedCells);
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    var _this = this;

	    this.props.columns.forEach(function (column, i) {
	      if (column.locked) {
	        _this.refs[i].setScrollLeft(scrollLeft);
	      }
	    });
	  },
	  render: function render() {
	    var cellsStyle = {
	      width: this.props.width ? this.props.width + getScrollbarSize() : '100%',
	      height: this.props.height,
	      whiteSpace: 'nowrap',
	      overflowX: 'hidden',
	      overflowY: 'hidden'
	    };

	    var cells = this.getCells();
	    return React.createElement(
	      'div',
	      _extends({}, this.props, { className: 'react-grid-HeaderRow' }),
	      React.createElement(
	        'div',
	        { style: cellsStyle },
	        cells
	      )
	    );
	  }
	});

	module.exports = HeaderRow;

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shallowEqual
	 * @typechecks
	 * 
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Performs equality by iterating through keys on an object and returning false
	 * when any key has values which are not strictly equal between the arguments.
	 * Returns true when the values of all keys are strictly equal.
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var bHasOwnProperty = hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(5);
	var joinClasses = __webpack_require__(6);
	var ExcelColumn = __webpack_require__(15);
	var ResizeHandle = __webpack_require__(16);
	var PropTypes = React.PropTypes;

	function simpleCellRenderer(objArgs) {
	  return React.createElement(
	    'div',
	    { className: 'widget-HeaderCell__value' },
	    objArgs.column.name
	  );
	}

	var HeaderCell = React.createClass({
	  displayName: 'HeaderCell',


	  propTypes: {
	    renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	    column: PropTypes.shape(ExcelColumn).isRequired,
	    onResize: PropTypes.func.isRequired,
	    height: PropTypes.number.isRequired,
	    onResizeEnd: PropTypes.func.isRequired,
	    className: PropTypes.string
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      renderer: simpleCellRenderer
	    };
	  },
	  getInitialState: function getInitialState() {
	    return { resizing: false };
	  },
	  onDragStart: function onDragStart(e) {
	    this.setState({ resizing: true });
	    // need to set dummy data for FF
	    if (e && e.dataTransfer && e.dataTransfer.setData) e.dataTransfer.setData('text/plain', 'dummy');
	  },
	  onDrag: function onDrag(e) {
	    var resize = this.props.onResize || null; // for flows sake, doesnt recognise a null check direct
	    if (resize) {
	      var _width = this.getWidthFromMouseEvent(e);
	      if (_width > 0) {
	        resize(this.props.column, _width);
	      }
	    }
	  },
	  onDragEnd: function onDragEnd(e) {
	    var width = this.getWidthFromMouseEvent(e);
	    this.props.onResizeEnd(this.props.column, width);
	    this.setState({ resizing: false });
	  },
	  getWidthFromMouseEvent: function getWidthFromMouseEvent(e) {
	    var right = e.pageX;
	    var left = ReactDOM.findDOMNode(this).getBoundingClientRect().left;
	    return right - left;
	  },
	  getCell: function getCell() {
	    if (React.isValidElement(this.props.renderer)) {
	      return React.cloneElement(this.props.renderer, { column: this.props.column });
	    }

	    return this.props.renderer({ column: this.props.column });
	  },
	  getStyle: function getStyle() {
	    return {
	      width: this.props.column.width,
	      left: this.props.column.left,
	      display: 'inline-block',
	      position: 'absolute',
	      overflow: 'hidden',
	      height: this.props.height,
	      margin: 0,
	      textOverflow: 'ellipsis',
	      whiteSpace: 'nowrap'
	    };
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    var node = ReactDOM.findDOMNode(this);
	    node.style.webkitTransform = 'translate3d(' + scrollLeft + 'px, 0px, 0px)';
	    node.style.transform = 'translate3d(' + scrollLeft + 'px, 0px, 0px)';
	  },
	  render: function render() {
	    var resizeHandle = undefined;
	    if (this.props.column.resizable) {
	      resizeHandle = React.createElement(ResizeHandle, {
	        onDrag: this.onDrag,
	        onDragStart: this.onDragStart,
	        onDragEnd: this.onDragEnd
	      });
	    }
	    var className = joinClasses({
	      'react-grid-HeaderCell': true,
	      'react-grid-HeaderCell--resizing': this.state.resizing,
	      'react-grid-HeaderCell--locked': this.props.column.locked
	    });
	    className = joinClasses(className, this.props.className, this.props.column.cellClass);
	    var cell = this.getCell();
	    return React.createElement(
	      'div',
	      { className: className, style: this.getStyle() },
	      cell,
	      resizeHandle
	    );
	  }
	});

	module.exports = HeaderCell;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var ExcelColumnShape = {
	  name: React.PropTypes.string.isRequired,
	  key: React.PropTypes.string.isRequired,
	  width: React.PropTypes.number.isRequired
	};

	module.exports = ExcelColumnShape;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var Draggable = __webpack_require__(17);

	var ResizeHandle = React.createClass({
	  displayName: 'ResizeHandle',

	  style: {
	    position: 'absolute',
	    top: 0,
	    right: 0,
	    width: 6,
	    height: '100%'
	  },

	  render: function render() {
	    return React.createElement(Draggable, _extends({}, this.props, {
	      className: 'react-grid-HeaderCell__resizeHandle',
	      style: this.style
	    }));
	  }
	});

	module.exports = ResizeHandle;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var PropTypes = React.PropTypes;

	var Draggable = React.createClass({
	  displayName: 'Draggable',

	  propTypes: {
	    onDragStart: PropTypes.func,
	    onDragEnd: PropTypes.func,
	    onDrag: PropTypes.func,
	    component: PropTypes.oneOfType([PropTypes.func, PropTypes.constructor])
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      onDragStart: function onDragStart() {
	        return true;
	      },
	      onDragEnd: function onDragEnd() {},
	      onDrag: function onDrag() {}
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      drag: null
	    };
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.cleanUp();
	  },
	  onMouseDown: function onMouseDown(e) {
	    var drag = this.props.onDragStart(e);

	    if (drag === null && e.button !== 0) {
	      return;
	    }

	    window.addEventListener('mouseup', this.onMouseUp);
	    window.addEventListener('mousemove', this.onMouseMove);

	    this.setState({ drag: drag });
	  },
	  onMouseMove: function onMouseMove(e) {
	    if (this.state.drag === null) {
	      return;
	    }

	    if (e.preventDefault) {
	      e.preventDefault();
	    }

	    this.props.onDrag(e);
	  },
	  onMouseUp: function onMouseUp(e) {
	    this.cleanUp();
	    this.props.onDragEnd(e, this.state.drag);
	    this.setState({ drag: null });
	  },
	  cleanUp: function cleanUp() {
	    window.removeEventListener('mouseup', this.onMouseUp);
	    window.removeEventListener('mousemove', this.onMouseMove);
	  },
	  render: function render() {
	    return React.createElement('div', _extends({}, this.props, {
	      onMouseDown: this.onMouseDown,
	      className: 'react-grid-HeaderCell__draggable' }));
	  }
	});

	module.exports = Draggable;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var joinClasses = __webpack_require__(6);
	var DEFINE_SORT = {
	  ASC: 'ASC',
	  DESC: 'DESC',
	  NONE: 'NONE'
	};

	var SortableHeaderCell = React.createClass({
	  displayName: 'SortableHeaderCell',

	  propTypes: {
	    columnKey: React.PropTypes.string.isRequired,
	    column: React.PropTypes.shape({ name: React.PropTypes.string }),
	    onSort: React.PropTypes.func.isRequired,
	    sortDirection: React.PropTypes.oneOf(['ASC', 'DESC', 'NONE'])
	  },

	  onClick: function onClick() {
	    var direction = undefined;
	    switch (this.props.sortDirection) {
	      default:
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
	    this.props.onSort(this.props.columnKey, direction);
	  },

	  getSortByText: function getSortByText() {
	    var unicodeKeys = {
	      ASC: '9650',
	      DESC: '9660',
	      NONE: ''
	    };
	    return String.fromCharCode(unicodeKeys[this.props.sortDirection]);
	  },

	  render: function render() {
	    var className = joinClasses({
	      'react-grid-HeaderCell-sortable': true,
	      'react-grid-HeaderCell-sortable--ascending': this.props.sortDirection === 'ASC',
	      'react-grid-HeaderCell-sortable--descending': this.props.sortDirection === 'DESC'
	    });

	    return React.createElement(
	      'div',
	      { className: className,
	        onClick: this.onClick,
	        style: { cursor: 'pointer' } },
	      React.createElement(
	        'span',
	        { className: 'pull-left' },
	        this.props.column.name
	      ),
	      React.createElement(
	        'span',
	        { className: 'pull-right' },
	        this.getSortByText()
	      )
	    );
	  }
	});

	module.exports = SortableHeaderCell;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var React = __webpack_require__(2);
	var Canvas = __webpack_require__(20);
	var PropTypes = React.PropTypes;
	var ViewportScroll = __webpack_require__(31);

	var Viewport = React.createClass({
	  displayName: 'Viewport',

	  mixins: [ViewportScroll],

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
	    minHeight: PropTypes.number,
	    groupOnAttribute: PropTypes.array
	  },

	  getDefaultProps: function getDefaultProps() {
	    var defaultGridSort = function defaultGridSort(a, b) {
	      if (a == null) return 1;
	      if (b == null) return -1;
	      return a > b ? 1 : -1;
	    };
	    return {
	      onGridSort: defaultGridSort
	    };
	  },

	  componentWillMount: function componentWillMount() {
	    this.getGroupedRows();
	  },

	  getInitialState: function getInitialState() {
	    return {
	      rows: []
	    };
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    if (prevProps.sortColumn != this.props.sortColumn || prevProps.sortDirection != this.props.sortDirection || prevProps.rowGetter != this.props.rowGetter) {
	      this.getGroupedRows();
	    }
	  },

	  getGroupedRows: function getGroupedRows() {
	    var allRows = this.getAllRows();
	    var groupedRows = this.groupByRowAttributes(this.props.groupOnAttribute, allRows);
	    var rows = this.flattenGroupedRows(groupedRows, []);
	    this.setState({ rows: rows });
	  },

	  flattenGroupedRows: function flattenGroupedRows(groupedRows, flattenedRows) {
	    if ((typeof groupedRows === 'undefined' ? 'undefined' : _typeof(groupedRows)) === 'object' && groupedRows instanceof Array == false) {
	      Object.keys(groupedRows).sort(function (l, r) {
	        return l.localeCompare(r);
	      }).map(function (groupName) {
	        flattenedRows.push({ type: 'group', displayElement: groupedRows[groupName].groupHeaderDisplay });
	        this.flattenGroupedRows(groupedRows[groupName]['rows'], flattenedRows);
	      }, this);
	      return flattenedRows;
	    } else {
	      groupedRows.forEach(function (r) {
	        return flattenedRows.push({ type: 'single', data: r });
	      });
	      return flattenedRows;
	    }
	  },

	  sortRows: function sortRows(sortColumn, sortDirection, rows) {
	    if (!sortColumn || !rows) return rows;
	    var column = $.grep(this.props.columns, function (e) {
	      return e.key == sortColumn;
	    })[0];
	    var onSort = column.hasOwnProperty("sortingFunction") ? column.sortingFunction : this.props.onGridSort;

	    var that = this;
	    var comparer = function comparer(a, b) {
	      if (sortDirection === 'ASC') {
	        return onSort(a[sortColumn], b[sortColumn]);
	      } else if (sortDirection === 'DESC') {
	        return onSort(b[sortColumn], a[sortColumn]);
	      }
	    };
	    return rows.sort(comparer);
	  },

	  groupByRowAttributes: function groupByRowAttributes(attrs, rows) {
	    if (attrs instanceof Array == false || !attrs.length > 0) {
	      return this.sortRows(this.props.sortColumn, this.props.sortDirection, rows);
	    }
	    var groupedRows = {};
	    var attributes = attrs.slice();
	    var attribute = attributes.shift();

	    for (var i = 0; i < rows.length; i++) {
	      var row = rows[i];
	      if (typeof row === 'undefined') continue;

	      var attribute_name, attribute_value;
	      switch (typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) {
	        case 'function':
	          var reactComponent = React.createElement(attribute, { row: row });
	          attribute_name = row[reactComponent.props.name.toString()];
	          attribute_value = reactComponent;
	          break;
	        case 'string':
	          attribute_name = row[attribute];
	          attribute_value = React.createElement('div', { className: 'groupName', style: { padding: '6px', fontSize: '16px', fontWeight: 'bold' } }, attribute_name.toString());
	          break;
	        default:
	          if (row[attribute] == 'undefined') return;
	      }

	      if (typeof groupedRows[attribute_name] === "undefined") groupedRows[attribute_name] = { groupHeaderDisplay: attribute_value, rows: [] };
	      groupedRows[attribute_name]['rows'].push(row);
	    }

	    Object.keys(groupedRows).map(function (groupName) {
	      groupedRows[groupName]['rows'] = this.groupByRowAttributes(attributes, groupedRows[groupName]['rows']);
	    }, this);

	    return groupedRows;
	  },

	  getAllRows: function getAllRows() {
	    if (Array.isArray(this.props.rowGetter)) {
	      return this.props.rowGetter.slice(0, this.props.rowsCount);
	    } else {
	      var rows = [];
	      for (var i = 0; i < this.props.rowsCount; i++) {
	        rows.push(this.props.rowGetter(i));
	      }
	      return rows;
	    }
	  },

	  render: function render() {

	    var style = {
	      padding: 0,
	      bottom: 0,
	      left: 0,
	      right: 0,
	      overflow: 'hidden',
	      position: 'absolute',
	      top: this.props.rowOffsetHeight
	    };

	    return React.createElement(
	      'div',
	      {
	        className: 'react-grid-Viewport',
	        style: style },
	      React.createElement(Canvas, {
	        ref: 'canvas',
	        totalWidth: this.props.totalWidth,
	        width: this.props.columnMetrics.width,
	        rowsCount: this.state.rows.length,
	        selectedRows: this.props.selectedRows,
	        expandedRows: this.props.expandedRows,
	        columns: this.props.columnMetrics.columns,
	        rowRenderer: this.props.rowRenderer,
	        visibleStart: this.state.visibleStart,
	        visibleEnd: this.state.visibleEnd,
	        displayStart: this.state.displayStart,
	        displayEnd: Math.max(this.state.displayEnd, this.state.rows.length),
	        cellMetaData: this.props.cellMetaData,
	        height: this.state.height,
	        rowHeight: this.props.rowHeight,
	        onScroll: this.onScroll,
	        onRows: this.props.onRows,
	        sortRows: this.sortRows(this.props.sortColumn, this.props.sortDirection),
	        groupOnAttribute: this.props.groupOnAttribute,
	        groupedRows: this.state.rows
	      })
	    );
	  },
	  getScroll: function getScroll() {
	    return this.refs.canvas.getScroll();
	  },
	  onScroll: function onScroll(scroll) {
	    this.updateScroll(scroll.scrollTop, scroll.scrollLeft, this.state.height, this.props.rowHeight, this.props.rowsCount);

	    if (this.props.onScroll) {
	      this.props.onScroll({ scrollTop: scroll.scrollTop, scrollLeft: scroll.scrollLeft });
	    }
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    this.refs.canvas.setScrollLeft(scrollLeft);
	  }
	});

	module.exports = Viewport;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var joinClasses = __webpack_require__(6);
	var PropTypes = React.PropTypes;
	var cloneWithProps = React.cloneElement;
	var shallowEqual = __webpack_require__(13);
	var ScrollShim = __webpack_require__(21);
	var Row = __webpack_require__(22);
	var RowContainer = __webpack_require__(30);

	var Canvas = React.createClass({
	  displayName: 'Canvas',

	  mixins: [ScrollShim],

	  propTypes: {
	    rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
	    rowHeight: PropTypes.number.isRequired,
	    height: PropTypes.number.isRequired,
	    displayStart: PropTypes.number.isRequired,
	    displayEnd: PropTypes.number.isRequired,
	    rowsCount: PropTypes.number.isRequired,
	    rowGetter: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.array.isRequired]),
	    onRows: PropTypes.func,
	    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	    groupOnAttribute: PropTypes.array
	  },

	  render: function render() {
	    var _this = this;

	    var displayStart = this.state.displayStart;
	    var displayEnd = this.state.displayEnd;
	    var rowHeight = this.props.rowHeight;
	    var length = this.props.rowsCount;
	    var groupOnAttribute = this.props.groupOnAttribute;
	    var rows = this.props.groupedRows.slice(displayStart, displayEnd).map(function (row, idx) {
	      return _this.renderRow(row, idx);
	    });

	    this._currentRowsLength = rows.length;

	    if (displayStart > 0) {
	      rows.unshift(this.renderPlaceholder('top', displayStart * rowHeight));
	    }

	    if (length - displayEnd > 0) {
	      rows.push(this.renderPlaceholder('bottom', (length - displayEnd) * rowHeight));
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

	    return React.createElement(
	      'div',
	      {
	        style: style,
	        onScroll: this.onScroll,
	        className: joinClasses("react-grid-Canvas", this.props.className, { opaque: this.props.cellMetaData.selected && this.props.cellMetaData.selected.active }) },
	      React.createElement(
	        'div',
	        { style: { width: this.props.width, overflow: 'hidden' } },
	        rows
	      )
	    );
	  },
	  renderRow: function renderRow(row, idx) {
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
	          isSelected: this.isRowSelected(this.props.displayStart + idx),
	          expandedRows: this.props.expandedRows,
	          cellMetaData: this.props.cellMetaData
	        });
	        break;
	      case 'group':
	        return this.renderGroupRow({ displayElement: row.displayElement });
	    }
	  },
	  renderSingleRow: function renderSingleRow(props) {
	    var RowsRenderer = this.props.rowRenderer;
	    if (typeof RowsRenderer === 'function') {
	      return React.createElement(RowsRenderer, props);
	    } else if (React.isValidElement(this.props.rowRenderer)) {
	      return cloneWithProps(this.props.rowRenderer, props);
	    }
	  },
	  renderGroupRow: function renderGroupRow(props) {
	    return React.createElement(RowContainer, {
	      height: this.props.rowHeight,
	      width: this.props.width,
	      renderer: props.displayElement
	    });
	  },
	  renderPlaceholder: function renderPlaceholder(key, height) {
	    return React.createElement(
	      'div',
	      { key: key, style: { height: height } },
	      this.props.columns.map(function (column, idx) {
	        return React.createElement('div', { style: { width: column.width }, key: idx });
	      })
	    );
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      rowRenderer: Row,
	      onRows: function onRows() {}
	    };
	  },
	  isRowSelected: function isRowSelected(rowIdx) {
	    return this.props.selectedRows && this.props.selectedRows[rowIdx] === true;
	  },


	  _currentRowsLength: 0,
	  _currentRowsRange: { start: 0, end: 0 },
	  _scroll: { scrollTop: 0, scrollLeft: 0 },

	  getInitialState: function getInitialState() {
	    return {
	      shouldUpdate: true,
	      displayStart: this.props.displayStart,
	      displayEnd: this.props.displayEnd,
	      scrollbarWidth: 0
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this._currentRowsLength = 0;
	    this._currentRowsRange = { start: 0, end: 0 };
	    this._scroll = { scrollTop: 0, scrollLeft: 0 };
	  },
	  componentDidMount: function componentDidMount() {
	    this.onRows();
	  },
	  componentDidUpdate: function componentDidUpdate(nextProps) {
	    if (this._scroll !== { start: 0, end: 0 }) {
	      this.setScrollLeft(this._scroll.scrollLeft);
	    }
	    this.onRows();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this._currentRowsLength = 0;
	    this._currentRowsRange = { start: 0, end: 0 };
	    this._scroll = { scrollTop: 0, scrollLeft: 0 };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.rowsCount > this.props.rowsCount) {
	      React.findDOMNode(this).scrollTop = nextProps.rowsCount * this.props.rowHeight;
	    }
	    var scrollbarWidth = this.getScrollbarWidth();
	    var shouldUpdate = !(nextProps.visibleStart > this.state.displayStart && nextProps.visibleEnd < this.state.displayEnd) || nextProps.rowsCount !== this.props.rowsCount || nextProps.rowHeight !== this.props.rowHeight || nextProps.columns !== this.props.columns || nextProps.groupedRows !== this.props.groupedRows || nextProps.width !== this.props.width || nextProps.cellMetaData !== this.props.cellMetaData || !shallowEqual(nextProps.style, this.props.style);

	    if (shouldUpdate) {
	      this.setState({
	        shouldUpdate: true,
	        displayStart: nextProps.displayStart,
	        displayEnd: nextProps.displayEnd,
	        scrollbarWidth: scrollbarWidth
	      });
	    } else {
	      this.setState({ shouldUpdate: false, scrollbarWidth: scrollbarWidth });
	    }
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return !nextState || nextState.shouldUpdate;
	  },
	  onRows: function onRows() {
	    if (this._currentRowsRange !== { start: 0, end: 0 }) {
	      this.props.onRows(this._currentRowsRange);
	      this._currentRowsRange = { start: 0, end: 0 };
	    }
	  },
	  getScrollbarWidth: function getScrollbarWidth() {
	    var scrollbarWidth = 0;
	    // Get the scrollbar width
	    var canvas = this.getDOMNode();
	    scrollbarWidth = canvas.offsetWidth - canvas.clientWidth;
	    return scrollbarWidth;
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    if (this._currentRowsLength !== 0) {
	      if (!this.refs) return;
	      for (var i = 0, len = this._currentRowsLength; i < len; i++) {
	        if (this.refs[i] && this.refs[i].setScrollLeft) {
	          this.refs[i].setScrollLeft(scrollLeft);
	        }
	      }
	    }
	  },
	  getScroll: function getScroll() {
	    var _React$findDOMNode = React.findDOMNode(this);

	    var scrollTop = _React$findDOMNode.scrollTop;
	    var scrollLeft = _React$findDOMNode.scrollLeft;

	    return { scrollTop: scrollTop, scrollLeft: scrollLeft };
	  },
	  onScroll: function onScroll(e) {
	    this.appendScrollShim();
	    var _e$target = e.target;
	    var scrollTop = _e$target.scrollTop;
	    var scrollLeft = _e$target.scrollLeft;

	    var scroll = { scrollTop: scrollTop, scrollLeft: scrollLeft };
	    this._scroll = scroll;
	    this.props.onScroll(scroll);
	  }
	});

	module.exports = Canvas;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _reactDom = __webpack_require__(5);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ScrollShim = {
	  appendScrollShim: function appendScrollShim() {
	    if (!this._scrollShim) {
	      var size = this._scrollShimSize();
	      var shim = document.createElement('div');
	      if (shim.classList) {
	        shim.classList.add('react-grid-ScrollShim'); // flow - not compatible with HTMLElement
	      } else {
	          shim.className += ' react-grid-ScrollShim';
	        }
	      shim.style.position = 'absolute';
	      shim.style.top = 0;
	      shim.style.left = 0;
	      shim.style.width = size.width + 'px';
	      shim.style.height = size.height + 'px';
	      _reactDom2.default.findDOMNode(this).appendChild(shim);
	      this._scrollShim = shim;
	    }
	    this._scheduleRemoveScrollShim();
	  },
	  _scrollShimSize: function _scrollShimSize() {
	    return {
	      width: this.props.width,
	      height: this.props.length * this.props.rowHeight
	    };
	  },
	  _scheduleRemoveScrollShim: function _scheduleRemoveScrollShim() {
	    if (this._scheduleRemoveScrollShimTimer) {
	      clearTimeout(this._scheduleRemoveScrollShimTimer);
	    }
	    this._scheduleRemoveScrollShimTimer = setTimeout(this._removeScrollShim, 200);
	  },
	  _removeScrollShim: function _removeScrollShim() {
	    if (this._scrollShim) {
	      this._scrollShim.parentNode.removeChild(this._scrollShim);
	      this._scrollShim = undefined;
	    }
	  }
	};

	module.exports = ScrollShim;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var joinClasses = __webpack_require__(6);
	var Cell = __webpack_require__(23);
	var ColumnMetrics = __webpack_require__(8);
	var ColumnUtilsMixin = __webpack_require__(10);
	var cellMetaDataShape = __webpack_require__(29);
	var PropTypes = React.PropTypes;

	var Row = React.createClass({
	  displayName: 'Row',


	  propTypes: {
	    height: PropTypes.number.isRequired,
	    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	    row: PropTypes.any.isRequired,
	    cellRenderer: PropTypes.func,
	    cellMetaData: PropTypes.shape(cellMetaDataShape),
	    isSelected: PropTypes.bool,
	    idx: PropTypes.number.isRequired,
	    key: PropTypes.string,
	    expandedRows: PropTypes.arrayOf(PropTypes.object)
	  },

	  mixins: [ColumnUtilsMixin],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      cellRenderer: Cell,
	      isSelected: false,
	      height: 35
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    return !ColumnMetrics.sameColumns(this.props.columns, nextProps.columns, ColumnMetrics.sameColumn) || this.doesRowContainSelectedCell(this.props) || this.doesRowContainSelectedCell(nextProps) || this.willRowBeDraggedOver(nextProps) || nextProps.row !== this.props.row || this.hasRowBeenCopied() || this.props.isSelected !== nextProps.isSelected || nextProps.height !== this.props.height;
	  },
	  handleDragEnter: function handleDragEnter() {
	    var handleDragEnterRow = this.props.cellMetaData.handleDragEnterRow;
	    if (handleDragEnterRow) {
	      handleDragEnterRow(this.props.idx);
	    }
	  },
	  getSelectedColumn: function getSelectedColumn() {
	    var selected = this.props.cellMetaData.selected;
	    if (selected && selected.idx) {
	      return this.getColumn(this.props.columns, selected.idx);
	    }
	  },
	  getCells: function getCells() {
	    var _this = this;

	    var cells = [];
	    var lockedCells = [];
	    var selectedColumn = this.getSelectedColumn();

	    this.props.columns.forEach(function (column, i) {
	      var CellRenderer = _this.props.cellRenderer;
	      var cell = React.createElement(CellRenderer, {
	        ref: i,
	        key: column.key + '-' + i,
	        idx: i,
	        rowIdx: _this.props.idx,
	        value: _this.getCellValue(column.key || i),
	        column: column,
	        height: _this.getRowHeight(),
	        formatter: column.formatter,
	        cellMetaData: _this.props.cellMetaData,
	        rowData: _this.props.row,
	        selectedColumn: selectedColumn,
	        isRowSelected: _this.props.isSelected });
	      if (column.locked) {
	        lockedCells.push(cell);
	      } else {
	        cells.push(cell);
	      }
	    });

	    return cells.concat(lockedCells);
	  },
	  getRowHeight: function getRowHeight() {
	    var rows = this.props.expandedRows || null;
	    if (rows && this.props.key) {
	      var row = rows[this.props.key] || null;
	      if (row) {
	        return row.height;
	      }
	    }
	    return this.props.height;
	  },
	  getCellValue: function getCellValue(key) {
	    var val = undefined;
	    if (key === 'select-row') {
	      return this.props.isSelected;
	    } else if (typeof this.props.row.get === 'function') {
	      val = this.props.row.get(key);
	    } else {
	      val = this.props.row[key];
	    }
	    return val;
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    var _this2 = this;

	    this.props.columns.forEach(function (column, i) {
	      if (column.locked) {
	        if (!_this2.refs[i]) return;
	        _this2.refs[i].setScrollLeft(scrollLeft);
	      }
	    });
	  },
	  doesRowContainSelectedCell: function doesRowContainSelectedCell(props) {
	    var selected = props.cellMetaData.selected;
	    if (selected && selected.rowIdx === props.idx) {
	      return true;
	    }

	    return false;
	  },
	  willRowBeDraggedOver: function willRowBeDraggedOver(props) {
	    var dragged = props.cellMetaData.dragged;
	    return dragged != null && (dragged.rowIdx >= 0 || dragged.complete === true);
	  },
	  hasRowBeenCopied: function hasRowBeenCopied() {
	    var copied = this.props.cellMetaData.copied;
	    return copied != null && copied.rowIdx === this.props.idx;
	  },
	  renderCell: function renderCell(props) {
	    if (typeof this.props.cellRenderer === 'function') {
	      this.props.cellRenderer.call(this, props);
	    }
	    if (React.isValidElement(this.props.cellRenderer)) {
	      return React.cloneElement(this.props.cellRenderer, props);
	    }

	    return this.props.cellRenderer(props);
	  },
	  render: function render() {
	    var className = joinClasses('react-grid-Row', 'react-grid-Row--' + (this.props.idx % 2 === 0 ? 'even' : 'odd'), { 'row-selected': this.props.isSelected });

	    var style = {
	      height: this.getRowHeight(this.props),
	      overflow: 'hidden'
	    };

	    var cells = this.getCells();
	    return React.createElement(
	      'div',
	      _extends({}, this.props, { className: className, style: style, onDragEnter: this.handleDragEnter }),
	      React.isValidElement(this.props.row) ? this.props.row : cells
	    );
	  }
	});

	module.exports = Row;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(2);
	var joinClasses = __webpack_require__(6);
	var cloneWithProps = React.cloneElement;
	var EditorContainer = __webpack_require__(24);
	var ExcelColumn = __webpack_require__(15);
	var isFunction = __webpack_require__(28);
	var CellMetaDataShape = __webpack_require__(29);

	var Cell = React.createClass({
	  displayName: 'Cell',


	  propTypes: {
	    rowIdx: React.PropTypes.number.isRequired,
	    idx: React.PropTypes.number.isRequired,
	    selected: React.PropTypes.shape({
	      idx: React.PropTypes.number.isRequired
	    }),
	    tabIndex: React.PropTypes.number,
	    ref: React.PropTypes.string,
	    column: React.PropTypes.shape(ExcelColumn).isRequired,
	    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]).isRequired,
	    isExpanded: React.PropTypes.bool,
	    cellMetaData: React.PropTypes.shape(CellMetaDataShape).isRequired,
	    handleDragStart: React.PropTypes.func,
	    className: React.PropTypes.string,
	    rowData: React.PropTypes.object.isRequired
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      tabIndex: -1,
	      ref: "cell",
	      isExpanded: false
	    };
	  },

	  getInitialState: function getInitialState() {
	    return { isRowChanging: false, isCellValueChanging: false };
	  },


	  componentDidMount: function componentDidMount() {
	    this.checkFocus();
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this.checkFocus();
	    var dragged = this.props.cellMetaData.dragged;
	    if (dragged && dragged.complete === true) {
	      this.props.cellMetaData.handleTerminateDrag();
	    }
	    if (this.state.isRowChanging && this.props.selectedColumn != null) {
	      this.applyUpdateClass();
	    }
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    this.setState({ isRowChanging: this.props.rowData !== nextProps.rowData, isCellValueChanging: this.props.value !== nextProps.value });
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return this.props.column.width !== nextProps.column.width || this.props.column.left !== nextProps.column.left || this.props.rowData !== nextProps.rowData || this.props.height !== nextProps.height || this.props.rowIdx !== nextProps.rowIdx || this.isCellSelectionChanging(nextProps) || this.isDraggedCellChanging(nextProps) || this.isCopyCellChanging(nextProps) || this.props.isRowSelected !== nextProps.isRowSelected || this.isSelected();
	  },
	  getStyle: function getStyle() {
	    var style = {
	      position: 'absolute',
	      width: this.props.column.width,
	      height: this.props.height,
	      left: this.props.column.left
	    };
	    return style;
	  },
	  render: function render() {
	    var style = this.getStyle();

	    var className = this.getCellClass();

	    var cellContent = this.renderCellContent({
	      value: this.props.value,
	      column: this.props.column,
	      rowIdx: this.props.rowIdx,
	      isExpanded: this.props.isExpanded,
	      rowData: this.props.rowData
	    });

	    return React.createElement(
	      'div',
	      _extends({}, this.props, { className: className, style: style, onClick: this.onCellClick, onDoubleClick: this.onCellDoubleClick }),
	      cellContent,
	      React.createElement('div', { className: 'drag-handle', draggable: 'true' })
	    );
	  },
	  renderCellContent: function renderCellContent(props) {
	    var CellContent;
	    var Formatter = this.getFormatter();
	    if (React.isValidElement(Formatter)) {
	      props.dependentValues = this.getFormatterDependencies();
	      CellContent = cloneWithProps(Formatter, props);
	    } else if (isFunction(Formatter)) {
	      CellContent = React.createElement(Formatter, { value: this.props.value, dependentValues: this.getFormatterDependencies() });
	    } else {
	      CellContent = React.createElement(SimpleCellFormatter, { value: this.props.value });
	    }
	    return React.createElement(
	      'div',
	      { ref: 'cell',
	        className: 'react-grid-Cell__value' },
	      CellContent,
	      ' ',
	      this.props.cellControls
	    );
	  },
	  isColumnSelected: function isColumnSelected() {
	    var meta = this.props.cellMetaData;
	    if (meta == null || meta.selected == null) {
	      return false;
	    }

	    return meta.selected && meta.selected.idx === this.props.idx;
	  },


	  isSelected: function isSelected() {
	    var meta = this.props.cellMetaData;
	    if (meta == null || meta.selected == null) {
	      return false;
	    }

	    return meta.selected && meta.selected.rowIdx === this.props.rowIdx && meta.selected.idx === this.props.idx;
	  },

	  isActive: function isActive() {
	    var meta = this.props.cellMetaData;
	    if (meta == null || meta.selected == null) {
	      return false;
	    }
	    return this.isSelected() && meta.selected.active === true;
	  },
	  isCellSelectionChanging: function isCellSelectionChanging(nextProps) {
	    var meta = this.props.cellMetaData;
	    if (meta == null || meta.selected == null) {
	      return false;
	    }
	    var nextSelected = nextProps.cellMetaData.selected;
	    if (meta.selected && nextSelected) {
	      return this.props.idx === nextSelected.idx || this.props.idx === meta.selected.idx;
	    } else {
	      return true;
	    }
	  },
	  getFormatter: function getFormatter() {
	    var col = this.props.column;
	    if (this.isActive()) {
	      return React.createElement(EditorContainer, { rowData: this.getRowData(), rowIdx: this.props.rowIdx, idx: this.props.idx, cellMetaData: this.props.cellMetaData, column: col, height: this.props.height });
	    } else {
	      return this.props.column.formatter;
	    }
	  },
	  getRowData: function getRowData() {
	    return this.props.rowData.toJSON ? this.props.rowData.toJSON() : this.props.rowData;
	  },
	  getFormatterDependencies: function getFormatterDependencies() {
	    //clone row data so editor cannot actually change this
	    var columnName = this.props.column.ItemId;
	    //convention based method to get corresponding Id or Name of any Name or Id property
	    if (typeof this.props.column.getRowMetaData === 'function') {
	      return this.props.column.getRowMetaData(this.getRowData(), this.props.column);
	    }
	  },
	  onCellClick: function onCellClick(e) {
	    var meta = this.props.cellMetaData;
	    if (meta != null && meta.onCellClick != null) {
	      meta.onCellClick({ rowIdx: this.props.rowIdx, idx: this.props.idx });
	    }
	  },
	  onCellDoubleClick: function onCellDoubleClick(e) {
	    var meta = this.props.cellMetaData;
	    if (meta != null && meta.onCellDoubleClick != null) {
	      meta.onCellDoubleClick({ rowIdx: this.props.rowIdx, idx: this.props.idx });
	    }
	  },


	  checkFocus: function checkFocus() {
	    if (this.isSelected() && !this.isActive()) {
	      React.findDOMNode(this).focus();
	    }
	  },

	  getCellClass: function getCellClass() {
	    var className = joinClasses(this.props.column.cellClass, 'react-grid-Cell', this.props.className, this.props.column.locked ? 'react-grid-Cell--locked' : null);
	    var extraClasses = joinClasses({
	      'selected': this.isSelected() && !this.isActive(),
	      'editing': this.isActive(),
	      'copied': this.isCopied(),
	      'active-drag-cell': this.isSelected() || this.isDraggedOver(),
	      'is-dragged-over-up': this.isDraggedOverUpwards(),
	      'is-dragged-over-down': this.isDraggedOverDownwards(),
	      'was-dragged-over': this.wasDraggedOver()
	    });
	    return joinClasses(className, extraClasses);
	  },

	  getUpdateCellClass: function getUpdateCellClass() {
	    return this.props.column.getUpdateCellClass ? this.props.column.getUpdateCellClass(this.props.selectedColumn, this.props.column, this.state.isCellValueChanging) : '';
	  },
	  applyUpdateClass: function applyUpdateClass() {
	    var updateCellClass = this.getUpdateCellClass();
	    // -> removing the class
	    if (updateCellClass != null && updateCellClass != "") {
	      var cellDOMNode = this.getDOMNode();
	      if (cellDOMNode.classList) {
	        cellDOMNode.classList.remove(updateCellClass);
	        // -> and re-adding the class
	        cellDOMNode.classList.add(updateCellClass);
	      } else if (cellDOMNode.className.indexOf(updateCellClass) === -1) {
	        // IE9 doesn't support classList, nor (I think) altering element.className
	        // without replacing it wholesale.
	        cellDOMNode.className = cellDOMNode.className + ' ' + updateCellClass;
	      }
	    }
	  },
	  setScrollLeft: function setScrollLeft(scrollLeft) {
	    var ctrl = this; //flow on windows has an outdated react declaration, once that gets updated, we can remove this
	    if (ctrl.isMounted()) {
	      var node = React.findDOMNode(this);
	      var transform = 'translate3d(' + scrollLeft + 'px, 0px, 0px)';
	      node.style.webkitTransform = transform;
	      node.style.transform = transform;
	    }
	  },
	  isCopied: function isCopied() {
	    var copied = this.props.cellMetaData.copied;
	    return copied && copied.rowIdx === this.props.rowIdx && copied.idx === this.props.idx;
	  },
	  isDraggedOver: function isDraggedOver() {
	    var dragged = this.props.cellMetaData.dragged;
	    return dragged && dragged.overRowIdx === this.props.rowIdx && dragged.idx === this.props.idx;
	  },
	  wasDraggedOver: function wasDraggedOver() {
	    var dragged = this.props.cellMetaData.dragged;
	    return dragged && (dragged.overRowIdx < this.props.rowIdx && this.props.rowIdx < dragged.rowIdx || dragged.overRowIdx > this.props.rowIdx && this.props.rowIdx > dragged.rowIdx) && dragged.idx === this.props.idx;
	  },
	  isDraggedCellChanging: function isDraggedCellChanging(nextProps) {
	    var isChanging;
	    var dragged = this.props.cellMetaData.dragged;
	    var nextDragged = nextProps.cellMetaData.dragged;
	    if (dragged) {
	      isChanging = nextDragged && this.props.idx === nextDragged.idx || dragged && this.props.idx === dragged.idx;
	      return isChanging;
	    } else {
	      return false;
	    }
	  },
	  isCopyCellChanging: function isCopyCellChanging(nextProps) {
	    var isChanging;
	    var copied = this.props.cellMetaData.copied;
	    var nextCopied = nextProps.cellMetaData.copied;
	    if (copied) {
	      isChanging = nextCopied && this.props.idx === nextCopied.idx || copied && this.props.idx === copied.idx;
	      return isChanging;
	    } else {
	      return false;
	    }
	  },
	  isDraggedOverUpwards: function isDraggedOverUpwards() {
	    var dragged = this.props.cellMetaData.dragged;
	    return !this.isSelected() && this.isDraggedOver() && this.props.rowIdx < dragged.rowIdx;
	  },
	  isDraggedOverDownwards: function isDraggedOverDownwards() {
	    var dragged = this.props.cellMetaData.dragged;
	    return !this.isSelected() && this.isDraggedOver() && this.props.rowIdx > dragged.rowIdx;
	  }
	});

	var SimpleCellFormatter = React.createClass({
	  displayName: 'SimpleCellFormatter',

	  propTypes: {
	    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]).isRequired
	  },

	  render: function render() {
	    return React.createElement(
	      'span',
	      null,
	      this.props.value
	    );
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.value !== this.props.value;
	  }
	});

	module.exports = Cell;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var joinClasses = __webpack_require__(6);
	var keyboardHandlerMixin = __webpack_require__(25);
	var SimpleTextEditor = __webpack_require__(26);
	var isFunction = __webpack_require__(28);

	var EditorContainer = React.createClass({
	  displayName: 'EditorContainer',

	  mixins: [keyboardHandlerMixin],

	  propTypes: {
	    rowIdx: React.PropTypes.number,
	    rowData: React.PropTypes.object.isRequired,
	    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]).isRequired,
	    cellMetaData: React.PropTypes.shape({
	      selected: React.PropTypes.object.isRequired,
	      copied: React.PropTypes.object,
	      dragged: React.PropTypes.object,
	      onCellClick: React.PropTypes.func,
	      onCellDoubleClick: React.PropTypes.func,
	      onCommitCancel: React.PropTypes.func,
	      onCommit: React.PropTypes.func
	    }).isRequired,
	    column: React.PropTypes.object.isRequired,
	    height: React.PropTypes.number.isRequired
	  },

	  changeCommitted: false,

	  getInitialState: function getInitialState() {
	    return { isInvalid: false };
	  },


	  componentDidMount: function componentDidMount() {
	    var inputNode = this.getInputNode();
	    if (inputNode !== undefined) {
	      this.setTextInputFocus();
	      if (!this.getEditor().disableContainerStyles) {
	        inputNode.className += ' editor-main';
	        inputNode.style.height = this.props.height - 1 + 'px';
	      }
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (!this.changeCommitted && !this.hasEscapeBeenPressed()) {
	      this.commit({ key: 'Enter' });
	    }
	  },

	  createEditor: function createEditor() {
	    var _this = this;

	    var editorRef = function editorRef(c) {
	      return _this.editor = c;
	    };
	    var editorProps = {
	      ref: editorRef,
	      column: this.props.column,
	      value: this.getInitialValue(),
	      onCommit: this.commit,
	      rowMetaData: this.getRowMetaData(),
	      height: this.props.height,
	      onBlur: this.commit,
	      onOverrideKeyDown: this.onKeyDown
	    };

	    var customEditor = this.props.column.editor;
	    if (customEditor && React.isValidElement(customEditor)) {
	      // return custom column editor or SimpleEditor if none specified
	      return React.cloneElement(customEditor, editorProps);
	    }

	    return React.createElement(SimpleTextEditor, { ref: editorRef, column: this.props.column, value: this.getInitialValue(), onBlur: this.commit, rowMetaData: this.getRowMetaData(), onKeyDown: function onKeyDown() {}, commit: function commit() {} });
	  },
	  onPressEnter: function onPressEnter() {
	    this.commit({ key: 'Enter' });
	  },
	  onPressTab: function onPressTab() {
	    this.commit({ key: 'Tab' });
	  },
	  onPressEscape: function onPressEscape(e) {
	    if (!this.editorIsSelectOpen()) {
	      this.props.cellMetaData.onCommitCancel();
	    } else {
	      // prevent event from bubbling if editor has results to select
	      e.stopPropagation();
	    }
	  },
	  onPressArrowDown: function onPressArrowDown(e) {
	    if (this.editorHasResults()) {
	      // dont want to propogate as that then moves us round the grid
	      e.stopPropagation();
	    } else {
	      this.commit(e);
	    }
	  },
	  onPressArrowUp: function onPressArrowUp(e) {
	    if (this.editorHasResults()) {
	      // dont want to propogate as that then moves us round the grid
	      e.stopPropagation();
	    } else {
	      this.commit(e);
	    }
	  },
	  onPressArrowLeft: function onPressArrowLeft(e) {
	    // prevent event propogation. this disables left cell navigation
	    if (!this.isCaretAtBeginningOfInput()) {
	      e.stopPropagation();
	    } else {
	      this.commit(e);
	    }
	  },
	  onPressArrowRight: function onPressArrowRight(e) {
	    // prevent event propogation. this disables right cell navigation
	    if (!this.isCaretAtEndOfInput()) {
	      e.stopPropagation();
	    } else {
	      this.commit(e);
	    }
	  },
	  editorHasResults: function editorHasResults() {
	    if (isFunction(this.getEditor().hasResults)) {
	      return this.getEditor().hasResults();
	    }

	    return false;
	  },
	  editorIsSelectOpen: function editorIsSelectOpen() {
	    if (isFunction(this.getEditor().isSelectOpen)) {
	      return this.getEditor().isSelectOpen();
	    }

	    return false;
	  },
	  getRowMetaData: function getRowMetaData() {
	    // clone row data so editor cannot actually change this
	    // convention based method to get corresponding Id or Name of any Name or Id property
	    if (typeof this.props.column.getRowMetaData === 'function') {
	      return this.props.column.getRowMetaData(this.props.rowData, this.props.column);
	    }
	  },
	  getEditor: function getEditor() {
	    return this.editor;
	  },
	  getInputNode: function getInputNode() {
	    return this.getEditor().getInputNode();
	  },
	  getInitialValue: function getInitialValue() {
	    var selected = this.props.cellMetaData.selected;
	    var keyCode = selected.initialKeyCode;
	    if (keyCode === 'Delete' || keyCode === 'Backspace') {
	      return '';
	    } else if (keyCode === 'Enter') {
	      return this.props.value;
	    }

	    var text = keyCode ? String.fromCharCode(keyCode) : this.props.value;
	    return text;
	  },
	  getContainerClass: function getContainerClass() {
	    return joinClasses({
	      'has-error': this.state.isInvalid === true
	    });
	  },
	  commit: function commit(args) {
	    var opts = args || {};
	    var updated = this.getEditor().getValue();
	    if (this.isNewValueValid(updated)) {
	      var cellKey = this.props.column.key;
	      this.props.cellMetaData.onCommit({ cellKey: cellKey, rowIdx: this.props.rowIdx, updated: updated, key: opts.key });
	    }

	    this.changeCommitted = true;
	  },
	  isNewValueValid: function isNewValueValid(value) {
	    if (isFunction(this.getEditor().validate)) {
	      var isValid = this.getEditor().validate(value);
	      this.setState({ isInvalid: !isValid });

	      return isValid;
	    }

	    return true;
	  },
	  setCaretAtEndOfInput: function setCaretAtEndOfInput() {
	    var input = this.getInputNode();
	    // taken from http://stackoverflow.com/questions/511088/use-javascript-to-place-cursor-at-end-of-text-in-text-input-element
	    var txtLength = input.value.length;
	    if (input.setSelectionRange) {
	      input.setSelectionRange(txtLength, txtLength);
	    } else if (input.createTextRange) {
	      var fieldRange = input.createTextRange();
	      fieldRange.moveStart('character', txtLength);
	      fieldRange.collapse();
	      fieldRange.select();
	    }
	  },
	  isCaretAtBeginningOfInput: function isCaretAtBeginningOfInput() {
	    var inputNode = this.getInputNode();
	    return inputNode.selectionStart === inputNode.selectionEnd && inputNode.selectionStart === 0;
	  },
	  isCaretAtEndOfInput: function isCaretAtEndOfInput() {
	    var inputNode = this.getInputNode();
	    return inputNode.selectionStart === inputNode.value.length;
	  },
	  setTextInputFocus: function setTextInputFocus() {
	    var selected = this.props.cellMetaData.selected;
	    var keyCode = selected.initialKeyCode;
	    var inputNode = this.getInputNode();
	    inputNode.focus();
	    if (inputNode.tagName === 'INPUT') {
	      if (!this.isKeyPrintable(keyCode)) {
	        inputNode.focus();
	        inputNode.select();
	      } else {
	        inputNode.select();
	      }
	    }
	  },
	  hasEscapeBeenPressed: function hasEscapeBeenPressed() {
	    var pressed = false;
	    var escapeKey = 27;
	    if (window.event) {
	      if (window.event.keyCode === escapeKey) {
	        pressed = true;
	      } else if (window.event.which === escapeKey) {
	        pressed = true;
	      }
	    }
	    return pressed;
	  },
	  renderStatusIcon: function renderStatusIcon() {
	    if (this.state.isInvalid === true) {
	      return React.createElement('span', { className: 'glyphicon glyphicon-remove form-control-feedback' });
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: this.getContainerClass(), onKeyDown: this.onKeyDown, commit: this.commit },
	      this.createEditor(),
	      this.renderStatusIcon()
	    );
	  }
	});

	module.exports = EditorContainer;

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var KeyboardHandlerMixin = {
	  onKeyDown: function onKeyDown(e) {
	    if (this.isCtrlKeyHeldDown(e)) {
	      this.checkAndCall('onPressKeyWithCtrl', e);
	    } else if (this.isKeyExplicitlyHandled(e.key)) {
	      // break up individual keyPress events to have their own specific callbacks
	      // this allows multiple mixins to listen to onKeyDown events and somewhat reduces methodName clashing
	      var callBack = 'onPress' + e.key;
	      this.checkAndCall(callBack, e);
	    } else if (this.isKeyPrintable(e.keyCode)) {
	      this.checkAndCall('onPressChar', e);
	    }
	  },


	  // taken from http://stackoverflow.com/questions/12467240/determine-if-javascript-e-keycode-is-a-printable-non-control-character
	  isKeyPrintable: function isKeyPrintable(keycode) {
	    var valid = keycode > 47 && keycode < 58 || // number keys
	    keycode === 32 || keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
	    keycode > 64 && keycode < 91 || // letter keys
	    keycode > 95 && keycode < 112 || // numpad keys
	    keycode > 185 && keycode < 193 || // ;=,-./` (in order)
	    keycode > 218 && keycode < 223; // [\]' (in order)

	    return valid;
	  },
	  isKeyExplicitlyHandled: function isKeyExplicitlyHandled(key) {
	    return typeof this['onPress' + key] === 'function';
	  },
	  isCtrlKeyHeldDown: function isCtrlKeyHeldDown(e) {
	    return e.ctrlKey === true && e.key !== 'Control';
	  },
	  checkAndCall: function checkAndCall(methodName, args) {
	    if (typeof this[methodName] === 'function') {
	      this[methodName](args);
	    }
	  }
	};

	module.exports = KeyboardHandlerMixin;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);
	var EditorBase = __webpack_require__(27);

	var SimpleTextEditor = function (_EditorBase) {
	  _inherits(SimpleTextEditor, _EditorBase);

	  function SimpleTextEditor() {
	    _classCallCheck(this, SimpleTextEditor);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SimpleTextEditor).apply(this, arguments));
	  }

	  _createClass(SimpleTextEditor, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement('input', { ref: 'input', type: 'text', onBlur: this.props.onBlur, className: 'form-control', defaultValue: this.props.value });
	    }
	  }]);

	  return SimpleTextEditor;
	}(EditorBase);

	module.exports = SimpleTextEditor;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(5);
	var ExcelColumn = __webpack_require__(15);

	var EditorBase = function (_React$Component) {
	  _inherits(EditorBase, _React$Component);

	  function EditorBase() {
	    _classCallCheck(this, EditorBase);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorBase).apply(this, arguments));
	  }

	  _createClass(EditorBase, [{
	    key: 'getStyle',
	    value: function getStyle() {
	      return {
	        width: '100%'
	      };
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var updated = {};
	      updated[this.props.column.key] = this.getInputNode().value;
	      return updated;
	    }
	  }, {
	    key: 'getInputNode',
	    value: function getInputNode() {
	      var domNode = ReactDOM.findDOMNode(this);
	      if (domNode.tagName === 'INPUT') {
	        return domNode;
	      }

	      return domNode.querySelector('input:not([type=hidden])');
	    }
	  }, {
	    key: 'inheritContainerStyles',
	    value: function inheritContainerStyles() {
	      return true;
	    }
	  }]);

	  return EditorBase;
	}(React.Component);

	EditorBase.propTypes = {
	  onKeyDown: React.PropTypes.func.isRequired,
	  value: React.PropTypes.any.isRequired,
	  onBlur: React.PropTypes.func.isRequired,
	  column: React.PropTypes.shape(ExcelColumn).isRequired,
	  commit: React.PropTypes.func.isRequired
	};

	module.exports = EditorBase;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	var isFunction = function isFunction(functionToCheck) {
	  var getType = {};
	  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	};

	module.exports = isFunction;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var PropTypes = __webpack_require__(2).PropTypes;

	module.exports = {
	  selected: PropTypes.object.isRequired,
	  copied: PropTypes.object,
	  dragged: PropTypes.object,
	  onCellClick: PropTypes.func.isRequired,
	  onCellDoubleClick: PropTypes.func.isRequired,
	  onCommit: PropTypes.func.isRequired,
	  onCommitCancel: PropTypes.func.isRequired,
	  handleDragEnterRow: PropTypes.func.isRequired,
	  handleTerminateDrag: PropTypes.func.isRequired
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var RowContainer = React.createClass({
	  displayName: 'RowContainer',


	  propTypes: {
	    height: React.PropTypes.number.isRequired,
	    width: React.PropTypes.number.isRequired,
	    renderer: React.PropTypes.func.isRequired
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { style: { height: this.props.height, overflow: 'hidden' } },
	      React.createElement(
	        'div',
	        { style: { position: 'absolute', left: 0, width: this.props.width } },
	        this.props.renderer
	      )
	    );
	  }
	});

	module.exports = RowContainer;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(5);
	var DOMMetrics = __webpack_require__(32);
	var min = Math.min;
	var max = Math.max;
	var floor = Math.floor;
	var ceil = Math.ceil;

	module.exports = {
	  mixins: [DOMMetrics.MetricsMixin],

	  DOMMetrics: {
	    viewportHeight: function viewportHeight() {
	      return ReactDOM.findDOMNode(this).offsetHeight;
	    }
	  },

	  propTypes: {
	    rowHeight: React.PropTypes.number,
	    rowsCount: React.PropTypes.number.isRequired
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      rowHeight: 30
	    };
	  },
	  getInitialState: function getInitialState() {
	    return this.getGridState(this.props);
	  },
	  getGridState: function getGridState(props) {
	    var renderedRowsCount = ceil((props.minHeight - props.rowHeight) / props.rowHeight);
	    var totalRowCount = min(renderedRowsCount * 2, props.rowsCount);
	    return {
	      displayStart: 0,
	      displayEnd: totalRowCount,
	      height: props.minHeight,
	      scrollTop: 0,
	      scrollLeft: 0
	    };
	  },
	  updateScroll: function updateScroll(scrollTop, scrollLeft, height, rowHeight, length) {
	    var renderedRowsCount = ceil(height / rowHeight);

	    var visibleStart = floor(scrollTop / rowHeight);

	    var visibleEnd = min(visibleStart + renderedRowsCount, length);

	    var displayStart = max(0, visibleStart - renderedRowsCount * 2);

	    var displayEnd = min(visibleStart + renderedRowsCount * 2, length);

	    var nextScrollState = {
	      visibleStart: visibleStart,
	      visibleEnd: visibleEnd,
	      displayStart: displayStart,
	      displayEnd: displayEnd,
	      height: height,
	      scrollTop: scrollTop,
	      scrollLeft: scrollLeft
	    };

	    this.setState(nextScrollState);
	  },
	  metricsUpdated: function metricsUpdated() {
	    var height = this.DOMMetrics.viewportHeight();
	    if (height) {
	      this.updateScroll(this.state.scrollTop, this.state.scrollLeft, height, this.props.rowHeight, this.props.rowsCount);
	    }
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (this.props.rowHeight !== nextProps.rowHeight || this.props.minHeight !== nextProps.minHeight) {
	      this.setState(this.getGridState(nextProps));
	    } else if (this.props.rowsCount !== nextProps.rowsCount) {
	      this.updateScroll(this.state.scrollTop, this.state.scrollLeft, this.state.height, nextProps.rowHeight, nextProps.rowsCount);
	    }
	  }
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var shallowCloneObject = __webpack_require__(7);

	var contextTypes = {
	  metricsComputator: React.PropTypes.object
	};

	var MetricsComputatorMixin = {

	  childContextTypes: contextTypes,

	  getChildContext: function getChildContext() {
	    return { metricsComputator: this };
	  },
	  getMetricImpl: function getMetricImpl(name) {
	    return this._DOMMetrics.metrics[name].value;
	  },
	  registerMetricsImpl: function registerMetricsImpl(component, metrics) {
	    var getters = {};
	    var s = this._DOMMetrics;

	    for (var name in metrics) {
	      if (s.metrics[name] !== undefined) {
	        throw new Error('DOM metric ' + name + ' is already defined');
	      }
	      s.metrics[name] = { component: component, computator: metrics[name].bind(component) };
	      getters[name] = this.getMetricImpl.bind(null, name);
	    }

	    if (s.components.indexOf(component) === -1) {
	      s.components.push(component);
	    }

	    return getters;
	  },
	  unregisterMetricsFor: function unregisterMetricsFor(component) {
	    var s = this._DOMMetrics;
	    var idx = s.components.indexOf(component);

	    if (idx > -1) {
	      s.components.splice(idx, 1);

	      var name = undefined;
	      var metricsToDelete = {};

	      for (name in s.metrics) {
	        if (s.metrics[name].component === component) {
	          metricsToDelete[name] = true;
	        }
	      }

	      for (name in metricsToDelete) {
	        if (metricsToDelete.hasOwnProperty(name)) {
	          delete s.metrics[name];
	        }
	      }
	    }
	  },
	  updateMetrics: function updateMetrics() {
	    var s = this._DOMMetrics;

	    var needUpdate = false;

	    for (var name in s.metrics) {
	      if (!s.metrics.hasOwnProperty(name)) continue;

	      var newMetric = s.metrics[name].computator();
	      if (newMetric !== s.metrics[name].value) {
	        needUpdate = true;
	      }
	      s.metrics[name].value = newMetric;
	    }

	    if (needUpdate) {
	      for (var i = 0, len = s.components.length; i < len; i++) {
	        if (s.components[i].metricsUpdated) {
	          s.components[i].metricsUpdated();
	        }
	      }
	    }
	  },
	  componentWillMount: function componentWillMount() {
	    this._DOMMetrics = {
	      metrics: {},
	      components: []
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    if (window.addEventListener) {
	      window.addEventListener('resize', this.updateMetrics);
	    } else {
	      window.attachEvent('resize', this.updateMetrics);
	    }
	    this.updateMetrics();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    window.removeEventListener('resize', this.updateMetrics);
	  }
	};

	var MetricsMixin = {

	  contextTypes: contextTypes,

	  componentWillMount: function componentWillMount() {
	    if (this.DOMMetrics) {
	      this._DOMMetricsDefs = shallowCloneObject(this.DOMMetrics);

	      this.DOMMetrics = {};
	      for (var name in this._DOMMetricsDefs) {
	        if (!this._DOMMetricsDefs.hasOwnProperty(name)) continue;

	        this.DOMMetrics[name] = function () {};
	      }
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    if (this.DOMMetrics) {
	      this.DOMMetrics = this.registerMetrics(this._DOMMetricsDefs);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (!this.registerMetricsImpl) {
	      return this.context.metricsComputator.unregisterMetricsFor(this);
	    }
	    if (this.hasOwnProperty('DOMMetrics')) {
	      delete this.DOMMetrics;
	    }
	  },
	  registerMetrics: function registerMetrics(metrics) {
	    if (this.registerMetricsImpl) {
	      return this.registerMetricsImpl(this, metrics);
	    }

	    return this.context.metricsComputator.registerMetricsImpl(this, metrics);
	  },
	  getMetric: function getMetric(name) {
	    if (this.getMetricImpl) {
	      return this.getMetricImpl(name);
	    }

	    return this.context.metricsComputator.getMetricImpl(name);
	  }
	};

	module.exports = {
	  MetricsComputatorMixin: MetricsComputatorMixin,
	  MetricsMixin: MetricsMixin
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  componentDidMount: function componentDidMount() {
	    this._scrollLeft = this.refs.viewport ? this.refs.viewport.getScroll().scrollLeft : 0;
	    this._onScroll();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    this._onScroll();
	  },
	  componentWillMount: function componentWillMount() {
	    this._scrollLeft = undefined;
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this._scrollLeft = undefined;
	  },
	  onScroll: function onScroll(props) {
	    if (this._scrollLeft !== props.scrollLeft) {
	      this._scrollLeft = props.scrollLeft;
	      this._onScroll();
	    }
	  },
	  _onScroll: function _onScroll() {
	    if (this._scrollLeft !== undefined) {
	      this.refs.header.setScrollLeft(this._scrollLeft);
	      if (this.refs.viewport) {
	        this.refs.viewport.setScrollLeft(this._scrollLeft);
	      }
	    }
	  }
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(2);

	var CheckboxEditor = React.createClass({
	  displayName: "CheckboxEditor",


	  PropTypes: {
	    value: React.PropTypes.bool.isRequired,
	    rowIdx: React.PropTypes.number.isRequired,
	    column: React.PropTypes.shape({
	      key: React.PropTypes.string.isRequired,
	      onCellChange: React.PropTypes.func.isRequired
	    }).isRequired
	  },

	  render: function render() {
	    var checked = this.props.value != null ? this.props.value : false;
	    return React.createElement("input", { className: "react-grid-CheckBox", type: "checkbox", checked: checked, onChange: this.handleChange });
	  },
	  handleChange: function handleChange(e) {
	    this.props.column.onCellChange(this.props.rowIdx, this.props.column.key, e);
	  }
	});

	module.exports = CheckboxEditor;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var ExcelColumn = __webpack_require__(15);

	var FilterableHeaderCell = React.createClass({
	  displayName: 'FilterableHeaderCell',


	  propTypes: {
	    onChange: React.PropTypes.func.isRequired,
	    column: React.PropTypes.shape(ExcelColumn)
	  },

	  getInitialState: function getInitialState() {
	    return { filterTerm: '' };
	  },
	  handleChange: function handleChange(e) {
	    var val = e.target.value;
	    this.setState({ filterTerm: val });
	    this.props.onChange({ filterTerm: val, columnKey: this.props.column.key });
	  },


	  renderInput: function renderInput() {
	    if (this.props.column.filterable === false) {
	      return React.createElement('span', null);
	    }

	    var inputKey = 'header-filter-' + this.props.column.key;
	    return React.createElement('input', { key: inputKey, type: 'text', className: 'form-control input-sm', placeholder: 'Search', value: this.state.filterTerm, onChange: this.handleChange });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'form-group' },
	        this.renderInput()
	      )
	    );
	  }
	});

	module.exports = FilterableHeaderCell;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* TODO mixins */

	var ColumnMetrics = __webpack_require__(8);
	var DOMMetrics = __webpack_require__(32);
	Object.assign = __webpack_require__(37);
	var PropTypes = __webpack_require__(2).PropTypes;
	var ColumnUtils = __webpack_require__(10);
	var React = __webpack_require__(2);

	var Column = function Column() {
	  _classCallCheck(this, Column);
	};

	;

	module.exports = {
	  mixins: [DOMMetrics.MetricsMixin],

	  propTypes: {
	    columns: PropTypes.arrayOf(Column),
	    minColumnWidth: PropTypes.number,
	    columnEquality: PropTypes.func
	  },

	  DOMMetrics: {
	    gridWidth: function gridWidth() {
	      return React.findDOMNode(this).offsetWidth - 2;
	    }
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      minColumnWidth: 80,
	      columnEquality: ColumnMetrics.sameColumn
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.columns) {
	      if (!ColumnMetrics.sameColumns(this.props.columns, nextProps.columns, this.props.columnEquality)) {
	        var columnMetrics = this.createColumnMetrics();
	        this.setState({ columnMetrics: columnMetrics });
	      }
	    }
	  },
	  getTotalWidth: function getTotalWidth() {
	    var totalWidth = 0;
	    if (this.props.width) {
	      totalWidth = this.props.width;
	    } else {
	      if (this.isMounted()) {
	        totalWidth = this.DOMMetrics.gridWidth();
	      } else {
	        totalWidth = ColumnUtils.getSize(this.props.columns) * this.props.minColumnWidth;
	      }
	    }
	    return totalWidth;
	  },
	  getColumnMetricsType: function getColumnMetricsType(metrics) {
	    var totalWidth = this.getTotalWidth();
	    var currentMetrics = {
	      columns: metrics.columns,
	      totalWidth: totalWidth,
	      minColumnWidth: metrics.minColumnWidth
	    };
	    var updatedMetrics = ColumnMetrics.recalculate(currentMetrics);
	    return updatedMetrics;
	  },
	  getColumn: function getColumn(columns, idx) {
	    if (Array.isArray(columns)) {
	      return columns[idx];
	    } else if (typeof Immutable !== 'undefined') {
	      return columns.get(idx);
	    }
	  },
	  getSize: function getSize() {
	    var columns = this.state.columnMetrics.columns;
	    if (Array.isArray(columns)) {
	      return columns.length;
	    } else if (typeof Immutable !== 'undefined') {
	      return columns.size;
	    }
	  },
	  metricsUpdated: function metricsUpdated() {
	    var columnMetrics = this.createColumnMetrics();
	    this.setState({ columnMetrics: columnMetrics });
	  },
	  createColumnMetrics: function createColumnMetrics(initialRun) {
	    var gridColumns = this.setupGridColumns();
	    return this.getColumnMetricsType({ columns: gridColumns, minColumnWidth: this.props.minColumnWidth }, initialRun);
	  },
	  onColumnResize: function onColumnResize(index, width) {
	    var columnMetrics = ColumnMetrics.resizeColumn(this.state.columnMetrics, index, width);
	    this.setState({ columnMetrics: columnMetrics });
	  }
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';

	var RowUtils = {
	  get: function get(row, property) {
	    if (typeof row.get === 'function') {
	      return row.get(property);
	    }

	    return row[property];
	  }
	};

	module.exports = RowUtils;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Editors = {
	  AutoComplete: __webpack_require__(40),
	  DropDownEditor: __webpack_require__(42),
	  SimpleTextEditor: __webpack_require__(26),
	  CheckboxEditor: __webpack_require__(34)
	};

	module.exports = Editors;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var ReactAutocomplete = __webpack_require__(41);
	var ExcelColumn = __webpack_require__(15);

	var optionPropType = React.PropTypes.shape({
	  id: React.PropTypes.required,
	  title: React.PropTypes.string
	});

	var AutoCompleteEditor = React.createClass({
	  displayName: 'AutoCompleteEditor',


	  propTypes: {
	    onCommit: React.PropTypes.func.isRequired,
	    options: React.PropTypes.arrayOf(optionPropType).isRequired,
	    label: React.PropTypes.any,
	    value: React.PropTypes.any.isRequired,
	    height: React.PropTypes.number,
	    valueParams: React.PropTypes.arrayOf(React.PropTypes.string),
	    column: React.PropTypes.shape(ExcelColumn).isRequired,
	    resultIdentifier: React.PropTypes.string,
	    search: React.PropTypes.string,
	    onKeyDown: React.PropTypes.func
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      resultIdentifier: 'id'
	    };
	  },
	  handleChange: function handleChange() {
	    this.props.onCommit();
	  },
	  getValue: function getValue() {
	    var value = undefined;
	    var updated = {};
	    if (this.hasResults() && this.isFocusedOnSuggestion()) {
	      value = this.getLabel(this.refs.autoComplete.state.focusedValue);
	      if (this.props.valueParams) {
	        value = this.constuctValueFromParams(this.refs.autoComplete.state.focusedValue, this.props.valueParams);
	      }
	    } else {
	      value = this.refs.autoComplete.state.searchTerm;
	    }

	    updated[this.props.column.key] = value;
	    return updated;
	  },
	  getInputNode: function getInputNode() {
	    return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
	  },
	  getLabel: function getLabel(item) {
	    var label = this.props.label != null ? this.props.label : 'title';
	    if (typeof label === 'function') {
	      return label(item);
	    } else if (typeof label === 'string') {
	      return item[label];
	    }
	  },
	  hasResults: function hasResults() {
	    return this.refs.autoComplete.state.results.length > 0;
	  },
	  isFocusedOnSuggestion: function isFocusedOnSuggestion() {
	    var autoComplete = this.refs.autoComplete;
	    return autoComplete.state.focusedValue != null;
	  },
	  constuctValueFromParams: function constuctValueFromParams(obj, props) {
	    if (!props) {
	      return '';
	    }

	    var ret = [];
	    for (var i = 0, ii = props.length; i < ii; i++) {
	      ret.push(obj[props[i]]);
	    }
	    return ret.join('|');
	  },
	  render: function render() {
	    var label = this.props.label != null ? this.props.label : 'title';
	    return React.createElement(
	      'div',
	      { height: this.props.height, onKeyDown: this.props.onKeyDown },
	      React.createElement(ReactAutocomplete, { search: this.props.search, ref: 'autoComplete', label: label, onChange: this.handleChange, resultIdentifier: this.props.resultIdentifier, options: this.props.options, value: { title: this.props.value } })
	    );
	  }
	});

	module.exports = AutoCompleteEditor;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(2));
		else if(typeof define === 'function' && define.amd)
			define(["react"], factory);
		else if(typeof exports === 'object')
			exports["ReactAutocomplete"] = factory(require("react"));
		else
			root["ReactAutocomplete"] = factory(root["React"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		var React = __webpack_require__(1);
		var joinClasses = __webpack_require__(2);

		var Autocomplete = React.createClass({ displayName: "Autocomplete",

		  propTypes: {
		    options: React.PropTypes.any,
		    search: React.PropTypes.func,
		    resultRenderer: React.PropTypes.oneOfType([React.PropTypes.component, React.PropTypes.func]),
		    value: React.PropTypes.object,
		    onChange: React.PropTypes.func,
		    onError: React.PropTypes.func
		  },

		  getDefaultProps: function () {
		    return { search: searchArray };
		  },

		  getInitialState: function () {
		    var searchTerm = this.props.searchTerm ? this.props.searchTerm : this.props.value ? this.props.value.title : "";
		    return {
		      results: [],
		      showResults: false,
		      showResultsInProgress: false,
		      searchTerm: searchTerm,
		      focusedValue: null
		    };
		  },

		  getResultIdentifier: function (result) {
		    if (this.props.resultIdentifier === undefined) {
		      return result.id;
		    } else {
		      return result[this.props.resultIdentifier];
		    }
		  },


		  render: function () {
		    var className = joinClasses(this.props.className, "react-autocomplete-Autocomplete", this.state.showResults ? "react-autocomplete-Autocomplete--resultsShown" : undefined);
		    var style = {
		      position: "relative",
		      outline: "none"
		    };
		    return React.createElement("div", {
		      tabIndex: "1",
		      className: className,
		      onFocus: this.onFocus,
		      onBlur: this.onBlur,
		      style: style }, React.createElement("input", {
		      ref: "search",
		      className: "react-autocomplete-Autocomplete__search",
		      style: { width: "100%" },
		      onClick: this.showAllResults,
		      onChange: this.onQueryChange,
		      onFocus: this.showAllResults,
		      onBlur: this.onQueryBlur,
		      onKeyDown: this.onQueryKeyDown,
		      value: this.state.searchTerm }), React.createElement(Results, {
		      className: "react-autocomplete-Autocomplete__results",
		      onSelect: this.onValueChange,
		      onFocus: this.onValueFocus,
		      results: this.state.results,
		      focusedValue: this.state.focusedValue,
		      show: this.state.showResults,
		      renderer: this.props.resultRenderer,
		      label: this.props.label,
		      resultIdentifier: this.props.resultIdentifier }));
		  },

		  componentWillReceiveProps: function (nextProps) {
		    var searchTerm = nextProps.searchTerm ? nextProps.searchTerm : nextProps.value ? nextProps.value.title : "";
		    this.setState({ searchTerm: searchTerm });
		  },

		  componentWillMount: function () {
		    this.blurTimer = null;
		  },

		  /**
		    * Show results for a search term value.
		    *
		    * This method doesn't update search term value itself.
		    *
		    * @param {Search} searchTerm
		    */
		  showResults: function (searchTerm) {
		    this.setState({ showResultsInProgress: true });
		    this.props.search(this.props.options, searchTerm.trim(), this.onSearchComplete);
		  },

		  showAllResults: function () {
		    if (!this.state.showResultsInProgress && !this.state.showResults) {
		      this.showResults("");
		    }
		  },

		  onValueChange: function (value) {
		    var state = {
		      value: value,
		      showResults: false
		    };

		    if (value) {
		      state.searchTerm = value.title;
		    }

		    this.setState(state);

		    if (this.props.onChange) {
		      this.props.onChange(value);
		    }
		  },

		  onSearchComplete: function (err, results) {
		    if (err) {
		      if (this.props.onError) {
		        this.props.onError(err);
		      } else {
		        throw err;
		      }
		    }

		    this.setState({
		      showResultsInProgress: false,
		      showResults: true,
		      results: results
		    });
		  },

		  onValueFocus: function (value) {
		    this.setState({ focusedValue: value });
		  },

		  onQueryChange: function (e) {
		    var searchTerm = e.target.value;
		    this.setState({
		      searchTerm: searchTerm,
		      focusedValue: null
		    });
		    this.showResults(searchTerm);
		  },

		  onFocus: function () {
		    if (this.blurTimer) {
		      clearTimeout(this.blurTimer);
		      this.blurTimer = null;
		    }
		    this.refs.search.getDOMNode().focus();
		  },

		  onBlur: function () {
		    // wrap in setTimeout so we can catch a click on results
		    this.blurTimer = setTimeout((function () {
		      if (this.isMounted()) {
		        this.setState({ showResults: false });
		      }
		    }).bind(this), 100);
		  },

		  onQueryKeyDown: function (e) {
		    if (e.key === "Enter") {
		      e.preventDefault();
		      if (this.state.focusedValue) {
		        this.onValueChange(this.state.focusedValue);
		      }
		    } else if (e.key === "ArrowUp" && this.state.showResults) {
		      e.preventDefault();
		      var prevIdx = Math.max(this.focusedValueIndex() - 1, 0);
		      this.setState({
		        focusedValue: this.state.results[prevIdx]
		      });
		    } else if (e.key === "ArrowDown") {
		      e.preventDefault();
		      if (this.state.showResults) {
		        var nextIdx = Math.min(this.focusedValueIndex() + (this.state.showResults ? 1 : 0), this.state.results.length - 1);
		        this.setState({
		          showResults: true,
		          focusedValue: this.state.results[nextIdx]
		        });
		      } else {
		        this.showAllResults();
		      }
		    }
		  },

		  focusedValueIndex: function () {
		    if (!this.state.focusedValue) {
		      return -1;
		    }
		    for (var i = 0, len = this.state.results.length; i < len; i++) {
		      if (this.getResultIdentifier(this.state.results[i]) === this.getResultIdentifier(this.state.focusedValue)) {
		        return i;
		      }
		    }
		    return -1;
		  }
		});

		var Results = React.createClass({ displayName: "Results",

		  getResultIdentifier: function (result) {
		    if (this.props.resultIdentifier === undefined) {
		      if (!result.id) {
		        throw "id property not found on result. You must specify a resultIdentifier and pass as props to autocomplete component";
		      }
		      return result.id;
		    } else {
		      return result[this.props.resultIdentifier];
		    }
		  },

		  render: function () {
		    var style = {
		      display: this.props.show ? "block" : "none",
		      position: "absolute",
		      listStyleType: "none"
		    };
		    var $__0 = this.props,
		        className = $__0.className,
		        props = (function (source, exclusion) {
		      var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {
		        throw new TypeError();
		      }for (var key in source) {
		        if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {
		          rest[key] = source[key];
		        }
		      }return rest;
		    })($__0, { className: 1 });

		    return React.createElement("ul", React.__spread({}, props, { style: style, className: className + " react-autocomplete-Results" }), this.props.results.map(this.renderResult));
		  },

		  renderResult: function (result) {
		    var focused = this.props.focusedValue && this.getResultIdentifier(this.props.focusedValue) === this.getResultIdentifier(result);
		    var Renderer = this.props.renderer || Result;
		    return React.createElement(Renderer, {
		      ref: focused ? "focused" : undefined,
		      key: this.getResultIdentifier(result),
		      result: result,
		      focused: focused,
		      onMouseEnter: this.onMouseEnterResult,
		      onClick: this.props.onSelect,
		      label: this.props.label });
		  },

		  componentDidUpdate: function () {
		    this.scrollToFocused();
		  },

		  componentDidMount: function () {
		    this.scrollToFocused();
		  },

		  componentWillMount: function () {
		    this.ignoreFocus = false;
		  },

		  scrollToFocused: function () {
		    var focused = this.refs && this.refs.focused;
		    if (focused) {
		      var containerNode = this.getDOMNode();
		      var scroll = containerNode.scrollTop;
		      var height = containerNode.offsetHeight;

		      var node = focused.getDOMNode();
		      var top = node.offsetTop;
		      var bottom = top + node.offsetHeight;

		      // we update ignoreFocus to true if we change the scroll position so
		      // the mouseover event triggered because of that won't have an
		      // effect
		      if (top < scroll) {
		        this.ignoreFocus = true;
		        containerNode.scrollTop = top;
		      } else if (bottom - scroll > height) {
		        this.ignoreFocus = true;
		        containerNode.scrollTop = bottom - height;
		      }
		    }
		  },

		  onMouseEnterResult: function (e, result) {
		    // check if we need to prevent the next onFocus event because it was
		    // probably caused by a mouseover due to scroll position change
		    if (this.ignoreFocus) {
		      this.ignoreFocus = false;
		    } else {
		      // we need to make sure focused node is visible
		      // for some reason mouse events fire on visible nodes due to
		      // box-shadow
		      var containerNode = this.getDOMNode();
		      var scroll = containerNode.scrollTop;
		      var height = containerNode.offsetHeight;

		      var node = e.target;
		      var top = node.offsetTop;
		      var bottom = top + node.offsetHeight;

		      if (bottom > scroll && top < scroll + height) {
		        this.props.onFocus(result);
		      }
		    }
		  }
		});

		var Result = React.createClass({ displayName: "Result",

		  getDefaultProps: function () {
		    return {
		      label: function (result) {
		        return result.title;
		      }
		    };
		  },

		  getLabel: function (result) {
		    if (typeof this.props.label === "function") {
		      return this.props.label(result);
		    } else if (typeof this.props.label === "string") {
		      return result[this.props.label];
		    }
		  },

		  render: function () {
		    var className = joinClasses({
		      "react-autocomplete-Result": true,
		      "react-autocomplete-Result--active": this.props.focused
		    });

		    return React.createElement("li", {
		      style: { listStyleType: "none" },
		      className: className,
		      onClick: this.onClick,
		      onMouseEnter: this.onMouseEnter }, React.createElement("a", null, this.getLabel(this.props.result)));
		  },

		  onClick: function () {
		    this.props.onClick(this.props.result);
		  },

		  onMouseEnter: function (e) {
		    if (this.props.onMouseEnter) {
		      this.props.onMouseEnter(e, this.props.result);
		    }
		  },

		  shouldComponentUpdate: function (nextProps) {
		    return nextProps.result.id !== this.props.result.id || nextProps.focused !== this.props.focused;
		  }
		});

		/**
		* Search options using specified search term treating options as an array
		* of candidates.
		*
		* @param {Array.<Object>} options
		* @param {String} searchTerm
		* @param {Callback} cb
		*/
		function searchArray(options, searchTerm, cb) {
		  if (!options) {
		    return cb(null, []);
		  }

		  searchTerm = new RegExp(searchTerm, "i");

		  var results = [];

		  for (var i = 0, len = options.length; i < len; i++) {
		    if (searchTerm.exec(options[i].title)) {
		      results.push(options[i]);
		    }
		  }

		  cb(null, results);
		}

		module.exports = Autocomplete;

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
		  Copyright (c) 2015 Jed Watson.
		  Licensed under the MIT License (MIT), see
		  http://jedwatson.github.io/classnames
		*/

		function classNames() {
			var classes = '';
			var arg;

			for (var i = 0; i < arguments.length; i++) {
				arg = arguments[i];
				if (!arg) {
					continue;
				}

				if ('string' === typeof arg || 'number' === typeof arg) {
					classes += ' ' + arg;
				} else if (Object.prototype.toString.call(arg) === '[object Array]') {
					classes += ' ' + classNames.apply(null, arg);
				} else if ('object' === typeof arg) {
					for (var key in arg) {
						if (!arg.hasOwnProperty(key) || !arg[key]) {
							continue;
						}
						classes += ' ' + key;
					}
				}
			}
			return classes.substr(1);
		}

		// safely export classNames for node / browserify
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		}

		// safely export classNames for RequireJS
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _reactDom = __webpack_require__(5);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);
	var EditorBase = __webpack_require__(27);

	var DropDownEditor = function (_EditorBase) {
	  _inherits(DropDownEditor, _EditorBase);

	  function DropDownEditor() {
	    _classCallCheck(this, DropDownEditor);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DropDownEditor).apply(this, arguments));
	  }

	  _createClass(DropDownEditor, [{
	    key: 'getInputNode',
	    value: function getInputNode() {
	      return _reactDom2.default.findDOMNode(this);
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick() {
	      this.getInputNode().focus();
	    }
	  }, {
	    key: 'onDoubleClick',
	    value: function onDoubleClick() {
	      this.getInputNode().focus();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'select',
	        { style: this.getStyle(), defaultValue: this.props.value, onBlur: this.props.onBlur, onChange: this.onChange },
	        this.renderOptions()
	      );
	    }
	  }, {
	    key: 'renderOptions',
	    value: function renderOptions() {
	      var options = [];
	      this.props.options.forEach(function (name) {
	        options.push(React.createElement(
	          'option',
	          { key: name, value: name },
	          name
	        ));
	      }, this);
	      return options;
	    }
	  }]);

	  return DropDownEditor;
	}(EditorBase);

	DropDownEditor.propTypes = {
	  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	};

	module.exports = DropDownEditor;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// not including this
	// it currently requires the whole of moment, which we dont want to take as a dependency
	var ImageFormatter = __webpack_require__(44);

	var Formatters = {
	  ImageFormatter: ImageFormatter
	};

	module.exports = Formatters;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var PendingPool = {};
	var ReadyPool = {};

	var ImageFormatter = React.createClass({
	  displayName: 'ImageFormatter',

	  propTypes: {
	    value: React.PropTypes.string.isRequired
	  },

	  getInitialState: function getInitialState() {
	    return {
	      ready: false
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this._load(this.props.value);
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.value !== this.props.value) {
	      this.setState({ value: null });
	      this._load(nextProps.value);
	    }
	  },
	  _load: function _load(src) {
	    var imageSrc = src;
	    if (ReadyPool[imageSrc]) {
	      this.setState({ value: imageSrc });
	      return;
	    }

	    if (PendingPool[imageSrc]) {
	      PendingPool[imageSrc].push(this._onLoad);
	      return;
	    }

	    PendingPool[imageSrc] = [this._onLoad];

	    var img = new Image();
	    img.onload = function () {
	      PendingPool[imageSrc].forEach(function (callback) {
	        callback(imageSrc);
	      });
	      delete PendingPool[imageSrc];
	      img.onload = null;
	      imageSrc = undefined;
	    };
	    img.src = imageSrc;
	  },
	  _onLoad: function _onLoad(src) {
	    if (this.isMounted() && src === this.props.value) {
	      this.setState({
	        value: src
	      });
	    }
	  },
	  render: function render() {
	    var style = this.state.value ? { backgroundImage: 'url(' + this.state.value + ')' } : undefined;

	    return React.createElement('div', { className: 'react-grid-image', style: style });
	  }
	});

	module.exports = ImageFormatter;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(2);

	var Toolbar = React.createClass({
	  displayName: "Toolbar",

	  propTypes: {
	    onAddRow: React.PropTypes.func,
	    onToggleFilter: React.PropTypes.func.isRequired,
	    enableFilter: React.PropTypes.bool,
	    numberOfRows: React.PropTypes.number.isRequired
	  },

	  onAddRow: function onAddRow() {
	    if (this.props.onAddRow !== null && this.props.onAddRow instanceof Function) {
	      this.props.onAddRow({ newRowIndex: this.props.numberOfRows });
	    }
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      enableAddRow: true
	    };
	  },
	  renderAddRowButton: function renderAddRowButton() {
	    if (this.props.onAddRow) {
	      return React.createElement(
	        "button",
	        { type: "button", className: "btn", onClick: this.onAddRow },
	        "Add Row"
	      );
	    }
	  },
	  renderToggleFilterButton: function renderToggleFilterButton() {
	    if (this.props.enableFilter) {
	      return React.createElement(
	        "button",
	        { type: "button", className: "btn", onClick: this.props.onToggleFilter },
	        "Filter Rows"
	      );
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "react-grid-Toolbar" },
	      React.createElement(
	        "div",
	        { className: "tools" },
	        this.renderAddRowButton(),
	        this.renderToggleFilterButton()
	      )
	    );
	  }
	});

	module.exports = Toolbar;

/***/ }
/******/ ])
});
;