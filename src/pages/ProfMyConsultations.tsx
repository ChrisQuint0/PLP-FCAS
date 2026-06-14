import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  themeQuartz,
  RowSelectionOptions,
  RowClickedEvent,
  ValueFormatterParams,
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
  X,
  Hash,
  Tag,
  MessageSquare,
  Timer,
} from "lucide-react";
import "./ProfMyConsultations.css";

ModuleRegistry.registerModules([AllCommunityModule]);

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
  date: string; // ISO: "2025-06-10"
  timeIn: string;
  timeOut: string;
  durationMin: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function parseTime(t: string): number {
  // "10:28 AM" → minutes since midnight
  const [hm, period] = t.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function calcDuration(timeIn: string, timeOut: string): number {
  return parseTime(timeOut) - parseTime(timeIn);
}

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

// ─── Data (dates in ISO 8601) ──────────────────────────────────────────────────
const DUMMY_DATA: ConsultationRow[] = [
  {
    studentNumber: "24-00647",
    studentName: "CABALLERO, RIZALDY H.",
    section: "BSIT2D",
    reason: "Academic Guidance",
    message: "Final examination",
    date: "2025-06-10",
    timeIn: "10:28 AM",
    timeOut: "10:45 AM",
    durationMin: calcDuration("10:28 AM", "10:45 AM"),
  },
  {
    studentNumber: "24-00710",
    studentName: "BALAWAG, AL-CHARZIL S.",
    section: "BSCS2A",
    reason: "Academic Guidance",
    message: "Final exam system presentation",
    date: "2025-06-04",
    timeIn: "12:37 PM",
    timeOut: "12:55 PM",
    durationMin: calcDuration("12:37 PM", "12:55 PM"),
  },
  {
    studentNumber: "22-00610",
    studentName: "MAGNO, ALDREN JAMES C.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 clarification",
    date: "2025-05-30",
    timeIn: "11:10 AM",
    timeOut: "11:25 AM",
    durationMin: calcDuration("11:10 AM", "11:25 AM"),
  },
  {
    studentNumber: "22-00598",
    studentName: "VELIGANIO, RODEN R.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 results query",
    date: "2025-05-30",
    timeIn: "11:09 AM",
    timeOut: "11:20 AM",
    durationMin: calcDuration("11:09 AM", "11:20 AM"),
  },
  {
    studentNumber: "22-00649",
    studentName: "MABANA, DHAN REY K.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Taking quiz retake",
    date: "2025-05-30",
    timeIn: "11:09 AM",
    timeOut: "11:30 AM",
    durationMin: calcDuration("11:09 AM", "11:30 AM"),
  },
  {
    studentNumber: "22-00699",
    studentName: "ESCOBER, JAMIE FRANCES C.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "Quiz 2 missed submission",
    date: "2025-05-30",
    timeIn: "11:09 AM",
    timeOut: "11:22 AM",
    durationMin: calcDuration("11:09 AM", "11:22 AM"),
  },
  {
    studentNumber: "22-01099",
    studentName: "SANTOS, REX VINCENT D.",
    section: "BSIT4D",
    reason: "Others (Specify the details)",
    message: "General consultation",
    date: "2025-05-28",
    timeIn: "11:36 AM",
    timeOut: "11:50 AM",
    durationMin: calcDuration("11:36 AM", "11:50 AM"),
  },
  {
    studentNumber: "23-00331",
    studentName: "ANDRADA, JON VINCENT M.",
    section: "BSIT3E",
    reason: "Others (Specify the details)",
    message: "Interview consultation",
    date: "2025-04-28",
    timeIn: "07:14 PM",
    timeOut: "07:30 PM",
    durationMin: calcDuration("07:14 PM", "07:30 PM"),
  },
  {
    studentNumber: "21-00482",
    studentName: "DELA CRUZ, MARIO P.",
    section: "BSCS3B",
    reason: "Academic Guidance",
    message: "Thesis title approval",
    date: "2025-04-15",
    timeIn: "09:00 AM",
    timeOut: "09:40 AM",
    durationMin: calcDuration("09:00 AM", "09:40 AM"),
  },
  {
    studentNumber: "23-00890",
    studentName: "REYES, PATRICIA ANN B.",
    section: "BSIT2A",
    reason: "Academic Guidance",
    message: "Grade inquiry for midterms",
    date: "2025-03-22",
    timeIn: "02:00 PM",
    timeOut: "02:20 PM",
    durationMin: calcDuration("02:00 PM", "02:20 PM"),
  },
  {
    studentNumber: "22-00145",
    studentName: "GARCIA, LOUIE MARK T.",
    section: "BSIT3C",
    reason: "Project Review",
    message: "Capstone prototype demo",
    date: "2025-03-10",
    timeIn: "03:15 PM",
    timeOut: "04:00 PM",
    durationMin: calcDuration("03:15 PM", "04:00 PM"),
  },
  {
    studentNumber: "21-00776",
    studentName: "MENDOZA, SARAH JANE O.",
    section: "BSCS4A",
    reason: "Academic Guidance",
    message: "OJT requirements clarification",
    date: "2025-02-28",
    timeIn: "10:00 AM",
    timeOut: "10:30 AM",
    durationMin: calcDuration("10:00 AM", "10:30 AM"),
  },
];

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  variant = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  variant?: "primary" | "secondary";
}) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
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

