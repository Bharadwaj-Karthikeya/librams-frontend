import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4 py-10 flex items-center justify-center ">
      <div className="relative w-full max-w-4xl">
        <div
          ref={modalRef}
          className="bg-white p-6 rounded-2xl shadow-2xl "
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
    </div>,
    document.body
  );
}
