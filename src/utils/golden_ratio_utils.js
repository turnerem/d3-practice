const toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

const getRadius = (degrees) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.pow(phi, (degrees / 90));
}

exports.getX = (degrees) => {
  const radiansTravelled = toRadians(degrees);
  const radius = getRadius(degrees);
  return Math.cos(radiansTravelled) * radius;
}

exports.getY = (degrees) => {
  const radiansTravelled = toRadians(degrees);
  const radius = getRadius(degrees);
  return Math.sin(radiansTravelled) * radius;
}

exports.mirrorStart = (xAxis, loc, i) => {
  // i is the index of the point in the startLayouts array
  // if point has hit x-axis, need to get different between x-axis hitpoint (loc) and start location on x-axis
  // and add this onto loc, then get mirror image of swirl
  
}