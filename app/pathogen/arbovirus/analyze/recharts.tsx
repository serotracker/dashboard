"use client"

import { ArboContext } from '@/contexts/arbo-context';
import { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { pathogenColors } from '../dashboard/(map)/MapAndFilters';


//Study by who region and pathogen


//Study count by pathogen and antibody type

type arboviruses = "DENV" | "ZIKV" | "CHIKV" | "YF" | "WNV" | "MAYV";

export function AntibodyPathogenBar() {
    
    const state = useContext(ArboContext);
    
    const data: {
        isotype: string,
        DENV: number,
        ZIKV: number,
        CHIKV: number,
        YF: number,
        WNV: number,
        MAYV: number
    }[] = []


    state.filteredData.forEach((d: any) => {
        const antibody = d.antibodies.sort().join(', ');
        const pathogen:arboviruses = d.pathogen;

        const existingData = _.find(data, { isotype: antibody });

        if (existingData) {
            existingData[pathogen]++;
        } else {
            data.push({
                isotype: antibody,
                DENV: pathogen === 'DENV' ? 1 : 0,
                ZIKV: pathogen === 'ZIKV' ? 1 : 0,
                CHIKV: pathogen === 'CHIKV' ? 1 : 0,
                YF: pathogen === 'YF' ? 1 : 0,
                WNV: pathogen === 'WNV' ? 1 : 0,
                MAYV: pathogen === 'MAYV' ? 1 : 0
            });
        }
    });

    console.log(data)


    return (
        <ResponsiveContainer width={"100%"} height={"100%"} >
            <BarChart width={730} height={250} data={data}>
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
        
    )
}




//Seroprevalence per pathogen, WHO region and age group

// Cumulative study count over time by pathogen

//Cumulative Study count over time by smaple frame

//Top 10 countries with most studies by pathogen