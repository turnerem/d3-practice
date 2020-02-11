import React, { Component } from 'react';
import barChartD3 from './barChartD3'

class BarChart extends Component {

  componentDidMount() {
    console.log('mounting')
    this._chart = barChartD3.create(
      this.refs.bar_chart,
      this.props.data,
      this.props.configs
    )
  }

  componentDidUpdate() {
    barChartD3.update(
      this.refs.bar_chart,
      this.props.data,
      this.props.config
    )
  }

  // componentWillUnmount() {
  //   barChartD3.destroy(this.bar_chart)
  // }

  // _setRef = (componentNode) => {
  //   this._rootNode = componentNode;
  // }
  render() {
    return (
      <div className='bar_chart' ref='bar_chart' />
      // <div className='bar-chart' ref={this._setRef.bind(this)} />
        
      // </div>
    );
  }
}

export default BarChart;