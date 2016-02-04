/* @flow */
/**

 * @jsx React.DOM


 */
'use strict';

var React          = require('react');
var moment         = require('moment');
var PropTypes = React.PropTypes;

class DateRangeFormatter extends React.Component {
  formatDate(date: Date | moment): string {
    if(moment.isMoment(date)){
      return moment(date).format(this.props.displayFormat);
    }else{
      return moment(date, this.props.inputFormat).format(this.props.displayFormat);
    }
  }

  render(): ?ReactElement {
    var startDate = this.props.value.startDate;
    var endDate = this.props.value.endDate;
    return (<span>{startDate} to {endDate}</span>);
  }
}

DateRangeFormatter.defaultProps = {
  inputFormat : 'YYYY-MM-DD',
  displayFormat : 'YYYY-MM-DD',
  value : {startDate : null, endDate : null}
};

DateRangeFormatter.propTypes = {
  value : PropTypes.shape({
    startDate : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    endDate   : PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }).isRequired,
  inputFormat : PropTypes.string,
  displayFormat : PropTypes.string
};

module.exports = DateRangeFormatter;
