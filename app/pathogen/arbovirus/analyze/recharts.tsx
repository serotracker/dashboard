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

// TODO: future enhancement if needed is to extract the function to build the data and keep things cleaner (may not be needed, more readalbe this way

//Study count by pathogen and antibody type

type arbovirusesSF = "DENV" | "ZIKV" | "CHIKV" | "YF" | "WNV" | "MAYV";
type arboviruses = "Dengue" | "Zika" | "Chikengunia" | "Yellow Fever" | "West Nile" | "Mayaro";

const convertArboSFtoArbo = (arbo: arbovirusesSF): arboviruses => {
    switch (arbo) {
        case "DENV":
        return "Dengue";
        case "ZIKV":
        return "Zika";
        case "CHIKV":
        return "Chikengunia";
        case "YF":
        return "Yellow Fever";
        case "WNV":
        return "West Nile";
        case "MAYV":
        return "Mayaro";
    }
}

interface dataStratifiedByArbovirus {
    // X axis variable would be appended here
    Zika: number;
    Dengue: number;
    Chikengunia: number;
    'Yellow Fever': number;
    'West Nile': number;
    Mayaro: number;
}

interface AntibodyIsotypeArbovirusData extends dataStratifiedByArbovirus {
    isotype: string;
} 

export function AntibodyPathogenBar() {
  const state = useContext(ArboContext);

  const data: AntibodyIsotypeArbovirusData[] = [];

  state.filteredData.forEach((d: any) => {
    const antibody = d.antibodies.sort().join(", ");
    const arbovirus: arboviruses = convertArboSFtoArbo(d.pathogen);

    const existingData = _.find(data, { isotype: antibody });

    if (existingData) {
      existingData[arbovirus]++;
    } else {
      data.push({
        isotype: antibody,
        Zika: arbovirus === "Zika" ? 1 : 0,
        Dengue: arbovirus === "Dengue" ? 1 : 0,
        Chikengunia: arbovirus === "Chikengunia" ? 1 : 0,
        'Yellow Fever': arbovirus === "Yellow Fever" ? 1 : 0,
        'West Nile': arbovirus === "West Nile" ? 1 : 0,
        Mayaro: arbovirus === "Mayaro" ? 1 : 0,
      });
    }
  });

  console.log(data);

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        width={730}
        height={250}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="isotype" />
        <YAxis />
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{right: -10}}/>        
        <Bar dataKey="Zika" stackId="a" fill={pathogenColors.ZIKV} />
        <Bar dataKey="Dengue" stackId="a" fill={pathogenColors.DENV} />
        <Bar dataKey="Chikengunia" stackId="a" fill={pathogenColors.CHIKV} />
        <Bar dataKey="Yellow Fever" stackId="a" fill={pathogenColors.YF} />
        <Bar dataKey="West Nile" stackId="a" fill={pathogenColors.WNV} />
        <Bar dataKey="Mayaro" stackId="a" fill={pathogenColors.MAYV} />
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
    const year = new Date(d.sample_end_date).getFullYear();
    let arbovirus: arboviruses = convertArboSFtoArbo(d.pathogen);

    const existingData = _.find(data, { year: year });

    if (existingData) {
      existingData[arbovirus]++;
    } else {
      data.push({
        year: year,
        Zika: arbovirus === "Zika" ? 1 : 0,
        Dengue: arbovirus === "Dengue" ? 1 : 0,
        Chikengunia: arbovirus === "Chikengunia" ? 1 : 0,
        'Yellow Fever': arbovirus === "Yellow Fever" ? 1 : 0,
        'West Nile': arbovirus === "West Nile" ? 1 : 0,
        Mayaro: arbovirus === "Mayaro" ? 1 : 0,
      });
    }
  });

  data.sort((a, b) => a.year - b.year);

  for (let i = 1; i < data.length; i++) {
    const element = data[i];

    element.Dengue += data[i - 1].Dengue;
    element.Zika += data[i - 1].Zika;
    element.Chikengunia += data[i - 1].Chikengunia;
    element['Yellow Fever'] += data[i - 1]['Yellow Fever'];
    element['West Nile'] += data[i - 1]['West Nile'];
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
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{right: -10}}/>        
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
          dataKey="Chikengunia"
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
        Chikengunia: arbovirus === "Chikengunia" ? 1 : 0,
        'Yellow Fever': arbovirus === "Yellow Fever" ? 1 : 0,
        'West Nile': arbovirus === "West Nile" ? 1 : 0,
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
          <YAxis dataKey="country" type="category" />
          <Legend verticalAlign="top"/>
          <Tooltip />
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
            <YAxis dataKey="country" type="category" />
            <Legend verticalAlign="top"/>
            <Tooltip />
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
          data={data.sort((a, b) => b.Chikengunia - a.Chikengunia).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Legend verticalAlign="top"/>
          <Tooltip />
          <Bar dataKey="Chikengunia" fill={pathogenColors.CHIKV} />
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
          data={data.sort((a, b) => b["Yellow Fever"] - a["Yellow Fever"]).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Legend verticalAlign="top"/>
          <Tooltip />
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
          data={data.sort((a, b) => b['West Nile'] - a['West Nile']).slice(0, 10)}
        >
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" />
          <Legend verticalAlign="top"/>
          <Tooltip />
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
          <YAxis dataKey="country" type="category" />
          <Legend verticalAlign="top"/>
          <Tooltip />
          <Bar dataKey="Mayaro" fill={pathogenColors.MAYV} />
        </BarChart>
      </ResponsiveContainer>
    </div>
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
      <ResponsiveContainer width={"100%"}>
        <AreaChart
          margin={{
            top: 0,
            right: 30,
            left: 0,
            bottom: 0,
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
              key={frame}
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