"use client";

import { ArboContext } from "@/contexts/arbo-context";
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
import { pathogenColors } from "../dashboard/(map)/MapAndFilters";

//Study by who region and pathogen

//Study count by pathogen and antibody type

type arboviruses = "DENV" | "ZIKV" | "CHIKV" | "YF" | "WNV" | "MAYV";

export function AntibodyPathogenBar() {
  const state = useContext(ArboContext);

  const data: {
    isotype: string;
    DENV: number;
    ZIKV: number;
    CHIKV: number;
    YF: number;
    WNV: number;
    MAYV: number;
  }[] = [];

  state.filteredData.forEach((d: any) => {
    const antibody = d.antibodies.sort().join(", ");
    const pathogen: arboviruses = d.pathogen;

    const existingData = _.find(data, { isotype: antibody });

    if (existingData) {
      existingData[pathogen]++;
    } else {
      data.push({
        isotype: antibody,
        DENV: pathogen === "DENV" ? 1 : 0,
        ZIKV: pathogen === "ZIKV" ? 1 : 0,
        CHIKV: pathogen === "CHIKV" ? 1 : 0,
        YF: pathogen === "YF" ? 1 : 0,
        WNV: pathogen === "WNV" ? 1 : 0,
        MAYV: pathogen === "MAYV" ? 1 : 0,
      });
    }
  });

  console.log(state.filteredData[0]);
  console.log(data);

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 60,
        }}
        width={730}
        height={250}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="isotype" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="DENV" stackId="a" fill={pathogenColors.DENV} />
        <Bar dataKey="ZIKV" stackId="a" fill={pathogenColors.ZIKV} />
        <Bar dataKey="CHIKV" stackId="a" fill={pathogenColors.CHIKV} />
        <Bar dataKey="YF" stackId="a" fill={pathogenColors.YF} />
        <Bar dataKey="WNV" stackId="a" fill={pathogenColors.WNV} />
        <Bar dataKey="MAYV" stackId="a" fill={pathogenColors.MAYV} />
      </BarChart>
    </ResponsiveContainer>
  );
}

//Seroprevalence per pathogen, WHO region and age group
// - Missing region data, need to calculate it, how?

// Cumulative study count over time by pathogen

export function StudyCountOverTime() {
  const state = useContext(ArboContext);

  const data: {
    year: number;
    DENV: number;
    ZIKV: number;
    CHIKV: number;
    YF: number;
    WNV: number;
    MAYV: number;
  }[] = [];

  state.filteredData.forEach((d: any) => {
    const date = new Date(d.sample_end_date);
    const year = date.getFullYear();
    const pathogen: arboviruses = d.pathogen;

    const existingData = _.find(data, { year: year });

    if (existingData) {
      existingData[pathogen]++;
    } else {
      data.push({
        year: year,
        DENV: pathogen === "DENV" ? 1 : 0,
        ZIKV: pathogen === "ZIKV" ? 1 : 0,
        CHIKV: pathogen === "CHIKV" ? 1 : 0,
        YF: pathogen === "YF" ? 1 : 0,
        WNV: pathogen === "WNV" ? 1 : 0,
        MAYV: pathogen === "MAYV" ? 1 : 0,
      });
    }
  });

  data.sort((a, b) => a.year - b.year);

  for (let i = 1; i < data.length; i++) {
    const element = data[i];

    element.DENV += data[i - 1].DENV;
    element.ZIKV += data[i - 1].ZIKV;
    element.CHIKV += data[i - 1].CHIKV;
    element.YF += data[i - 1].YF;
    element.WNV += data[i - 1].WNV;
    element.MAYV += data[i - 1].MAYV;
  }

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 60,
        }}
        width={730}
        height={250}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="DENV"
          stackId="1"
          stroke={pathogenColors.DENV}
          fill={pathogenColors.DENV}
        />
        <Area
          type="monotone"
          dataKey="ZIKV"
          stackId="1"
          stroke={pathogenColors.ZIKV}
          fill={pathogenColors.ZIKV}
        />
        <Area
          type="monotone"
          dataKey="CHIKV"
          stackId="1"
          stroke={pathogenColors.CHIKV}
          fill={pathogenColors.CHIKV}
        />
        <Area
          type="monotone"
          dataKey="YF"
          stackId="1"
          stroke={pathogenColors.YF}
          fill={pathogenColors.YF}
        />
        <Area
          type="monotone"
          dataKey="WNV"
          stackId="1"
          stroke={pathogenColors.WNV}
          fill={pathogenColors.WNV}
        />
        <Area
          type="monotone"
          dataKey="MAYV"
          stackId="1"
          stroke={pathogenColors.MAYV}
          fill={pathogenColors.MAYV}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

//Cumulative Study count over time by smaple frame

