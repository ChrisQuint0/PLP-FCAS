import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Plus, Eye, Edit2, Archive, Upload, Download, RefreshCw } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  SelectionChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from 'ag-grid-community';

import AddProfessorDialog from '../components/professors/AddProfessorDialog';
import ProfessorDetailsSidebar from '../components/professors/ProfessorDetailsSidebar';
import ResetPasswordDialog from '../components/professors/ResetPasswordDialog';
import { useProfessors } from '../hooks/useProfessors';
import { Professor } from '../types/professor';
import { useToast } from '../contexts/ToastContext';
import './AdminProfessors.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const adminTheme = themeQuartz.withParams({
  accentColor: "#1e7a45",
  selectedRowBackgroundColor: "rgba(30, 122, 69, 0.08)",
  rowHoverColor: "rgba(30, 122, 69, 0.04)",
  headerBackgroundColor: "#f9fbf9",
  borderColor: "#deeae2",
});

export default function AdminProfessors() {
  const { showToast } = useToast();
  const gridRef = useRef<AgGridReact>(null);
  
  const {
    professors,
    addProfessor,
    updateProfessor,
    archiveProfessor,
    deleteProfessor
  } = useProfessors();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isResetPwdOpen, setIsResetPwdOpen] = useState(false);
  
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [resetPwdProf, setResetPwdProf] = useState<{id: string, name: string} | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + N for Add Professor
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsAddModalOpen(true);
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

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", e.target.value);
    }
  }, []);

  const handleRowClicked = (e: any) => {
    setSelectedProfessor(e.data);
    setIsDetailsOpen(true);
  };

  const handleAddSave = (data: Omit<Professor, 'id' | 'hasConsultations'>) => {
    addProfessor(data);
    showToast("Professor added successfully", "success");
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id: string, data: Partial<Professor>) => {
    updateProfessor(id, data);
    showToast("Professor updated successfully", "success");
    
    // Update selected professor state to reflect changes in sidebar
    if (selectedProfessor && selectedProfessor.id === id) {
      setSelectedProfessor({ ...selectedProfessor, ...data } as Professor);
    }
  };

  const handleArchive = (id: string) => {
    archiveProfessor(id);
    showToast("Professor archived successfully", "success");
    // Row will update, we let the grid handle it
  };

  const handleDelete = (id: string) => {
    deleteProfessor(id);
    showToast("Professor deleted successfully", "success");
  };

  const handleOpenResetPassword = (id: string, name: string) => {
    setResetPwdProf({ id, name });
    setIsResetPwdOpen(true);
  };

  const handleResetPasswordSave = (newPassword: string) => {
    // In a real app, send newPassword to the backend
    showToast("Password updated successfully", "success");
    setIsResetPwdOpen(false);
    setResetPwdProf(null);
  };

  const handleGenerateReport = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `Professors_Report_${new Date().toISOString().slice(0, 10)}.csv`,
        columnKeys: ['firstName', 'lastName', 'middleName', 'suffix', 'email', 'username', 'status']
      });
      showToast("Report generated successfully", "success");
    }
  };

  // AG-Grid Columns
  const colDefs = useMemo<ColDef[]>(() => [
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 120 },
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 120 },
    { field: "middleName", headerName: "MI", width: 80 },
    { field: "suffix", headerName: "Suffix", width: 90 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
    { field: "username", headerName: "Username", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", width: 110,
      cellRenderer: (params: any) => (
        <span className={`prof-grid-badge ${params.value === 'Active' ? 'badge-active' : 'badge-archived'}`}>
          {params.value}
        </span>
      )
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="professors-page">
      <div className="professors-header-bar">
        <div className="professors-header-left">
          <h1 className="professors-title">Professor Management</h1>
        </div>
        
        <div className="professors-header-right">
          <div className="prof-search-wrapper">
            <Search size={16} className="prof-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="prof-search-input"
              placeholder="Search professors..."
              onChange={handleSearch}
            />
          </div>
          
          <button className="prof-btn prof-btn-secondary" onClick={() => { /* Refresh mock data logic if needed */ }}>
            <RefreshCw size={16} /> Refresh
          </button>
          
          <button className="prof-btn prof-btn-secondary" onClick={handleGenerateReport} title="Export to CSV">
            <Download size={16} /> Generate Report
          </button>
          
          <button className="prof-btn prof-btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Professor
          </button>
        </div>
      </div>

      <div className="professors-grid-container">
        <AgGridReact
          theme={adminTheme}
          ref={gridRef}
          rowData={professors}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection={{ mode: "singleRow" }}
          onRowClicked={handleRowClicked}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>

      <AddProfessorDialog 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddSave} 
      />

      {isDetailsOpen && selectedProfessor && (
        <ProfessorDetailsSidebar 
          professor={professors.find(p => p.id === selectedProfessor.id) || selectedProfessor} 
          onClose={() => setIsDetailsOpen(false)}
          onUpdate={handleUpdate}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onResetPassword={handleOpenResetPassword}
        />
      )}

      {resetPwdProf && (
        <ResetPasswordDialog
          isOpen={isResetPwdOpen}
          professorName={resetPwdProf.name}
          onClose={() => { setIsResetPwdOpen(false); setResetPwdProf(null); }}
          onSave={handleResetPasswordSave}
        />
      )}
    </div>
  );
}
