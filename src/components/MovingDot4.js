import React, { Component } from 'react';
import * as d3 from 'd3'
const { 
  toRadians, 
  getRadius, 
  findHitLoc, 
  distBwPts
} = require('../utils/golden_ratio_utils')
// golden ratio in x-y coordinates:
// a(t) = (r(t)cos(t), r(t)sin(t))
// if we start at point (1, 0) then t = 0 so:
// a(0) = (1x1, 1x0) = (1, 0)
// after 90 degrees of mvmt, radius is 1.6180


// only dealing with one anticlockwise bee right now. And not adjusting time based on dist to be travelled
class MovingDot extends Component {
  state = {
    path: {
      hivex:300, hivey:600, 
      hiveOrientation: {x: 1, y: 1},
      sx:300, sy: 600, 
      x:300, y:600,
      tx: 300, ty: 600,
      // revolutions: 2,
      degrees: 1080,
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
    const { duration } = this.props.configs
    // store the source position
    // console.log('old path in animate', path)
    this.updatePath()

    const { path } = this.state
    // console.log('new path in animate', newPath)

    let timer = d3.timer(( elapsed ) => {
      // compute how far through the animation we are (0 to 1)

      const t = Math.min(1, elapsed / duration);
      // update point positions (interpolate between source and target)

      path.x = path.sx * (1 - t) + path.tx * t;
      path.y = path.sy * (1 - t) + path.ty * t;

      // update what is drawn on screen
      this.draw( ctx );

      // if this animation is over
      if (t === 1) {
        // stop this timer for this layout and start a new one
        timer.stop();
        // start animation for next layout
        setTimeout(this.animate, duration, ctx);
      }
    });
  }


  // methods for calculating path

  // vanilla: not accounting for bouncing off edge.
  // end point of last path becomes beginning of new path
  // increment degrees to represent degrees for destination x y
  // find destination x, y with these new degrees
  updatePath = () => {
    const { degreeIncrement, pointRad, width, height } = this.props.configs
    console.log('pointRad', pointRad)

    this.setState(({path}) => {
      console.log('in setState of updatePath')
      const { hivex, hivey } = path
      console.log('path to spread', path)
      const newPath = {...path}
      newPath.sx = path.tx;
      newPath.sy = path.ty;

      // before updating object any further, see if the would-be updates lead dot outside plot bounary
      const tryDegrees = path.degrees + degreeIncrement
      // newPath.durAdjust = 1
      const radiansTravelled = toRadians(tryDegrees),
       radius = getRadius(tryDegrees),
       tryTx = hivex + Math.cos(radiansTravelled) * radius * path.hiveOrientation.x,
       tryTy = hivey + Math.sin(radiansTravelled) * radius * path.hiveOrientation.y;

      if (tryTx >= pointRad && tryTx <= width - pointRad &&
        tryTy >= pointRad && tryTy <= height - pointRad) {
          newPath.degrees = tryDegrees
          newPath.tx = tryTx
          newPath.ty = tryTy

          return { path: newPath }
        } else {
          console.log('HIT EDGE')
          // check whether destination of new path strays outside boundary
          let hitX
          let hitY
          let hitAxis

          if (tryTx <= pointRad) {
            hitAxis = 'y'
            hitX = pointRad
            hitY = findHitLoc(hitAxis, hitX, newPath.sx, newPath.sy, tryTx, tryTy)

          } else if (tryTx >= width - pointRad) {
            hitAxis = 'y'
            hitX = width - pointRad
            hitY = findHitLoc(hitAxis, hitX, newPath.sx, newPath.sy, tryTx, tryTy)
          } else if (tryTy <= pointRad) {
            hitAxis = 'x'
            hitY = pointRad
            hitX = findHitLoc(hitAxis, hitY, newPath.sx, newPath.sy, tryTx, tryTy)
          } else if (tryTy >= height - pointRad) {
            hitAxis = 'x'
            hitY = height - pointRad
            hitX = findHitLoc(hitAxis, hitY, newPath.sx, newPath.sy, tryTx, tryTy)
          }

          newPath.tx = hitX
          newPath.ty = hitY

          console.log('hitX, hitY', hitX, hitY)

          // adjust degree increment - won't be adding on full degreeIncrement
          this.adjustDegreesToT(newPath, hitX, hitY, tryTx, tryTy)
          // getNewHive only works if newPath tx and ty have been updated to hitX and hitY
          // new hive is used in calculation of NEXT path, not adjustment of current path
          this.getNewHive(newPath, hitAxis)
          return { path: newPath }

        }
      
    })

  }

  // adjustDegreesToT and getNewHive are used within a set state, so we pass them the currentState path rather than take it off props.
  // We nevertheless define them within MovingDot because they are methods that mutate the path that's passed into them

  adjustDegreesToT = (path, correctedX, correctedY, triedX, triedY) => {
    const { degreeIncrement } = this.props.configs
    const { sx, sy, degrees } = path
    const origDist = distBwPts(sx, sy, triedX, triedY)
    const adjustedDist = distBwPts(sx, sy, correctedX, correctedY)
    console.log('adjustedDist', adjustedDist, 'always less than origDist', origDist, '??')

    const distRatio = adjustedDist / origDist
    const newDegreeIncrement = degreeIncrement * distRatio
    
    // const newDegrees = (clockwise) ? (degrees + degreeCompensation) : (degrees - degreeCompensation)
    path.degrees = degrees + newDegreeIncrement
  
    return { path }
  
  }
  
  // can I update object with +=, *=?
  getNewHive = (path, hitAxis) => {
    // if point hits y-axis, then update hivey
    // note that this will only work if destination points have already been updated - we make use of tx/ty
    path[`hive${hitAxis}`] += path[`t${hitAxis}`] - path[`hive${hitAxis}`]
    // if hit y-axis, must get reflection along x-axis of hive orientation,
    // (which means changing y-part of hive orientation(??))
    path.hiveOrientation[hitAxis] *= -1
  }


  
}

export default MovingDot;