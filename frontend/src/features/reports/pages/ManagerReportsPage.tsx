import BinStatusDonut from "../components/BinStatusDonut"
import CollectionTrendChart from "../components/CollectionTrendChart"
import RecentCollectionTable from "../components/RecentCollectionTable"
import ReportFilters from "../components/ReportFilters"
import ReportSummaryCards from "../components/ReportSummaryCards"
import TopStaffList from "../components/TopStaffList"

const ManagerReportsPage = () => {
  return (
    <div className="p-6 bg-[#F6F8FA] min-h-screen space-y-6">
      {/* Filters */}
      <ReportFilters />

      {/* Summary */}
      <ReportSummaryCards />

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <CollectionTrendChart />
        </div>
        <BinStatusDonut />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-3 gap-6">
        <TopStaffList />
        <div className="col-span-2">
          <RecentCollectionTable />
        </div>
      </div>
    </div>
  )
}

export default ManagerReportsPage
