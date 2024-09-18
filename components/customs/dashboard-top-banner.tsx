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

interface DashboardTopBannerProps {
  headerContent: React.ReactNode;
  downloadCsvButtonOneConfiguration: DownloadCsvButtonConfiguration;
  downloadCsvButtonTwoConfiguration: DownloadCsvButtonConfiguration | {
    enabled: false;
  };
  citationButtonConfiguration: CitationButtonConfiguration;
  dataLastUpdatedNoteConfiguration: DataLastUpdatedNoteConfiguration;
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
    <div className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
      {props.headerContent}
      <div className="relative">
        <Button
          className="w-[30%] bg-background hover:bg-backgroundHover"
          onClick={() => downloadData(downloadCsvButtonOneConfiguration)}
        >
          {props.downloadCsvButtonOneConfiguration.buttonContent}
        </Button>
        <Button
          className={cn(
            "w-[30%] bg-background hover:bg-backgroundHover ml-2",
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
            "w-[30%] bg-background hover:bg-backgroundHover ml-2",
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
          'w-auto ml-2 inline-flex absolute right-0 bottom-0',
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
  );
} 