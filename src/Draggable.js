/* @flow need   */
/**
 * @jsx React.DOM


 */
'use strict';

var React         = require('react');
var PropTypes     = React.PropTypes;
var emptyFunction = require('react/lib/emptyFunction');

class Draggable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.state = {
      drag: null
    };
  }

  componentWillUnmount() {
    this.cleanUp();
  }

  onMouseDown(e: SyntheticMouseEvent) {
    var drag = this.props.onDragStart(e);

    if (drag === null && e.button !== 0) {
      return;
    }

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    this.setState({drag});
  }

  onMouseMove(e: SyntheticEvent) {
    if (this.state.drag === null) {
      return;
    }

    if (e.preventDefault) {
      e.preventDefault();
    }

    this.props.onDrag(e);
  }

  onMouseUp(e: SyntheticEvent) {
    this.cleanUp();
    this.props.onDragEnd(e, this.state.drag);
    this.setState({drag: null});
  }

  cleanUp() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  render(): ?ReactElement {
    var Component = this.props.component;
    return (
      <div {...this.props}
        onMouseDown={this.onMouseDown}
        className='react-grid-HeaderCell__draggable' />
    );
  }
}

Draggable.defaultProps = {
  onDragStart: emptyFunction.thatReturnsTrue,
  onDragEnd: emptyFunction,
  onDrag: emptyFunction
};

Draggable.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDrag: PropTypes.func,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.constructor])
};

module.exports = Draggable;
