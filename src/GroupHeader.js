'use strict';

var React = require('react');
var joinClasses = require('classnames');

var GroupHeader = React.createClass({

  renderOtherValues(): ?ReactElement {
    return (
      <span className="other-values">
      {Object.keys(this.props.otherValues).map(
        (key) => <span className={key}>{this.props.otherValues[key]}</span>
      )}
      </span>
    );
  },

  render(): ?ReactElement {
    var className = joinClasses(
      'react-grid-GroupHeader',
      'react-grid-GroupHeader--'+this.props.groupName
    );

    var style = {
      overflow: 'hidden'
    };

    return (
      <div className={className} style={style}>
        <span className="group-value">{this.props.groupValue}</span>
        {this.renderOtherValues()}
      </div>
    );
  }

});

module.exports = GroupHeader;
