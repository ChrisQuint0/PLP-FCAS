import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "./ModuleSelection.css";

import plpLogo from "../assets/plp_logo.png";
import ccsLogo from "../assets/ccs_logo.png";
import ProfAuthModal from "../components/ProfAuthModal";

export default function ModuleSelection() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isProfAuthOpen, setIsProfAuthOpen] = useState(false);

  return (
    <div className="module-container">
      {/* Optional: Minimal Header/Footer Branding */}
      <div className="branding-header">
        <img src={plpLogo} alt="PLP Logo" className="brand-logo" />
        <div className="brand-text">
          <h2>Pamantasan ng Lungsod ng Pasig</h2>
          <p>Faculty Consulation and Attendance System</p>
        </div>
        <img src={ccsLogo} alt="CCS Logo" className="brand-logo" />
      </div>

      <div className="module-content">
        <h1 className="select-title">Select Module</h1>
        <p className="select-subtitle">Choose your portal to continue</p>

        <div className="card-grid">
          {/* ADMIN CARD */}
          <div
            className="module-card"
            onClick={() => showToast("Admin Dashboard coming soon!", "info")}
          >
            <div className="icon-wrapper">
              {/* Admin Shield SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
              </svg>
            </div>
            <h3>Admin Dashboard</h3>
            <p>
              Manage users, view system-wide analytics, manage reasons, and
              generate comprehensive consultation reports.
            </p>
          </div>

          {/* PROFESSOR CARD */}
          <div
            className="module-card"
            onClick={() => setIsProfAuthOpen(true)}
          >
            <div className="icon-wrapper">
              {/* Professor Briefcase/Book SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14v7"
                />
              </svg>
            </div>
            <h3>Professor Dashboard</h3>
            <p>
              Track your daily consultations, view student records, and generate
              personal activity reports.
            </p>
          </div>

          {/* STUDENT CARD */}
          {/* This one actually navigates to the page you already built! */}
          <div className="module-card" onClick={() => navigate("/")}>
            <div className="icon-wrapper">
              {/* Student Clipboard SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3>Student Visit Form</h3>
            <p>
              Quickly log your attendance and reason for consultation using your
              Student Number or QR Code.
            </p>
          </div>
        </div>
      </div>
      
      <ProfAuthModal
        isOpen={isProfAuthOpen}
        onClose={() => setIsProfAuthOpen(false)}
      />
    </div>
  );
}
