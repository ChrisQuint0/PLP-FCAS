import { useState, useCallback } from 'react';
import { Professor } from '../types/professor';

const mockProfessors: Professor[] = [
  { id: '1', firstName: 'Samantha', lastName: 'Siao', middleName: '', suffix: '', email: 'sison_markjoseph@plpasig.edu.ph', username: '22-00624', status: 'Active', hasConsultations: true },
  { id: '2', firstName: 'Alexen', lastName: 'Elacio', middleName: 'A', suffix: '', email: 'Elacio_Alexen@plpasig.edu.ph', username: 'Alexen', status: 'Active', hasConsultations: false },
  { id: '3', firstName: 'Berlinne', lastName: 'Bobis', middleName: 'S', suffix: '', email: 'Bobis_Berlinne@plpasig.edu.ph', username: 'Berline', status: 'Active', hasConsultations: true },
  { id: '4', firstName: 'Catherine', lastName: 'Sorbito', middleName: 'B', suffix: '', email: 'Sorbito_Catherine@plpasig.edu.ph', username: 'Catherine', status: 'Active', hasConsultations: false },
  { id: '5', firstName: 'Dawn Bernadette', lastName: 'Menor', middleName: 'O', suffix: '', email: 'Menor_DawnBernadette@plpasig.edu.ph', username: 'Dawn', status: 'Active', hasConsultations: false },
  { id: '6', firstName: 'Juanito', lastName: 'Alvarez', middleName: '', suffix: 'Jr', email: 'alvarez_juanito@plpasig.edu.ph', username: 'jhun', status: 'Active', hasConsultations: true },
];

export function useProfessors() {
  const [professors, setProfessors] = useState<Professor[]>(mockProfessors);

  const addProfessor = useCallback((professorData: Omit<Professor, 'id' | 'hasConsultations'>) => {
    const newProfessor: Professor = {
      ...professorData,
      id: Date.now().toString(),
      hasConsultations: false,
    };
    setProfessors((prev) => [...prev, newProfessor]);
  }, []);

  const updateProfessor = useCallback((id: string, professorData: Partial<Professor>) => {
    setProfessors((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...professorData } : p))
    );
  }, []);

  const archiveProfessor = useCallback((id: string) => {
    setProfessors((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Archived' } : p))
    );
  }, []);

  const deleteProfessor = useCallback((id: string) => {
    setProfessors((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    professors,
    addProfessor,
    updateProfessor,
    archiveProfessor,
    deleteProfessor,
  };
}
