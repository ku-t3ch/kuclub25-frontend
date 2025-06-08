import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Project } from '../../types/project';
import ProjectCard from '../ui/cardProject';

interface UpcomingProjectSectionProps {
  projects: Project[];
  loading?: boolean;
  title?: string;
  description?: string; // Add description prop
  maxProjects?: number;
  onProjectClick?: (project: Project) => void;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
}

const UpcomingProjectSection: React.FC<UpcomingProjectSectionProps> = ({
  projects,
  loading = false,
  title = "โครงการที่กำลังจะเกิดขึ้น",
  description, // Add description parameter
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${getValueForTheme('text-white', 'text-gray-900')}`}>
            {title}
          </h2>
          {showViewAllButton && (
            <div className={`h-8 w-24 rounded ${getValueForTheme('bg-slate-700', 'bg-gray-300')} animate-pulse`} />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(Math.min(maxProjects, 6))].map((_, index) => (
            <div
              key={index}
              className={`
                animate-pulse rounded-lg p-4 border
                ${getValueForTheme('bg-slate-800 border-slate-700', 'bg-gray-200 border-gray-300')}
              `}
            >
              <div className={`h-6 w-20 rounded-full mb-2 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              <div className={`h-6 rounded mb-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              <div className={`h-4 rounded mb-2 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              <div className={`h-4 rounded mb-4 w-2/3 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              <div className="flex gap-2 mb-3">
                <div className={`h-4 w-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-4 rounded flex-1 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              </div>
              <div className="flex gap-2 mb-3">
                <div className={`h-4 w-4 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-4 rounded flex-1 ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              </div>
              <div className="flex gap-2">
                <div className={`h-6 w-16 rounded-full ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
                <div className={`h-6 w-20 rounded-full ${getValueForTheme('bg-slate-700', 'bg-gray-300')}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${getValueForTheme('text-white', 'text-gray-900')}`}>
            {title}
          </h2>
          {description && (
            <p className={`text-sm mt-2 ${getValueForTheme('text-gray-300', 'text-gray-600')}`}>
              {description}
            </p>
          )}
        </div>
        
        {showViewAllButton && upcomingProjects.length > 0 && (
          <button
            onClick={onViewAll}
            className={`
              text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200
              ${getValueForTheme(
                'text-blue-400 hover:text-blue-300 hover:bg-slate-700',
                'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              )}
            `}
          >
            ดูทั้งหมด
          </button>
        )}
      </div>
      
      {upcomingProjects.length === 0 ? (
        <div className={`text-center py-12 ${getValueForTheme('text-gray-400', 'text-gray-500')}`}>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">ไม่มีโครงการที่กำลังจะเกิดขึ้น</p>
          <p className="text-sm">โครงการทั้งหมดได้สิ้นสุดลงแล้วหรือไม่มีข้อมูลวันที่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onProjectClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingProjectSection;