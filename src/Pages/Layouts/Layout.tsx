import { ReactNode } from "react";
import ResponsiveAppBar from "../../Components/ResponsiveAppBar";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-full min-h-screen justify-between items-center">
        <ResponsiveAppBar />
        <main className="p-4 md:p-10 xl:p-20 w-full 2xl:max-w-screen-2xl">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
