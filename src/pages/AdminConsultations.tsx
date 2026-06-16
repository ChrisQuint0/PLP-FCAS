import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  SelectionChangedEvent,
  CellValueChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { Plus, Trash2, Search, X, Info, CalendarDays, Clock, Tag, MessageSquare, Hash, Edit2 } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import "./AdminConsultations.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const adminTheme = themeQuartz.withParams({
  accentColor: "#1e7a45",
  selectedRowBackgroundColor: "rgba(30, 122, 69, 0.08)",
  rowHoverColor: "rgba(30, 122, 69, 0.04)",
  headerBackgroundColor: "#f9fbf9",
  borderColor: "#deeae2",
});

interface Consultation {
  id: string;
  studentNo: string;
  studentName: string;
  section: string;
  professor: string;
  reason: string;
  message: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
}

// Mock student database
const STUDENT_DB: Record<string, string> = {
  "23-00163": "Dela Cruz, Juan M.",
  "21-00234": "Rizal, Jose P.",
  "22-00456": "Bonifacio, Andres K.",
  "24-00111": "Mabini, Apolinario L.",
  "2021001": "Dela Cruz, Juan M.",
  "2021055": "Clara, Maria C."
};

const SECTIONS = ["BSIT3A", "BSIT3B", "BSCS1A", "BSIT4A", "BSIT4B"];
const PROFESSORS = ["Prof. Alan Turing", "Prof. Ada Lovelace", "Prof. Grace Hopper", "Prof. Jhun Alvarez"];
const REASONS = ["Academic Guidance", "Project assistance", "Grade dispute", "Personal and Emotional Support", "Others"];
const STATUSES = ["Pending", "Completed", "Cancelled"];

