import { Download } from "lucide-react";
import { useState } from "react";
import { useFeedbacks } from "../../features/feedback/hooks";
import {
  FeedbackFilters,
  FeedbackSummary,
  FeedbackTable,
  FeedbackViewModal,
} from "../../features/feedback/components";
import { feedbackApi } from "../../features/feedback/api/feedbackApi";

const ManagerFeedbackPage = () => {
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const {
    feedbacks,
    isLoading,
    meta,
    filterParams,
    handleSearch,
    updateFilter,
    handlePageChange,
    handleClearFilters,
    delete: deleteFeedback,
    refetch,
  } = useFeedbacks();

  const handleViewFeedback = (id: string) => {
    console.log("Opening modal for feedback:", id);
    setSelectedFeedbackId(id);
    setShowModal(true);
  };

  const handleStatusChange = async (feedbackId: string, status: string) => {
    try {
      await feedbackApi.update(feedbackId, { status: status as any });
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      await feedbackApi.delete(feedbackId);
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      throw error;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Content wrapper */}
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              Phản hồi từ người dân
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Theo dõi, phân loại và xử lý các báo cáo vi phạm, sự cố rác thải.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
              <Download size={16} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Summary */}
        <FeedbackSummary feedbacks={feedbacks} />

        {/* Filters */}
        <FeedbackFilters
          onSearch={handleSearch}
          onStatusFilter={(status) => updateFilter("status", status)}
          onAreaFilter={(areaId) => updateFilter("areaId", areaId)}
          onBinFilter={(binId) => updateFilter("binId", binId)}
          onDateRangeFilter={(startDate, endDate) => {
            updateFilter("startDate", startDate);
            updateFilter("endDate", endDate);
          }}
          onClearFilters={handleClearFilters}
          defaultSearch={filterParams.search}
          defaultStatus={filterParams.status}
          defaultAreaId={filterParams.areaId}
          defaultBinId={filterParams.binId}
          defaultStartDate={filterParams.startDate}
          defaultEndDate={filterParams.endDate}
        />

        {/* Table */}
        <FeedbackTable
          data={feedbacks}
          isLoading={isLoading}
          page={meta.page}
          pageSize={meta.pageSize}
          totalItems={meta.totalItems}
          onPageChange={handlePageChange}
          onView={handleViewFeedback}
          onDelete={deleteFeedback}
        />

        {/* View Modal */}
        {selectedFeedbackId && showModal && (
          <>
            {console.log(
              "Rendering modal with feedbackId:",
              selectedFeedbackId,
            )}
            <FeedbackViewModal
              feedbackId={selectedFeedbackId}
              isOpen={showModal}
              onClose={() => {
                console.log("Closing modal");
                setShowModal(false);
                setSelectedFeedbackId(null);
              }}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteFeedback}
              onRefresh={refetch}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerFeedbackPage;
