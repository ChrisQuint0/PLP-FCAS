import { useState, useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { useToast } from "../contexts/ToastContext";
import "./VisitFormModal.css";

interface StudentData {
  id: string;
  name: string;
  status: string;
  section: string;
}

interface VisitFormModalProps {
  isOpen: boolean;
  student: StudentData | null;
  onClose: () => void; // Used for "Sign out"
  onSubmit: (formData: any) => void;
}

export default function VisitFormModal({
  isOpen,
  student,
  onClose,
  onSubmit,
}: VisitFormModalProps) {
  const { showToast } = useToast();
  const [status, setStatus] = useState("");
  const [section, setSection] = useState("");
  const [professor, setProfessor] = useState("");
  const [purpose, setPurpose] = useState("");
  const [concern, setConcern] = useState("");
  const [timeIn, setTimeIn] = useState("");

  // Custom Dropdown State
  const [profSearch, setProfSearch] = useState("");
  const [isProfDropdownOpen, setIsProfDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const professorList = [
    "Prof. Alvarez",
    "Prof. Dela Cruz",
    "Prof. Garcia",
    "Prof. Reyes",
    "Prof. Santos",
    "Prof. Villanueva",
  ];

  const filteredProfessors = professorList.filter((p) =>
    p.toLowerCase().includes(profSearch.toLowerCase()),
  );

  // Signature Pad State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);

      // Resize canvas to match its displayed CSS size, multiplied by devicePixelRatio for sharpness
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvas, {
        minWidth: 1,
        maxWidth: 2.5,
        penColor: "rgb(0, 0, 0)",
      });

      return () => {
        signaturePadRef.current?.off();
        signaturePadRef.current = null;
      };
    }
  }, [isOpen]);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && student) {
      setStatus(student.status);
      setSection(student.section);
      setTimeIn(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setProfessor("");
      setProfSearch("");
      setPurpose("");
      setConcern("");
      clearSignature();
    }
  }, [isOpen, student]);

  // Handle click outside for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Global Enter Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Enter") {
        // Don't submit if they are typing multiple lines in the textarea
        if (document.activeElement?.tagName.toLowerCase() === "textarea")
          return;
        e.preventDefault();
        handleFormSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }); // Note: Runs every render to ensure latest state is captured on submit

  if (!isOpen || !student) return null;

  // --- Signature Pad Logic ---
  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };
  // ---------------------------

  const handleFormSubmit = () => {
    if (!professor || !purpose) {
      showToast("Please select a professor and purpose of visit.", "error");
      return;
    }

    const signatureData = signaturePadRef.current?.toDataURL() || "";

    onSubmit({
      studentId: student.id,
      name: student.name,
      status,
      section,
      professor,
      purpose,
      concern,
      timeIn,
      signature: signatureData,
    });
  };

  return (
    // NO onClick={onClose} here to prevent closing when clicking outside
    <div className="modal-overlay visit-overlay">
      <div className="visit-content" onClick={(e) => e.stopPropagation()}>
        {/* GREEN HEADER */}
        <div className="visit-header">
          <div className="visit-header-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
          </div>
          <div>
            <span className="visit-header-subtitle">STUDENT VISIT FORM</span>
            <h2 className="visit-header-title">Welcome, {student.name}!</h2>
          </div>
        </div>

        {/* INFO BAR */}
        <div className="visit-info-bar">
          <div className="info-item">
            <span className="info-hash">#</span>
            <strong>{student.id}</strong>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <select
              className="info-select status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Regular">Regular</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>
          <div className="info-item">
            <select
              className="info-select section-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="BSIT3A">BSIT3A</option>
              <option value="BSCS3A">BSCS3A</option>
              {/* Add more sections as needed */}
            </select>
          </div>
          <div className="info-item time-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Time in: {timeIn}
          </div>
        </div>

        {/* FORM GRID */}
        <div className="visit-form-grid">
          <div
            className="form-group"
            ref={dropdownRef}
            style={{ position: "relative" }}
          >
            <label>Professor to consult</label>
            <input
              type="text"
              className="visit-input"
              placeholder="Search professor..."
              value={profSearch}
              onChange={(e) => {
                setProfSearch(e.target.value);
                setIsProfDropdownOpen(true);
                setProfessor(""); // Reset actual selection while typing
              }}
              onFocus={() => setIsProfDropdownOpen(true)}
            />
            {isProfDropdownOpen && (
              <ul className="custom-dropdown-list">
                {filteredProfessors.length > 0 ? (
                  filteredProfessors.map((prof) => (
                    <li
                      key={prof}
                      className="custom-dropdown-item"
                      onClick={() => {
                        setProfessor(prof);
                        setProfSearch(prof);
                        setIsProfDropdownOpen(false);
                      }}
                    >
                      {prof}
                    </li>
                  ))
                ) : (
                  <li className="custom-dropdown-empty">No professor found</li>
                )}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Purpose of visit</label>
            <select
              className="visit-input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="" disabled>
                Select purpose
              </option>
              <option value="Academic Guidance">Academic Guidance</option>
              <option value="Clearance">Clearance</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* CONCERN TEXTAREA */}
        <div className="form-group concern-group">
          <label>
            Describe your concern <span>(optional)</span>
          </label>
          <textarea
            className="visit-textarea"
            placeholder="Briefly describe what you'd like to discuss..."
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            maxLength={300}
          ></textarea>
          <div className="char-count">{concern.length} / 300</div>
        </div>

        {/* SIGNATURE PAD */}
        <div className="form-group signature-group">
          <div className="signature-header">
            <label>Student Signature</label>
            <button
              className="clear-sig-btn"
              onClick={clearSignature}
              type="button"
            >
              Clear
            </button>
          </div>
          <div className="canvas-container">
            <canvas ref={canvasRef} className="signature-canvas"></canvas>
          </div>
        </div>

        <div className="visit-footer-divider"></div>

        {/* BUTTONS */}
        <div className="visit-actions">
          <button className="visit-btn btn-outline" onClick={onClose}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              />
            </svg>
            Cancel
          </button>
          <div className="submit-wrapper">
            <button className="visit-btn btn-solid" onClick={handleFormSubmit}>
              Submit
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
