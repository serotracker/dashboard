import { useContext, useCallback } from "react";
import { download, generateCsv, mkConfig } from "export-to-csv";

import { ToastContext, ToastId } from "@/contexts/toast-provider";
import { cn, typedObjectFromEntries } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DownloadCsvButtonConfiguration {
  enabled: true;
  buttonContent: React.ReactNode | string;
  filteredData: Array<
    Record<string, string | number | string[] | undefined | null | boolean>
  >;
  dataTableRows: Array<{
    fieldName: string;
    label: string;
  }>;
  csvDownloadFilename: string;
}

interface EnabledCitationButtonConfiguration {
  enabled: true;
  suggestedCitationText: string;
  citationToastId: ToastId;
  buttonContent: React.ReactNode | string;
}

interface DisabledCitationButtonConfiguration {
  enabled: false;
}

type CitationButtonConfiguration = EnabledCitationButtonConfiguration | DisabledCitationButtonConfiguration;

interface EnabledDataLastUpdatedNoteConfiguration {
  enabled: true;
  dataLastUpdatedText: string;
}

interface DisabledDataLastUpdatedNoteConfiguration {
  enabled: false;
}

type DataLastUpdatedNoteConfiguration = EnabledDataLastUpdatedNoteConfiguration | DisabledDataLastUpdatedNoteConfiguration;

interface DashboardSectionButtonConfiguration {
  header: string;
  text: string;
}

interface DashboardTopBannerProps {
  headerContent: React.ReactNode;
  downloadCsvButtonOneConfiguration: DownloadCsvButtonConfiguration;
  downloadCsvButtonTwoConfiguration: DownloadCsvButtonConfiguration | {
    enabled: false;
  };
  citationButtonConfiguration: CitationButtonConfiguration;
  dataLastUpdatedNoteConfiguration: DataLastUpdatedNoteConfiguration;
  mapButtonConfiguration: DashboardSectionButtonConfiguration;
  dataButtonConfiguration: DashboardSectionButtonConfiguration;
  visualizationsButtonConfiguration: DashboardSectionButtonConfiguration;
}

export const DashboardTopBanner = (props: DashboardTopBannerProps) => {
  const { openToast } = useContext(ToastContext);
  const { downloadCsvButtonOneConfiguration, downloadCsvButtonTwoConfiguration, citationButtonConfiguration, dataLastUpdatedNoteConfiguration } = props;

  const downloadData = useCallback((downloadCsvButtonConfiguration: DownloadCsvButtonConfiguration) => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: downloadCsvButtonConfiguration.csvDownloadFilename
    });

    const csv = generateCsv(csvConfig)(
      downloadCsvButtonConfiguration.filteredData.map((dataPoint) => (
        typedObjectFromEntries(downloadCsvButtonConfiguration.dataTableRows.map(({ fieldName, label }) => {
          const value = dataPoint[fieldName]

          if(Array.isArray(value)) {
            const joinedArrayValue = value.join(";")

            return [label, joinedArrayValue];
          }

          return [label, value]
        }))
      ))
    );

    download(csvConfig)(csv);
  }, []);

  return (
    <>
      <div className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
        {props.headerContent}
        <div className="relative">
          <Button
            className="w-[30%] bg-background hover:bg-backgroundHover h-full"
            onClick={() => downloadData(downloadCsvButtonOneConfiguration)}
          >
            {props.downloadCsvButtonOneConfiguration.buttonContent}
          </Button>
          <Button
            className={cn(
              "w-[30%] bg-background hover:bg-backgroundHover ml-2 h-full",
              props.downloadCsvButtonTwoConfiguration.enabled ? '' : 'hidden'
            )}
            onClick={() => {
              if(downloadCsvButtonTwoConfiguration.enabled === false) {
                return;
              }
              downloadData(downloadCsvButtonTwoConfiguration)
            }}
          >
            {props.downloadCsvButtonTwoConfiguration.enabled ? props.downloadCsvButtonTwoConfiguration.buttonContent : 'No text'}
          </Button>
          <Button
            className={cn(
              "w-[30%] bg-background hover:bg-backgroundHover ml-2 h-full",
              citationButtonConfiguration.enabled ? '' : 'hidden'
            )}
            onClick={() => {
              if(citationButtonConfiguration.enabled === false) {
                return;
              }

              navigator.clipboard.writeText(citationButtonConfiguration.suggestedCitationText);

              openToast({ toastId: citationButtonConfiguration.citationToastId })
            }}
          >
            {citationButtonConfiguration.enabled ? citationButtonConfiguration.buttonContent : 'No text'}
          </Button>
          <div className={cn(
            'w-auto ml-2 inline-flex absolute right-0 bottom-0 max-w-[35%]',
            citationButtonConfiguration.enabled === false && dataLastUpdatedNoteConfiguration.enabled === true ? '' : 'hidden'
          )}>
            <p className='italic text-sm'>
              {dataLastUpdatedNoteConfiguration.enabled ? dataLastUpdatedNoteConfiguration.dataLastUpdatedText : 'No text'}
            </p>
          </div>
        </div>
        <p className={cn(
          'w-full italic text-sm mt-4',
          citationButtonConfiguration.enabled === true && dataLastUpdatedNoteConfiguration.enabled === true ? '' : 'hidden'
        )}> {dataLastUpdatedNoteConfiguration.enabled ? dataLastUpdatedNoteConfiguration.dataLastUpdatedText : 'No text'} </p>
      </div>
      <div className="w-full flex mt-2">
        <div className="w-[33%] h-fit">
          <div className="rounded-md border border-background mx-4 bg-mers hover:bg-mersHover">
            <button className="w-full h-full p-4">
              <b className="text-white">Map</b>
              <p className="text-sm text-white">A map displaying MERS serosurveys, viral testing, and genomic sequencing data across the globe.</p>
            </button>
          </div>
        </div>
        <div className="w-[33%] h-fit">
          <div className="rounded-md border border-background mx-4 bg-mers hover:bg-mersHover">
            <button className="w-full h-full p-4">
              <b className="text-white">Data</b>
              <p className="text-sm text-white">View or download our entire MERS dataset.</p>
            </button>
          </div>
        </div>
        <div className="w-[33%] h-fit">
          <div className="rounded-md border border-background mx-4 bg-mers hover:bg-mersHover">
            <button className="w-full h-full p-4">
              <b className="text-white">Visualizations</b>
              <p className="text-sm text-white">A collection of visualizations for our MERS dataset.</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 