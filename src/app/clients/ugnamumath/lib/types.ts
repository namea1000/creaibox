export interface AcademyBranch {
  id: string;
  name: string;
  licenseNumber: string;
  description: string;
  imageUrl: string;
}

export interface CurriculumItem {
  id: string;
  title: string;
  target: string;
  description: string;
  details: string[];
  imageUrl: string;
}

export interface AchievementItem {
  id: string;
  studentName: string;
  targetSchool: string;
  year: string;
  status: string; // "합격" 등
  category: "영재교/과고" | "특목/자사고" | "대입";
}