// Actions Renderer
const ActionsRenderer = (props: any) => {
  const handleDelete = () => {
    props.api.applyTransaction({ remove: [props.data] });
  };
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", height: "100%" }}>
      <button onClick={handleDelete} title="Delete Record" className="action-icon-btn delete">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default function AdminConsultations() {
  const gridRef = useRef<AgGridReact>(null);
  const { showToast } = useToast();

  const [selectedCount, setSelectedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Consultation | null>(null);
  const [newForm, setNewForm] = useState<Partial<Consultation>>({});
  
  // Date Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rowData] = useState<Consultation[]>([
    {
      id: "C-1001",
      studentNo: "23-00163",
      studentName: "Dela Cruz, Juan M.",
      section: "BSIT3A",
      professor: "Prof. Alan Turing",
      reason: "Project assistance",
      message: "Help with data structures capstone",
      date: "2025-11-12",
      timeIn: "10:00",
      timeOut: "11:00",
      status: "Pending",
    },
    {
      id: "C-1002",
      studentNo: "21-00234",
      studentName: "Rizal, Jose P.",
      section: "BSCS1A",
      professor: "Prof. Ada Lovelace",
      reason: "Grade dispute",
      message: "Midterm grading clarification",
      date: "2025-11-13",
      timeIn: "14:30",
      timeOut: "15:15",
      status: "Completed",
    },
  ]);

  // Date filtering logic
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.onFilterChanged();
    }
  }, [fromDate, toDate]);

  const isExternalFilterPresent = useCallback((): boolean => {
    return fromDate !== "" || toDate !== "";
  }, [fromDate, toDate]);

  const doesExternalFilterPass = useCallback(
    (node: any): boolean => {
      if (!node.data) return true;
      const rDate = node.data.date;
      if (fromDate && rDate < fromDate) return false;
      if (toDate && rDate > toDate) return false;
      return true;
    },
    [fromDate, toDate]
  );

  const colDefs = useMemo<ColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 90, editable: false },
      { field: "studentNo", headerName: "Student No.", width: 130, minWidth: 130 },
      { field: "studentName", headerName: "Student Name", flex: 1.5, minWidth: 160, editable: false, tooltipField: "studentName" },
      { 
        field: "section", 
        headerName: "Section", 
        width: 110,
        minWidth: 110,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: SECTIONS }
      },
      { 
        field: "professor", 
        headerName: "Professor", 
        flex: 1.2,
        minWidth: 150,
        tooltipField: "professor",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PROFESSORS }
      },
      { 
        field: "reason", 
        headerName: "Reason", 
        flex: 1.2,
        minWidth: 150,
        tooltipField: "reason",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: REASONS }
      },
      { field: "message", headerName: "Message", flex: 1.5, minWidth: 200, tooltipField: "message" },
      { field: "date", headerName: "Date", width: 120, minWidth: 120 },
      { field: "timeIn", headerName: "Time In", width: 100, minWidth: 100 },
      { field: "timeOut", headerName: "Time Out", width: 100, minWidth: 100 },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: STATUSES },
      },
      {
        headerName: "Actions",
        width: 100,
        cellRenderer: ActionsRenderer,
        editable: false,
        sortable: false,
        filter: false,
        pinned: "right",
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
    }),
    []
  );

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    setSelectedCount(event.api.getSelectedNodes().length);
  }, []);

  const onRowClicked = useCallback((e: any) => {
    if (e.data) setSelectedRow(e.data);
  }, []);

  const handleEditFromPanel = () => {
    if (selectedRow) {
      setNewForm(selectedRow);
      setIsEditMode(true);
      setIsModalOpen(true);
      setSelectedRow(null); // Close panel when opening modal
    }
  };

  const handleOpenNewModal = () => {
    setNewForm({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    if (event.colDef.field === "studentNo") {
      const newVal = event.newValue as string;
      const oldVal = event.oldValue as string;
      
      // Validate format
      if (!/^\d{2}-\d{5}$/.test(newVal)) {
        showToast("Invalid Student Number format. Must be XX-XXXXX (e.g., 23-00163).", "error");
        event.node.setDataValue("studentNo", oldVal);
        return;
      }
      
      // Lookup student name
      const foundName = STUDENT_DB[newVal];
      if (foundName) {
        event.node.setDataValue("studentName", foundName);
        showToast("Student name updated.", "success");
      } else {
        showToast(`No student found for number ${newVal}.`, "error");
        event.node.setDataValue("studentName", "Unknown Student");
      }
    }
  }, [showToast]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", e.target.value);
    }
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!gridRef.current) return;
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length > 0) {
      gridRef.current.api.applyTransaction({ remove: selectedRows });
      setSelectedCount(0);
    }
  }, []);

  const handleModalStudentNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewForm(prev => ({ ...prev, studentNo: val }));
    
    // Auto-fill student name if matches 23-00163
    if (/^\d{2}-\d{5}$/.test(val)) {
       const found = STUDENT_DB[val];
       if (found) {
         setNewForm(prev => ({ ...prev, studentName: found }));
       } else {
         setNewForm(prev => ({ ...prev, studentName: "" }));
       }
    } else {
      setNewForm(prev => ({ ...prev, studentName: "" }));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gridRef.current) return;

    if (!/^\d{2}-\d{5}$/.test(newForm.studentNo || "")) {
       showToast("Invalid Student Number format. Must be XX-XXXXX.", "error");
       return;
    }
    
    if (!newForm.studentName) {
       showToast(`No student exists for number ${newForm.studentNo}`, "error");
       return;
    }

    if (isEditMode) {
      const updatedRecord = { ...newForm } as Consultation;
      gridRef.current.api.applyTransaction({ update: [updatedRecord] });
      showToast("Log updated successfully.", "success");
    } else {
      const newRecord: Consultation = {
        id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
        studentNo: newForm.studentNo || "",
        studentName: newForm.studentName || "",
        section: newForm.section || SECTIONS[0],
        professor: newForm.professor || PROFESSORS[0],
        reason: newForm.reason || REASONS[0],
        message: newForm.message || "",
        date: newForm.date || new Date().toISOString().split("T")[0],
        timeIn: newForm.timeIn || "",
        timeOut: newForm.timeOut || "",
        status: newForm.status || "Pending",
      };
      gridRef.current.api.applyTransaction({ add: [newRecord] });
      showToast("Log added successfully.", "success");
    }

    setIsModalOpen(false);
    setNewForm({});
  };

  return (
    <div className="consultations-page">
      {/* Redesigned Header mimicking the mock image */}
      <div className="consultations-header-bar">
        <div className="header-bar-left">
          <h1 className="header-bar-title">Consultation Logs</h1>
        </div>
        
        <div className="header-bar-right">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search records..."
              onChange={handleSearch}
            />
          </div>
          <button className="btn btn-new-log" onClick={handleOpenNewModal}>
            <Plus size={16} /> New Log
          </button>
          <button className="btn-info" onClick={() => setIsInfoModalOpen(true)} title="How to use">
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="date-filter-group">
          <label>From:</label>
          <input type="date" className="filter-date-input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <label>To:</label>
          <input type="date" className="filter-date-input" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        {selectedCount > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={16} />
            Delete Selected ({selectedCount})
          </button>
        )}
      </div>

      <div className="grid-container">
        <AgGridReact
          theme={adminTheme}
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection={{ mode: "multiRow", checkboxes: true, headerCheckbox: true }}
          onSelectionChanged={onSelectionChanged}
          onRowClicked={onRowClicked}
          onCellValueChanged={onCellValueChanged}
          tooltipShowDelay={300}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleAddSubmit}>
            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 className="modal-title">{isEditMode ? "Edit Consultation Log" : "Add Consultation Log"}</h2>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Student No. (XX-XXXXX)</label>
                  <input
                    type="text"
                    required
                    placeholder="23-00163"
                    value={newForm.studentNo || ""}
                    onChange={handleModalStudentNoChange}
                  />
                </div>
                <div className="form-group">
                  <label>Student Name (Auto-filled)</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={newForm.studentName || ""}
                    style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                  />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select required value={newForm.section || ""} onChange={e => setNewForm({...newForm, section: e.target.value})}>
                    <option value="" disabled>Select section</option>
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Professor</label>
                  <select required value={newForm.professor || ""} onChange={e => setNewForm({...newForm, professor: e.target.value})}>
                    <option value="" disabled>Select professor</option>
                    {PROFESSORS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Reason</label>
                  <select required value={newForm.reason || ""} onChange={e => setNewForm({...newForm, reason: e.target.value})}>
                    <option value="" disabled>Select reason</option>
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Message</label>
                  <textarea rows={2} required value={newForm.message || ""} onChange={e => setNewForm({...newForm, message: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={newForm.date || ""} onChange={e => setNewForm({...newForm, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={newForm.status || "Pending"} onChange={e => setNewForm({...newForm, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Time In</label>
                  <input type="time" required value={newForm.timeIn || ""} onChange={e => setNewForm({...newForm, timeIn: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time Out</label>
                  <input type="time" required value={newForm.timeOut || ""} onChange={e => setNewForm({...newForm, timeOut: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Log</button>
            </div>
          </form>
        </div>
      )}

      {/* Info Modal */}
      {isInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h3>How to Use</h3>
              <button className="close-btn" onClick={() => setIsInfoModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ lineHeight: "1.6" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li style={{ marginBottom: "10px" }}><strong>Add:</strong> Click the "New Log" button in the header. Ensure Student Number format is exactly <code>XX-XXXXX</code>.</li>
                <li style={{ marginBottom: "10px" }}><strong>Edit:</strong> Double-click directly on any cell in the table to edit its value. You need to press enter to save instead of just clicking away.</li>
                <li style={{ marginBottom: "10px" }}><strong>Delete Single:</strong> Click the trash icon in the Actions column of the row.</li>
                <li><strong>Delete Multiple:</strong> Check the boxes next to the rows you want to delete, then click "Delete Selected" above the table.</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setIsInfoModalOpen(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedRow && (
        <>
          <div className="panel-backdrop" onClick={() => setSelectedRow(null)} aria-hidden="true" />
          <aside className="detail-panel" role="dialog" aria-label="Consultation details">
            <div className="panel-header">
              <h2 className="panel-title">Consultation Details</h2>
              <div className="panel-actions">
                <button className="panel-action-btn" onClick={handleEditFromPanel} title="Edit Record">
                  <Edit2 size={16} />
                </button>
                <button className="panel-action-btn" onClick={() => setSelectedRow(null)} aria-label="Close details">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="panel-student">
              <div className="panel-avatar" aria-hidden="true">
                {selectedRow.studentName.charAt(0)}
              </div>
              <div>
                <p className="panel-student-name">{selectedRow.studentName}</p>
                <p className="panel-student-meta">
                  {selectedRow.studentNo} · {selectedRow.section}
                </p>
              </div>
            </div>

            <dl className="panel-fields">
              <div className="panel-field">
                <dt>
                  <CalendarDays size={14} aria-hidden="true" />
                  Date
                </dt>
                <dd>{selectedRow.date}</dd>
              </div>
              <div className="panel-field">
                <dt>
                  <Clock size={14} aria-hidden="true" />
                  Time
                </dt>
                <dd>
                  {selectedRow.timeIn} → {selectedRow.timeOut}
                </dd>
              </div>
              <div className="panel-field">
                <dt>
                  <Tag size={14} aria-hidden="true" />
                  Reason
                </dt>
                <dd>{selectedRow.reason}</dd>
              </div>
              <div className="panel-field">
                <dt>
                  <Hash size={14} aria-hidden="true" />
                  Professor
                </dt>
                <dd>{selectedRow.professor}</dd>
              </div>
              <div className="panel-field">
                <dt>
                  <MessageSquare size={14} aria-hidden="true" />
                  Message
                </dt>
                <dd className="panel-message">{selectedRow.message}</dd>
              </div>
            </dl>
          </aside>
        </>
      )}
    </div>
  );
}
