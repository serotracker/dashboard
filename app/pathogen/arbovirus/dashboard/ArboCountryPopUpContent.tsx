
interface ArboCountryPopupContentProps {
  record: any;
}

export function ArboCountryPopupContent({ record }: ArboCountryPopupContentProps): React.ReactNode {
  return <div> {record.countryName} </div>
}