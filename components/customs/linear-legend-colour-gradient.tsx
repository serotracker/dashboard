import * as d3 from "d3";
import { useEffect, useMemo, useId } from "react";

interface LinearLegendColourGradientTick {
  numericValue: number;
  colourCode: string;
}

export interface LinearLegendColourGradientProps {
  title: string;
  ticks: LinearLegendColourGradientTick[];
  widthPx: number;
}

export const LinearLegendColourGradient = (
  props: LinearLegendColourGradientProps
) => {
  const { ticks, widthPx } = props;

  const rawElementId = useId();

  const elementId = useMemo(() => {
    return rawElementId.replaceAll(':', '')
  }, [ rawElementId ])

  const tickMinimum = useMemo(() => {
    return Math.min(...ticks.map((tick) => tick.numericValue));
  }, [ ticks ]);

  const tickMaximum = useMemo(() => {
    return Math.max(...ticks.map((tick) => tick.numericValue));
  }, [ ticks ]);

  const linearGradientData = useMemo(() => {
    return ticks.map((tick) => ({
      offset: `${Math.floor(((tick.numericValue - tickMinimum) * 100) / (tickMaximum - tickMinimum))}%`,
      color: tick.colourCode,
    }));
  }, [ ticks, tickMinimum, tickMaximum ]);

  useEffect(() => {
    d3.select(`#${elementId}`).selectChildren().remove();
    var svgLegend = d3.select(`#${elementId}`).append("svg");
    var defs = svgLegend.append("defs");

    var linearGradient = defs
      .append("linearGradient")
      .attr("id", `linear-gradient-${elementId}`);

    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    linearGradient
      .selectAll("stop")
      .data(linearGradientData)
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    svgLegend
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", "left")
      .text("Legend title");

    svgLegend
      .append("rect")
      .attr("x", 0)
      .attr("y", 30)
      .attr("width", widthPx)
      .attr("height", 15)
      .style("fill", `url(#linear-gradient-${elementId})`);

    var xTicks = d3
      .scaleLinear()
      .domain([tickMinimum, tickMaximum])
      .range([0, widthPx]);

    var xTicksElement = d3.axisBottom(xTicks);

    svgLegend
      .attr("width", `${widthPx}px`)
      .attr("height", "70px")
      .append("g")
      .attr("transform", "translate(0, 40)")
      .call(xTicksElement);
  }, [ticks, tickMinimum, tickMaximum, linearGradientData, widthPx, elementId]);

  return <div id={elementId} />;
};
