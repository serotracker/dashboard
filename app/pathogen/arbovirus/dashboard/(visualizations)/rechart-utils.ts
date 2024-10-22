import { pathogenColors } from "../(map)/ArbovirusMap";
import { arboviruses } from "./recharts";

export const barColoursForArboviruses = {
  Zika: pathogenColors.ZIKV,
  Dengue: pathogenColors.DENV,
  Chikungunya: pathogenColors.CHIKV,
  "Yellow Fever": pathogenColors.YFV,
  "West Nile": pathogenColors.WNV,
  Mayaro: pathogenColors.MAYV,
  Oropouche: pathogenColors.OROV,
};

const sortOrderForArboviruses = {
  Zika: 1,
  Dengue: 2,
  Chikungunya: 3,
  "Yellow Fever": 4,
  "West Nile": 5,
  Mayaro: 6,
  Oropouche: 7
};

export const sortArboviruses = (a: arboviruses, b: arboviruses) => {
  return sortOrderForArboviruses[a] - sortOrderForArboviruses[b];
};
