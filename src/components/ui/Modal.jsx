import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
  position = "center",
  contentClassName = "",
  showCloseButton = true,
  scrollable = true,
}) {
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

  const alignmentClasses =
    position === "right"
      ? "items-stretch justify-end"
      : "items-center justify-center";

  const wrapperClasses =
    position === "right"
      ? "relative w-full max-w-2xl h-full"
      : "relative w-full max-w-4xl";

  const contentSizingClasses =
    position === "right"
      ? "h-full"
      : scrollable
        ? "max-h-[90vh]"
        : "max-h-none";

  const overflowClasses = scrollable ? "overflow-y-auto" : "overflow-visible";
  const contentAlignmentClasses = position === "right" ? "" : "mx-auto";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4 py-10 flex ${alignmentClasses}`}
    >
      <div className={wrapperClasses}>
        <div
          ref={modalRef}
          className={`relative bg-white p-6 rounded-2xl shadow-2xl ${contentAlignmentClasses} ${overflowClasses} ${contentSizingClasses} ${contentClassName}`}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
