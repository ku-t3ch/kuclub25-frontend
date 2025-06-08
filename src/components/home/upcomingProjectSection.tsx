import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Project } from '../../types/project';
import ProjectCard from '../ui/cardProject';

interface UpcomingProjectSectionProps {
  projects: Project[];
  loading?: boolean;
  title?: string;
  maxProjects?: number;
  onProjectClick?: (project: Project) => void;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
}

const UpcomingProjectSection: React.FC<UpcomingProjectSectionProps> = ({
  projects,
  loading = false,
  title = "โครงการที่กำลังจะเกิดขึ้น",
  maxProjects = 6,
  onProjectClick,
  showViewAllButton = true,
  onViewAll
}) => {
  const { resolvedTheme } = useTheme();

  const getValueForTheme = (darkValue: string, lightValue: string) => {
    return resolvedTheme === 'dark' ? darkValue : lightValue;
  };

  // Filter and sort upcoming projects
  const upcomingProjects = useMemo(() => {
    const now = new Date();
    
    return projects
      .filter(project => {
        const startDate = project.date_start_the_project || project.date_start;
        if (!startDate) return false;
        
        const start = new Date(startDate);
        return start >= now; // Only future projects
      })
      .sort((a, b) => {
        const dateA = a.date_start_the_project || a.date_start;
        const dateB = b.date_start_the_project || b.date_start;
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      })
      .slice(0, maxProjects);
  }, [projects, maxProjects]);

  if (loading) {
    return (
      <div className="w-full px-4 xs:px-5 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className={`text-lg md:text-3xl font-bold ${getValueForTheme('text-white', 'text-gray-900')}`}>
              {title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(Math.min(maxProjects, 6))].map((_, index) => (
              <div
                key={index}
                className={`
                  animate-pulse rounded-lg p-3 sm:p-4 border
                  ${getValueForTheme('bg-slate-800 border-slate-700', 'bg-gray-200 border-gray-300')}
                `}
              >
                <div className={`h-5 sm:h-6 w-16 sm:w-20 rounded-full mb-2 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-5 sm:h-6 rounded mb-3 sm:mb-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-3 sm:h-4 rounded mb-2 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-3 sm:h-4 rounded mb-3 sm:mb-4 w-2/3 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <div className={`h-3 sm:h-4 w-3 sm:w-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                  <div className={`h-3 sm:h-4 rounded flex-1 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                </div>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <div className={`h-3 sm:h-4 w-3 sm:w-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                  <div className={`h-3 sm:h-4 rounded flex-1 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                </div>
                <div className="flex gap-2">
                  <div className={`h-5 sm:h-6 w-12 sm:w-16 rounded-full ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                  <div className={`h-5 sm:h-6 w-16 sm:w-20 rounded-full ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 xs:px-5 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2 className={`text-lg md:text-3xl font-bold ${getValueForTheme('text-white', 'text-gray-900')} leading-tight`}>
            {title}
          </h2>
        </div>
        
        {upcomingProjects.length === 0 ? (
          <div className={`text-center py-8 sm:py-12 px-4 ${getValueForTheme('text-gray-400', 'text-gray-500')}`}>
            <svg 
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2 leading-tight">
              ไม่มีโครงการที่กำลังจะเกิดขึ้น
            </p>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
              โครงการทั้งหมดได้สิ้นสุดลงแล้วหรือไม่มีข้อมูลวันที่
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcomingProjects.map((project) => (
              <div
                key={project.id}
                className="transform transition-transform duration-200 active:scale-[0.98] sm:hover:scale-[1.02]"
              >
                <ProjectCard
                  project={project}
                  onClick={onProjectClick}
                  showCountdown={true} // Enable countdown for upcoming projects
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingProjectSection;