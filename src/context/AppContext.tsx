import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Homework,
  DailyLog,
  ExamResult,
  MotivationMessage,
  MeetingNote,
  HomeworkStatus
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_HOMEWORKS,
  INITIAL_DAILY_LOGS,
  INITIAL_EXAMS,
  MOTIVATION_QUOTES,
  INITIAL_MEETINGS
} from '../data/initialData';

export type ActiveTab = 'dashboard' | 'students' | 'homework' | 'tracker' | 'exams' | 'motivation' | 'report';
export type ViewRole = 'coach' | 'student';

interface AppContextType {
  // Navigation & Role & Auth
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewRole: ViewRole;
  setViewRole: (role: ViewRole) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedStudent: Student | undefined;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'streak'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Homework
  homeworks: Homework[];
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt'>) => void;
  updateHomework: (id: string, data: Partial<Homework>) => void;
  toggleHomeworkStatus: (id: string, newStatus: HomeworkStatus) => void;
  deleteHomework: (id: string) => void;

  // Daily Logs
  dailyLogs: DailyLog[];
  addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
  deleteDailyLog: (id: string) => void;

  // Exams
  exams: ExamResult[];
  addExam: (exam: Omit<ExamResult, 'id'>) => void;
  deleteExam: (id: string) => void;

  // Motivations
  motivations: MotivationMessage[];
  addMotivation: (quote: Omit<MotivationMessage, 'id' | 'date'>) => void;
  deleteMotivation: (id: string) => void;

  // Meetings
  meetings: MeetingNote[];
  addMeeting: (meeting: Omit<MeetingNote, 'id'>) => void;
  deleteMeeting: (id: string) => void;

