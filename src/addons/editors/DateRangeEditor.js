
/**
 * @jsx React.DOM


 */
'use strict';

var React                   = require('react');
var ReactDOM = require('react-dom');
var DateRangeFilter         = require('./widgets/DateRangeFilter');
var Moment                  = require('moment');

type DateRangeValue = { startDate: Date; endDate: Date};

var DateRangeEditor = React.createClass({

  getDefaultProps(): {format: string; ranges: Array<Date>}{
    return {
      format   : "YYYY-MM-DD",
      ranges   : []
    }
  },

  PropTypes : {
    format : React.PropTypes.string,
    ranges : React.PropTypes.arrayOf(React.PropTypes.string),
    value : React.PropTypes.shape({
      startDate: React.PropTypes.Date.isRequired,
      endDate: React.PropTypes.Date.isRequired
    }).isRequired
  },

  handleDateFilterApply(startDate: string, endDate: string){
    this.commit({value : {startDate : startDate, endDate : endDate}});
  },

  isDateValid(date: Date): boolean{
    return Moment(date, this.props.format, true).isValid();
  },

  overrides : {
      checkFocus : function(){
          this.setTextInputFocus();
      },
      getInputNode(): HTMLElement{
        return ReactDOM.findDOMNode(this.refs.datepicker);
      },
      getValue(): DateRangeValue{
        var dateToParse = this.getInputNode().value;
        var dateRanges = dateToParse.split(this.rangeSeparatorChar);
        if(dateRanges.length !== 2){
          throw ("DateRangeEditor.getValue error : " + dateToParse + " is not in the correct format");
        }
        return {startDate : dateRanges[0].trim(), endDate : dateRanges[1].trim()}
      }
  },

  rangeSeparatorChar : ' - ',

  validate(value: DateRangeValue): boolean{
    return this.isDateValid(value.startDate)
    && this.isDateValid(value.endDate)
    && (Moment(value.startDate, this.props.format).isBefore(value.endDate)
    || Moment(value.startDate, this.props.format).isSame(value.endDate));
  },

  render(): ?ReactElement{
    return (
      <div style={this.getStyle()} onKeyDown={this.onKeyDown}>
        <DateRangeFilter ref="datepicker" onApply={this.handleDateFilterApply}  format={this.props.format} ranges={this.props.ranges} startDate={this.props.value.startDate} endDate={this.props.value.endDate} />
      </div>
    );
  }

});

module.exports = DateRangeEditor;
