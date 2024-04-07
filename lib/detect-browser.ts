export enum Browser {
  CHROME = "CHROME",
  OTHER = "OTHER",
}

export const detectBrowser = () => {
  try {
    if (navigator.userAgent.includes("Chrome")) {
      return Browser.CHROME;
    }

    return Browser.OTHER;
  } catch {
    return Browser.OTHER;
  }
};
