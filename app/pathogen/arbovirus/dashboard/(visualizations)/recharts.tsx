"use client";

import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Label,
} from "recharts";
import _ from "lodash";
import { pathogenColors } from "../(map)/ArbovirusMap";
import clsx from "clsx";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { CustomXAxisTick } from "@/components/customs/visualizations/custom-x-axis-tick";

//Study by who region and pathogen

// TODO: future enhancement if needed is to extract the function to build the data and keep things cleaner (may not be needed, more readalbe this way

//Study count by pathogen and antibody type

export enum ShortformArbovirus {
  DENV = "DENV",
  ZIKV = "ZIKV",
  CHIKV = "CHIKV",
  YF = "YF",
  WNV = "WNV",
  MAYV = "MAYV",
}

export type arbovirusesSF = "DENV" | "ZIKV" | "CHIKV" | "YF" | "WNV" | "MAYV";
export type arboviruses =
  | "Dengue"
  | "Zika"
  | "Chikungunya"
  | "Yellow Fever"
  | "West Nile"
  | "Mayaro";

type antibodies = "IgG" | "IgM" | "NAb" | "NR" | "IgG, IgM";

export const convertArboSFtoArbo = (arbo: arbovirusesSF): arboviruses => {
  switch (arbo) {
    case "DENV":
      return "Dengue";
    case "ZIKV":
      return "Zika";
    case "CHIKV":
      return "Chikungunya";
    case "YF":
      return "Yellow Fever";
    case "WNV":
      return "West Nile";
    case "MAYV":
      return "Mayaro";
  }
};

interface dataStratifiedByArbovirus {
  // X axis variable would be appended here
  Zika: number;
  Dengue: number;
  Chikungunya: number;
  "Yellow Fever": number;
  "West Nile": number;
  Mayaro: number;
}

export function AntibodyPathogenBar() {
  const state = useContext(ArboContext);

  const data: {
    arbovirus: arboviruses;
    IgG: number;
    IgM: number;
    NAb: number;
    NR: number;
    "IgG, IgM": number;
  }[] = [];

  state.filteredData.forEach((d: any) => {
    const antibody: antibodies = d.antibodies.sort().join(", ");
    const arbovirus: arboviruses = convertArboSFtoArbo(d.pathogen);

    const existingData = _.find(data, { arbovirus: arbovirus });

    if (existingData) {
      existingData[antibody]++;
    } else {
      data.push({
        arbovirus: arbovirus,
        IgG: antibody === "IgG" ? 1 : 0,
        IgM: antibody === "IgM" ? 1 : 0,
        NAb: antibody === "NAb" ? 1 : 0,
        NR: antibody === "NR" ? 1 : 0,
        "IgG, IgM": antibody === "IgG, IgM" ? 1 : 0,
      });
    }
  });

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="arbovirus" />
        <YAxis />
        <Tooltip itemStyle={{"color": "black"}}/>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ right: -10 }}
        />
        <Bar dataKey="IgG" stackId="a" fill={"#61f4de"} />
        <Bar dataKey="IgM" stackId="a" fill={"#65cbe9"} />
        <Bar dataKey="IgG, IgM" stackId="a" fill={"#6cb6ef"} />
        <Bar dataKey="NAb" stackId="a" fill={"#6c8dfa"} />
        <Bar dataKey="NR" stackId="a" fill={"#6e78ff"} />
      </BarChart>
    </ResponsiveContainer>
  );
}

//Seroprevalence per pathogen, WHO region and age group
// - Missing region data, need to calculate it, how?

// Cumulative study count over time by pathogen

interface StudyCountOverTime extends dataStratifiedByArbovirus {
  year: number;
}

export function StudyCountOverTime() {
  const state = useContext(ArboContext);

  const data: StudyCountOverTime[] = [];

  state.filteredData.forEach((d: any) => {
    const year = new Date(d.sampleEndDate).getFullYear();
    let arbovirus: arboviruses = convertArboSFtoArbo(d.pathogen);

    const existingData = _.find(data, { year: year });

    if (existingData) {
      existingData[arbovirus]++;
    } else {
      data.push({
        year: year,
        Zika: arbovirus === "Zika" ? 1 : 0,
        Dengue: arbovirus === "Dengue" ? 1 : 0,
        Chikungunya: arbovirus === "Chikungunya" ? 1 : 0,
        "Yellow Fever": arbovirus === "Yellow Fever" ? 1 : 0,
        "West Nile": arbovirus === "West Nile" ? 1 : 0,
        Mayaro: arbovirus === "Mayaro" ? 1 : 0,
      });
    }
  });

  data.sort((a, b) => a.year - b.year);

  for (let i = 1; i < data.length; i++) {
    const element = data[i];

    element.Dengue += data[i - 1].Dengue;
    element.Zika += data[i - 1].Zika;
    element.Chikungunya += data[i - 1].Chikungunya;
    element["Yellow Fever"] += data[i - 1]["Yellow Fever"];
    element["West Nile"] += data[i - 1]["West Nile"];
    element.Mayaro += data[i - 1].Mayaro;
  }

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        width={730}
        height={250}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip itemStyle={{"color": "black"}} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ right: -10 }}
        />
        <Area
          type="monotone"
          dataKey="Zika"
          stackId="1"
          stroke={pathogenColors.ZIKV}
          fill={pathogenColors.ZIKV}
        />
        <Area
          type="monotone"
          dataKey="Dengue"
          stackId="1"
          stroke={pathogenColors.DENV}
          fill={pathogenColors.DENV}
        />
        <Area
          type="monotone"
          dataKey="Chikungunya"
          stackId="1"
          stroke={pathogenColors.CHIKV}
          fill={pathogenColors.CHIKV}
        />
        <Area
          type="monotone"
          dataKey="Yellow Fever"
          stackId="1"
          stroke={pathogenColors.YF}
          fill={pathogenColors.YF}
        />
        <Area
          type="monotone"
          dataKey="West Nile"
          stackId="1"
          stroke={pathogenColors.WNV}
          fill={pathogenColors.WNV}
        />
        <Area
          type="monotone"
          dataKey="Mayaro"
          stackId="1"
          stroke={pathogenColors.MAYV}
          fill={pathogenColors.MAYV}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function median(values: number[]): number {
  if (values.length === 0) {
    return 0; // there is no data for this region
  }

  // Sorting values, preventing original array
  // from being mutated.
  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  return values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2;
}

type WHORegion = "AFR" | "AMR" | "EMR" | "EUR" | "SEAR" | "WPR";
const WHORegions: WHORegion[] = ["AFR", "AMR", "EMR", "EUR", "SEAR", "WPR"];
type AgeGroup =
  | "Adults (18-64 years)"
  | "Children and Youth (0-17 years)"
  | "Seniors (65+ years)"
  | "Multiple groups";

const ageGroupColorMappings: Record<AgeGroup, string> = {
  "Adults (18-64 years)": "#f55c7a",
  "Children and Youth (0-17 years)": "#f68c70",
  "Seniors (65+ years)": "#f6bc66",
  "Multiple groups": "#6c8dfa",
};

