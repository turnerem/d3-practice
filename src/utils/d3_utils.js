const d3 = require('d3')
const mouseD3 = {}

mouseD3.hoverOver = function(d, i, highlightCol = '#00ff00') {
  d3.select(this).attr('color', highlightCol)
}

mouseD3.unHoverOver = function(d, i, baseCol) {
  d3.select(this).attr('color', baseCol)
}

export default mouseD3