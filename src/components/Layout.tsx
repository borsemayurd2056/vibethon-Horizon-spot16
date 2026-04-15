import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="min-h-screen">
      {showSidebar && <Sidebar />}
      <div className={`min-w-0 flex min-h-screen flex-col ${showSidebar ? "lg:ml-64" : ""}`}>
        <Navbar />
        <main className="flex-1 pt-16 page-fade">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
