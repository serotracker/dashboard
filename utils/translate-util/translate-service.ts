import English from "./en.json";
import French from "./fr.json";
import German from './de.json'
import _ from "lodash";

export const toPascalCase = (str: string) => _.upperFirst(_.camelCase(str));

export enum LanguageType {
    french = "fr",
    english = "en",
    german = "de",
  }

interface TranslateStringProps {
  text: string;
}

// Recursive Typings for nested JSON objects
type JsonRecord<T> = Record<string, T | string>;
interface Json extends JsonRecord<Json> {}

const translations = {
  "en": English,
  "fr": French,
  "de": German
}

const recursiveFind = (object: any, keys: string[], index: number): string => {
  const key = keys[index];
  const nextObj = object[key];

  if (index + 1 === keys.length) {
    return nextObj;
  }
  return recursiveFind(nextObj, keys, index + 1);
};

let language: LanguageType = LanguageType.english;

export const getLanguageType = () => {
  return language;
}

/**
 * Used to translate JSON based on language and return a string
 * @param text
 * @param specifier
 * @param substitution
 * @param addSpaces
 * @returns string
 */
export default function Translate(
  text: string,
  specifier: string[] | null = null,
  substitution: Record<string, string | number> | null = null,
  addSpaces: [boolean, boolean] | null = null
): string {
  let translationDictionary: Json = translations[language] as Json;

  try {
    let translatedString = translationDictionary[text];

    if (!translatedString) {
      return specifier ? specifier[specifier.length - 1] : text;
    }

    if (specifier) {
      translatedString = recursiveFind(translatedString, specifier, 0);
    }

    if (substitution) {
      Object.keys(substitution).forEach((key) => {
        const value = substitution[key];
        const replace = new RegExp(key, "g");
        translatedString = (translatedString as string).replace(
          replace,
          `${value}`
        );
      });
    }

    if (addSpaces && addSpaces[0]) {
      translatedString = " " + translatedString;
    }

    if (addSpaces && addSpaces[1]) {
      translatedString += " ";
    }
    return translatedString as string;
  } catch (e) {
    return `No translation for string ${text}`;
  }
}

/**
 * Used to translate JSON based on language and return an object
 * @param text
 * @returns object
 */
export function TranslateObject(text: string): object {

  let translationDictionary: Json = translations[language] as Json;

  try {
    return translationDictionary[text] as object;
  } catch (e) {
    return { error: `No translation object for string ${text}` };
  }
}

/**
 * Used to translate and localize dates
 * @param dateString with format `{YYYY-MM-DD}T{HH:MM:SS}`
 * @returns string
 */
 export function TranslateDate(dateString: string): string {

  let formattedDateString: string = "-";

  try {
    const dateTimeFormat = new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    formattedDateString = dateTimeFormat.format(new Date(dateString));
  } catch (e) {
    console.error(`Unable to format date ${dateString}. Check data`);
  }

  // TODO: Need to catch errors here
  return formattedDateString
}

export const translateAntibodyTargets = (antibodyTarget: string | string[]) => {
  if (typeof antibodyTarget == "string") {
    return Translate("AntibodyTargetOptions", [antibodyTarget.replace(/\s/g, "")])
  }
  else {
    const initialValue = ""
    let returnString = antibodyTarget.reduce((previousValue, currentValue) => previousValue
        + Translate("AntibodyTargetOptions", [currentValue.replace(/\s/g, "")]) + ", ", initialValue)
    return returnString.slice(0, -2)
  }
}