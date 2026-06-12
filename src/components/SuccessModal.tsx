import { useEffect, useState } from "react";
import "./SuccessModal.css";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Auto-close after 3 seconds with animation
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for the 300ms closing animation to finish
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`success-overlay ${isClosing ? "closing-overlay" : ""}`}>
      <div className={`success-content ${isClosing ? "closing" : ""}`}>
        <div className="success-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 className="success-title">Success!</h2>
        <p className="success-message">{message}</p>
      </div>
    </div>
  );
}