// ─── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  row,
  onClose,
}: {
  row: ConsultationRow | null;
  onClose: () => void;
}) {
  if (!row) return null;
  return (
    <>
      <div className="panel-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className="detail-panel"
        role="dialog"
        aria-label="Consultation details"
      >
        <div className="panel-header">
          <h2 className="panel-title">Consultation Details</h2>
          <button
            className="panel-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="panel-student">
          <div className="panel-avatar" aria-hidden="true">
            {row.studentName.charAt(0)}
          </div>
          <div>
            <p className="panel-student-name">{row.studentName}</p>
            <p className="panel-student-meta">
              {row.studentNumber} · {row.section}
            </p>
          </div>
        </div>

        <dl className="panel-fields">
          <div className="panel-field">
            <dt>
              <CalendarDays size={14} aria-hidden="true" />
              Date
            </dt>
            <dd>{formatDisplayDate(row.date)}</dd>
          </div>
          <div className="panel-field">
            <dt>
              <Clock size={14} aria-hidden="true" />
              Time
            </dt>
            <dd>
              {row.timeIn} → {row.timeOut}
            </dd>
          </div>
          <div className="panel-field">
            <dt>
              <Timer size={14} aria-hidden="true" />
              Duration
            </dt>
            <dd>{row.durationMin} min</dd>
          </div>
          <div className="panel-field">
            <dt>
              <Tag size={14} aria-hidden="true" />
              Reason
            </dt>
            <dd>{row.reason}</dd>
          </div>
          <div className="panel-field panel-field--full">
            <dt>
              <MessageSquare size={14} aria-hidden="true" />
              Message / Details
            </dt>
            <dd className="panel-message">{row.message}</dd>
          </div>
          <div className="panel-field">
            <dt>
              <Hash size={14} aria-hidden="true" />
              Student No.
            </dt>
            <dd>{row.studentNumber}</dd>
          </div>
        </dl>
      </aside>
    </>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ProfMyConsultations() {
  const navigate = useNavigate();
  const today = isoToday();
  const weekStart = isoWeekStart();

  const [fromDate, setFromDate] = useState("2020-06-01");
  const [toDate, setToDate] = useState(today);
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedRow, setSelectedRow] = useState<ConsultationRow | null>(null);

  const sections = useMemo(() => {
    const all = DUMMY_DATA.map((r) => r.section);
    return ["all", ...Array.from(new Set(all)).sort()];
  }, []);

  // Live-filter by date range + section
  const rowData = useMemo(() => {
    return DUMMY_DATA.filter((r) => {
      const inSection = sectionFilter === "all" || r.section === sectionFilter;
      const inRange = r.date >= fromDate && r.date <= toDate;
      return inSection && inRange;
    });
  }, [sectionFilter, fromDate, toDate]);

  // Stat counts (always computed against full data, not filtered view)
  const countToday = useMemo(
    () => DUMMY_DATA.filter((r) => r.date === today).length,
    [today],
  );
  const countWeek = useMemo(
    () =>
      DUMMY_DATA.filter((r) => r.date >= weekStart && r.date <= today).length,
    [weekStart, today],
  );
  const totalStudents = DUMMY_DATA.length;

  // ─── Column definitions ─────────────────────────────────────────────────────
  const columnDefs = useMemo<ColDef<ConsultationRow>[]>(
    () => [
      {
        headerName: "Student No.",
        field: "studentNumber",
        width: 130,
        filter: "agTextColumnFilter",
        pinned: "left",
        sort: null,
      },
      {
        headerName: "Student Name",
        field: "studentName",
        flex: 2,
        minWidth: 190,
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
        minWidth: 170,
        filter: "agTextColumnFilter",
        tooltipField: "reason",
      },
      {
        headerName: "Message / Details",
        field: "message",
        flex: 2,
        minWidth: 180,
        filter: "agTextColumnFilter",
        tooltipField: "message",
      },
      {
        headerName: "Date",
        field: "date",
        width: 150,
        filter: "agTextColumnFilter",
        sort: "desc",
        valueFormatter: (p: ValueFormatterParams) =>
          p.value ? formatDisplayDate(p.value) : "",
        comparator: (a: string, b: string) => a.localeCompare(b),
      },
      {
        headerName: "Time In",
        field: "timeIn",
        width: 105,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Time Out",
        field: "timeOut",
        width: 105,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Duration",
        field: "durationMin",
        width: 100,
        filter: "agNumberColumnFilter",
        valueFormatter: (p: ValueFormatterParams) =>
          p.value != null ? `${p.value} min` : "",
        type: "numericColumn",
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

  const onGridReady = useCallback((_params: GridReadyEvent) => {}, []);

  const rowSelection = useMemo<RowSelectionOptions>(
    () => ({ mode: "singleRow", checkboxes: false }),
    [],
  );

  const onRowClicked = useCallback((e: RowClickedEvent<ConsultationRow>) => {
    if (e.data) setSelectedRow(e.data);
  }, []);

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
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          <StatCard
            icon={<CalendarCheck size={20} />}
            label="Consultations Today"
            value={countToday}
            variant="secondary"
          />
          <StatCard
            icon={<CalendarDays size={20} />}
            label="Consultations This Week"
            value={countWeek}
            variant="secondary"
          />
          <StatCard
            icon={<Users size={20} />}
            label="Students Consulted"
            value={totalStudents}
            variant="primary"
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

          <button className="btn-report" onClick={handleGenerateReport}>
            <Download size={15} aria-hidden="true" />
            Generate Report
          </button>
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
            onRowClicked={onRowClicked}
            suppressMenuHide={true}
            tooltipShowDelay={300}
          />
        </div>
      </main>

      {/* ── Detail panel ───────────────────────────────────────────────────── */}
      <DetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
}
