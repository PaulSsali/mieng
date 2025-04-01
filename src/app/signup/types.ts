export interface FormData {
  // Step 1: Personal Information
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Engineering Discipline
  discipline: string;
  
  // Step 3: Work Experience
  experience: string;
  hasMentor: boolean;
  
  // Step 4: Report Completion Preferences
  hoursPerWeek: number;
  completionTimeline: string;
} 