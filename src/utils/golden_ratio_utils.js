

const distBwPts = (x1, y1, x2, y2) => {
  const distSquared = Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)
  return Math.pow(distSquared, 1/2)
}

const toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

const getRadius = (degrees) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  // console.log('the radius', Math.pow(phi, (degrees / 90)))
  return Math.pow(phi, (degrees / 90));
}

const findHitLoc = (hitAxis, boundaryLoc, sx, sy, tx, ty) => {
  // console.log('finding hit location - boundaryLoc', boundaryLoc, 'sx, sy', sx, sy, 'tx, ty', tx, ty)
  const m = (ty - sy) / (tx - sx)
  if (hitAxis === 'x') {
    return (boundaryLoc - sy) / m + sx
  } else {
    return m * (boundaryLoc - sx) + sy
  }
}


module.exports = { 
  distBwPts, 
  toRadians, getRadius,
  findHitLoc
}
// export default calcPath