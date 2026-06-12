import React, { useState, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import "./SignUpModal.css";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const { showToast } = useToast();
  const [studentNum, setStudentNum] = useState(Array(7).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleNumChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newNum = [...studentNum];
    newNum[index] = value;
    setStudentNum(newNum);
    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleNumKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !studentNum[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a toast. Database connection comes later.
    showToast("Sign up form submitted! (Database connection pending)", "success");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Student Account Sign Up</h2>
        <div className="modal-divider"></div>

        <form onSubmit={handleSignUp} className="signup-form">
          {/* Student Number Row */}
          <div className="form-group full-width">
            <label>Student Number</label>
            <div className="modal-num-group">
              <div className="modal-box-group">
                {studentNum.slice(0, 2).map((digit, i) => (
                  <input
                    key={`su-part1-${i}`}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleNumChange(i, e.target.value)}
                    onKeyDown={(e) => handleNumKeyDown(i, e)}
                    className="modal-digit-box"
                    required
                  />
                ))}
              </div>
              <span className="modal-dash">-</span>
              <div className="modal-box-group">
                {studentNum.slice(2).map((digit, i) => (
                  <input
                    key={`su-part2-${i}`}
                    ref={(el) => { inputRefs.current[i + 2] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleNumChange(i + 2, e.target.value)}
                    onKeyDown={(e) => handleNumKeyDown(i + 2, e)}
                    className="modal-digit-box"
                    required
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name Row */}
          <div className="form-group half-width">
            <label>First Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Juan"
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Last Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Dela Cruz"
              required
            />
          </div>

          {/* Details Row */}
          <div className="form-group quarter-width">
            <label>M.I.</label>
            <input
              type="text"
              className="form-input"
              maxLength={2}
              placeholder="A."
            />
          </div>
          <div className="form-group quarter-width">
            <label>Suffix</label>
            <select className="form-input select-input" defaultValue="">
              <option value="">N/A</option>
              <option value="Jr.">Jr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>
          <div className="form-group half-width">
            <label>Section</label>
            <select
              className="form-input select-input"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Section
              </option>
              <optgroup label="Information Technology">
                <option value="BSIT1A">BSIT1A</option>
                <option value="BSIT2A">BSIT2A</option>
                <option value="BSIT3A">BSIT3A</option>
                <option value="BSIT4A">BSIT4A</option>
              </optgroup>
              <optgroup label="Computer Science">
                <option value="BSCS1A">BSCS1A</option>
                <option value="BSCS2A">BSCS2A</option>
                <option value="BSCS3A">BSCS3A</option>
                <option value="BSCS4A">BSCS4A</option>
              </optgroup>
            </select>
          </div>

          {/* Email Row */}
          <div className="form-group full-width">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="student@plpasig.edu.ph"
              required
            />
          </div>

          <button type="submit" className="submit-btn full-width">
            SIGN UP
          </button>

          <p className="login-link-text full-width">
            Already have an account?{" "}
            <span className="login-link" onClick={onClose}>
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
