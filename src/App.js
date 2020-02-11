import React from 'react'
// import BarChart from './components/BarChart'
import './App.css'
// import TimeLine from './TimeLine'
// import TimeLine2 from './TimeLine2'
// import TimeLine3 from './TimeLine3'
import MovingDot from './components/MovingDot4'

const configs = {
  height: 700, width: 1000, 
  pointRad: 20, degrees: 5, 
  duration: 100, 
  degreeIncrement: 5
}

const App = () => {
  return ( 
    <>
    <p>Yes or No?</p>
    {/* <BarChart />  */}
    <MovingDot configs={configs}/>
    {/* <p>TIMELINE?</p>
    <TimeLine3 /> */}
    </>
  )
}

export default App
