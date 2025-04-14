export type Skill = {
  id?: string; // Firestore Document ID
  name: string;
  level: number; // Proficiency level (e.g., 0-100)
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}; 