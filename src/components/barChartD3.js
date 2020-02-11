const d3 = require('d3')
const barChartD3 = {};

barChartD3.create = function(el, data, configs) {
  console.log('creating', configs.height, configs.width)
  

  const svg = d3.select(el).append('svg')
    .attr('class', 'd3').attr('width', configs.width)
    .attr('height', configs.height + configs.margin.bottom)
    .style('border', '1px solid black')

  svg.append('g')
    .attr('class', 'd3-bars')

  this.initialise(el, data, configs)
}

// http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// scaling points - for window resizing... deal with later
// var pointScale = d3.scalePoint()
// 	.domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
// 	.range([0, 600]);
// barChartD3._scales = function(data, classSize) {
//   // scale col width and height based on [canvas size relative to screen size] and number of cols and a guess at max col height...
//   return {x: 10, y: 10}
// }
// scaling: based on document.getElementById('bar_chart').offsetWidth (offsetWidth universal? check fe-nc-news scrolling)
// also: number of question responses
// also: number of people in room (maybe... think about this)

barChartD3._scales = function(labels, configs) {
  const { height, nAttendees } = configs
  return {
    y: height * .95 / nAttendees,
    // determine transform for rotating text based on pixel size
  }
}

barChartD3.initialise = function(el, data, configs) {
  console.log('initialising')
  this._drawBars(el, data, configs)
}

barChartD3.update = function(el, data, configs) {
  const scales = this._scales({}, configs)
  console.log('updating')
  this._updateBars(el, data, configs, scales)
}

barChartD3.destroy = function(el) {
  // anything to clean up?
  // https://stackoverflow.com/questions/11091865/how-does-dom-node-cleanup-work-in-d3
  // if the same data is displayed both before and after the update, then you may not need to recompute all of its attributes
}



// data: x labels must be unique (and orderable?)
barChartD3._drawBars = function(el, data, configs) {
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([ 0, configs.width ])
    .padding(0.2)

  d3.select(el).selectAll('.d3-bars')
    .append('g')
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + configs.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    .attr("transform", "translate(0,0)")
    // .style("text-anchor", "end")
    // .style("text-align", "center")
    // .style('border', '1px solid black');

  const g = d3.select(el).selectAll('.d3-bars')

  const bars = g.selectAll('.bar')
  // each point should have an id
    .data(data, function(d) { return d.id })

  bars.enter().append('rect')
  .attr('class', 'bar')
      .attr('x', function(d) {console.log('initialising rect'); return x(d.label)})
      .attr('width', x.bandwidth)
      .attr('y', function(d) { return configs.height})
      .attr('height', function(d) { return 0 })
      .attr('fill', '#cdc6ff')
     
}

barChartD3._updateBars = function(configs, scales) {
  
    d3.selectAll('.d3-bars rect').transition()
      .duration(1000)
      .attr('y', function(d) {console.log('starting transition'); return configs.height - d.y })
      .attr('height', function(d) { return scales.y * d.y })
      .attr('fill', '#ffb347')
      .delay((d, i) => {return i * 30})

}

export default barChartD3