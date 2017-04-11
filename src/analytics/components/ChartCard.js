import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardSubtitle, Progress } from 'reactstrap'
import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment'

import BarChart from './BarChart'
import SearchTermListModal from './SearchTermListModal'

class ChartCard  extends Component {

  constructor(props){
    super(props)
    const initDate = moment().subtract(1, 'days')
    this.state = {
      date: initDate,
      showingModal: false,
      modalHeader: "",
      modalData: {
        hour: "0",
        terms: []
      }
    }
    this.handleCloseModal = this.handleCloseModal.bind(this)   
    this.handleChartClick = this.handleChartClick.bind(this)   
  }

  handleChartClick(index, label){
    this.setState({
      showingModal: true,
      modalHeader: label,
      modalData: this.props.termReport[index],
    })  
  }

  handleCloseModal(){
    this.setState({
      showingModal: false,
      modalData: {
        hour: "0",
        terms: []
      }
    })
  }
  
  render() {
 
    if (this.props.isLoading) {
      var progress = 
        
        <div style={{position: 'absolute', width:'60%', left: '20%', top: '50%'}}>
          {progress}   
          <Progress animated color="info" value={100} />
        </div>    
    }

    if (this.props.reportIsSampled) {
      var alert =
        <div style={{fontSize: 12}}>
          *This report was created using <a target="_blank" href="https://support.google.com/analytics/answer/2637192?hl=en"><u>sampled</u></a> data.
        </div>
    }


    return(
      <Card block style={{margin: 10}}>
        <SearchTermListModal
          size={"sm"}
          isOpen={this.state.showingModal}
          header={this.state.modalHeader}
          data={this.state.modalData}
          onClose={this.handleCloseModal} />
        <CardTitle>
          {this.props.title}
        </CardTitle>
        <CardSubtitle>{this.props.subtitle}</CardSubtitle>
        {this.props.children}
        {progress}   
        <BarChart 
          chartID={this.props.chartID} 
          data={this.props.chartData} 
          onChartClick={this.handleChartClick}/>
        {alert}    
       
      </Card>
    )
  }
}

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  chartID: PropTypes.string.isRequired,
  chartData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  termReport: PropTypes.array.isRequired
}

export default ChartCard
