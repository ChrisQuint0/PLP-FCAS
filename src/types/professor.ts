export interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  email: string;
  username: string;
  status: 'Active' | 'Archived';
  hasConsultations: boolean;
}
