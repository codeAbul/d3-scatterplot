import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import dataset from "../../assets/data/my_weather_data.json";
import useWindowSize from "../../hooks/useWindowSize";

type Data = typeof dataset[0];
type ExtractDewPoint = (data: Data) => Data["dewPoint"];
type ExtractHumidity = (data: Data) => Data["humidity"];
type ExtractCloudCover = (data:Data) => Data["cloudCover"];

const ScatterPlot: FC<{}> = () => {
  const windowSize = useWindowSize();
  const svgWrapper = useRef(null);
  const drawScatterPlot = async () => {
    // Access data
    // dewPoint on the x axis
    // humidity on the y axis
    const xAccessor: ExtractDewPoint = d => d.dewPoint;
    const yAccessor: ExtractHumidity = d => d.humidity;
    const colorAccessor: ExtractCloudCover = d => d.cloudCover;

    // create chart dimensions

    // prettier-ignore
    const width = d3.min(
      [windowSize.innerWidth!*0.9,
            windowSize.innerHeight!*0.9]
            );

    let dimensions = {
      width,
      height: width,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
      },
      get boundedWidth() {
        return this.width! - (this.margin.right + this.margin.left);
      },
      get boundedHeight() {
        return this.height! - (this.margin.top + this.margin.bottom);
      }
    };

    const wrapper = d3.select(svgWrapper.current);

    wrapper.selectAll("g")
      .remove();

    // set width and height for svg wrapper element
    // prettier-ignore
    wrapper
      .attr("width", dimensions.width!)
      .attr("height", dimensions.height!);


    const bounds =
      wrapper.append("g")
        .style("transform", `translate(
          ${dimensions.margin.left}px,
          ${dimensions.margin.top}px
        )`);

    // create scales

    const dewPointExtent = d3.extent(dataset,xAccessor) as [number,number];
    const humidityExtent = d3.extent(dataset,yAccessor) as [number,number];
    const cloudCoverExtent = d3.extent(dataset,colorAccessor) as [number,number];

    const xScale = d3.scaleLinear()
      .domain(dewPointExtent)
      .range([0,dimensions.boundedWidth])
      .nice();

    // y values go from top to bottom

    const yScale = d3.scaleLinear()
      .domain(humidityExtent)
      .range([dimensions.boundedHeight,0])
      .nice();

    // color scale

    const colorScale = d3.scaleLinear()
      .domain(cloudCoverExtent)
      .range(["skyblue" as any,"darkslategrey"])
    // Draw the data

    const dots =
      bounds.selectAll("circle")
        .data(dataset)
      .join("circle")
        .attr("cx",d => xScale(xAccessor(d)))
        .attr("cy",d => yScale(yAccessor(d)))
        .attr("r",5)
        .attr("fill",d => colorScale(colorAccessor(d)));

    // Draw the peripherals

    const xAxisGenerator = d3.axisBottom(xScale);
    const yAxisGenerator = d3.axisLeft(yScale)
      .ticks(4);

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform",`translateY(
        ${dimensions.boundedHeight}px)`
        );

    const xAxisLabel = xAxis.append("text")
      .attr("x",dimensions.boundedWidth/2)
      .attr("y",dimensions.margin.bottom-10)
      .attr("fill","blue")
      .style("font-size","1.4rem")
      .html("Dew point (&deg;F)");

    const yAxis = bounds.append("g")
      .call(yAxisGenerator);

    const yAxisLabel = yAxis.append("text")
      .attr("x",-dimensions.boundedHeight/2 )
      .attr("y", -dimensions.margin.left+20)
      .attr("fill","blue")
      .style("transform","rotate(-90deg")
      .style("text-anchor","middle")
      .style("font-size","1.4rem")
      .html("Relative humidity");
  };

  // Draw the plot whenever the window size changes
  useEffect(() => {
    drawScatterPlot();
  }, [windowSize]);

  return (
    <svg ref={svgWrapper}>
      <title>
        Scatter Plot plotting dew point on the x-axis and humidity on the y-axis
        , cloud cover for color scales, for New york city temperatures across 2018
      </title>
    </svg>
  );
};

export default ScatterPlot;
