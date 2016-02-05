const React                   = require('react');

const CheckboxEditor = React.createClass({

  PropTypes : {
    value : React.PropTypes.bool.isRequired,
    rowIdx : React.PropTypes.number.isRequired,
    column: React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      onCellChange: React.PropTypes.func.isRequired
    }).isRequired
  },

  render(): ? ReactElement {
    var checked = this.props.value != null ? this.props.value : false;
    return (<input className="react-grid-CheckBox" type="checkbox" checked={checked} onChange={this.handleChange} />);
  },

  handleChange(e: Event){
    this.props.column.onCellChange(this.props.rowIdx, this.props.column.key, e);
  }
});

module.exports = CheckboxEditor;
