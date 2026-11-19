import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { Toast } from './components/common/Toast';
import { ModuleDetailModal } from './components/modals/ModuleDetailModal';
import { CourseModal } from './components/courses/CourseModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { ProductionSyncModal } from './components/modals/ProductionSyncModal';

// Views
import { MainDashboard } from './components/dashboard/MainDashboard';
import { CalendarTimeline } from './components/calendar/CalendarTimeline';
import { CourseManagement } from './components/courses/CourseManagement';
import { CourseDetailView } from './components/courses/CourseDetailView';
import { StudentManagement } from './components/students/StudentManagement';
import { ExamManagement } from './components/exams/ExamManagement';
import { LearningTrackView } from './components/learning/LearningTrackView';
import { SystemSettingsView } from './components/system/SystemSettingsView';

const MainContent: React.FC = () => {
  const { activeSection } = useApp();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainDashboard />;

      case 'students':
        return <StudentManagement />;

      case 'courses':
        return <CourseManagement />;

      case 'course-detail':
        return <CourseDetailView />;

      case 'course-progress':
        return <CalendarTimeline />;

      case 'learning-modules':
        return <LearningTrackView trackType="modules" />;

      case 'question-bank':
        return <LearningTrackView trackType="questions" />;

      case 'practice-problems':
        return <LearningTrackView trackType="problems" />;

      case 'assignments':
        return <LearningTrackView trackType="assignments" />;

      case 'python-track':
        return <LearningTrackView trackType="Python" />;

      case 'sql-databases':
        return <LearningTrackView trackType="SQL" />;

      case 'web-development':
        return <LearningTrackView trackType="Web" />;

      case 'ai-data-science':
        return <LearningTrackView trackType="AI" />;

      case 'exam-dashboard':
      case 'scheduled-exams':
      case 'proctoring':
      case 'exam-results':
      case 'certificates':
        return <ExamManagement />;

      case 'student-analytics':
      case 'learning-analytics':
      case 'growth-analytics':
      case 'financial-management':
        return <MainDashboard />;

      case 'notifications':
      case 'user-management':
      case 'roles-permissions':
      case 'settings':
        return <SystemSettingsView />;

      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F5F7FA]">
      {/* Top Navigation Bar */}
      <TopHeader />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <ModuleDetailModal />
      <CourseModal />
      <StudentProfileModal />
      <ProductionSyncModal />
      <GlobalSearchModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-900 font-sans antialiased text-slate-800">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}

export const CodeLekhoApp = App;
