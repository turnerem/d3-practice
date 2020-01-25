import React, { Component } from 'react';
import * as d3 from 'd3';

class TempDataChart extends Component {
  state = {
    temperatureData: [ 8, 5, 13, 9, 12 ]
  } 
     
  render() {
    const { temperatureData } = this.state;
    d3.select(this.refs.temperatures)
          .selectAll("h2")
          .data(temperatureData)
          .enter()
              .append("h2")
              .text((datapoint) => datapoint + " degrees")
    return (
      <div ref='temperatures'></div>
    );
  }
}

export default TempDataChart;