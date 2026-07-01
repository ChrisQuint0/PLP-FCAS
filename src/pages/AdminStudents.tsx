import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Plus, Eye, Edit2, Archive, Upload, Download } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  SelectionChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from 'ag-grid-community';

import StudentModal from '../components/students/StudentModal';
import StudentDetailsPanel from '../components/students/StudentDetailsPanel';
import ArchiveStudentDialog from '../components/students/ArchiveStudentDialog';
import { useToast } from '../contexts/ToastContext';
import './AdminStudents.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const adminTheme = themeQuartz.withParams({
  accentColor: "#1e7a45",
  selectedRowBackgroundColor: "rgba(30, 122, 69, 0.08)",
  rowHoverColor: "rgba(30, 122, 69, 0.04)",
  headerBackgroundColor: "#f9fbf9",
  borderColor: "#deeae2",
});

export interface Student {
  id: string;
  studentNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  section: string;
  status: 'Regular' | 'Irregular' | 'Inactive' | 'Archived';
}

const mockStudents: Student[] = [
  { id: '1', studentNo: '23-00163', firstName: 'Juan', middleName: 'M.', lastName: 'Dela Cruz', suffix: '', email: 'juan@plp.edu.ph', section: 'BSIT3A', status: 'Regular' },
  { id: '2', studentNo: '21-00234', firstName: 'Jose', middleName: 'P.', lastName: 'Rizal', suffix: '', email: 'jose@plp.edu.ph', section: 'BSIT4A', status: 'Irregular' },
  { id: '3', studentNo: '22-00456', firstName: 'Andres', middleName: 'K.', lastName: 'Bonifacio', suffix: '', email: 'andres@plp.edu.ph', section: 'BSCS1A', status: 'Inactive' },
  { id: '4', studentNo: '24-00111', firstName: 'Apolinario', middleName: 'L.', lastName: 'Mabini', suffix: '', email: 'apolinario@plp.edu.ph', section: 'BSIT3B', status: 'Regular' },
];

export default function AdminStudents() {
  const { showToast } = useToast();
  const gridRef = useRef<AgGridReact>(null);
  
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedCount, setSelectedCount] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + N for Add Student
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleAddClick();
      }
      // Ctrl + F for Search Focus
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleArchiveClick = (student: Student) => {
    setSelectedStudent(student);
    setIsArchiveOpen(true);
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...studentData } as Student : s));
      showToast("Student updated successfully", "success");
    } else {
      const newStudent = { ...studentData, id: Date.now().toString() } as Student;
      setStudents([...students, newStudent]);
      showToast("Student added successfully", "success");
    }
    setIsModalOpen(false);
  };

  const handleConfirmArchive = () => {
    if (selectedStudent) {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, status: 'Archived' } : s));
      showToast("Student archived successfully", "success");
      setIsArchiveOpen(false);
      setIsDetailsOpen(false);
    }
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", e.target.value);
    }
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    setSelectedCount(event.api.getSelectedNodes().length);
  }, []);

  // AG-Grid Columns
  const ActionsRenderer = (props: any) => {
    const student = props.data as Student;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%' }}>
        <button onClick={() => handleViewDetails(student)} title="View" className="action-icon-btn view"><Eye size={16} /></button>
        <button onClick={() => handleEditClick(student)} title="Edit" className="action-icon-btn edit"><Edit2 size={16} /></button>
        {student.status !== 'Archived' && (
          <button onClick={() => handleArchiveClick(student)} title="Archive" className="action-icon-btn archive"><Archive size={16} /></button>
        )}
      </div>
    );
  };

  const colDefs = useMemo<ColDef[]>(() => [
    { field: "studentNo", headerName: "Student No.", width: 130 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 120 },
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 120 },
    { field: "middleName", headerName: "MI", width: 80 },
    { field: "section", headerName: "Section", width: 110 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
    { field: "status", headerName: "Status", width: 110 },
    {
      headerName: "Actions",
      width: 120,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      pinned: "right",
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="students-page">
      <div className="students-header-bar">
        <div className="header-bar-left">
          <h1 className="header-bar-title">Student Records</h1>
        </div>
        
        <div className="header-bar-right">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search students..."
              onChange={handleSearch}
            />
          </div>
          <button className="btn btn-secondary" title="Import Students">
            <Upload size={16} /> Import
          </button>
          <button className="btn btn-secondary" title="Export to Excel">
            <Download size={16} /> Export
          </button>
          <button className="btn btn-new-student" onClick={handleAddClick}>
            <Plus size={16} /> New Student
          </button>
        </div>
      </div>

      <div className="grid-container">
        <AgGridReact
          theme={adminTheme}
          ref={gridRef}
          rowData={students}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection={{ mode: "multiRow", checkboxes: true, headerCheckbox: true }}
          onSelectionChanged={onSelectionChanged}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>

      {isModalOpen && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveStudent} 
        />
      )}

      {isDetailsOpen && selectedStudent && (
        <StudentDetailsPanel 
          student={selectedStudent} 
          onClose={() => setIsDetailsOpen(false)} 
          onEdit={() => handleEditClick(selectedStudent)}
          onArchive={() => handleArchiveClick(selectedStudent)}
        />
      )}

      {isArchiveOpen && (
        <ArchiveStudentDialog 
          onClose={() => setIsArchiveOpen(false)} 
          onConfirm={handleConfirmArchive} 
        />
      )}
    </div>
  );
}
