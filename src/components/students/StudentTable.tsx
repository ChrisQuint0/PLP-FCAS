import React from 'react';
import { Eye, Edit2, Archive } from 'lucide-react';
import { Student } from '../../pages/AdminStudents';
import './StudentTable.css';

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onArchive: (student: Student) => void;
}

export default function StudentTable({ students, onView, onEdit, onArchive }: StudentTableProps) {
  
  const getStatusBadgeClass = (status: Student['status']) => {
    switch (status) {
      case 'Regular': return 'badge-success';
      case 'Irregular': return 'badge-warning';
      case 'Inactive': return 'badge-inactive';
      case 'Archived': return 'badge-archived';
      default: return '';
    }
  };

  if (students.length === 0) {
    return (
      <div className="student-table-empty card">
        <p>No students found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="student-table-container card">
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>MI</th>
              <th>Section</th>
              <th>Email</th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} onDoubleClick={() => onView(student)}>
                <td className="font-medium">{student.studentNo}</td>
                <td>{student.lastName} {student.suffix}</td>
                <td>{student.firstName}</td>
                <td>{student.middleName}</td>
                <td>
                  <span className="section-badge">{student.section}</span>
                </td>
                <td className="text-muted">{student.email}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-icon view" 
                    title="View Details"
                    onClick={() => onView(student)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-icon edit" 
                    title="Edit Student"
                    onClick={() => onEdit(student)}
                  >
                    <Edit2 size={16} />
                  </button>
                  {student.status !== 'Archived' && (
                    <button 
                      className="action-icon archive" 
                      title="Archive Student"
                      onClick={() => onArchive(student)}
                    >
                      <Archive size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <span className="pagination-info">Showing {students.length} of {students.length} students</span>
        <div className="pagination-controls">
          <button className="page-btn" disabled>Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
