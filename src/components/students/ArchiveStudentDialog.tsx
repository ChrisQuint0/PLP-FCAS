import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ArchiveStudentDialog.css';

interface ArchiveStudentDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ArchiveStudentDialog({ onClose, onConfirm }: ArchiveStudentDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content animate-pop">
        <div className="dialog-icon-wrapper">
          <AlertTriangle size={32} color="#c62828" />
        </div>
        <h3 className="dialog-title">Archive Student</h3>
        <p className="dialog-message">
          Are you sure you want to archive this student? They will no longer appear in active lists, but their records will be preserved.
        </p>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Archive</button>
        </div>
      </div>
    </div>
  );
}
