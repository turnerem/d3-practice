import React, { Component } from 'react';
import * as d3 from 'd3'
import { getX, getY } from '../utils/golden_ratio_utils'
// golden ratio in x-y coordinates:
// a(t) = (r(t)cos(t), r(t)sin(t))
// if we start at point (1, 0) then t = 0 so:
// a(0) = (1x1, 1x0) = (1, 0)
// after 90 degrees of mvmt, radius is 1.6180

class MovingDot extends Component {
  state = {
    height: 800,
    width: 1400,
    startLayouts: [{x: 500, y: 600}],
    // layouts represent the location of each dot. Updated at each transition phase.
    layouts: [{x: 500, y: 600}],
    // once we know the starting point and the degrees, we know the location of the dot (IFF it starts at (1, 0))
    degrees: 5,
    // increment should equal degrees starting value
    degreeIncrement: 5,
    duration: 50,
    // may need to reduce duration for each 5 degree increment as the path gets longer
    multiplier: 1,
    timer: null
  }

  componentDidMount() {
    console.log('mounting')
    const { height, width } = this.state
    
      
      const screenScale = window.devicePixelRatio || 1;
      const canvas = d3.select('body').append('canvas')
        .attr( 'width', width * screenScale)
        .attr( 'height', height * screenScale )
        .style( 'width', `${width}px` )
        .style( 'height', `${height}px` )
      
      canvas.node().getContext( '2d' ).scale( screenScale, screenScale );
      
      const ctx = canvas.node().getContext( '2d' );
      ctx.globalAlpha = 0.8;
      
      this.animate( ctx );

  }

  render() {
    

    return (
      <div ref='movingDots'></div>
    );
  }
  

//draw each point to the canvas as a circle
draw = ( points, ctx ) => {
  const { height, width } = this.state
  ctx.save();
  ctx.clearRect( 0, 0, width, height );
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    const radius = 20;
    ctx.beginPath();
    ctx.arc( point.x, point.y, radius, 0, 2*Math.PI, false );
    ctx.closePath();
    ctx.fillStyle = "#cccccc";
    ctx.fill()
  }

  ctx.restore();
}


animate = ( ctx ) => {
  const { degrees, duration, layouts, startLayouts } = this.state
  console.log(degrees, 'the degrees')
  // store the source position
  const newLayouts = [];
  layouts.forEach(( point, i ) => {
    let newPoint = {};
    newPoint.sx = point.x;
    newPoint.sy = point.y;
    newPoint.x = newPoint.tx = startLayouts[i].x + getX(degrees);
    newPoint.y = newPoint.ty = startLayouts[i].y + getY(degrees);
    newLayouts.push( newPoint );
  });

  let timer = d3.timer(( elapsed ) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, elapsed / duration);
    // update point positions (interpolate between source and target)
    newLayouts.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    this.draw( newLayouts, ctx );

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      timer.stop();

      // update to use next layout
      this.setState((currentState) => {
        const { degrees, degreeIncrement } = currentState;
        return { degrees: degrees + degreeIncrement, layouts: newLayouts }
      })

      // start animation for next layout
      setTimeout(this.animate, this.state.duration, ctx);
    }
  });
 }

}

export default MovingDot;