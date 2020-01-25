import * as d3 from 'd3'
import * as api from './src/api'
// import { URL } from '../url'

const data = {}

const margin = ({top: 20, right: 20, bottom: 30, left: 40})
const height = 500;
const width = 600;

const x = d3.scaleUtc()
.domain(d3.extent(data, d => d.date))
.rangeRound([margin.left, width - margin.right])

const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value)).nice()
    .rangeRound([height - margin.bottom, margin.top])

const color = d3.scaleOrdinal(
      data.conditions === undefined ? data.map(d => d.condition) : data.conditions, 
      data.colors === undefined ? d3.schemeCategory10 : data.colors
    ).unknown("black")

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").append("tspan").text(data.y))

const grid = g => g
  .attr("stroke", "currentColor")
  .attr("stroke-opacity", 0.1)
  .call(g => g.append("g")
    .selectAll("line")
    .data(x.ticks())
    .join("line")
      .attr("x1", d => 0.5 + x(d))
      .attr("x2", d => 0.5 + x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom))
  .call(g => g.append("g")
    .selectAll("line")
    .data(y.ticks())
    .join("line")
      .attr("y1", d => 0.5 + y(d))
      .attr("y2", d => 0.5 + y(d))
      .attr("x1", margin.left)
      .attr("x2", width - margin.right));

const line = d3.line()
    .curve(d3.curveStep)
    .x(d => x(d.date))
    .y(d => y(d.value))

// const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height]);
const svgCanvas = d3.select(this.refs.canvas)
  .append('svg')
    .attr("viewBox", [0, 0, width, height]);

    svgCanvas.append("g")
      .call(xAxis);

      svgCanvas.append("g")
      .call(yAxis);

      svgCanvas.append("g")
      .call(grid);

  // const colorId = DOM.uid("color");

  svgCanvas.append("linearGradient")
      .attr("id", 'lineG')
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("x2", width)
    .selectAll("stop")
    .data(data)
    .join("stop")
      .attr("offset", d => x(d.date) / width)
      .attr("stop-color", d => color(d.condition));

  svgCanvas.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", 'lineG')
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);


