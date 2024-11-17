import { useContext, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { assertNever } from "assert-never";

import { ToastContext, ToastId } from "@/contexts/toast-provider";
import { cn, typedObjectFromEntries } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardType, dashboardTypeToRouteName } from "@/app/app-header-and-main";
import { DashboardSectionId } from "@/app/pathogen/generic-pathogen-dashboard-page";

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
  citationText: string;
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
  dashboardType: (
    DashboardType.ARBOVIRUS |
    DashboardType.SARS_COV_2 |
    DashboardType.MERS
  ),
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
  const router = useRouter();
  const {
    dashboardType,
    downloadCsvButtonOneConfiguration,
    downloadCsvButtonTwoConfiguration,
    citationButtonConfiguration,
    dataLastUpdatedNoteConfiguration,
    mapButtonConfiguration,
    dataButtonConfiguration,
    visualizationsButtonConfiguration
  } = props;

  const navigationButtonSectionData = useMemo(() => [{
    sectionId: DashboardSectionId.MAP,
    header: mapButtonConfiguration.header,
    text: mapButtonConfiguration.text,
    route: `/pathogen/${dashboardTypeToRouteName[dashboardType]}/dashboard#${DashboardSectionId.MAP}`
  }, {
    sectionId: DashboardSectionId.TABLE,
    header: dataButtonConfiguration.header,
    text: dataButtonConfiguration.text,
    route: `/pathogen/${dashboardTypeToRouteName[dashboardType]}/dashboard#${DashboardSectionId.TABLE}`
  }, {
    sectionId: DashboardSectionId.VISUALIZATIONS,
    header: visualizationsButtonConfiguration.header,
    text: visualizationsButtonConfiguration.text,
    route: `/pathogen/${dashboardTypeToRouteName[dashboardType]}/dashboard#${DashboardSectionId.VISUALIZATIONS}`
  }], [ mapButtonConfiguration, dataButtonConfiguration, visualizationsButtonConfiguration, dashboardType ]);

  const navigationButtonColourClassName = useMemo(() => {
    if(dashboardType === DashboardType.ARBOVIRUS) {
      return 'bg-arbovirus hover:bg-arbovirusHover';
    }
    if(dashboardType === DashboardType.SARS_COV_2) {
      return 'bg-sc2virus hover:bg-sc2virusHover';
    }
    if(dashboardType === DashboardType.MERS) {
      return 'bg-mers hover:bg-mersHover';
    }

    assertNever(dashboardType)
  }, [ dashboardType ]);

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
      )).map((element) => ({ ...element, 'Citation': downloadCsvButtonConfiguration.citationText}))
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
            //citationButtonConfiguration.enabled === false && dataLastUpdatedNoteConfiguration.enabled === true ? '' : 'hidden'
            ''
          )}>
            <p className='italic text-sm'>
              {dataLastUpdatedNoteConfiguration.enabled ? dataLastUpdatedNoteConfiguration.dataLastUpdatedText : 'No text'}
            </p>
          </div>
        </div>
        <p className={cn(
          'w-full italic text-sm mt-4',
          //citationButtonConfiguration.enabled === true && dataLastUpdatedNoteConfiguration.enabled === true ? '' : 'hidden'
          'hidden'
        )}> {dataLastUpdatedNoteConfiguration.enabled ? dataLastUpdatedNoteConfiguration.dataLastUpdatedText : 'No text'} </p>
      </div>
      <div className="w-full flex mt-2">
        {navigationButtonSectionData.map((sectionData) => (
          <div className="w-[33%] h-fit" key={sectionData.sectionId}>
            <div className={cn(
              'rounded-md border border-background mx-4',
              navigationButtonColourClassName
            )}>
              <button className="w-full h-full p-4" onClick={() => {router.push(sectionData.route)}}>
                <b className="text-white">{sectionData.header}</b>
                <p className="text-sm text-white">{sectionData.text}</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 