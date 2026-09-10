export type ExamType = 'YKS-SAY' | 'YKS-EA' | 'YKS-SOZ' | 'LGS' | 'KPSS' | 'DGS' | 'GENEL';

export type HomeworkStatus = 'pending' | 'completed' | 'incompleted' | 'reviewed';

export interface Student {
  id: string;
  name: string;
  code: string; // Unique student login code (e.g. ZEYNEP, EMRE, ARDA)
  avatar?: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  examType: ExamType;
  targetDepartment: string;
  targetRanking: string;
  dailyTargetQuestions: number;
  weeklyTargetQuestions: number;
  streak: number;
  notes: string;
  createdAt: string;
}

export interface Homework {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  source: string;
  targetCount: number;
  completedCount?: number;
  dueDate: string; // YYYY-MM-DD
  status: HomeworkStatus;
  coachFeedback?: string;
  studentNotes?: string;
  createdAt: string;
}

export interface SubjectStat {
  subject: string;
  correct: number;
  wrong: number;
  empty: number;
}

export interface DailyLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  studyMinutes: number;
  subjects: SubjectStat[];
  notes: string;
  mood?: 'super' | 'good' | 'tired' | 'stressed';
}

export interface ExamScoreDetail {
  subject: string;
  correct: number;
  wrong: number;
  net: number;
}

export interface ExamResult {
  id: string;
  studentId: string;
  title: string;
  date: string;
  type: string;
  scores: ExamScoreDetail[];
  totalNet: number;
  ranking?: string;
  coachNotes?: string;
}

export interface MotivationMessage {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'focus' | 'stress' | 'grit' | 'success' | 'routine';
  coachNote?: string;
  isCustom?: boolean;
  date: string;
}

export interface MeetingNote {
  id: string;
  studentId: string;
  date: string;
  durationMinutes: number;
  keyPoints: string;
  actionItems: string;
  nextMeetingDate?: string;
}
