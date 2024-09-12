import { useContext, useCallback } from "react";
import { download, generateCsv, mkConfig } from "export-to-csv";

import { ToastContext, ToastId } from "@/contexts/toast-provider";
import { cn, typedObjectFromEntries } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DownloadCsvButtonConfiguration {
  buttonContent: React.ReactNode | string;
}

interface EnabledCitationButtonConfiguration {
  enabled: true;
  suggestedCitationText: string;
  csvDownloadFilename: string;
  citationToastId: ToastId;
  buttonContent: React.ReactNode | string;
}

interface DisabledCitationButtonConfiguration {
  enabled: false;
}

type CitationButtonConfiguration = EnabledCitationButtonConfiguration | DisabledCitationButtonConfiguration;

interface DashboardTopBannerProps {
  filteredData: Array<
    Record<string, string | number | string[] | undefined | null>
  >;
  dataTableRows: Array<{
    fieldName: string;
    label: string;
  }>;
  headerContent: React.ReactNode;
  downloadCsvButtonConfiguration: DownloadCsvButtonConfiguration;
  citationButtonConfiguration: CitationButtonConfiguration;
}

export const DashboardTopBanner = (props: DashboardTopBannerProps) => {
  const { openToast } = useContext(ToastContext);
  const { filteredData, dataTableRows, citationButtonConfiguration } = props;

  const downloadData = useCallback(() => {
    if(citationButtonConfiguration.enabled === false) {
      return;
    }

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: citationButtonConfiguration.csvDownloadFilename
    });

    const csv = generateCsv(csvConfig)(
      filteredData.map((dataPoint) => (
        typedObjectFromEntries(dataTableRows.map(({ fieldName, label }) => {
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
  }, [ filteredData, dataTableRows, citationButtonConfiguration ]);

  return (
    <div className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
      {props.headerContent}
      <Button
        className="w-[30%] bg-background hover:bg-backgroundHover"
        onClick={downloadData}
      >
        {props.downloadCsvButtonConfiguration.buttonContent}
      </Button>
      <Button
        className={cn(
          "w-[30%] bg-background hover:bg-backgroundHover ml-2",
          props.citationButtonConfiguration.enabled ? '' : 'hidden'
        )}
        onClick={() => {
          if(props.citationButtonConfiguration.enabled === false) {
            return;
          }

          navigator.clipboard.writeText(props.citationButtonConfiguration.suggestedCitationText);

          openToast({ toastId: props.citationButtonConfiguration.citationToastId })
        }}
      >
        {props.citationButtonConfiguration.enabled ? props.citationButtonConfiguration.buttonContent : 'No text'}
      </Button>
    </div>
  );
} 