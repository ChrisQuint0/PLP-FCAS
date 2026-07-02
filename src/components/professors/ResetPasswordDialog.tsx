import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import './ResetPasswordDialog.css';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  professorName: string;
  onClose: () => void;
  onSave: (newPassword: string) => void;
}

export default function ResetPasswordDialog({ isOpen, professorName, onClose, onSave }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    onSave(password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="reset-pwd-dialog-content">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Setting a new password for <strong>{professorName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="reset-pwd-form">
          {error && <div className="reset-pwd-error">{error}</div>}
          
          <div className="reset-pwd-group">
            <label>New Password <span className="reset-pwd-req">*</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Min 6 characters" 
            />
          </div>

          <div className="reset-pwd-group">
            <label>Confirm Password <span className="reset-pwd-req">*</span></label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Re-type new password" 
            />
          </div>

          <DialogFooter className="reset-pwd-footer">
            <button type="button" className="reset-pwd-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="reset-pwd-submit">Update Password</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
