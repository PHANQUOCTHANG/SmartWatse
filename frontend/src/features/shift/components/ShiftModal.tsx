import React from "react";

export const ShiftModal: React.FC<{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white p-4 rounded shadow z-10 w-full max-w-lg">
        <button className="float-right" onClick={onClose}>
          Close
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