export function StudyCountOverTimeBySampleFrame() {
  const state = useContext(ArboContext);

  const sampleFrames = [
    "Community",
    "Positive cases of a different arbovirus",
    "Pregnant or parturient women",
    "Perinatal",
    "Inpatients",
    "Target group",
    "Students and Daycares",
    "Essential non-healthcare workers",
    "Positive or suspected cases",
    "Outpatients",
    "Blood donors",
  ];

  const data: { year: number; [key: string]: number }[] = [];

  state.filteredData.forEach((d: any) => {
    const year = new Date(d.sample_end_date).getFullYear();
    const sampleFrame = d.sample_frame;

    const existingData = data.find((d) => d.year === year);

    if (existingData) {
      existingData[sampleFrame]++;
    } else {
      const newData: { year: number; [key: string]: number } = { year: year };
      sampleFrames.forEach(
        (frame) => (newData[frame] = frame === sampleFrame ? 1 : 0)
      );
      data.push(newData);
    }
  });

  data.sort((a, b) => a.year - b.year);

  for (let i = 1; i < data.length; i++) {
    sampleFrames.forEach((frame) => (data[i][frame] += data[i - 1][frame]));
  }

  const sampleFrameColors: { [key: string]: string } = {
    Community: "#FF5733",
    "Positive cases of a different arbovirus": "#C70039",
    "Pregnant or parturient women": "#900C3F",
    Perinatal: "#581845",
    Inpatients: "#1C2833",
    "Target group": "#B2BABB",
    "Students and Daycares": "#2E4053",
    "Essential non-healthcare workers": "#D5D8DC",
    "Positive or suspected cases": "#85C1E9",
    Outpatients: "#AED6F1",
    "Blood donors": "#A569BD",
  };

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 60,
        }}
        width={730}
        height={500}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {sampleFrames.map((frame) => (
          <Area
            type="monotone"
            dataKey={frame}
            stackId="1"
            stroke={sampleFrameColors[frame]}
            fill={sampleFrameColors[frame]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

//Top 10 countries with most studies by pathogen

export function Top10CountriesByPathogenStudyCount() {
  const state = useContext(ArboContext);

  const data: {
    country: string;
    DENV: number;
    ZIKV: number;
    CHIKV: number;
    YF: number;
    WNV: number;
    MAYV: number;
  }[] = [];

  state.filteredData.forEach((d: any) => {
    const country = d.country;
    const pathogen: arboviruses = d.pathogen;

    const existingData = _.find(data, { country: country });

    if (existingData) {
      existingData[pathogen]++;
    } else {
      data.push({
        country: country,
        DENV: pathogen === "DENV" ? 1 : 0,
        ZIKV: pathogen === "ZIKV" ? 1 : 0,
        CHIKV: pathogen === "CHIKV" ? 1 : 0,
        YF: pathogen === "YF" ? 1 : 0,
        WNV: pathogen === "WNV" ? 1 : 0,
        MAYV: pathogen === "MAYV" ? 1 : 0,
      });
    }
  });

  return (
    <div className="h-full flex flex-row flex-wrap">
      <ResponsiveContainer width="50%" height="28%">
          <BarChart
            margin={{
              top: 10,
              right: 30,
              left: 40,
              bottom: 0,
            }}
            layout="vertical"
            width={500}
            height={250}
            data={data.sort((a, b) => b.DENV - a.DENV).slice(0, 10)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="country" type="category" />
            <Tooltip />
            <Bar dataKey="DENV" fill={pathogenColors.DENV} />
          </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="28%">
        <BarChart
          margin={{
            top: 10,
            right: 30,
            left: 40,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.ZIKV - a.ZIKV).slice(0, 10)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Tooltip />
          <Bar dataKey="ZIKV" fill={pathogenColors.ZIKV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="28%">
        <BarChart
          margin={{
            top: 10,
            right: 30,
            left: 40,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.CHIKV - a.CHIKV).slice(0, 10)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Tooltip />
          <Bar dataKey="CHIKV" fill={pathogenColors.CHIKV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="28%">
        <BarChart
          margin={{
            top: 10,
            right: 30,
            left: 40,
            bottom: 0,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.YF - a.YF).slice(0, 10)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Tooltip />
          <Bar dataKey="YF" fill={pathogenColors.YF} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="28%">
        <BarChart
          margin={{
            top: 10,
            right: 30,
            left: 40,
            bottom: 20,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.WNV - a.WNV).slice(0, 10)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Tooltip />
          <Bar dataKey="WNV" fill={pathogenColors.WNV} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="50%" height="28%">
        <BarChart
          margin={{
            top: 10,
            right: 30,
            left: 40,
            bottom: 20,
          }}
          layout="vertical"
          width={500}
          height={250}
          data={data.sort((a, b) => b.MAYV - a.MAYV).slice(0, 10)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Tooltip />
          <Bar dataKey="MAYV" fill={pathogenColors.MAYV} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
