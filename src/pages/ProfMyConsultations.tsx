import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  themeQuartz,
  RowSelectionOptions,
} from "ag-grid-community";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Users,
  LogOut,
  Download,
  ChevronDown,
  Clock,
} from "lucide-react";
import "./ProfMyConsultations.css";

// ─── Register AG Grid modules once (works offline — bundled via npm) ──────────
ModuleRegistry.registerModules([AllCommunityModule]);

// ─── Light-mode AG Grid theme via Theming API (v33+) ─────────────────────────
const lightTheme = themeQuartz.withParams({
  accentColor: "#1a6b3c",
  headerBackgroundColor: "#1a6b3c",
  headerTextColor: "#ffffff",
  headerFontWeight: 600,
  headerFontSize: 13,
  fontSize: 13,
  rowHeight: 42,
  headerHeight: 44,
  borderColor: "#d0d5dd",
  rowBorder: true,
  columnBorder: false,
  backgroundColor: "#ffffff",
  foregroundColor: "#101828",
  oddRowBackgroundColor: "#f9fafb",
  selectedRowBackgroundColor: "#ecfdf5",
});

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ConsultationRow {
  studentNumber: string;
  studentName: string;
  section: string;
  reason: string;
  message: string;
  date: string;
  timeIn: string;
  timeOut: string;
}

