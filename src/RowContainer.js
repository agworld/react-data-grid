/* @flow  */
/**
 * @jsx React.DOM


 */
'use strict';

var React = require('react');


var RowContainer = React.createClass({

  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    renderer: React.PropTypes.func.isRequired
  },

  render(): ?ReactElement {
    return (
        <div style={{height: this.props.height, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, width: this.props.width}}>
            {this.props.renderer}
          </div>
        </div>
    );
  }
});

module.exports = RowContainer;
