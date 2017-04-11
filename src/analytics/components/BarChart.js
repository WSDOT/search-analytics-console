import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

class BarChart extends Component {

  constructor(props){
    super(props)
    this.drawGraph = this.drawGraph.bind(this)
    Chart.defaults.global.animation.duration = 0  
  }
  
  drawGraph(){
    var ctx = document.getElementById(this.props.chartID);
    
    if (this.chart){
      this.chart.destroy()
    }
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.props.data,
        options: {

          legend: {
            display: false
          },
          scales: {
            xAxes: [{       
              gridLines: {
                display: false
              }
            }],
            yAxes: [{       
              gridLines: {
                display: false
              }
            }]
          }
      }
    })

    const onChartClick = this.props.onChartClick  
    const chart = this.chart
      
    ctx.onclick = function(e){
      var activePoints = chart.getElementsAtEvent(e)
      if (activePoints[0] !== undefined) {
        console.log(activePoints[0]._index)
        console.log(chart.config.data)
        onChartClick(activePoints[0]._index, chart.config.data.labels[activePoints[0]._index])
      }
    }
  }

  componentDidUpdate() {
    this.drawGraph()
  }

  componentDidMount() {
    this.drawGraph()
  }

  render() {
    return(
        <canvas id={this.props.chartID} style={{marginTop: 20}}></canvas>  
        )
  }
}

BarChart.propTypes = {
  chartID: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
}

export default BarChart
