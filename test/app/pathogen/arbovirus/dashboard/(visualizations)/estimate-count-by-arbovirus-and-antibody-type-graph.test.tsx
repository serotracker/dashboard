import { describe, expect, test } from 'vitest'
import {
  generateAntibodyForGraph,
  PossibleAntibodyForGraph,
  sortPossibleAntibodiesForGraph
} from '@/app/pathogen/arbovirus/dashboard/(visualizations)/estimate-count-by-arbovirus-and-antibody-type-graph';

describe('generateAntibodyForGraph', () => {
  test.each`
    antibodies                               | expectedOutput 
    ${["IgG", "IgM-capture"]}                | ${"IgG;IgM"}
    ${["NAb"]}                               | ${"NAb"}
    ${["IgM"]}                               | ${"IgM"}
    ${["IgG", "IgM", "IgAM"]}                | ${"Other"}
    ${["IgM", "IgG"]}                        | ${"IgG;IgM"}
    ${["IgG"]}                               | ${"IgG"}
    ${[]}                                    | ${undefined}
    ${["IgG-capture", "IgM-capture"]}        | ${"IgG;IgM"}
    ${["IgM-capture"]}                       | ${"IgM"}
    ${["IgM-capture", "IgG"]}                | ${"IgG;IgM"}
    ${["IgG", "IgM"]}                        | ${"IgG;IgM"}
    ${["IgG", "IgAM"]}                       | ${"Other"}
    ${["Total Ig"]}                          | ${"Total Ig"}
    ${["NAb", "IgG", "IgM"]}                 | ${"Other"}
    ${["IgG", "NAb"]}                        | ${"IgG;NAb"}
    ${["IgG-capture"]}                       | ${"IgG"}
    ${["IgM", "NAb"]}                        | ${"IgM;NAb"}
    ${["IgG", "IgM", "N Segment"]}           | ${"Other"}
    ${["NAb", "IgM"]}                        | ${"IgM;NAb"}
    ${["IgM-capture", "IgG-capture"]}        | ${"IgG;IgM"}
    ${["IgG", "IgG-capture", "IgM-capture"]} | ${"IgG;IgM"}
    ${["IgG-capture", "NAb"]}                | ${"IgG;NAb"}
    ${["IgM", "IgM-capture"]}                | ${"IgM"}
    ${["IgAM"]}                              | ${"Other"}
    ${["IgG", "IgM", "NAb"]}                 | ${"Other"}
    ${["IgAM", "IgM", "IgG"]}                | ${"Other"}
  `('should produce $expectedOutput for a antibodies of $antibodies', ({
    antibodies,
    expectedOutput,
  }: {
    antibodies: string[],
    expectedOutput: string,
  }) => {
    const { antibody } = generateAntibodyForGraph({ antibodies });

    expect(expectedOutput).toEqual(antibody);
  });
});

describe('sortPossibleAntibodiesForGraph', () => {
  test.each`
    unsortedInput                                                            | sortedOutput
    ${["NAb","IgG","IgM","IgG;IgM","Total Ig","IgG;NAb","IgM;NAb","Other"]}, | ${["IgG","IgG;IgM","IgG;NAb","IgM","IgM;NAb","NAb","Other","Total Ig"]}
  `('should sort $unsortedInput to $sortedOutput', ({
    unsortedInput,
    sortedOutput,
  }: {
    unsortedInput: PossibleAntibodyForGraph[],
    sortedOutput: PossibleAntibodyForGraph[],
  }) => {
    const output = unsortedInput
      .sort((antibodyA, antibodyB) => sortPossibleAntibodiesForGraph(antibodyA, antibodyB));

    expect(output).toEqual(sortedOutput);
  });
});