export function MedianSeroPrevByWHOregionAndAgeGroup() {
  const state = useContext(ArboContext);

  const seroprevalenceData: {
    arbovirus: arbovirusesSF;
    AFR: Record<AgeGroup, number[]>;
    AMR: Record<AgeGroup, number[]>;
    EMR: Record<AgeGroup, number[]>;
    EUR: Record<AgeGroup, number[]>;
    SEAR: Record<AgeGroup, number[]>;
    WPR: Record<AgeGroup, number[]>;
  }[] = [];

  const medianData: {
    arbovirus: arbovirusesSF;
    data: {
      region: WHORegion;
      "Adults (18-64 years)": string;
      "Children and Youth (0-17 years)": string;
      "Seniors (65+ years)": string;
      "Multiple groups": string;
    }[];
  }[] = [];

  state.filteredData.forEach((d: any) => {
    const region: WHORegion = d.whoRegion;
    const arbovirus: arbovirusesSF = d.pathogen;
    const seroprevalence = parseFloat(d.seroprevalence);
    const ageGroup: AgeGroup = d.ageGroup ?? "Multiple groups";

    if (!seroprevalenceData.find((data) => data.arbovirus === arbovirus)) {
      seroprevalenceData.push({
        arbovirus: arbovirus,
        AFR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
        AMR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
        EMR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
        EUR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
        SEAR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
        WPR: {
          "Adults (18-64 years)": [],
          "Children and Youth (0-17 years)": [],
          "Seniors (65+ years)": [],
          "Multiple groups": [],
        },
      });
    }

    const existingData = seroprevalenceData.find(
      (data) => data.arbovirus === arbovirus
    );

    if (existingData) {
      if (
        existingData[region] &&
        Array.isArray(existingData[region][ageGroup])
      ) {
        existingData[region][ageGroup].push(seroprevalence);
      } else {
        console.error(
          `Unexpected region or ageGroup: ${region}, ${ageGroup}`,
          existingData
        );
      }
    } else {
      console.error(
        `Missing seroprevalence data. Unexpected arbovirus or error saving: ${arbovirus}`
      );
    }
  });

  seroprevalenceData.forEach((d) => {
    const dataToPush: {
      region: WHORegion;
      "Adults (18-64 years)": string;
      "Children and Youth (0-17 years)": string;
      "Seniors (65+ years)": string;
      "Multiple groups": string;
    }[] = WHORegions.map((region) => ({
      region,
      "Adults (18-64 years)": (
        median(d[region]["Adults (18-64 years)"]) * 100
      ).toFixed(1),
      "Children and Youth (0-17 years)": (
        median(d[region]["Children and Youth (0-17 years)"]) * 100
      ).toFixed(1),
      "Seniors (65+ years)": (
        median(d[region]["Seniors (65+ years)"]) * 100
      ).toFixed(1),
      "Multiple groups": (median(d[region]["Multiple groups"]) * 100).toFixed(
        1
      ),
    }));

    medianData.push({
      arbovirus: d.arbovirus,
      data: dataToPush,
    });
  });

  return (
    <div className="h-full flex flex-col">
      <div className="h-[90%] flex flex-row flex-wrap">
        {medianData.map((d, index) => {
          const width = medianData.length < 3 ? "w-full" : "w-1/2";
          const height =
            medianData.length === 1
              ? "h-full"
              : medianData.length < 5
              ? "h-1/2"
              : "h-1/3";

          return (
            <div
              className={clsx(width, height)}
              key={`med-sero-prev-who-age-${d.arbovirus}`}
            >
              <p className="w-full text-center ">
                {convertArboSFtoArbo(d.arbovirus)}
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  margin={{
                    top: 10,
                    right: 10,
                    left: index % 2 === 0 ? 0 : 40,
                    bottom: 40,
                  }}
                  width={500}
                  height={450}
                  data={d.data.filter((dataItem) => {
                    return Object.values(dataItem).some((v) => {
                      const val = parseFloat(v as string);
                      return typeof val === "number" && val > 0;
                    });
                  })}
                  barCategoryGap={1}
                  barGap={0}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="region"
                    interval={0}
                    tick={(props) => CustomXAxisTick({...props, tickSlant: 35 })}
                  />
                  <YAxis
                    domain={[0, 100]}
                    hide={index % 2 != 0}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <Tooltip itemStyle={{"color": "black"}} formatter={(value) => `${value}%`}/>
                  {Object.keys(ageGroupColorMappings).map((ageGroup) => (
                     <Bar
                      key={ageGroup}
                      dataKey={ageGroup}
                      fill={ageGroupColorMappings[ageGroup as AgeGroup]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center flex-wrap">
        {/* Legend */}
        {Object.keys(ageGroupColorMappings).map((ageGroup) => (
          <div className="w-fit m-2" key={ageGroup}>
            <div
              className="w-4 h-4 inline-block mr-2"
              style={{
                backgroundColor: ageGroupColorMappings[ageGroup as AgeGroup],
              }}
            ></div>
            {ageGroup}
          </div>
        ))}
      </div>
    </div>
  );
}

//Top 10 countries with most studies by pathogen

interface Top10CountriesByPathogenStudyCount extends dataStratifiedByArbovirus {
  country: string;
}

export function Top10CountriesByPathogenStudyCount() {
  const state = useContext(ArboContext);

  const data: Top10CountriesByPathogenStudyCount[] = [];

  state.filteredData.forEach((d: any) => {
    const country = d.country;
    const arbovirus: arboviruses = convertArboSFtoArbo(d.pathogen);

    const existingData = _.find(data, { country: country });

    if (existingData) {
      existingData[arbovirus]++;
    } else {
      data.push({
        country: country,
        Dengue: arbovirus === "Dengue" ? 1 : 0,
        Zika: arbovirus === "Zika" ? 1 : 0,
        Chikungunya: arbovirus === "Chikungunya" ? 1 : 0,
        "Yellow Fever": arbovirus === "Yellow Fever" ? 1 : 0,
        "West Nile": arbovirus === "West Nile" ? 1 : 0,
        Mayaro: arbovirus === "Mayaro" ? 1 : 0,
      });
    }
  });

  return (
    <div className="h-full flex flex-row flex-wrap">
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.Zika - a.Zika).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="Zika" fill={pathogenColors.ZIKV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.Dengue - a.Dengue).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="Dengue" fill={pathogenColors.DENV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.Chikungunya - a.Chikungunya).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="Chikungunya" fill={pathogenColors.CHIKV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data
            .sort((a, b) => b["Yellow Fever"] - a["Yellow Fever"])
            .slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="Yellow Fever" fill={pathogenColors.YF} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data
            .sort((a, b) => b["West Nile"] - a["West Nile"])
            .slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="West Nile" fill={pathogenColors.WNV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="33%">
        <BarChart
          margin={{
            top: 0,
            right: 0,
            left: 30,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.Mayaro - a.Mayaro).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis hide={true} dataKey="country" type="category" />
          <Legend verticalAlign="top" />
          <Tooltip itemStyle={{"color": "black"}} />
          <Bar dataKey="Mayaro" fill={pathogenColors.MAYV} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
