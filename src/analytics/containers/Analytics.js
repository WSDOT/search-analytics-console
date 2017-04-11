import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import { Row, Col } from 'reactstrap'
import { DateRangePicker, SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates';

import TopSearches from '../components/TopSearches'
import ChartCard from '../components/ChartCard'

import { 
  getTopSevenDayReport, 
  getTopThirtyDayReport,
  setDayReportDate, 
  getDayReport, 
  setMultiDayReportDates, 
  getMultiDayReport 
} from '../actions/actions'

class Analytics extends Component {
  
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount() {
    
    if (this.props.dayReportData.report.length === 0){
      this.props.dispatch(getDayReport(this.props.dayReportDate))
    }
    if (this.props.multiDayReportData.report.length === 0){
      this.props.dispatch(getMultiDayReport(
            this.props.multiDayReportStartDate,
            this.props.multiDayReportEndDate))
    }

    if (this.props.topSevenDayReportData.length === 0){
      this.props.dispatch(getTopSevenDayReport())
    }
    
    if (this.props.topThirtyDayReportData.length === 0){
      this.props.dispatch(getTopThirtyDayReport())
    }
  }

  componentWillReceiveProps(nextProps){
    //if we have a new Date, fire action
    if (this.props.dayReportDate !== nextProps.dayReportDate){
      this.props.dispatch(getDayReport(nextProps.dayReportDate))
    }
  }

  handleDailyDateChange(newDate){
    this.props.dispatch(setDayReportDate(newDate)) 
  }

  handleMultiDateChange(startDate, endDate){
    
    if (startDate === null){
      startDate = endDate
    }
    if (endDate === null){
      endDate = startDate
    }
    
    this.props.dispatch(setMultiDayReportDates(startDate, endDate))
 
  }

  render() {
    // Set up day report graph
    const dayReportGraphData = []
    for (let data of this.props.dayReportData.report){
      // sum up the number of terms per hour for graph.
      var sum1 = data.terms.reduce(function(result, term) {
        return result + parseInt(term.count, 10)
      }, 0)
      dayReportGraphData.push(parseInt(sum1, 10))
    }

    const data1 = {
      labels: ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"],
      datasets: [{
        label: "Searches",
        data: dayReportGraphData,
        backgroundColor:'rgba(92, 184, 92, 1)',
        borderColor: 'rgba(92, 184, 92, 0.4)',
        borderWidth: 1
      }]
    }

    var singleDatePicker =
      <div>
        <SingleDatePicker
          date={this.props.dayReportDate}
          focused={this.state.focused} 
          onFocusChange={({ focused }) => this.setState({ focused })}
          numberOfMonths={1}
          hideKeyboardShortcutsPanel={true}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment().subtract(1, 'days'))}
          onDateChange={
            date => { 
              this.handleDailyDateChange(date) 
            }
          }/>
     </div>

    // set up multi day report graph
    const multiDayReportGraphData = []
    const multiDayReportGraphLabels = []

    var totalSearches = 0

    for (let data of this.props.multiDayReportData.report) { 
      multiDayReportGraphLabels.push(moment(data.time, "YYYYMMDD").format("MM/DD/YY"))
      // sum up the number of terms per day for graph.
      var sum2 = data.terms.reduce(function(result, term) {
        return result + parseInt(term.count, 10)
      }, 0)
      multiDayReportGraphData.push(parseInt(sum2, 10))
      totalSearches += sum2
    }

    const data2 = {
      labels: multiDayReportGraphLabels,
      datasets: [{
        label: "Searches",
        data: multiDayReportGraphData,
        backgroundColor:'rgba(92, 184, 92, 1)',
        borderColor: 'rgba(92, 184, 92, 0.4)',
        borderWidth: 1
      }]
    }

    var dateRangePicker =
      <div>
        <DateRangePicker
          startDate={this.props.multiDayReportStartDate}
          endDate={this.props.multiDayReportEndDate}
          numberOfMonths={1}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment().subtract(1, 'days'))}
          hideKeyboardShortcutsPanel={true}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}          
          onDatesChange={
            ({ startDate, endDate }) => {
              this.handleMultiDateChange(startDate, endDate)
            }
          }
          onClose={ (dates) => {
            this.handleMultiDateChange(dates.startDate, dates.endDate)
            this.props.dispatch(getMultiDayReport(
              dates.startDate, dates.endDate))
          }}/>
     </div>

    return (
        <Row>
          <Col xs="12" sm="12" md="7">
            <Row>
              <Col>
                <ChartCard 
                  title="Searches per hour" 
                  chartID="DaySearches" 
                  chartData={data1}
                  termReport={this.props.dayReportData.report}
                  reportIsSampled={this.props.dayReportData.isSampled}
                  isLoading={this.props.isFetchingDayReport}
                  showDatePicker={true} 
                  date={this.props.dayReportDate} 
                  onDateChange={newDate => this.handleDailyDateChange(newDate)}>
                  {singleDatePicker}
                </ChartCard>
              </Col>
            </Row>
            <Row>
              <Col>
                <ChartCard 
                  title={"Searches per day"}
                  subtitle={totalSearches + " total"} 
                  chartID="ThreeMonthSearches" 
                  reportIsSampled={this.props.multiDayReportData.isSampled}
                  termReport={this.props.multiDayReportData.report}
                  chartData={data2} 
                  isLoading={this.props.isFetchingMultiDayReport}
                  showDatePicker={false}>
                  {dateRangePicker}
                </ChartCard>
              </Col>
            </Row>
          </Col>
          <Col xs="12" sm="12" md="5">
            <TopSearches
              firstTabTitle={"7 Days"}
              firstTabData={this.props.topSevenDayReportData}
              secondTabTitle={"30 Days"}
              secondTabData={this.props.topThirtyDayReportData}/>
          </Col>
        </Row>
       );
  }
}

Analytics.propTypes = {
  isFetchingDayReport: PropTypes.bool.isRequired,
  dayReportDate: PropTypes.object.isRequired,
  dayReportData: PropTypes.object.isRequired,
  
  isFetchingMultiDayReport: PropTypes.bool.isRequired,
  multiDayReportStartDate: PropTypes.object.isRequired,
  multiDayReportEndDate: PropTypes.object.isRequired,
  multiDayReportData: PropTypes.object.isRequired,
  
  isFetchingTopSevenDayReport: PropTypes.bool.isRequired,
  topSevenDayReportData: PropTypes.array.isRequired,
  
  isFetchingTopThirtyDayReport: PropTypes.bool.isRequired,
  topThirtyDayReportData: PropTypes.array.isRequired
}

function mapStateToProps(state) {

  const { 
    isFetchingDayReport, 
    dayReportDate,
    dayReportData, 
    
    isFetchingMultiDayReport ,
    multiDayReportStartDate,
    multiDayReportEndDate,
    multiDayReportData, 
    
    isFetchingTopSevenDayReport,
    topSevenDayReportData,
    
    isFetchingTopThirtyDayReport,
    topThirtyDayReportData
  } = state.analytics
  
  return {
    isFetchingDayReport,
    dayReportDate,
    dayReportData,
    
    isFetchingMultiDayReport,
    multiDayReportStartDate,
    multiDayReportEndDate,
    multiDayReportData,
    
    isFetchingTopSevenDayReport,
    topSevenDayReportData,
    
    isFetchingTopThirtyDayReport,
    topThirtyDayReportData
  }
}

export default connect(mapStateToProps)(Analytics)
