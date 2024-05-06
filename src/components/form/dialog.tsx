"use client";

import { useEffect, useRef } from "react";
import type { Dispatch, ReactElement, SetStateAction } from "react";

interface SearchDialogProps {
  isEnabled: boolean;
  setOutsideClick?: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

function Dialog({ children, isEnabled, setOutsideClick }: SearchDialogProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEnabled]);

  const handleOverlayClick = (): void => {
    if (setOutsideClick) setOutsideClick(false);
  };

  const handleModalClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
  };

  return (
    <dialog
      aria-labelledby="modal-title"
      aria-modal="true"
      className={`text-white fixed inset-0 z-10 flex h-screen w-screen items-center justify-center overflow-y-auto bg-black/30 backdrop-blur-sm ${
        isEnabled
          ? "pointer-events-auto opacity-100 transition-opacity duration-75 ease-in"
          : "pointer-events-none opacity-0 transition-opacity duration-75 ease-out"
      }`}
      onClick={handleOverlayClick}
    >
      <div onClick={handleModalClick} role="document">
        {children}
      </div>
    </dialog>
  );
}

export default Dialog;
