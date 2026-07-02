import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Edit2, Archive, Trash2, KeyRound, Save, XCircle } from 'lucide-react';
import { Professor } from '../../types/professor';
import './ProfessorDetailsSidebar.css';

interface ProfessorDetailsSidebarProps {
  professor: Professor;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Professor>) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string, name: string) => void;
}

export default function ProfessorDetailsSidebar({
  professor,
  onClose,
  onUpdate,
  onArchive,
  onDelete,
  onResetPassword,
}: ProfessorDetailsSidebarProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Professor>>({});

  useEffect(() => {
    setFormData(professor);
    setIsEditMode(false);
  }, [professor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate Middle Initial (Max 1 char)
    if (name === 'middleName' && value.length > 1) {
      return;
    }

    // Validate Names (Alphabetic + spaces)
    if ((name === 'firstName' || name === 'lastName') && value.length > 0 && !/^[A-Za-z\s]+$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
      alert("Please fill in all required fields.");
      return;
    }
    onUpdate(professor.id, formData);
    setIsEditMode(false);
  };

  const handleArchive = () => {
    if (window.confirm("Archive this professor?\n\nArchived professors can still be restored later.")) {
      onArchive(professor.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (professor.hasConsultations) return;
    if (window.confirm(`Are you sure you want to permanently delete ${professor.firstName} ${professor.lastName}?`)) {
      onDelete(professor.id);
      onClose();
    }
  };

  return (
    <div className="prof-sidebar-overlay" onClick={onClose}>
      <div className="prof-sidebar-content animate-slide-left" onClick={(e) => e.stopPropagation()}>
        <div className="prof-sidebar-header">
          <h2>{isEditMode ? 'Edit Professor' : 'Professor Information'}</h2>
          <button className="prof-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="prof-sidebar-body">
          <div className="prof-profile-header">
            <div className="prof-avatar">
              <User size={32} color="#1e7a45" />
            </div>
            <div className="prof-info">
              {!isEditMode ? (
                <>
                  <h3>{professor.lastName} {professor.suffix ? `${professor.suffix},` : ','} {professor.firstName} {professor.middleName}</h3>
                  <span className="prof-username">@{professor.username}</span>
                  <span className={`prof-status-badge badge-${professor.status.toLowerCase()}`}>
                    {professor.status}
                  </span>
                </>
              ) : (
                <h3>Editing Profile</h3>
              )}
            </div>
          </div>

          <div className="prof-sidebar-section">
            <h4>Profile Details</h4>
            
            <div className="prof-field-group">
              <label>First Name</label>
              {isEditMode ? (
                <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
              ) : (
                <div className="prof-read-only">{professor.firstName}</div>
              )}
            </div>

            <div className="prof-field-group">
              <label>Last Name</label>
              {isEditMode ? (
                <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
              ) : (
                <div className="prof-read-only">{professor.lastName}</div>
              )}
            </div>

            <div className="prof-sidebar-row">
              <div className="prof-field-group">
                <label>M.I.</label>
                {isEditMode ? (
                  <input type="text" name="middleName" value={formData.middleName || ''} onChange={handleChange} className="uppercase" />
                ) : (
                  <div className="prof-read-only">{professor.middleName || '-'}</div>
                )}
              </div>
              <div className="prof-field-group">
                <label>Suffix</label>
                {isEditMode ? (
                  <select name="suffix" value={formData.suffix || ''} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                ) : (
                  <div className="prof-read-only">{professor.suffix || '-'}</div>
                )}
              </div>
            </div>
          </div>

          <div className="prof-sidebar-section">
            <h4>Account Information</h4>
            
            <div className="prof-field-group">
              <label>Email Address</label>
              {isEditMode ? (
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              ) : (
                <div className="prof-read-only flex-center"><Mail size={16} className="prof-icon"/> {professor.email}</div>
              )}
            </div>

            <div className="prof-field-group">
              <label>Username</label>
              {isEditMode ? (
                <input type="text" name="username" value={formData.username || ''} onChange={handleChange} required />
              ) : (
                <div className="prof-read-only flex-center"><Shield size={16} className="prof-icon"/> {professor.username}</div>
              )}
            </div>

            <div className="prof-field-group">
              <label>Password</label>
              <button 
                className="prof-reset-pwd-btn" 
                onClick={() => onResetPassword(professor.id, `${professor.firstName} ${professor.lastName}`)}
              >
                <KeyRound size={16} /> Reset Password
              </button>
            </div>
          </div>

        </div>

        <div className="prof-sidebar-footer">
          {isEditMode ? (
            <>
              <button className="prof-btn-cancel" onClick={() => { setIsEditMode(false); setFormData(professor); }}>
                <XCircle size={16} /> Cancel
              </button>
              <button className="prof-btn-save" onClick={handleSave}>
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <>
              <div className="prof-actions-row">
                <button className="prof-btn-secondary" onClick={() => setIsEditMode(true)}>
                  <Edit2 size={16} /> Edit
                </button>
                {professor.status !== 'Archived' && (
                  <button className="prof-btn-warning" onClick={handleArchive}>
                    <Archive size={16} /> Archive
                  </button>
                )}
              </div>
              
              <div className="prof-delete-container">
                <button 
                  className={`prof-btn-danger ${professor.hasConsultations ? 'disabled' : ''}`} 
                  onClick={handleDelete}
                  disabled={professor.hasConsultations}
                >
                  <Trash2 size={16} /> Delete Professor
                </button>
                {professor.hasConsultations && (
                  <p className="prof-helper-text">
                    This professor cannot be deleted because consultation records are associated with this account.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
