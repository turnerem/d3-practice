const { expect } = require('chai')
const bee = require('./golden_ratio_utils')

const { getX, getY, isAtEdge, mirrorOrigin, newPath } = bee

describe('getX', () => {
  it('returns pos number when given 89 and 271 degrees', () => {
    expect(getX(89) > 0).to.equal(true)
    expect(getX(271) > 0).to.equal(true)
  });
  it('returns neg number when given 91 and 269 degrees', () => {
    expect(getX(91) < 0).to.equal(true)
    expect(getX(269) < 0).to.equal(true)
  });
});

describe('getY', () => {
  it('returns pos number at 1 and 179 degrees', () => {
    expect(getY(1) > 0).to.equal(true)
    expect(getY(179) > 0).to.equal(true)
  })
  it('returns neg number at 181 and 359 degrees', () => {
    expect(getY(181) < 0).to.equal(true)
    expect(getY(359) < 0).to.equal(true)
  })
});

describe('isAtEdge', () => {
  it('returns true if point is {x: 25, y: 25}', () => {
    expect(isAtEdge('y', {x: 25, y: 25}, 20, 100)).to.equal(true)
    expect(isAtEdge('x', {x: 25, y: 25}, 20, 100)).to.equal(true)
  });
  it('returns false if point is {x: 26, y: 26}', () => {
    expect(isAtEdge('y', {x: 26, y: 26}, 20, 100)).to.equal(false)
    expect(isAtEdge('x', {x: 26, y: 26}, 20, 100)).to.equal(false)
  });
  it('returns true if point is {x: 75, y: 75}', () => {
    expect(isAtEdge('y', {x: 75, y: 75}, 20, 100)).to.equal(true)
    expect(isAtEdge('x', {x: 75, y: 75}, 20, 100)).to.equal(true)
  });
  it('returns true if point is {x: 74, y: 74}', () => {
    expect(isAtEdge('y', {x: 74, y: 74}, 20, 100)).to.equal(false)
    expect(isAtEdge('x', {x: 74, y: 74}, 20, 100)).to.equal(false)
  });
});

describe('mirrorOrigin', () => {
  it('should return object with 2 keys', () => {
    const actual = mirrorOrigin('x', 4, {x: 1, y: 5})
    expect(actual).to.be.an('object')
    expect(Object.keys(actual).length).to.equal(2)
  });
  it('should increment x by diff between x-origin and current x-loc if pt collides with x axis', () => {
    const actual = mirrorOrigin('x', 4, {x: 1, y: 5})
    expect(actual.x).to.equal(7)
  })
  it('should not change y', () => {
    const actual = mirrorOrigin('x', 4, {x: 1, y: 5})
    expect(actual.y).to.equal(5)
  });
  it('should also work when hit loc is less than origin', () => {
    const actual = mirrorOrigin('x', -1, {x: 1, y: 5})
    expect(actual.x).to.equal(-3)
  });
  it('should work similarly when point hits y-axis', () => {
    const actual = mirrorOrigin('y', -1, {x: 1, y: 5})
    expect(actual.y).to.equal(-7)
    expect(actual.x).to.equal(1)
  });
});

// layouts[i].sy = Math.floor(point.y) - (point.sy - Math.floor(point.y))
// layouts[i].ty = Math.floor(point.y) - (point.ty - Math.floor(point.y)) 
// const newStartLayout = this.mirrorOrigin('x', point.x, startLayouts[i])
// startLayouts.splice(i, 1, newStartLayout)

describe('newPath', () => {
  it('if point hits y-axis (pointRad =, say,  0) at x=4 when {sx:2, sy:2, x:4, y:0, tx:8, ty:-6}, then new layout is {sx:0, sy:-6, x:4, y:0, tx:6, ty:2}', () => {
    expect(newPath('y', {sx:2, sy:2, x:4, y:0, tx:8, ty:-4})).to.deep.equal({sx:0, sy:-4, x:4, y:0, tx:6, ty:2})
  })
  it('if point hits y-axis (pointRad =, say,  0) at x=4 when {sx:0, sy:-6, x:4, y:0, tx:6, ty:2}, then new layout is {sx:2, sy:2, x:4, y:0, tx:8, ty:-6}', () => {
    expect(newPath('y', {sx:0, sy:-6, x:4, y:0, tx:6, ty:2})).to.deep.equal({sx:2, sy:2, x:4, y:0, tx:8, ty:-6})
  })
  it('if point hits x-axis (pointRad =, say,  0) at y=4 when {sx:2, sy:2, x:0, y:4, tx:8, ty:-6}, then new layout is {sx:8, sy:-6, x:0, y:4, tx:2, ty:2}', () => {
    expect(newPath('x', {sx:2, sy:2, x:0, y:4, tx:-4, ty:8})).to.deep.equal({sx:-4, sy:0, x:0, y:4, tx:2, ty:6})
  })
  it('if point hits outer x-boundary at (100, 4) when {sx:92, sy:2, x:100, y:4, tx:112, ty:7}, then new layout is {sx:112, sy:1, x:100, y:4, tx:92, ty:6}', () => {
    expect(newPath('x', {sx:92, sy:2, x:100, y:4, tx:112, ty:7})).to.deep.equal({sx:112, sy:1, x:100, y:4, tx:92, ty:6})
  })
});