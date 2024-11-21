import { useCallback, useContext, useMemo, useState } from 'react';
import { ArbovirusAvailablePathogensContext } from '@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-available-pathogens-context';
import { ArbovirusVisualizationInformation } from './visualization-page-config';

interface UseArbovirusBreakdownVisualizationPaginationConfigurationInput {
  renderVisualization: ArbovirusVisualizationInformation<string, string, string, string, string>['renderVisualization']
}

interface UseArbovirusBreakdownVisualizationPaginationConfigurationOutput {
  renderVisualization: ArbovirusVisualizationInformation<string, string, string, string, string>['renderVisualization'],
  paginationConfiguration: ArbovirusVisualizationInformation<string, string, string, string, string>['paginationConfiguration']
}

export const useArbovirusBreakdownVisualizationPaginationConfiguration = (
  input: UseArbovirusBreakdownVisualizationPaginationConfigurationInput
): UseArbovirusBreakdownVisualizationPaginationConfigurationOutput => {
  const { renderVisualization: inputRenderVisualization } = input;
  const { availablePathogens } = useContext(ArbovirusAvailablePathogensContext);

  const [ currentPageIndex, setCurrentPageIndex ] = useState<number>(0);

  const { numberOfPagesAvailable, pageSize } = useMemo(() => {
    if(availablePathogens.length <= 6) {
      return {
        numberOfPagesAvailable: 1,
        pageSize: 6
      }
    } else {
      return {
        numberOfPagesAvailable: Math.ceil(availablePathogens.length / 4),
        pageSize: 4
      }
    }
  }, [ availablePathogens ]);

  const renderVisualization: typeof inputRenderVisualization = useCallback(({ data, highlightedDataPoint, hideArbovirusDropdown }) => {
    const pathogensForPage = availablePathogens.slice(
      0 + (pageSize * currentPageIndex),
      pageSize + (pageSize * currentPageIndex)
    );

    const dataForPage = data
      .filter((element) => pathogensForPage.includes(element.pathogen));

    return inputRenderVisualization({
      data: dataForPage,
      highlightedDataPoint,
      hideArbovirusDropdown
    });
  }, [ inputRenderVisualization, availablePathogens, pageSize, currentPageIndex ]);

  return {
    renderVisualization,
    paginationConfiguration: {
      numberOfPagesAvailable,
      currentPageIndex,
      setCurrentPageIndex
    }
  }
}