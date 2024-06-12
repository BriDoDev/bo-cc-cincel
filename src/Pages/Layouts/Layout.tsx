import { ReactNode } from "react";
import ResponsiveAppBar from "../../Components/ResponsiveAppBar";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-full min-h-screen justify-start gap-8 items-center">
        <ResponsiveAppBar />
        <main className="p-4 w-full xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
