import { useEffect, useRef } from "react";

export default function Modal({ children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div
          ref={modalRef}
          className="bg-white p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
