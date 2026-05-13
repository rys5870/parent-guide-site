"use client";
import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  /** מחליפים רוחב/גובה מקסימלי לתצוגה מקדימה וכדומה */
  panelClassName?: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  panelClassName,
}) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!modalRoot || !isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className={
          panelClassName ??
          "bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-xl md:max-w-2xl relative overflow-y-auto max-h-[90vh]"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;