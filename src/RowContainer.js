/* @flow  */
/**
 * @jsx React.DOM


 */
'use strict';

var React = require('react');


function RowContainer(props) {
  return (
      <div style={{height: props.height, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, width: props.width}}>
          {props.renderer}
        </div>
      </div>
  );
}

RowContainer.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  renderer: React.PropTypes.func.isRequired
};

module.exports = RowContainer;