  // Backup & Reset
  exportData: () => void;
  importData: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'coach_track_pro_storage_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewRole, setViewRole] = useState<ViewRole>('coach');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('coach_track_is_coach') || !!localStorage.getItem('coach_track_student_code');
  });

  // Load state from localStorage or initialData
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selected_student`);
    return saved || (INITIAL_STUDENTS[0]?.id ?? '');
  });

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_homeworks`);
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORKS;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [exams, setExams] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [motivations, setMotivations] = useState<MotivationMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_motivations`);
    return saved ? JSON.parse(saved) : MOTIVATION_QUOTES;
  });

  const [meetings, setMeetings] = useState<MeetingNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meetings`);
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  // Attempt initial fetch from backend server if available
  useEffect(() => {
    fetch('/api/data')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('No backend');
      })
      .then((data) => {
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
          setHomeworks(data.homeworks || []);
          setDailyLogs(data.dailyLogs || []);
          setExams(data.exams || []);
          setMotivations(data.motivations || []);
          setMeetings(data.meetings || []);
        }
      })
      .catch(() => {
        // Fallback to local storage silently
      });
  }, []);

  // Helper to sync changes to server
  const syncToServer = (payload: any) => {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    syncToServer({ students });
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_selected_student`, selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_homeworks`, JSON.stringify(homeworks));
    syncToServer({ homeworks });
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(dailyLogs));
    syncToServer({ dailyLogs });
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
    syncToServer({ exams });
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_motivations`, JSON.stringify(motivations));
    syncToServer({ motivations });
  }, [motivations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_meetings`, JSON.stringify(meetings));
    syncToServer({ meetings });
  }, [meetings]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const logout = () => {
    localStorage.removeItem('coach_track_is_coach');
    localStorage.removeItem('coach_track_student_code');
    setIsAuthenticated(false);
  };

  // Handlers for Students
  const addStudent = (data: Omit<Student, 'id' | 'createdAt' | 'streak'>) => {
    const code =
      data.code ||
      data.name
        .split(' ')[0]
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

    const newStudent: Student = {
      ...data,
      code,
      id: `student-${Date.now()}`,
      streak: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudentId(newStudent.id);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setHomeworks((prev) => prev.filter((h) => h.studentId !== id));
    setDailyLogs((prev) => prev.filter((l) => l.studentId !== id));
    setExams((prev) => prev.filter((e) => e.studentId !== id));
    setMeetings((prev) => prev.filter((m) => m.studentId !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setSelectedStudentId(remaining[0].id);
      }
    }
  };

  // Handlers for Homework
  const addHomework = (data: Omit<Homework, 'id' | 'createdAt'>) => {
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHomeworks((prev) => [newHw, ...prev]);
  };

  const updateHomework = (id: string, data: Partial<Homework>) => {
    setHomeworks((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
  };

  const toggleHomeworkStatus = (id: string, newStatus: HomeworkStatus) => {
    setHomeworks((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const completedCount = newStatus === 'completed' ? h.targetCount : (h.completedCount ?? 0);
          return { ...h, status: newStatus, completedCount };
        }
        return h;
      })
    );
  };

  const deleteHomework = (id: string) => {
    setHomeworks((prev) => prev.filter((h) => h.id !== id));
  };

  // Handlers for Daily Logs
  const addDailyLog = (data: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...data,
      id: `log-${Date.now()}`
    };
    setDailyLogs((prev) => [newLog, ...prev]);

    // Update streak for the student
    if (selectedStudent) {
      updateStudent(selectedStudent.id, { streak: (selectedStudent.streak || 0) + 1 });
    }
  };

  const deleteDailyLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // Handlers for Exams
  const addExam = (data: Omit<ExamResult, 'id'>) => {
    const newExam: ExamResult = {
      ...data,
      id: `exam-${Date.now()}`
    };
    setExams((prev) => [newExam, ...prev]);
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for Motivations
  const addMotivation = (quote: Omit<MotivationMessage, 'id' | 'date'>) => {
    const newQuote: MotivationMessage = {
      ...quote,
      id: `quote-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isCustom: true
    };
    setMotivations((prev) => [newQuote, ...prev]);
  };

  const deleteMotivation = (id: string) => {
    setMotivations((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers for Meetings
  const addMeeting = (meeting: Omit<MeetingNote, 'id'>) => {
    const newMeeting: MeetingNote = {
      ...meeting,
      id: `meet-${Date.now()}`
    };
    setMeetings((prev) => [newMeeting, ...prev]);
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  // Backup & Reset
  const exportData = () => {
    const fullData = {
      students,
      homeworks,
      dailyLogs,
      exams,
      motivations,
      meetings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kocluk-yedek-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.students) setStudents(parsed.students);
      if (parsed.homeworks) setHomeworks(parsed.homeworks);
      if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
      if (parsed.exams) setExams(parsed.exams);
      if (parsed.motivations) setMotivations(parsed.motivations);
      if (parsed.meetings) setMeetings(parsed.meetings);
      syncToServer(parsed);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
      setStudents(INITIAL_STUDENTS);
      setSelectedStudentId(INITIAL_STUDENTS[0]?.id ?? '');
      setHomeworks(INITIAL_HOMEWORKS);
      setDailyLogs(INITIAL_DAILY_LOGS);
      setExams(INITIAL_EXAMS);
      setMotivations(MOTIVATION_QUOTES);
      setMeetings(INITIAL_MEETINGS);
      localStorage.clear();
      syncToServer({
        students: INITIAL_STUDENTS,
        homeworks: INITIAL_HOMEWORKS,
        dailyLogs: INITIAL_DAILY_LOGS,
        exams: INITIAL_EXAMS,
        motivations: MOTIVATION_QUOTES,
        meetings: INITIAL_MEETINGS
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewRole,
        setViewRole,
        selectedStudentId,
        setSelectedStudentId,
        selectedStudent,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        homeworks,
        addHomework,
        updateHomework,
        toggleHomeworkStatus,
        deleteHomework,
        dailyLogs,
        addDailyLog,
        deleteDailyLog,
        exams,
        addExam,
        deleteExam,
        motivations,
        addMotivation,
        deleteMotivation,
        meetings,
        addMeeting,
        deleteMeeting,
        exportData,
        importData,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
