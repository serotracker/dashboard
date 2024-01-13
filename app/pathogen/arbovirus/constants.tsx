interface PathogenInfo {
    longForm: string; // long form name
}

const pathogenConstants: { [key: string]: PathogenInfo } = {
    "DENV": { longForm: "Dengue Virus" },
    "ZIKV": { longForm: "Zika Virus" },
    "CHIKV": { longForm: "Chikungunya Virus"},
    "YF": { longForm: "Yellow Fever"},
    "WNV": { longForm: "West Nile Virus"},
    "MAYV": { longForm: "Mayaro Virus"},
};

export type KnownPathogen = keyof typeof pathogenConstants extends infer Keys ? Keys extends string ? Keys : never : never;

export const getAllKnownPathogens = (): string[] => {
    return Object.keys(pathogenConstants);
  };

export const isKnownPathogen = (pathogen: string): pathogen is KnownPathogen => {
    return pathogen in pathogenConstants;
};

export const getLongFormPathogen = (pathogen: KnownPathogen): string => {
    if (!isKnownPathogen(pathogen)) {
        throw new Error(`Attempted to get the longform of pathogen ${pathogen} which does not exist.`)
    }
    return pathogenConstants[pathogen].longForm
}

export const getAllLongFormPathogens = (): string[] => {
    return getAllKnownPathogens().map((pathogen) => {
        return getLongFormPathogen(pathogen)
    });
}