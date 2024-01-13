const pathogenSFToLF: { [key: string]: string } = {
    "ZIKV": "Zika Virus",
    "DENV": "Dengue Virus",
    "CHIKV": "Chikungunya Virus",
    "YF": "Yellow Fever",
    "WNV": "West Nile Virus",
    "MAYV": "Mayaro Virus",
};

// What the...?
export type KnownPathogen = keyof typeof pathogenSFToLF extends infer Keys ? Keys extends string ? Keys : never : never;

export const getAllKnownPathogens = (): string[] => {
    return Object.keys(pathogenSFToLF);
  };

export const isKnownPathogen = (pathogen: string): pathogen is KnownPathogen => {
    return pathogen in pathogenSFToLF;
};

export const getLongFormPathogen = (pathogen: KnownPathogen): string => {
    if (!isKnownPathogen(pathogen)) {
        throw new Error(`Attempted to get the longform of pathogen ${pathogen} which does not exist.`)
    }
    return pathogenSFToLF[pathogen]
}

export const getAllLongFormPathogens = (): string[] => {
    return getAllKnownPathogens().map((pathogen) => {
        return getLongFormPathogen(pathogen)
    });
}