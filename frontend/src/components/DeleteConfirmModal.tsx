import { AlertCircle, Loader } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  taskName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  taskName,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
          Xóa nhiệm vụ?
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Bạn có chắc chắn muốn xóa{" "}
          <span className="font-semibold">{taskName || "nhiệm vụ này"}</span>?
          Hành động này không thể hoàn tác.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader size={16} className="animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
