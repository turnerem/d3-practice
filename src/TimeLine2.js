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

// let styler = require('styler')
import data from "./data2.json";

console.log('data keys', data)

const series = new TimeSeries({
    name: "series",
    columns: ["index", "median"],
    points: data.map(({ date, count }) => [
        date,
        // [pct05 / 1000, pct25 / 1000, pct75 / 1000, pct95 / 1000],
        count
    ])
});

class TimeLine2 extends Component {
  
    render() {
        const style = styler([
            { key: "t", color: "steelblue", width: 1, opacity: 1 },
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
                                        {/* <BandChart
                                            axis="t-axis"
                                            style={style}
                                            spacing={1}
                                            column="t"
                                            interpolation="curveBasis"
                                            series={series}
                                        /> */}
                                        <LineChart
                                            axis="t-axis"
                                            style={style}
                                            spacing={1}
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
}

export default TimeLine2;