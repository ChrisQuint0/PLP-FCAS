import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "./AdminAuthModal.css";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "signIn" | "recovery";

export default function AdminAuthModal({ isOpen, onClose }: AdminAuthModalProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mode, setMode] = useState<AuthMode>("signIn");

  // Sign In State
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setSignInUsername("");
      setSignInPassword("");
      setRecoveryEmail("");
    }
  }, [isOpen, mode]);

  // QR Code Scanner Listener
  useEffect(() => {
    if (!isOpen || mode !== "signIn") return;

    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      if (currentTime - lastKeyTime > 50) {
        buffer = "";
      }

      if (e.key === "Enter" && buffer.length > 0) {
        e.preventDefault();
        
        const match = buffer.match(/\[(.*?)\]\[(.*?)\]/);
        
        if (match) {
          const username = match[1];
          const password = match[2];
          
          setSignInUsername(username);
          setSignInPassword(password);
          
          showToast("QR code scanned successfully. Signing in...", "success");
          
          setTimeout(() => {
            navigate("/admin/dashboard");
            onClose();
          }, 800);
        } else {
          showToast("Invalid QR code format.", "error");
        }
        buffer = "";
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
      
      lastKeyTime = currentTime;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mode, navigate, onClose, showToast]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInUsername && signInPassword) {
      showToast("Signed in successfully", "success");
      navigate("/admin/dashboard");
      onClose();
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryEmail) {
      showToast("QR code has been sent to the admin email address", "success");
      setMode("signIn");
    }
  };

  const handleQrSignInClick = () => {
    showToast("Scan the QR code using the scanner", "info");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>



        {mode === "signIn" && (
          <div className="auth-section">
            <h2 className="modal-title">Admin Account Sign In</h2>
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group full-width">
                <label>Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={signInUsername}
                  onChange={(e) => setSignInUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn full-width">
                SIGN IN
              </button>
            </form>
            <div className="link-text">
              <button className="action-link" onClick={handleQrSignInClick}>Or sign in using your QR code</button>
              <br />
              Forgot both your QR code and password? <button className="action-link" onClick={() => setMode("recovery")}>Get it via email</button>
            </div>
          </div>
        )}

        {mode === "recovery" && (
          <div className="auth-section">
            <h2 className="modal-title">Password and QR code recovery</h2>
            <form onSubmit={handleRecovery} className="auth-form">
              <div className="form-group full-width">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>
              <p className="recovery-note">Note: Make sure the email you entered is registered in the system.</p>
              <button type="submit" className="submit-btn full-width">
                SEND TO EMAIL
              </button>
            </form>
            <div className="link-text">
              <button className="action-link" onClick={() => setMode("signIn")}>Back to Sign in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
