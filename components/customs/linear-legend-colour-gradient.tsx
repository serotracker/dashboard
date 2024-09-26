import * as d3 from "d3";
import { useEffect, useMemo, useId } from "react";

interface LinearLegendColourGradientTick {
  numericValue: number;
  isTickValueDisplayed: boolean;
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
  const { ticks, widthPx, title } = props;

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
      offset: `${Math.floor(((tick.numericValue - tickMinimum) * 90) / (tickMaximum - tickMinimum))}%`,
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
      .text(title);

    svgLegend
      .append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", widthPx - 10)
      .attr("height", 15)
      .style("fill", `url(#linear-gradient-${elementId})`);

    var xTicks = d3
      .scaleLinear()
      .domain([tickMinimum, tickMaximum + ((tickMaximum - tickMinimum) * 0.1)])
      .range([0, widthPx - 10]);

    var xTicksElement = d3
      .axisBottom(xTicks)
      .tickValues(ticks
        .filter((tick) => !!tick.isTickValueDisplayed)
        .map((tick) => tick.numericValue)
      );

    svgLegend
      .attr("width", `${widthPx}px`)
      .attr("height", "70px")
      .append("g")
      .attr("transform", "translate(10, 40)")
      .call(xTicksElement);
  }, [ ticks, tickMinimum, tickMaximum, linearGradientData, widthPx, elementId, title ]);

  return <div id={elementId} />;
};
