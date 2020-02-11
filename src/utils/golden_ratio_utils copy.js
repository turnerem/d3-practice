
const bee = {}

bee.distBwPts = (x1, y1, x2, y2) => {
  const distSquared = Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)
  return Math.pow(distSquared, 1/2)
}

bee.toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

bee.getRadius = (degrees) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.pow(phi, (degrees / 90));
}

bee.updatePath = ( oldPath, configs ) => {
  const { degrees, hivex, hivey, tx, ty } = oldPath
  const { degreeIncrement } = configs
  const newPath = {...oldPath};
  newPath.sx = tx;
  newPath.sy = ty;
  newPath.degrees += degreeIncrement
  newPath.durAdjust = 1

  const radiansTravelled = this.toRadians(degrees);
  const radius = this.getRadius(degrees);
  newPath.tx = hivex + Math.cos(radiansTravelled) * radius
  newPath.ty = hivey + Math.sin(radiansTravelled) * radius
  console.log('newPath', newPath)
  return newPath
}

  
bee.mirrorOrigin = (hitAxis, path) => {
  const otherAxis = (hitAxis === 'y') ? 'x' : 'y'
  return {
    [`hive${hitAxis}`] : path[`t${hitAxis}`] + (path[`t${hitAxis}`] - path[`hive${hitAxis}`]),
    [`hive${otherAxis}`] : path[`hive${otherAxis}`]
  }
}

bee.calcPath = (oldPath, configs) => {
  const { height, width, pointRad, degreeIncrement } = configs
  // const { degrees, hivex, hivey, durationMultiplier } = oldPath
  console.log('old path', oldPath)
  const newPath = this.updatePath( oldPath, configs )

  if (newPath.tx >= pointRad && 
    newPath.tx <= width - pointRad &&
    newPath.ty >= pointRad && 
    newPath.ty <= height - pointRad) {
      return newPath
  } else {
    let newT
    let hitAxis
    if (newPath.tx <= pointRad) { // case where hitting x-boundary
      hitAxis = 'x'
      newT = this.findHitLoc(hitAxis, 0, newPath, pointRad)
    } else if (newPath.tx >= width - pointRad) {
      hitAxis = 'x'
      newT = this.findHitLoc(hitAxis, width, newPath, pointRad)
    } else if (newPath.ty <= pointRad) { // cases where hitting y-boundary
      hitAxis = 'y'
      newT = this.findHitLoc(hitAxis, 0, newPath, pointRad)
    } else if (newPath.ty >= height - pointRad) {
      hitAxis = 'y'
      newT = this.findHitLoc(hitAxis, height, newPath, pointRad)
    }
    newPath.tx = newT.tx
    newPath.ty = newT.ty

    const {newDegrees, newDurAdjust } = this.adjustDegreesToT(newPath, newT, degreeIncrement)
    newPath.degrees = newDegrees
    newPath.durAdjust = newDurAdjust
    
    const newHive = this.mirrorOrigin(hitAxis, newPath)
    newPath.hivex = newHive.hivex
    newPath.hivey = newHive.hivey

    return newPath
    
  }
}

bee.findHitLoc = (hitAxis, boundaryLoc, path, pointRad) => {
  const { sx, sy, tx, ty } = path
  const m = (ty - sy) / (tx - sx)
  if (hitAxis === 'x') {
    const y = m * (boundaryLoc - sx) + sy
    return (boundaryLoc === 0) ? { tx: pointRad, ty: y } : { tx: boundaryLoc - pointRad, ty: y }
  } else {
    const x = (boundaryLoc - sy) / m + sx
    return (boundaryLoc === 0) ? { tx: x, ty: pointRad } : { tx: x, ty: boundaryLoc - pointRad }
  }
}

bee.adjustDegreesToT = (intendedPath, newT, degreeIncrement) => {
  const { sx, sy, tx, ty, degrees, clockwise } = intendedPath
  const origDist = this.distBwPts(sx, sy, tx, ty)
  const adjustedDist = this.distBwPts(sx, sy, newT.tx, newT.ty)
  const distRatio = adjustedDist / origDist
  const newDegreeInc = degreeIncrement * distRatio

  const newDegrees = (clockwise) ? (degrees - (degreeIncrement - newDegreeInc) + 360) % 360 : (degrees + (degreeIncrement - newDegreeInc)) % 360
  return { newDegrees, newDurAdjust: distRatio }
}




bee.newPath = (hitAxis, oldPath) => {
  const newPath = { ...oldPath }
  // sy: start, ty: end, y: current location
  // a-axis is the hit axis, b-axis is the other axis
  const otherAxis = (hitAxis === 'y') ? 'x': 'y'

  const b = otherAxis
  const sa = `s${hitAxis}`
  const sb = `s${otherAxis}`
  const ta = `t${hitAxis}`
  const tb = `t${otherAxis}`

  const saNew = oldPath[ta]
  const taNew = oldPath[sa]
  const tbNew = oldPath[b] + (oldPath[b] - oldPath[sb])
  const sbNew = oldPath[b] - (oldPath[tb] - oldPath[b])

  if (hitAxis === 'y') {
    newPath.sx = sbNew
    newPath.sy = saNew
    newPath.tx = tbNew
    newPath.ty = taNew
  } else {
    newPath.sx = saNew
    newPath.sy = sbNew
    newPath.tx = taNew
    newPath.ty = tbNew
  }

  return newPath
}

bee.isAtEdge = (hitAxis, point, pointRad, heightOrWidth, screenScale = 1) => {
  // hitAxis: 'x' or 'y'
  // point: {x: 3, y: 54}
  // pointRad: radius of the point (in pixels or proportion of chart height/width (no sure which))
  // heightOrWidth: height fot y and width for x
  // screenScale: at some stage rescale? Or rescale at earlier stage: rescaling factored in before height/width calculated?
  return (
    (point[hitAxis] - pointRad <= 5) | 
    (point[hitAxis] + pointRad >= (heightOrWidth - 5))
    ) ? true : false
  }


// module.exports = bee
export default bee