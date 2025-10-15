import AsideDirectoryPanel from "@/layouts/AsideDirectoryPanel";
import AsideMessageApp from "@/layouts/AsideMessageApp";
import MainMessage from "@/layouts/MainMessage";

export default function page() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AsideMessageApp />
      <MainMessage />
      <AsideDirectoryPanel />
    </div>
  );
}
