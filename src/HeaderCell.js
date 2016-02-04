/* TODO@flow unkwon */
/**
 * @jsx React.DOM


 */
"use strict";

var React          = require('react');
var ReactDOM = require('react-dom');
var joinClasses     = require('classnames');
var cloneWithProps = require('react/lib/cloneWithProps');
var PropTypes      = React.PropTypes;
var ExcelColumn    = require('./addons/grids/ExcelColumn');
var ResizeHandle   = require('./ResizeHandle');

class HeaderCell extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.state = {resizing: false};
  }

  onDrag(e: SyntheticMouseEvent) {
    var resize = this.props.onResize || null; //for flows sake, doesnt recognise a null check direct
    if(resize) {
      var width = this.getWidthFromMouseEvent(e);
      if (width > 0) {
        resize(this.props.column, width);
      }
    }
  }

  onDragEnd(e: SyntheticMouseEvent) {
    var width = this.getWidthFromMouseEvent(e);
    this.props.onResizeEnd(this.props.column, width);
    this.setState({resizing: false});
  }

  onDragStart(e: SyntheticMouseEvent) {
    this.setState({resizing: true});
    //need to set dummy data for FF
    if(e && e.dataTransfer && e.dataTransfer.setData) e.dataTransfer.setData('text/plain', 'dummy');
  }

  getCell(): ReactComponent {
    if (React.isValidElement(this.props.renderer)) {
      return cloneWithProps(this.props.renderer, {column : this.props.column});
    } else {
      var Renderer = this.props.renderer;
      return this.props.renderer({column: this.props.column});
    }
  }

  getStyle(): {width:number; left: number; display: string; position: string; overflow: string; height: number; margin: number; textOverflow: string; whiteSpace: string } {
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
  }

  getWidthFromMouseEvent(e: SyntheticMouseEvent): number {
    var right = e.pageX;
    var left = ReactDOM.findDOMNode(this).getBoundingClientRect().left;
    return right - left;
  }

  setScrollLeft(scrollLeft: number) {
    var node = ReactDOM.findDOMNode(this);
    node.style.webkitTransform = `translate3d(${scrollLeft}px, 0px, 0px)`;
    node.style.transform = `translate3d(${scrollLeft}px, 0px, 0px)`;
  }

  render(): ?ReactElement {
    var resizeHandle;
    if(this.props.column.resizable){
      resizeHandle = <ResizeHandle
      onDrag={this.onDrag}
      onDragStart={this.onDragStart}
      onDragEnd={this.onDragEnd}
      />
    }
    var className = joinClasses({
      'react-grid-HeaderCell': true,
      'react-grid-HeaderCell--resizing': this.state.resizing,
      'react-grid-HeaderCell--locked': this.props.column.locked
    });
    className = joinClasses(className, this.props.className);
    var cell = this.getCell();
    return (
      <div className={className} style={this.getStyle()}>
        {cell}
        {{resizeHandle}}
      </div>
    );
  }
}

HeaderCell.defaultProps = {
  renderer: simpleCellRenderer
};

HeaderCell.propTypes = {
  renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  column: PropTypes.shape(ExcelColumn).isRequired,
  onResize: PropTypes.func.isRequired,
  height : PropTypes.number.isRequired,
  onResizeEnd : PropTypes.func.isRequired
};

function simpleCellRenderer(props: {column: {name: string}}): ReactElement {
  return <div className="widget-HeaderCell__value">{props.column.name}</div>;
}

class SimpleCellFormatter extends React.Component {
  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
      return nextProps.value !== this.props.value;
  }

  render(): ?ReactElement {
    return <span>{this.props.value}</span>
  }
}

SimpleCellFormatter.propTypes = {
  value :  React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]).isRequired
};

module.exports = HeaderCell;
