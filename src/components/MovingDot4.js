import React, { Component } from 'react';
import * as d3 from 'd3'
import calcPath from '../utils/golden_ratio_utils'
// golden ratio in x-y coordinates:
// a(t) = (r(t)cos(t), r(t)sin(t))
// if we start at point (1, 0) then t = 0 so:
// a(0) = (1x1, 1x0) = (1, 0)
// after 90 degrees of mvmt, radius is 1.6180

class MovingDot extends Component {
  state = {
    path: {
      hivex:300, hivey:600, 
      sx:300, sy: 600, 
      x:300, y:600,
      tx: null, ty: null,
      // revolutions: 2,
      degrees: 0,
      durAdjust: 1,
      clockwise: false
    }
  }

  componentDidMount() {
    console.log('mounting', window.devicePixelRatio)
    const { height, width } = this.props.configs
    
    const canvas = d3.select('body').append('canvas')
        .attr( 'width', width )
        .attr( 'height', height  )
        .style('border', '1px solid black')
        .style( 'width', `${width}px` )
        .style( 'height', `${height}px` )
      
      // canvas.node().getContext( '2d' ).scale( screenScale, screenScale );
      
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
  draw = ( ctx ) => {
    const { path } = this.state

    const { height, width, pointRad } = this.props.configs

    ctx.save();
    ctx.clearRect( 0, 0, width, height );
 
    ctx.beginPath();
    ctx.arc( path.x, path.y, pointRad, 0, 2*Math.PI, false );
    ctx.closePath();
    ctx.fillStyle = "#cccccc";
    ctx.fill()
  
    ctx.restore();
  }
  

  animate = ( ctx ) => {
    const { path } = this.state
    const { configs } = this.props
    const { duration } = configs
    // store the source position
    const newPath = calcPath(path, configs)

    let timer = d3.timer(( elapsed ) => {
      // compute how far through the animation we are (0 to 1)

      const t = Math.min(1, elapsed / duration * newPath.durAdjust);
      // update point positions (interpolate between source and target)

      path.x = path.sx * (1 - t) + path.tx * t;
      path.y = path.sy * (1 - t) + path.ty * t;

      // update what is drawn on screen
      this.draw( ctx );

      // if this animation is over
      if (t === 1) {
        // stop this timer for this layout and start a new one
        timer.stop();

        // update to use next layout
        this.setState({ path })

        // start animation for next layout
        setTimeout(this.animate, duration, ctx);
      }
    });
  }



}

export default MovingDot;