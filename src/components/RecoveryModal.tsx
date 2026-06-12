import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import "./RecoveryModal.css";

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecoveryModal({ isOpen, onClose }: RecoveryModalProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Recovery instructions sent to: ${email}`, "success");
    setEmail(""); // clear input
    onClose(); // close modal
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="recovery-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Account Recovery</h2>
        <p className="recovery-subtitle">
          Retrieve your Student Number and QR Code
        </p>

        <div className="modal-divider"></div>

        <form onSubmit={handleSubmit} className="recovery-form">
          <div className="form-group full-width">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="student@plpasig.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <small className="form-note">
              Note: Make sure the email you entered is registered in the system.
            </small>
          </div>

          <button type="submit" className="submit-btn full-width">
            SEND TO EMAIL
          </button>
        </form>
      </div>
    </div>
  );
}
