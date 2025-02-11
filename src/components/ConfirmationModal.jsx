import { useEffect } from "react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmation", 
  message = "Are you sure?", 
  confirmText = "Yes", 
  cancelText = "No",
  imagePreview = null // Untuk preview gambar jika ada
}) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-center text-xl font-bold text-red-500">
          {title}
        </h2>
        <hr className="mb-4 border-t-2 border-red-500" />

        {imagePreview && (
          <div className="flex justify-center mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-64 h-48 object-contain rounded-md shadow"
            />
          </div>
        )}

        <p className="text-center text-sm text-gray-700">{message}</p>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onConfirm}
            className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 transition"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
