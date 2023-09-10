"use client";

import React, { useContext } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { useQuery } from "@tanstack/react-query";
import { ArboContext } from "@/contexts/arbo-context";
import useArboData from "@/hooks/useArboData";

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
        "http://localhost:5000/data_provider/data_provider/arbo/visualizations",
      ).then((response) => response.json()),
  });

  if (
    visualizations.isSuccess &&
    !visualizations.isLoading &&
    !visualizations.isError
  ) {
    console.log(visualizations.data);

    const config = visualizations.data[0];

    console.log("Responsive Bar: ", config);

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
    if (visualizations.isError) console.log("Error", visualizations.error);

    return <span>Loading...</span>;
  }
}

export function CountOfStudiesStratifiedByAntibodyAndPathogen() {
  // The data coming in from the props will be moved to a context
  const state = useContext(ArboContext);

  console.log("State: ", state);

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

  const allDataQuery = useArboData();

  if (!state?.filteredData) return <span>Loading...</span>;
  else {
    console.log("antibody filtering: ", state.filteredData);

    const rawData =
      state.filteredData.length > 0
        ? state.filteredData
        : allDataQuery.data?.records;

    rawData?.forEach((d: any) => {
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
        ZIKV: d.ZIKV,
        CHIKV: d.CHIKV,
        YF: d.YF,
        WNV: d.WNV,
        MAYV: d.MAYV,
      };
    });

    console.log("Chart Data: ", chartData);

    return (
      <ResponsiveBar
        data={chartData}
        keys={["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"]}
        indexBy={"antibody"}
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

  // Potentially consider moving this data manipulation to the backend and retrieve all datasets in a single call
  //  This also probably comes with config values and other required data for each chart such that I can map over the
  //  returned data and create a chart for each object in the list based on its specifications.
  //  Keeps all data handling in one place and could potentially generate this page on the server side instead
}

// Create the boxplot
export function PathogenSeroprevalenceBoxPlot() {
  const allDataRecords = useArboData();

  const state = useContext(ArboContext);

  if (state && allDataRecords.data && allDataRecords.isSuccess) {
    const rawData =
      state.filteredData.length > 0
        ? state.filteredData
        : allDataRecords.data?.records;

    const data: { pathogen: string; seroprevalence: number }[] = rawData.map(
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
        seroprevalence.reduce((sumSq, value) => sumSq + (value - mu) ** 2, 0) /
          n,
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

    console.log("Box Plot Data: ", boxPlotData);

    return (
      <div className={"h-72 w-full"}>
        <ResponsiveBoxPlot
          data={boxPlotData}
          groupBy="pathogen"
          value="seroprevalence"
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
          colors={{ scheme: "nivo" }}
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
  } else {
    return <span>Loading...</span>;
  }
}
