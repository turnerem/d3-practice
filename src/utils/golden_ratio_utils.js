
// golden_ratio_utils.js:50 finding hit location
// golden_ratio_utils.js:63 anjuting degrees to t
// golden_ratio_utils.js:40 calculating mirror origin
// golden_ratio_utils.js:15 the radius 358.338425266808

const distBwPts = (x1, y1, x2, y2) => {
  const distSquared = Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)
  return Math.pow(distSquared, 1/2)
}

const toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

const getRadius = (degrees) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  console.log('the radius', Math.pow(phi, (degrees / 90)))
  return Math.pow(phi, (degrees / 90));
}

const updatePath = ( oldPath, configs ) => {
  // console.log('updating')
  const { degrees, hivex, hivey, tx, ty } = oldPath
  const { degreeIncrement } = configs
  const newPath = {...oldPath};
  newPath.sx = tx;
  newPath.sy = ty;
  newPath.degrees += degreeIncrement
  newPath.durAdjust = 1

  const radiansTravelled = toRadians(degrees);
  const radius = getRadius(degrees);
  newPath.tx = hivex + Math.cos(radiansTravelled) * radius
  newPath.ty = hivey + Math.sin(radiansTravelled) * radius
  // console.log('newPath', newPath)

  return newPath
}

  
const mirrorOrigin = (hitAxis, path) => {
  console.log('calculating mirror origin')
  const otherAxis = (hitAxis === 'y') ? 'x' : 'y'
  console.log('original hive', {hivex:path.hivex, hivey:path.hivey})
  console.log('new hive', {[`hive${hitAxis}`] : path[`t${hitAxis}`] + (path[`t${hitAxis}`] - path[`hive${hitAxis}`]),
  [`hive${otherAxis}`] : path[`hive${otherAxis}`]})
  return {
    [`hive${hitAxis}`] : path[`t${hitAxis}`] + (path[`t${hitAxis}`] - path[`hive${hitAxis}`]),
    [`hive${otherAxis}`] : path[`hive${otherAxis}`]
  }
}

const mirrorDegrees = (hitAxis, path) => {
  const degreesBasic = path.degrees % 360
  const quadrant = Math.ceil(degreesBasic / 90)
  const remainder = degreesBasic % 90
  // if (hitAxis === 'y') {
  //   if (degreesBasic > 90 & degreesBasic <= 270)
  // }
}


const findHitLoc = (hitAxis, boundaryLoc, path, pointRad) => {
  console.log('finding hit location')
  const { sx, sy, tx, ty } = path
  const m = (ty - sy) / (tx - sx)
  if (hitAxis === 'x') {
    const x = (boundaryLoc - sy) / m + sx
    console.log('hit x - sx, tx, x-boundary:', sx, tx, x)
    return (boundaryLoc === 0) ? { tx: x, ty: pointRad } : { tx: x, ty: boundaryLoc - pointRad }
  } else {
    const y = m * (boundaryLoc - sx) + sy
    console.log('hit y - sy, ty, y-boundary:', sy, ty, y)
    return (boundaryLoc === 0) ? { tx: pointRad, ty: y } : { tx: boundaryLoc - pointRad, ty: y }
  }
}

const adjustDegreesToT = (intendedPath, newT, degreeIncrement) => {
  console.log('anjuting degrees to t')
  const { sx, sy, tx, ty, degrees, clockwise } = intendedPath
  const origDist = distBwPts(sx, sy, tx, ty)
  const adjustedDist = distBwPts(sx, sy, newT.tx, newT.ty)
  const distRatio = adjustedDist / origDist
  console.log('distRatio', distRatio, 'always less than', degreeIncrement, '??')
  const newDegreeInc = degreeIncrement * distRatio

  const newDegrees = (clockwise) ? (degrees - (degreeIncrement - newDegreeInc)) : (degrees + (degreeIncrement - newDegreeInc))
  return { newDegrees, newDurAdjust: distRatio }
}


const calcPath = (oldPath, configs) => {
  const { height, width, pointRad, degreeIncrement } = configs
  // const { degrees, hivex, hivey, durationMultiplier } = oldPath

  // console.log('old path', oldPath)
  const newPath = updatePath( oldPath, configs )

  if (newPath.tx >= pointRad && 
    newPath.tx <= width - pointRad &&
    newPath.ty >= pointRad && 
    newPath.ty <= height - pointRad) {
      return newPath
  } else {
    let newT
    let hitAxis
    if (newPath.tx <= pointRad) { // case where hitting x-boundary
      hitAxis = 'y'
      newT = findHitLoc(hitAxis, pointRad, newPath, pointRad)
    } else if (newPath.tx >= width - pointRad) {
      hitAxis = 'y'
      newT = findHitLoc(hitAxis, width - pointRad, newPath, pointRad)
    } else if (newPath.ty <= pointRad) { // cases where hitting y-boundary
      hitAxis = 'x'
      newT = findHitLoc(hitAxis, pointRad, newPath, pointRad)
    } else if (newPath.ty >= height - pointRad) {
      hitAxis = 'x'
      newT = findHitLoc(hitAxis, height - pointRad, newPath, pointRad)
    }
    newPath.tx = newT.tx
    newPath.ty = newT.ty

    const {newDegrees, newDurAdjust } = adjustDegreesToT(newPath, newT, degreeIncrement)
    newPath.degrees = newDegrees + 180 // add on XX degrees everytime we take the mirror of the hive origin
    // newPath.durAdjust = newDurAdjust
    
    const newHive = mirrorOrigin(hitAxis, newPath)
    newPath.hivex = newHive.hivex
    newPath.hivey = newHive.hivey

    return newPath
    
  }
}

// module.exports = { 
//   distBwPts, updatePath, 
//   mirrorOrigin, findHitLoc, 
//   adjustDegreesToT, calcPath 
// }
export default calcPath