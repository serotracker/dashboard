/**
 * @file Filters Component
 * @description This component renders a set of filters for the Arboviruses dashboard.
 * It includes dropdowns for age group, sex, country, assay, producer, sample frame, antibody, and pathogen.
 * The filters are dynamically updated based on user interactions and are synchronized with the global state.
 * The component fetches arbovirus data and filter options from the API, rendering the filters once the data is available.
 * It uses the ArboContext to manage global state and interacts with the map using the mapboxgl library.
 *
 *
 * @see contexts/arbo-context.tsx
 * @see hooks/useArboData.tsx
 * @see components/customs/multi-select.tsx
 */

"use client";

import React, { useContext, useMemo } from "react";
import uniq from "lodash/uniq";
import { useArboData } from "@/hooks/arbovirus/useArboData";
import { useArboFilters } from "@/hooks/arbovirus/useArboFilters";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";

interface ArbovirusFiltersProps {
  className?: string;
}

export const ArbovirusFilters = (props: ArbovirusFiltersProps) => {
  const state = useContext(ArboContext);

  const { data } = useArboData();
  const { data: filterData } = useArboFilters();

  const selectedAgeGroups = state.selectedFilters['ageGroup'] ?? [];
  const selectedArboviruses = state.selectedFilters['pathogen'] ?? [];

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const arbovirusFilters = [
    FilterableField.pathogen
  ]

  const studyParameterFilters = [
    FilterableField.estimateType,
    FilterableField.studyPopulation
  ]

  const dateFilters = [
    FilterableField.start_date,
    FilterableField.end_date
  ]

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.unRegion,
    FilterableField.countryAlphaTwoCode,
    FilterableField.esm,
  ];

  const demographicFilters = [
    FilterableField.ageGroup,
    FilterableField.pediatricAgeGroup,
    FilterableField.sex,
    FilterableField.sampleFrame
  ].filter((field) => {
    /* If the 0-17 filter is not selected, don't show pediatric age group.*/
    if(
      field === FilterableField.pediatricAgeGroup && !(
        selectedAgeGroups.length === 1 &&
        selectedAgeGroups[0] === 'Children and Youth (0-17 years)'
      )
    ) {
      return false;
    }

    return true;
  });

  const testInformationFilters = [
    FilterableField.assay,
    FilterableField.producer,
    FilterableField.antibody,
    FilterableField.serotype
  ].filter((field) => {
    if(!selectedArboviruses.includes('DENV') && field === FilterableField.serotype) {
      return false;
    }

    return true;
  });

  const filterSections = [{
    headerText: 'Arboviruses',
    headerTooltipText: 'Filter on arbovirus strain.',
    includedFilters: arbovirusFilters
  }, 
  ...(oropoucheEnabled ? [{
    headerText: 'Study Parameters',
    headerTooltipText: 'Very basic filters to allow you to choose what kind of studies you are interested in.',
    includedFilters: studyParameterFilters
  }] : []),
  {
    headerText: 'Date',
    headerTooltipText: 'Filter on sample start and end date.',
    includedFilters: dateFilters
  }, {
    headerText: 'Study Location',
    headerTooltipText: 'Filter on where the study was conducted.',
    includedFilters: studyLocationFilters
  }, {
    headerText: 'Demographic',
    headerTooltipText: 'Filter on demographic variables, including population group, sex, and age group.',
    includedFilters: demographicFilters
  }, {
    headerText: 'Test Information',
    headerTooltipText: 'Filter according to serological measurement methods.',
    includedFilters: testInformationFilters
  }];

  // TEMPORARY SOLUTION
  // I'm deriving the filters on the front end here to keep the OROV stuff out.
  // Previous code:
  //    filterData={filterData?.arbovirusFilterOptions ? {
  //      whoRegion: filterData.arbovirusFilterOptions.whoRegion,
  //      unRegion: filterData.arbovirusFilterOptions.unRegion,
  //      countryAlphaTwoCode: filterData.arbovirusFilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode),
  //      // Filters that don't exist in the backend (such as the ESM filter) need to have their avaiable options added manually
  //      esm: [
  //        'dengue2015',
  //        'dengue2050',
  //        'zika'
  //      ],
  //      pathogen: filterData.arbovirusFilterOptions.pathogen,
  //      ageGroup: filterData.arbovirusFilterOptions.ageGroup,
  //      sex: filterData.arbovirusFilterOptions.sex,
  //      sampleFrame: filterData.arbovirusFilterOptions.sampleFrame,
  //      assay: filterData.arbovirusFilterOptions.assay,
  //      producer: filterData.arbovirusFilterOptions.producer,
  //      antibody: filterData.arbovirusFilterOptions.antibody,
  //      serotype: filterData.arbovirusFilterOptions.serotype,
  //      pediatricAgeGroup: filterData.arbovirusFilterOptions.pediatricAgeGroup
  //    } : {}}
  //TODO: Revert to using filterData?.arbovirusFilterOptions once the Oropouche stuff is released.

  const whoRegion = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.whoRegion)
      .filter((whoRegion): whoRegion is NonNullable<typeof whoRegion> => !!whoRegion)
    );
  }, [ data ]);

  const unRegion = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.unRegion)
      .filter((unRegion): unRegion is NonNullable<typeof unRegion> => !!unRegion)
    );
  }, [ data ]);

  const countryAlphaTwoCode = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? []).map((dataPoint) => dataPoint.countryAlphaTwoCode));
  }, [ data ]);

  const pathogen = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? []).map((dataPoint) => dataPoint.pathogen));
  }, [ data ]);

  const ageGroup = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.ageGroup)
      .filter((ageGroup): ageGroup is NonNullable<typeof ageGroup> => !!ageGroup)
    );
  }, [ data ]);

  const sex = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.sex)
      .filter((sex): sex is NonNullable<typeof sex> => !!sex)
    );
  }, [ data ]);

  const sampleFrame = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.sampleFrame)
      .filter((sampleFrame): sampleFrame is NonNullable<typeof sampleFrame> => !!sampleFrame)
    );
  }, [ data ]);

  const assay = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.assay)
      .filter((assay): assay is NonNullable<typeof assay> => !!assay)
    );
  }, [ data ]);

  const producer = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .map((dataPoint) => dataPoint.producer)
      .filter((producer): producer is NonNullable<typeof producer> => !!producer)
    );
  }, [ data ]);

  const antibody = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .flatMap((dataPoint) => dataPoint.antibodies)
      .filter((antibody): antibody is NonNullable<typeof antibody> => !!antibody)
    );
  }, [ data ]);

  const serotype = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .flatMap((dataPoint) => dataPoint.serotype)
      .filter((serotype): serotype is NonNullable<typeof serotype> => !!serotype)
    );
  }, [ data ]);

  const pediatricAgeGroup = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .flatMap((dataPoint) => dataPoint.pediatricAgeGroup)
      .filter((pediatricAgeGroup): pediatricAgeGroup is NonNullable<typeof pediatricAgeGroup> => !!pediatricAgeGroup)
    );
  }, [ data ]);

  const estimateType = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .flatMap((dataPoint) => dataPoint.estimateType)
    );
  }, [ data ]);

  const studyPopulation = useMemo(() => {
    return uniq((data?.arbovirusEstimates ?? [])
      .flatMap((dataPoint) => dataPoint.studyPopulation)
    );
  }, [ data ]);

  return (
    <Filters
      className={props.className}
      filterSections={filterSections}
      state={state}
      filterData={{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        // Filters that don't exist in the backend (such as the ESM filter) need to have their avaiable options added manually
        esm: [
          'dengue2015',
          'dengue2050',
          'zika'
        ],
        pathogen,
        ageGroup,
        sex,
        sampleFrame,
        assay,
        producer,
        antibody,
        serotype,
        pediatricAgeGroup,
        estimateType,
        studyPopulation
      }}
      data={data?.arbovirusEstimates ?? []}
      resetAllFiltersButtonEnabled={true}
    />
  )
}