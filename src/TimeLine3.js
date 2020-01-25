import React, { Component } from 'react';

import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "./components/ChartContainer";
import ChartRow from "./components/ChartRow";
import Charts from "./components/Charts";
import YAxis from "./components/YAxis";
import BandChart from "./components/BandChart";
import LineChart from "./components/LineChart";
import Resizable from "./components/Resizable";
import styler from "./js/styler";

import data from "./data2.json";

import * as api from './api'
const fs = require('fs')

// import countsPerTimeUnit from './utils/utils'

class TimeLine3 extends Component {
  state = {
    data: []
  }

  componentDidMount = () => {
    api.getData('topics')
      .then(({ topics_res }) => {
        // console.log('data keys', topics_res)

        const { topic_art_dates } = topics_res
        console.log('data keys', topic_art_dates)
        
        const formattedData = this.countsPerTimeUnit(topic_art_dates)
        console.log(formattedData, 'FORMATTED data')
        
        this.setState({ data: formattedData })
        
      })
      .catch(err => console.log('AN ERR', err))
  }

  render() {
    // const {data} = this.state
    const series = new TimeSeries({
      name: "series",
      columns: ["index", "median"],
      points: data.map(({ date, count }) => [
        date,
        // [pct05 / 1000, pct25 / 1000, pct75 / 1000, pct95 / 1000],
        count
    ])
  });
  console.log(data, 'DATA series data')

    console.log('series off of state', series)
    const style = styler([
        { key: "median", color: "#333", width: 1 }
    ]);

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <b>BarChart</b>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-12">
                    <Resizable>
                        <ChartContainer timeRange={series.range()}>
                            <ChartRow height="500">
                                <YAxis
                                    id="t-axis"
                                    label="time (s)"
                                    min={0}
                                    max={18}
                                    format="d"
                                    width="70"
                                    type="linear"
                                />
                                <Charts>
                                    
                                    <LineChart
                                        axis="t-axis"
                                        style={style}
                                        spacing={1}
                                        // visible={false}
                                        columns={["median"]}
                                        interpolation="curveBasis"
                                        series={series}
                                    />
                                </Charts>
                            </ChartRow>
                        </ChartContainer>
                    </Resizable>
                </div>
            </div>
        </div>
    );
}
countsPerTimeUnit = (data) => {
  const countObj = {}
  data.forEach(elem => {
    let jsDate = new Date(elem.created_at);
    let mth = jsDate.getMonth() + 1;
    let yr = jsDate.getFullYear();
    let day = jsDate.getDate()

    let mthChar = (mth < 10) ? '0' + mth : '' + mth;
    let dayChar = (day < 10) ? '0' + day : '' + day;
    let formattedDate = `${yr}-${mthChar}-${dayChar}`
    countObj.hasOwnProperty(formattedDate) ? countObj[formattedDate] ++ : countObj[formattedDate] = 1;
  })
  const dateArr = Object.keys(countObj).map(key => {
    
    return { date:key, count: countObj[key]}
    
  })
  return dateArr
}
}


export default TimeLine3;