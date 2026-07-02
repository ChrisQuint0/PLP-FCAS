import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Professor } from '../../types/professor';
import './AddProfessorDialog.css';

interface AddProfessorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Professor, 'id' | 'hasConsultations'>) => void;
}

export default function AddProfessorDialog({ isOpen, onClose, onSave }: AddProfessorDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
      setError(null);
    }
  }, [isOpen]);

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

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password matching
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Strong password (min 6 chars for simplicity here)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Pass data
    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      suffix: formData.suffix,
      email: formData.email,
      username: formData.username,
      status: 'Active',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="add-prof-dialog-content">
        <DialogHeader>
          <DialogTitle>Add New Professor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="add-prof-form">
          {error && <div className="add-prof-error">{error}</div>}
          
          <div className="add-prof-grid">
            <div className="add-prof-group">
              <label>First Name <span className="add-prof-req">*</span></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="e.g. John" />
            </div>

            <div className="add-prof-group">
              <label>Last Name <span className="add-prof-req">*</span></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="e.g. Doe" />
            </div>

            <div className="add-prof-group">
              <label>M.I. <span className="add-prof-opt">(Opt)</span></label>
              <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="e.g. A" className="uppercase" />
            </div>

            <div className="add-prof-group">
              <label>Suffix <span className="add-prof-opt">(Opt)</span></label>
              <select name="suffix" value={formData.suffix} onChange={handleChange}>
                <option value="">None</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>

            <div className="add-prof-group add-prof-full">
              <label>Email Address <span className="add-prof-req">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="professor@plp.edu.ph" />
            </div>

            <div className="add-prof-group add-prof-full">
              <label>Username <span className="add-prof-req">*</span></label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Unique username" />
            </div>

            <div className="add-prof-group">
              <label>Password <span className="add-prof-req">*</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min 6 characters" />
            </div>

            <div className="add-prof-group">
              <label>Confirm Password <span className="add-prof-req">*</span></label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-type password" />
            </div>
          </div>

          <DialogFooter className="add-prof-footer">
            <button type="button" className="add-prof-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-prof-submit">Create Professor</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