// ─── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY_DATA: ConsultationRow[] = [
  {
    studentNumber: "24-00647",
    studentName: "CABALLERO, RIZALDY H.",
    section: "BSIT2D",
    reason: "Academic Guidance",
    message: "Final examination",
    date: "June 10, 2025",
    timeIn: "10:28 AM",
    timeOut: "10:45 AM",
  },
  {
    studentNumber: "24-00710",
    studentName: "BALAWAG, AL-CHARZIL S.",
    section: "BSCS2A",
    reason: "Academic Guidance",
    message: "Final exam system presentation",
    date: "June 04, 2025",
    timeIn: "12:37 PM",
    timeOut: "12:55 PM",
  },
  {
    studentNumber: "22-00610",
    studentName: "MAGNO, ALDREN JAMES C.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 clarification",
    date: "May 30, 2025",
    timeIn: "11:10 AM",
    timeOut: "11:25 AM",
  },
  {
    studentNumber: "22-00598",
    studentName: "VELIGANIO, RODEN R.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 results query",
    date: "May 30, 2025",
    timeIn: "11:09 AM",
    timeOut: "11:20 AM",
  },
  {
    studentNumber: "22-00649",
    studentName: "MABANA, DHAN REY K.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Taking quiz retake",
    date: "May 30, 2025",
    timeIn: "11:09 AM",
    timeOut: "11:30 AM",
  },
  {
    studentNumber: "22-00699",
    studentName: "ESCOBER, JAMIE FRANCES C.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 missed submission",
    date: "May 30, 2025",
    timeIn: "11:09 AM",
    timeOut: "11:22 AM",
  },
  {
    studentNumber: "22-01099",
    studentName: "SANTOS, REX VINCENT D.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "General consultation",
    date: "May 28, 2025",
    timeIn: "11:36 AM",
    timeOut: "11:50 AM",
  },
  {
    studentNumber: "23-00331",
    studentName: "ANDRADA, JON VINCENT M.",
    section: "BSIT3E",
    reason: "Others (Specify the details)",
    message: "Interview consultation",
    date: "April 28, 2025",
    timeIn: "07:14 PM",
    timeOut: "07:30 PM",
  },
  {
    studentNumber: "21-00482",
    studentName: "DELA CRUZ, MARIO P.",
    section: "BSCS3B",
    reason: "Academic Guidance",
    message: "Thesis title approval",
    date: "April 15, 2025",
    timeIn: "09:00 AM",
    timeOut: "09:40 AM",
  },
  {
    studentNumber: "23-00890",
    studentName: "REYES, PATRICIA ANN B.",
    section: "BSIT2A",
    reason: "Academic Guidance",
    message: "Grade inquiry for midterms",
    date: "March 22, 2025",
    timeIn: "02:00 PM",
    timeOut: "02:20 PM",
  },
  {
    studentNumber: "22-00145",
    studentName: "GARCIA, LOUIE MARK T.",
    section: "BSIT3C",
    reason: "Project Review",
    message: "Capstone prototype demo",
    date: "March 10, 2025",
    timeIn: "03:15 PM",
    timeOut: "04:00 PM",
  },
  {
    studentNumber: "21-00776",
    studentName: "MENDOZA, SARAH JANE O.",
    section: "BSCS4A",
    reason: "Academic Guidance",
    message: "OJT requirements clarification",
    date: "February 28, 2025",
    timeIn: "10:00 AM",
    timeOut: "10:30 AM",
  },
];

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ProfMyConsultations() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("2020-06-01");
  const [toDate, setToDate] = useState("2026-06-11");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Derive unique sections for the dropdown
  const sections = useMemo(() => {
    const all = DUMMY_DATA.map((r) => r.section);
    return ["all", ...Array.from(new Set(all)).sort()];
  }, []);

  // Filter rows based on the section dropdown
  // (Date filtering is illustrative — with a real DB, pass to query instead)
  const rowData = useMemo(() => {
    if (sectionFilter === "all") return DUMMY_DATA;
    return DUMMY_DATA.filter((r) => r.section === sectionFilter);
  }, [sectionFilter]);

  // Stats
  const totalStudents = DUMMY_DATA.length;

  // ─── Column definitions ─────────────────────────────────────────────────────
  const columnDefs = useMemo<ColDef<ConsultationRow>[]>(
    () => [
      {
        headerName: "Student No.",
        field: "studentNumber",
        width: 120,
        filter: "agTextColumnFilter",
        pinned: "left",
      },
      {
        headerName: "Student Name",
        field: "studentName",
        flex: 2,
        minWidth: 180,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Section",
        field: "section",
        width: 110,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Reason",
        field: "reason",
        flex: 1.5,
        minWidth: 160,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Message / Details",
        field: "message",
        flex: 2,
        minWidth: 180,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Date",
        field: "date",
        width: 140,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Time In",
        field: "timeIn",
        width: 100,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Time Out",
        field: "timeOut",
        width: 100,
        filter: "agTextColumnFilter",
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: false,
    }),
    [],
  );

  const onGridReady = useCallback((_params: GridReadyEvent) => {
    // Grid is ready — could auto-size columns here if desired
  }, []);

  const rowSelection = useMemo<RowSelectionOptions>(
    () => ({
      mode: "singleRow",
      checkboxes: false,
    }),
    [],
  );

  const handleGenerateReport = () => {
    alert(
      "Report generation triggered.\n(Wire up your Tauri export command here.)",
    );
  };

  const handleSignOut = () => {
    navigate("/module-selection");
  };

  return (
    <div className="page-wrapper">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="page-header">
        <div className="header-brand">
          <BookOpen size={22} aria-hidden="true" />
          <span>My Consultations</span>
        </div>
        <button className="btn-sign-out" onClick={handleSignOut}>
          <LogOut size={15} aria-hidden="true" />
          Sign out
        </button>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="page-main">
        {/* Welcome row */}
        <div className="welcome-row">
          <div>
            <h1 className="welcome-name">Welcome, Prof. Alvarez</h1>
            <p className="welcome-date">
              <Clock
                size={13}
                aria-hidden="true"
                style={{ marginRight: 5, verticalAlign: -1 }}
              />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button className="btn-report" onClick={handleGenerateReport}>
            <Download size={15} aria-hidden="true" />
            Generate Report
          </button>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          <StatCard
            icon={<CalendarCheck size={20} />}
            label="Consultations Today"
            value={0}
          />
          <StatCard
            icon={<CalendarDays size={20} />}
            label="Consultations This Week"
            value={0}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Students Consulted"
            value={totalStudents}
          />
        </div>

        {/* Filter toolbar */}
        <div className="filter-toolbar">
          <div className="date-range">
            <label className="filter-label" htmlFor="from-date">
              From
            </label>
            <input
              id="from-date"
              type="date"
              className="date-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="filter-label" style={{ margin: "0 4px" }}>
              to
            </span>
            <input
              type="date"
              className="date-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="section-select-wrap">
            <label className="filter-label" htmlFor="section-filter">
              Section
            </label>
            <div className="select-wrapper">
              <select
                id="section-filter"
                className="section-select"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All Sections" : s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="select-chevron"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* AG Grid */}
        <div className="grid-container">
          <AgGridReact<ConsultationRow>
            theme={lightTheme}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            animateRows={true}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 25, 50]}
            rowSelection={rowSelection}
            suppressMenuHide={true}
          />
        </div>


      </main>
    </div>
  );
}
