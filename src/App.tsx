import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentsView } from './components/students/StudentsView';
import { StudentModal } from './components/students/StudentModal';
import { MeetingModal } from './components/students/MeetingModal';
import { HomeworkView } from './components/homework/HomeworkView';
import { HomeworkModal } from './components/homework/HomeworkModal';
import { TrackerView } from './components/tracker/TrackerView';
import { DailyLogModal } from './components/tracker/DailyLogModal';
import { ExamsView } from './components/exams/ExamsView';
import { ExamModal } from './components/exams/ExamModal';
import { MotivationView } from './components/motivation/MotivationView';
import { MotivationModal } from './components/motivation/MotivationModal';
import { ReportView } from './components/report/ReportView';
import { StudentPortal } from './components/student-portal/StudentPortal';
import { AuthScreen } from './components/auth/AuthScreen';
import { Student } from './types';

const AppContent: React.FC = () => {
  const {
    activeTab,
    viewRole,
    selectedStudent,
    isAuthenticated,
    setIsAuthenticated,
    addStudent,
    updateStudent,
    addHomework,
    addDailyLog,
    addExam,
    addMotivation,
    addMeeting
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal States
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingStudent, setMeetingStudent] = useState<Student | null>(null);

  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [dailyLogModalOpen, setDailyLogModalOpen] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [motivationModalOpen, setMotivationModalOpen] = useState(false);

  // Modal Handlers
  const handleOpenStudentModal = (student?: Student) => {
    setEditingStudent(student || null);
    setStudentModalOpen(true);
  };

  const handleOpenMeetingModal = (student: Student) => {
    setMeetingStudent(student);
    setMeetingModalOpen(true);
  };

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex-1 flex">
        {/* Left Sidebar (Only in Coach mode or desktop) */}
        {viewRole === 'coach' && (
          <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${
            viewRole === 'coach' ? 'lg:pl-80' : ''
          }`}
        >
          {viewRole === 'student' ? (
            <StudentPortal onOpenDailyLogModal={() => setDailyLogModalOpen(true)} />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  onOpenHomeworkModal={() => setHomeworkModalOpen(true)}
                  onOpenDailyLogModal={() => setDailyLogModalOpen(true)}
                  onOpenExamModal={() => setExamModalOpen(true)}
                  onOpenStudentModal={() => handleOpenStudentModal()}
                  onOpenMotivationModal={() => setMotivationModalOpen(true)}
                />
              )}

              {activeTab === 'students' && (
                <StudentsView
                  onOpenStudentModal={handleOpenStudentModal}
                  onOpenMeetingModal={handleOpenMeetingModal}
                />
              )}

              {activeTab === 'homework' && (
                <HomeworkView onOpenHomeworkModal={() => setHomeworkModalOpen(true)} />
              )}

              {activeTab === 'tracker' && (
                <TrackerView onOpenDailyLogModal={() => setDailyLogModalOpen(true)} />
              )}

              {activeTab === 'exams' && (
                <ExamsView onOpenExamModal={() => setExamModalOpen(true)} />
              )}

              {activeTab === 'motivation' && (
                <MotivationView onOpenMotivationModal={() => setMotivationModalOpen(true)} />
              )}

              {activeTab === 'report' && <ReportView />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSave={(data) => {
          if (editingStudent) {
            updateStudent(editingStudent.id, data);
          } else {
            addStudent(data);
          }
        }}
        editingStudent={editingStudent}
      />

      <MeetingModal
        isOpen={meetingModalOpen}
        onClose={() => setMeetingModalOpen(false)}
        onSave={addMeeting}
        studentId={meetingStudent?.id || selectedStudent?.id || ''}
        studentName={meetingStudent?.name || selectedStudent?.name || ''}
      />

      <HomeworkModal
        isOpen={homeworkModalOpen}
        onClose={() => setHomeworkModalOpen(false)}
        onSave={addHomework}
        studentId={selectedStudent?.id || ''}
        studentName={selectedStudent?.name || ''}
      />

      <DailyLogModal
        isOpen={dailyLogModalOpen}
        onClose={() => setDailyLogModalOpen(false)}
        onSave={addDailyLog}
        studentId={selectedStudent?.id || ''}
        studentName={selectedStudent?.name || ''}
      />

      <ExamModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        onSave={addExam}
        studentId={selectedStudent?.id || ''}
        studentName={selectedStudent?.name || ''}
        defaultExamType={selectedStudent?.examType.includes('YKS') ? 'TYT' : 'LGS'}
      />

      <MotivationModal
        isOpen={motivationModalOpen}
        onClose={() => setMotivationModalOpen(false)}
        onSave={addMotivation}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
