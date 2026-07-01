import React from 'react';
import { X, User, Mail, GraduationCap, Edit2, Archive, Clock } from 'lucide-react';
import { Student } from '../../pages/AdminStudents';
import './StudentDetailsPanel.css';

interface StudentDetailsPanelProps {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

export default function StudentDetailsPanel({ student, onClose, onEdit, onArchive }: StudentDetailsPanelProps) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-content animate-slide-left" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Student Details</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="panel-body">
          <div className="student-profile-header">
            <div className="profile-avatar">
              <User size={32} color="#1e7a45" />
            </div>
            <div className="profile-info">
              <h3>{student.lastName} {student.suffix}, {student.firstName} {student.middleName}</h3>
              <span className="student-no">{student.studentNo}</span>
              <span className={`status-badge badge-${student.status.toLowerCase()}`}>
                {student.status}
              </span>
            </div>
          </div>

          <div className="panel-section">
            <h4>Contact Information</h4>
            <div className="info-row">
              <Mail size={16} className="info-icon" />
              <span>{student.email}</span>
            </div>
          </div>

          <div className="panel-section">
            <h4>Enrollment Information</h4>
            <div className="info-row">
              <GraduationCap size={16} className="info-icon" />
              <span>Section: {student.section}</span>
            </div>
            <div className="info-row">
              <Clock size={16} className="info-icon" />
              <span>Status: {student.status} Student</span>
            </div>
          </div>

          <div className="panel-section">
            <h4>Recent Activity</h4>
            <div className="empty-state">
              <p>No recent consultations or activity recorded.</p>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <button className="secondary-btn" onClick={onEdit}>
            <Edit2 size={16} /> Edit Profile
          </button>
          {student.status !== 'Archived' && (
            <button className="danger-btn" onClick={onArchive}>
              <Archive size={16} /> Archive Student
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
