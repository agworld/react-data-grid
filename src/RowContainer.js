/* @flow  */
/**
 * @jsx React.DOM


 */
'use strict';

var React = require('react');


class RowContainer extends React.Component {
  render(): ?ReactElement {
    return (
        <div style={{height: this.props.height, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, width: this.props.width}}>
            {this.props.renderer}
          </div>
        </div>
    );
  }
}

RowContainer.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  renderer: React.PropTypes.func.isRequired
};

module.exports = RowContainer;
