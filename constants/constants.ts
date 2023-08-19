export const PAGES = {
    Explore: "Explore",
    Analyze: "Analyze",
    Data: "Data",
    Publications: "Publications",
    About: "About"
}

export const PAGE_HASHES = {
    [PAGES.Explore]: {
        Map: "Map",
    },
    [PAGES.Analyze]: {
        ByCountry: "ByCountry",
        ByPopulation: "ByPopulation",
        AdditionalGraphs: "AdditionalGraphs"
    },
    [PAGES.Data]: {
        DataDictionary: "DataDictionary",
        ChangeLog: "ChangeLog",
        SubmitSource: "SubmitSource",
        DownloadCsv: "DownloadCsv",
        AccessGithub: "AccessGithub",
        FAQ: "FAQ",
        DataTable: "DataTable"

    },
    [PAGES.Publications]: {
        ResearchArticles: "ResearchArticles",
        GeneralSerotrackerCommunications: "GeneralSerotrackerCommunications",
        BiblioDigests: "BiblioDigests",
        PrivateSectorReports: "PrivateSectorReports",
        MediaMentions: "MediaMentions"
    },
    [PAGES.About]: {
        ContactUs: "ContactUs",
        Team: "Team"
    }
}
