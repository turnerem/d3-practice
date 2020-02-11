


const distBwPts = (x1, y1, x2, y2) => {
  const distSquared = Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)
  return Math.pow(distSquared, 1/2)
}

const toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

const getRadius = (degrees) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.pow(phi, (degrees / 90));
}

const updatePath = ( oldPath, configs ) => {
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

  return newPath
}

  
const mirrorOrigin = (hitAxis, path) => {
  const otherAxis = (hitAxis === 'y') ? 'x' : 'y'
  return {
    [`hive${hitAxis}`] : path[`t${hitAxis}`] + (path[`t${hitAxis}`] - path[`hive${hitAxis}`]),
    [`hive${otherAxis}`] : path[`hive${otherAxis}`]
  }
}


const findHitLoc = (hitAxis, boundaryLoc, path, pointRad) => {
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

const adjustDegreesToT = (intendedPath, newT, degreeIncrement) => {
  const { sx, sy, tx, ty, degrees, clockwise } = intendedPath
  const origDist = distBwPts(sx, sy, tx, ty)
  const adjustedDist = distBwPts(sx, sy, newT.tx, newT.ty)
  const distRatio = adjustedDist / origDist
  const newDegreeInc = degreeIncrement * distRatio

  const newDegrees = (clockwise) ? (degrees - (degreeIncrement - newDegreeInc) + 360) % 360 : (degrees + (degreeIncrement - newDegreeInc)) % 360
  return { newDegrees, newDurAdjust: distRatio }
}


const calcPath = (oldPath, configs) => {
  const { height, width, pointRad, degreeIncrement } = configs
  // const { degrees, hivex, hivey, durationMultiplier } = oldPath

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
      hitAxis = 'x'
      newT = findHitLoc(hitAxis, 0, newPath, pointRad)
    } else if (newPath.tx >= width - pointRad) {
      hitAxis = 'x'
      newT = findHitLoc(hitAxis, width, newPath, pointRad)
    } else if (newPath.ty <= pointRad) { // cases where hitting y-boundary
      hitAxis = 'y'
      newT = findHitLoc(hitAxis, 0, newPath, pointRad)
    } else if (newPath.ty >= height - pointRad) {
      hitAxis = 'y'
      newT = findHitLoc(hitAxis, height, newPath, pointRad)
    }
    newPath.tx = newT.tx
    newPath.ty = newT.ty

    const {newDegrees, newDurAdjust } = adjustDegreesToT(newPath, newT, degreeIncrement)
    newPath.degrees = newDegrees
    newPath.durAdjust = newDurAdjust
    
    const newHive = mirrorOrigin(hitAxis, newPath)
    newPath.hivex = newHive.hivex
    newPath.hivey = newHive.hivey

    return newPath
    
  }
}

// module.exports = bee
export default calcPath