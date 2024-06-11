import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const GradientBarChart = () => {
  const data = [
    { color: '#ff6400', value: 0 },
    { color: '#806480', value: 2.5 },
    { color: '#0064FF', value: 5 }
    // Add more data as needed
  ]

  const svgRef = useRef(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const extent = d3.extent(data, d => d.value)

    const padding = 9
    const height = 300 // Adjusted height for the vertical chart
    const innerHeight = height - padding * 2 // Adjusted innerHeight for the vertical chart
    const barWidth = 10 // Adjusted barWidth for the vertical chart
    const width = 28 // Adjusted width for the vertical chart

    const yScale = d3.scaleLinear().range([innerHeight, 0]).domain(extent) // Use yScale for vertical positioning

    const yTicks = data.map(d => d.value)

    const yAxis = d3
      .axisLeft(yScale) // Use yAxis for vertical orientation
      .tickSize(-width) // Adjusted tickSize for the vertical chart
      .tickValues(yTicks)

    const defs = svg.append('defs')
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'myGradient')
      .attr('x1', '0%') // Adjusted gradient direction for vertical chart
      .attr('x2', '0%')
      .attr('y1', '100%')
      .attr('y2', '0%')

    linearGradient
      .selectAll('stop')
      .data(data)
      .enter()
      .append('stop')
      .attr(
        'offset',
        d => ((d.value - extent[0]) / (extent[1] - extent[0])) * 100 + '%'
      )
      .attr('stop-color', d => d.color)

    svg
      .append('rect')
      .attr('height', innerHeight) // Adjusted height for the vertical chart
      .attr('width', barWidth)
      .style('fill', 'url(#myGradient)')
      .attr('transform', `translate(${padding}, ${padding})`)

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${padding + barWidth}, ${padding})`) // Adjusted transform for the vertical chart
      .call(yAxis)
      .select('.domain')
      .remove()

    // Adjust label positions and orientations
    svg
      .selectAll('.y-axis text')
      .attr('transform', 'rotate(0)')
      .attr('dx', '2em')
      .attr('dy', '1em')
  }, [data])

  return <svg ref={svgRef} width='36' height='320'></svg> // Adjusted width and height for the vertical chart
}

export default GradientBarChart
