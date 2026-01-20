import DrawerHeader from "./DrawerHeader";
import DrawerProgress from "./DrawerProgress";
import DrawerActions from "./DrawerActions";
import DrawerInfo from "./DrawerInfo";
import DrawerFeedback from "./DrawerFeedback";
import DrawerHistory from "./DrawerHistory";

export default function BinDetailDrawer() {
  const isOpen = true; // mock, sau gắn store

  if (!isOpen) return null;

  return (
    <aside className="absolute right-0 top-0 h-full w-[420px] border-l bg-white shadow-xl">
      <div className="flex h-full flex-col">
        <DrawerHeader />
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <DrawerProgress />
          <DrawerActions />
          <DrawerInfo />
          <DrawerFeedback />
          <DrawerHistory />
        </div>
      </div>
    </aside>
  );
}
