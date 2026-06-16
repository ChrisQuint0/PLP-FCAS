import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  UserCheck,
  Users,
  MessageSquare,
  Building2,
  Settings,
  Archive,
  ArchiveRestore,
  LogOut,
  Menu,
  ShieldCheck,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

import "./AdminDashboard.css";
import plpLogo from "../assets/plp_logo.png";
import AdminConsultations from "./AdminConsultations";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logoHover, setLogoHover] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentView, setCurrentView] = useState("Dashboard");

  // Stats data
  const stats = [
    { label: "Admins", value: 1, icon: <ShieldCheck size={36} /> },
    { label: "Professors", value: 26, icon: <UserCheck size={36} /> },
    { label: "Students", value: 627, icon: <Users size={36} /> },
    { label: "Graduates", value: 135, icon: <GraduationCap size={36} /> },
  ];

  // Doughnut Chart — palette pulled from the Tauri app's dark-green range
  const doughnutData = {
    labels: [
      "Academic Guidance",
      "Personal and Emotional Support",
      "Extracurricular Activities",
      "Goal Setting and Future Planning",
      "OTHERS (Specify the details)",
      "Graduation",
      "SEAOIL Job Fair",
      "College and Career Readiness",
    ],
    datasets: [
      {
        data: [1362, 1341, 102, 6, 72, 1, 0, 0],
        backgroundColor: [
          "#3b82f6", // Blue
          "#f59e0b", // Amber
          "#10b981", // Emerald
          "#ec4899", // Pink
          "#8b5cf6", // Purple
          "#ef4444", // Red
          "#14b8a6", // Teal
          "#f97316", // Orange
        ],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#4a6b55",
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 11, family: "'Inter', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 58, 42, 0.92)",
        titleFont: { family: "'Inter', sans-serif", size: 12 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 6,
      },
    },
  };

  // Area Chart — single green line matching "Generate Report" button
  const areaData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: `Consultations (${currentYear})`,
        data: [0, 250, 1300, 350, 700, 150, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(45, 106, 79, 0.18)",
        borderColor: "#1e6b40",
        pointBackgroundColor: "#1e6b40",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#1e6b40",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
      },
    ],
  };

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#4a6b55",
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 58, 42, 0.92)",
        titleFont: { family: "'Inter', sans-serif", size: 12 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1400,
        grid: {
          color: "#dce8de",
        },
        ticks: {
          color: "#7a9e85",
          font: { family: "'Inter', sans-serif", size: 11 },
        },
        border: { color: "#dce8de" },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#7a9e85",
          font: { family: "'Inter', sans-serif", size: 11 },
        },
        border: { color: "#dce8de" },
      },
    },
  };

  const handleSignOut = () => {
    navigate("/module-selection");
  };

  return (
    <div
      className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div
            className="sidebar-brand-trigger"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            onClick={() => {
              if (!isSidebarOpen) setIsSidebarOpen(true);
            }}
          >
            {!isSidebarOpen && logoHover ? (
              <Menu className="sidebar-menu-icon" size={26} />
            ) : (
              <img src={plpLogo} alt="PLP Logo" className="sidebar-logo" />
            )}
          </div>

          {isSidebarOpen && (
            <div className="sidebar-user-info">
              <span className="user-name">Jhun Alvarez</span>
              <span className="user-role">Admin</span>
            </div>
          )}

          {isSidebarOpen && (
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Dashboard"}
            onClick={() => setCurrentView("Dashboard")}
          />
          <NavItem
            icon={<FileText size={18} />}
            label="Consultations"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Consultations"}
            onClick={() => setCurrentView("Consultations")}
          />
          <NavItem
            icon={<GraduationCap size={18} />}
            label="Students"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Students"}
            onClick={() => setCurrentView("Students")}
          />
          <NavItem
            icon={<UserCheck size={18} />}
            label="Professors"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Professors"}
            onClick={() => setCurrentView("Professors")}
          />
          <NavItem
            icon={<Users size={18} />}
            label="Admins"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Admins"}
            onClick={() => setCurrentView("Admins")}
          />
          <NavItem
            icon={<MessageSquare size={18} />}
            label="Reasons"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Reasons"}
            onClick={() => setCurrentView("Reasons")}
          />
          <NavItem
            icon={<Building2 size={18} />}
            label="Sections"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Sections"}
            onClick={() => setCurrentView("Sections")}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Settings"}
            onClick={() => setCurrentView("Settings")}
          />

          <div className="nav-divider" />

          <NavItem
            icon={<Archive size={18} />}
            label="Archived Students"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Archived Students"}
            onClick={() => setCurrentView("Archived Students")}
          />
          <NavItem
            icon={<ArchiveRestore size={18} />}
            label="Archived Professors"
            isSidebarOpen={isSidebarOpen}
            active={currentView === "Archived Professors"}
            onClick={() => setCurrentView("Archived Professors")}
          />
        </nav>

        <div className="sidebar-footer">
          <button className="signout-btn" onClick={handleSignOut}>
            <LogOut size={18} />
            {isSidebarOpen && <span className="signout-text">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        {currentView === "Dashboard" && (
          <>
            <header className="admin-topbar">
              <h1 className="dashboard-title">DASHBOARD</h1>
            </header>

            <div className="admin-content">
              {/* Stat Cards */}
              <div className="admin-stats-grid">
                {stats.map((stat, idx) => (
                  <div key={idx} className="admin-stat-card">
                    <div className="admin-stat-info">
                      <span className="admin-stat-value">{stat.value}</span>
                      <span className="admin-stat-label">{stat.label}</span>
                    </div>
                    <div className="admin-stat-icon-wrapper">{stat.icon}</div>
                  </div>
                ))}
              </div>

              <div className="year-selector">
                <button 
                  className="year-nav-btn" 
                  onClick={() => setCurrentYear(y => y - 1)}
                  aria-label="Previous Year"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="year-text">
                  YEAR: <span className="year-highlight">{currentYear}</span>
                </span>
                <button 
                  className="year-nav-btn" 
                  onClick={() => setCurrentYear(y => y + 1)}
                  aria-label="Next Year"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Charts Section */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h2 className="chart-title">Consultation Reasons - {currentYear}</h2>
                  <div className="doughnut-container">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </div>

                <div className="chart-card">
                  <h2 className="chart-title">Consultations ({currentYear})</h2>
                  <div className="area-container">
                    <Line data={areaData} options={areaOptions} />
                  </div>
                </div>
              </div>

              <div className="actions-row">
                <button className="generate-report-btn">
                  <Download size={16} />
                  GENERATE REPORT
                </button>
              </div>
            </div>
          </>
        )}

        {currentView === "Consultations" && <AdminConsultations />}
        
        {/* Placeholder for other views */}
        {currentView !== "Dashboard" && currentView !== "Consultations" && (
          <div style={{ padding: "24px" }}>
            <h2>{currentView}</h2>
            <p>This module is under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponent for Navigation Items
function NavItem({
  icon,
  label,
  active = false,
  isSidebarOpen,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isSidebarOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      title={!isSidebarOpen ? label : undefined}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      {isSidebarOpen && <span className="nav-label">{label}</span>}
    </button>
  );
}
