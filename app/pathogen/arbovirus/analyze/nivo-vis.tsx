"use client";

import React, { useContext } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { useQuery } from "@tanstack/react-query";
import { ArboContext } from "@/contexts/arbo-context";
import { pathogenColors } from "@/app/pathogen/arbovirus/dashboard/(map)/MapAndFilters";

type DataSubType = {
  DENV: number;
  ZIKV: number;
  CHIKV: number;
  YF: number;
  WNV: number;
  MAYV: number;
};

type DataType = {
  NR: DataSubType;
  NAb: DataSubType;
  IgM: DataSubType;
  IgG: DataSubType;
  IgGIgM: DataSubType;
};

export function CustomResponsiveBar() {
  const visualizations = useQuery({
    queryKey: ["ArbovirusVisualizations"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data_provider/arbo/visualizations`,
      ).then((response) => response.json()),
  });

  if (
    visualizations.isSuccess &&
    !visualizations.isLoading &&
    !visualizations.isError
  ) {
    const config = visualizations.data[0];

    return (
      <ResponsiveBar
        data={config.data}
        keys={config.keys}
        indexBy={config.indexBy}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: config.xAxisLabel,
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: config.yAxisLabel,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            itemDirection: "left-to-right",
          },
        ]}
      />
    );
  } else {
    if (visualizations.isError) console.error("Error", visualizations.error);

    return <span>Loading...</span>;
  }
}

const getColor = (bar: any) => {
  if (bar.id) return pathogenColors[bar.id];
  else if (bar.group) return pathogenColors[bar.group];
  else return "hsl(0,100,84)";
};



//Study by who region and pathogen

//Study count by pathogen and antibody type
export function CountOfStudiesStratifiedByAntibodyAndPathogen() {
  // The data coming in from the props will be moved to a context
  const state = useContext(ArboContext);

  const data: DataType = {
    NR: {
      DENV: 0,
      ZIKV: 0,
      CHIKV: 0,
      YF: 0,
      WNV: 0,
      MAYV: 0,
    },
    NAb: {
      DENV: 0,
      ZIKV: 0,
      CHIKV: 0,
      YF: 0,
      WNV: 0,
      MAYV: 0,
    },
    IgM: {
      DENV: 0,
      ZIKV: 0,
      CHIKV: 0,
      YF: 0,
      WNV: 0,
      MAYV: 0,
    },
    IgG: {
      DENV: 0,
      ZIKV: 0,
      CHIKV: 0,
      YF: 0,
      WNV: 0,
      MAYV: 0,
    },
    IgGIgM: {
      DENV: 0,
      ZIKV: 0,
      CHIKV: 0,
      YF: 0,
      WNV: 0,
      MAYV: 0,
    },
  };

  state.filteredData.forEach((d: any) => {
    const antibodies = d.antibodies as (keyof typeof data)[];
    if (antibodies.length == 2) {
      const pathogen: keyof (typeof data)["NAb"] = d.pathogen;
      data["IgGIgM"][pathogen] += 1;
    } else {
      const antibody: keyof typeof data = antibodies[0];
      const pathogen: keyof (typeof data)["NAb"] = d.pathogen;
      if (antibody && pathogen) {
        if (data[antibody]) data[antibody][pathogen] += 1;
        else data["NR"][pathogen] += 1;
      }
    }
  });

  const chartData = Object.keys(data).map((antibody) => {
    const d = data[antibody as keyof DataType];
    return {
      antibody: antibody,
      DENV: d.DENV,
      DENVColor: "hsl(0,100,84)",
      ZIKV: d.ZIKV,
      ZIKVColor: "hsl(217,100,81)",
      CHIKV: d.CHIKV,
      CHIKVColor: "hsl(185,100,80)",
      YF: d.YF,
      YFColor: "hsl(33,100,82)",
      WNV: d.WNV,
      WNVColor: "hsl(110,100,87)",
      MAYV: d.MAYV,
      MAYVColor: "hsl(62,100,86)",
    };
  });

  // @ts-ignore
  return (
    <ResponsiveBar
      data={chartData}
      keys={["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"]}
      indexBy={"antibody"}
      colors={getColor}
      margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "antibody",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count #",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemWidth: 100,
          itemHeight: 20,
          itemsSpacing: 2,
          symbolSize: 20,
          itemDirection: "left-to-right",
        },
      ]}
    />
  );

}

//Seroprevalence per pathogen, WHO region and age group

// Cumulative study count over time by pathogen

//Cumulative Study count over time by smaple frame

//Top 10 countries with most studies by pathogen

// Create the boxplot
export function PathogenSeroprevalenceBoxPlot() {
  const state = useContext(ArboContext);

  const data: { pathogen: string; seroprevalence: number }[] = state.filteredData.map(
    (d: any) => {
      return {
        pathogen: d.pathogen,
        seroprevalence: d.seroprevalence * 100,
      };
    },
  );

  const groupedData: Record<
    string,
    {
      pathogen: string;
      mu: number; // Mean
      sd: number; // Standard deviation
      n: number; // Count
      seroprevalence: number[]; // Store seroprevalence values for later calculation
    }
  > = data.reduce(
    (
      acc: Record<
        string,
        {
          pathogen: string;
          mu: number; // Mean
          sd: number; // Standard deviation
          n: number; // Count
          seroprevalence: number[]; // Store seroprevalence values for later calculation
        }
      >,
      item,
    ) => {
      const { pathogen, seroprevalence } = item;
      if (!acc[pathogen]) {
        acc[pathogen] = {
          pathogen,
          mu: 0, // Initialize mean
          sd: 0, // Initialize standard deviation
          n: 0, // Initialize count
          seroprevalence: [], // Store seroprevalence values for later calculation
        };
      }
      acc[pathogen].seroprevalence.push(seroprevalence);
      acc[pathogen].n++;
      return acc;
    },
    {},
  );

  // Calculate mean and standard deviation
  for (const pathogen in groupedData) {
    const { seroprevalence, n } = groupedData[pathogen];
    const mu = seroprevalence.reduce((sum, value) => sum + value, 0) / n;
    const sd = Math.sqrt(
      seroprevalence.reduce((sumSq, value) => sumSq + (value - mu) ** 2, 0) / n,
    );
    groupedData[pathogen].mu = mu;
    groupedData[pathogen].sd = sd;
  }

  // Create the boxplot data with the desired format
  const boxPlotData: {
    pathogen: string;
    mu: number;
    sd: number;
    n: number;
    seroprevalence: number;
  }[] = data.map((item: any) => {
    const { pathogen, seroprevalence } = item;
    const { mu, sd, n } = groupedData[pathogen];
    return {
      pathogen,
      mu,
      sd,
      n,
      seroprevalence,
    };
  });

  return (
    <div className={"h-72 w-full"}>
      <ResponsiveBoxPlot
        data={boxPlotData}
        groupBy="pathogen"
        value="seroprevalence"
        colors={getColor}
        colorBy="pathogen"
        minValue="0"
        maxValue="100"
        margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
        padding={0.12}
        enableGridX={true}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 36,
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 0,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Pathogen",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Seroprevalence",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        borderRadius={2}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        medianWidth={2}
        medianColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        whiskerEndSize={0.6}
        whiskerColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        motionConfig="stiff"
      />
    </div>
  );
}
