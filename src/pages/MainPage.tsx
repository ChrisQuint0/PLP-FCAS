import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "./MainPage.css";
import SignUpModal from "../components/SignUpModal";
import RecoveryModal from "../components/RecoveryModal";
import VisitFormModal from "../components/VisitFormModal";
import SuccessModal from "../components/SuccessModal";

import plpLogo from "../assets/plp_logo.png";
import loginGif from "../assets/login_animation.gif";
import ccsLogo from "../assets/ccs_logo.png";
import bgImage from "../assets/background.jpg";
import typingGif from "../assets/computer_animation.gif";

export default function MainPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [studentNum, setStudentNum] = useState<string[]>(Array(7).fill(""));
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  // We use a ref to hold the latest state so our global event listener
  // doesn't get trapped in a stale closure.
  const studentNumRef = useRef(studentNum);

  useEffect(() => {
    studentNumRef.current = studentNum;
  }, [studentNum]);

  const handleSignClick = async () => {
    const currentNum = studentNumRef.current;

    if (currentNum.includes("")) {
      showToast("Please enter the complete 7-digit student number.", "error");
      return;
    }

    const fullNumber = `${currentNum.slice(0, 2).join("")}-${currentNum.slice(2).join("")}`;

    try {
      // 1. COMMENT OUT THE REAL FETCH REQUEST
      /*
      const response = await fetch("http://localhost:8000/student_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_number: fullNumber }),
      });
      const data = await response.json();
      */

      // 2. CREATE A FAKE "SUCCESS" RESPONSE INSTEAD
      const data: any = {
        status: "success",
        student_name: "Christopher A. Quinto", // Feel free to change this dummy name
        message: "",
      };

      // 3. THE REST OF YOUR LOGIC REMAINS EXACTLY THE SAME
      if (data.status === "success") {
        setCurrentStudent({
          id: fullNumber,
          name: data.student_name,
          status: "Regular",
          section: "BSIT3A",
        });
        setIsVisitFormOpen(true);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Could not connect to the server.", "error");
    }
  };

  // --- GLOBAL KEYBOARD LISTENER ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // CRITICAL: Stop listening if the modal is open!
      if (isSignUpOpen || isRecoveryOpen || isVisitFormOpen || isSuccessModalOpen) return;

      // 1. Handle "Enter" to submit
      if (e.key === "Enter") {
        e.preventDefault();
        handleSignClick();
        return;
      }

      // 2. Handle "Backspace" to delete the last entered digit
      if (e.key === "Backspace") {
        e.preventDefault();
        setStudentNum((prev) => {
          const newNum = [...prev];
          for (let i = 6; i >= 0; i--) {
            if (newNum[i] !== "") {
              newNum[i] = "";
              break;
            }
          }
          return newNum;
        });
        return;
      }

      // 3. Handle Numbers (0-9) to fill the next empty box
      if (/^\d$/.test(e.key)) {
        setStudentNum((prev) => {
          const newNum = [...prev];
          for (let i = 0; i < 7; i++) {
            if (newNum[i] === "") {
              newNum[i] = e.key;
              break;
            }
          }
          return newNum;
        });
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup listener when component unmounts
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isSignUpOpen, isRecoveryOpen, isVisitFormOpen, isSuccessModalOpen]);

  // Find the first empty box so we can apply the green border to it
  const activeIndex = studentNum.findIndex((val) => val === "");

  return (
    <div className="main-container">
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <button className="close-btn">✕</button>

        <div className="sidebar-top">
          <img src={plpLogo} alt="PLP Logo" className="plp-logo" />
          <h2 className="faculty-text">Faculty</h2>
        </div>

        <div className="login-banner">
          <img src={loginGif} alt="Log In" className="login-gif" />
        </div>

        <div className="sidebar-bottom">
          <img src={ccsLogo} alt="CCS Logo" className="ccs-logo" />
          <p>Powered by College of Computer Studies</p>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div
        className="main-content"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay"></div>

        <div className="content-wrapper">
          <div className="title-container">
            <h1 className="page-title">Student Account</h1>
          </div>

          <div className="center-panel">
            <img
              src={typingGif}
              alt="Typing Animation"
              className="typing-gif"
            />

            <div className="form-container">
              <h3 className="input-label">Student Number</h3>

              <div className="input-group">
                {/* First 2 digits */}
                <div className="box-group">
                  {studentNum.slice(0, 2).map((digit, i) => (
                    <input
                      key={`part1-${i}`}
                      type="text"
                      readOnly // Prevents mobile keyboards or manual cursors
                      value={digit}
                      className={`digit-box ${activeIndex === i ? "active" : ""}`}
                    />
                  ))}
                </div>

                <span className="dash">-</span>

                {/* Last 5 digits */}
                <div className="box-group">
                  {studentNum.slice(2).map((digit, i) => (
                    <input
                      key={`part2-${i}`}
                      type="text"
                      readOnly
                      value={digit}
                      // i is 0-4, but in the full array these are indices 2-6
                      className={`digit-box ${activeIndex === i + 2 ? "active" : ""}`}
                    />
                  ))}
                </div>
              </div>

              <button className="sign-btn" onClick={handleSignClick}>
                SIGN IN
              </button>
            </div>
          </div>

          <div className="bottom-links">
            <p>
              <a href="#" className="red-link">
                Scan your QR code to Sign In
              </a>
            </p>
            <p>
              Not a member?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignUpOpen(true);
                }}
              >
                Sign up
              </a>
            </p>
            <p>
              Forgot both your QR code and Student ID?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecoveryOpen(true);
                }}
              >
                Get it via email
              </a>
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/module-selection")}
          >
            ←
          </button>
        </div>
      </div>

      {/* Render the SignUp Modal */}
      {isSignUpOpen && (
        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
        />
      )}
      {isRecoveryOpen && (
        <RecoveryModal
          isOpen={isRecoveryOpen}
          onClose={() => setIsRecoveryOpen(false)}
        />
      )}

      <VisitFormModal
        isOpen={isVisitFormOpen}
        student={currentStudent}
        onClose={() => {
          setIsVisitFormOpen(false);
          setStudentNum(Array(7).fill("")); // Clear boxes on sign out
        }}
        onSubmit={(formData) => {
          console.log("Submitting Consultation:", formData);
          setIsVisitFormOpen(false);
          setStudentNum(Array(7).fill("")); // Clear boxes on success
          
          // Provide a satisfying custom confirmation modal
          setTimeout(() => {
            setIsSuccessModalOpen(true);
          }, 300);
        }}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message="Consultation Logged Successfully!"
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
