import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-amber-50 min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}
