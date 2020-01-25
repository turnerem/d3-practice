import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        const data = [ 2, 4, 2, 6, 8 ]
        
        this.drawBarChart(data)
    }
    render() { 
        return <div ref="canvas5"></div> 
    }
    drawBarChart(data)  {
        
        const margin = {top: 10, right: 30, bottom: 90, left: 40},
        width = 480 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
        
            const scale = 20
            const svgTopics = d3.select(this.refs.canvas5)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .style('border', '1px solid black')
                // .append('g')
                // .attr('transform', 'translate(' + margin.left + ', ', + margin.top + ')')
            
            // x-axis
            // const x = d3.scaleBand()
            //   .range([0, width])
            //   .domain(data.map(d => {return d.xLabels}))
            //   .padding(0.2)



            svgTopics.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                    .attr('x', (d, iteration) => iteration * 20)
                    .attr('width', 20)
                    .attr('fill', 'orange')
                    .attr('height', (d) => 0)
                    .attr('y', (d) => 0)

            svgTopics.selectAll('rect')
              .transition()
              .duration(800)
              .attr('y', (d) => height - d * scale)
              .attr('height', (d) => height * scale)
              .delay((d, i) => {console.log(i); return i * 100})
                }
}
export default BarChart