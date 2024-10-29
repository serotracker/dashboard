import { AppHeaderAndMain } from "../app-header-and-main";

interface GenericPathogenPageLayoutProps {
  children: React.ReactNode;
}

export const GenericPathogenPageLayout = (props: GenericPathogenPageLayoutProps) => (
  <AppHeaderAndMain>
    <div className={"grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-hidden border-box"}>
      {props.children}
    </div>
  </AppHeaderAndMain>
)