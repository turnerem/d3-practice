import React, { Component } from 'react';
import * as d3 from 'd3'
import { data } from './coordinates-exotic'

class MovingDot extends Component {
  state = {
    layouts: [],
    height: 800,
    width: 1400,
    duration: 5000,
    timer: null,
    currLayout: 1,
    currEase: 0
  }

  componentDidMount() {
    console.log('mounting')
    const { height, width } = this.state
    
      const layouts = [];
      Object.keys( data ).forEach( key => {
        let layout = [];
        data[ key ].forEach( point => {
          layout.push({
            x: point[0],
            y: point[1]
          });
        });
        layouts.push( layout );
      });
      console.log('setting state', layouts)
      this.setState({ layouts })
      
      const screenScale = window.devicePixelRatio || 1;
      const canvas = d3.select('body').append('canvas')
        .attr( 'width', width * screenScale)
        .attr( 'height', height * screenScale )
        .style( 'width', `${width}px` )
        .style( 'height', `${height}px` )
      
      canvas.node().getContext( '2d' ).scale( screenScale, screenScale );
      
      const ctx = canvas.node().getContext( '2d' );
      ctx.globalAlpha = 0.8;
      
      this.animate( layouts[0], layouts[1], layouts, ctx );

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
    const radius = 2;
    ctx.beginPath();
    ctx.arc( point.x, point.y, radius, 0, 2*Math.PI, false );
    ctx.closePath();
    ctx.fillStyle = "#cccccc";
    ctx.fill()
  }

  ctx.restore();
}


animate = ( oldPoints, newPoints, layouts, ctx ) => {
  const { duration, currEase } = this.state
  // store the source position
  const points = [];
  const shuffledNewPoints = d3.shuffle( newPoints );
  oldPoints.forEach(( point, i ) => {
    let newPoint = {};
    newPoint.sx = point.x;
    newPoint.sy = point.y;
    newPoint.x = newPoint.tx = shuffledNewPoints[i].x;
    newPoint.y = newPoint.ty = shuffledNewPoints[i].y;
    points.push( newPoint );
  });

  let eases = [d3.easeCubic ]
  let ease = eases[ currEase ];

  let timer = d3.timer(( elapsed ) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease( elapsed / duration ));
    // update point positions (interpolate between source and target)
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    this.draw( points, ctx );

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      timer.stop();

      // update to use next layout
      this.setState((currentState) => {
        const { currLayout, currEase } = currentState;
        return { currLayout: (currLayout + 1) % layouts.length, currEase: (currEase + 1) % eases.length }
      })

      // start animation for next layout
      const { currLayout } = this.state
      setTimeout(this.animate, 1500, points, layouts[currLayout], layouts , ctx);
    }
  });
 }

}

export default MovingDot;