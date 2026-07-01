import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../pages/AdminStudents';
import './StudentModal.css';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
}

export default function StudentModal({ student, onClose, onSave }: StudentModalProps) {
  const isEdit = !!student;
  
  const [formData, setFormData] = useState<Partial<Student>>({
    studentNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    section: 'BSIT3A',
    status: 'Regular',
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="sm-modal-overlay">
      <div className="sm-modal-content sm-animate-slide-in">
        <div className="sm-modal-header">
          <h2 className="sm-modal-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="sm-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="sm-student-form">
          <div className="sm-form-grid">
            <div className="sm-form-group sm-full-width">
              <label>Student Number <span className="sm-required">*</span></label>
              <input 
                type="text" 
                name="studentNo" 
                value={formData.studentNo} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 23-00163"
              />
            </div>
            
            <div className="sm-form-group">
              <label>First Name <span className="sm-required">*</span></label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
                placeholder="First name"
              />
            </div>

            <div className="sm-form-group">
              <label>Middle Name <span className="sm-optional">(Optional)</span></label>
              <input 
                type="text" 
                name="middleName" 
                value={formData.middleName} 
                onChange={handleChange}
                placeholder="Middle name"
              />
            </div>

            <div className="sm-form-group">
              <label>Last Name <span className="sm-required">*</span></label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
                placeholder="Last name"
              />
            </div>

            <div className="sm-form-group">
              <label>Suffix <span className="sm-optional">(Optional)</span></label>
              <input 
                type="text" 
                name="suffix" 
                value={formData.suffix} 
                onChange={handleChange} 
                placeholder="e.g. Jr., III"
              />
            </div>

            <div className="sm-form-group sm-full-width">
              <label>Email Address <span className="sm-required">*</span></label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="student@plp.edu.ph"
              />
            </div>

            <div className="sm-form-group">
              <label>Section <span className="sm-required">*</span></label>
              <div className="sm-select-wrapper">
                <select name="section" value={formData.section} onChange={handleChange} required>
                  <option value="BSIT3A">BSIT3A</option>
                  <option value="BSIT3B">BSIT3B</option>
                  <option value="BSIT4A">BSIT4A</option>
                  <option value="BSIT4B">BSIT4B</option>
                  <option value="BSCS1A">BSCS1A</option>
                </select>
              </div>
            </div>

            <div className="sm-form-group">
              <label>Enrollment Status <span className="sm-required">*</span></label>
              <div className="sm-select-wrapper">
                <select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sm-modal-footer">
            <button type="button" className="sm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="sm-btn-submit">
              {isEdit ? 'Save Changes' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
