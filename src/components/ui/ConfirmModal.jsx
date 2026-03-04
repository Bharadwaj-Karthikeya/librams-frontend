import { createPortal } from "react-dom";
import Button from "./Button";

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading,
}) {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}