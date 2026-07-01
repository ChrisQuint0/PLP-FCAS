import React from 'react';
import { Search, RefreshCw, Upload, Download } from 'lucide-react';
import './StudentToolbar.css';

interface StudentToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sectionFilter: string;
  onSectionChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export default function StudentToolbar({
  searchQuery,
  onSearchChange,
  sectionFilter,
  onSectionChange,
  statusFilter,
  onStatusChange,
  searchInputRef
}: StudentToolbarProps) {
  
  return (
    <div className="student-toolbar card">
      <div className="toolbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            ref={searchInputRef}
            type="text" 
            className="search-input" 
            placeholder="Search by student number, name, or email..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <select 
          className="filter-select"
          value={sectionFilter}
          onChange={(e) => onSectionChange(e.target.value)}
        >
          <option value="">All Sections</option>
          <option value="BSIT3A">BSIT3A</option>
          <option value="BSIT3B">BSIT3B</option>
          <option value="BSIT4A">BSIT4A</option>
          <option value="BSIT4B">BSIT4B</option>
          <option value="BSCS1A">BSCS1A</option>
        </select>

        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Regular">Regular</option>
          <option value="Irregular">Irregular</option>
          <option value="Inactive">Inactive</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="toolbar-right">
        <button className="icon-btn" title="Refresh">
          <RefreshCw size={18} />
        </button>
        <button className="secondary-btn" title="Import from Excel">
          <Upload size={16} />
          <span>Import</span>
        </button>
        <button className="secondary-btn" title="Export to Excel/PDF">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
