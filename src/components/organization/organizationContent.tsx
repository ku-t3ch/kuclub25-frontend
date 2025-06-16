"use client";

import React from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';
import OrganizationGrid from './organizationGrid';
import LoadingSkeleton from '../ui/loading/loadingOrganization';

interface OrganizationContentProps {
  loading: boolean;
  organizations: any[];
  paginatedOrganizations: any[];
  hasMoreItems: boolean;
  canShowLess: boolean;
  stats: {
    total: number;
    displayed: number;
    category: string | null;
    campus: string | null;
  };
  gridClasses: string;
  onLoadMore: () => void;
  onShowLess: () => void;
  onClearFilters: () => void;
}

const OrganizationContent: React.FC<OrganizationContentProps> = ({
  loading,
  organizations,
  paginatedOrganizations,
  hasMoreItems,
  canShowLess,
  stats,
  gridClasses,
  onLoadMore,
  onShowLess,
  onClearFilters
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeClasses = {
    primaryButton: combine(
      "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base",
      getValueForTheme(
        "bg-gradient-to-r from-[#54CF90] via-[#54CF90] to-[#54CF90]/90 hover:from-[#4AB87E] hover:via-[#4AB87E] hover:to-[#4AB87E]/90 text-white shadow-[#54CF90]/25",
        "bg-[#006C67] hover:bg-[#005550] text-white shadow-[#006C67]/25"
      )
    ),
    secondaryButton: combine(
      "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 border text-sm sm:text-base",
      getValueForTheme(
        "bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/30",
        "bg-white hover:bg-gray-50 text-[#006C67] border-gray-300 hover:border-[#006C67]/50"
      )
    ),
    emptyStateContainer: "text-center py-8 sm:py-12 lg:py-16 px-4",
    emptyStateIcon: combine(
      "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center",
      getValueForTheme("bg-white/10", "bg-[#006C67]/10")
    ),
    emptyStateTitle: combine(
      "text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    emptyStateText: combine(
      "text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-md lg:max-w-lg mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    ),
    paginationContainer: "mt-6 sm:mt-8 lg:mt-10 flex flex-col gap-3 sm:gap-4 items-center",
    buttonGroup: "inline-flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto max-w-sm xs:max-w-none",
    statsText: combine(
      "text-xs sm:text-sm lg:text-base text-center",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    )
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton 
          viewMode="grid" 
          themeClasses={{}} 
        />
      </div>
    );
  }

  // Empty State - ปรับปรุงให้ดูดีขึ้น
  if (organizations.length === 0) {
    const hasActiveFilters = stats.category || stats.campus;
    
    return (
      <div className={themeClasses.emptyStateContainer}>
        <div className={themeClasses.emptyStateIcon}>
          <svg
            className={combine(
              "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
              getValueForTheme("text-white/60", "text-[#006C67]/60")
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <h3 className={themeClasses.emptyStateTitle}>
          {hasActiveFilters ? 'ไม่พบชมรมที่ตรงกับเงื่อนไข' : 'ยังไม่มีชมรมในระบบ'}
        </h3>
        
        <p className={themeClasses.emptyStateText}>
          {hasActiveFilters 
            ? 'ลองปรับเปลี่ยนคำค้นหา ประเภทองค์กร หรือวิทยาเขต หรือล้างตัวกรองทั้งหมด'
            : 'ขณะนี้ยังไม่มีชมรมที่ลงทะเบียนในระบบ กรุณาลองใหม่อีกครั้งในภายหลัง'
          }
        </p>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={combine(
              themeClasses.primaryButton,
              "w-full xs:w-auto hover:scale-105 transform"
            )}
          >
            <span>ล้างตัวกรองทั้งหมด</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="organizations-grid" className="space-y-6">
      {/* Organization Grid */}
      <OrganizationGrid
        organizations={paginatedOrganizations}
        viewMode="grid"
        gridClasses={gridClasses}
        animationVariants={{
          container: { 
            hidden: { opacity: 0 }, 
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            } 
          },
          item: { 
            hidden: { opacity: 0, y: 20, scale: 0.95 }, 
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            } 
          }
        }}
      />
      
      {/* Enhanced Pagination Controls */}
      {(hasMoreItems || canShowLess) && (
        <div className={themeClasses.paginationContainer}>
          <div className={themeClasses.buttonGroup}>
            {hasMoreItems && (
              <button
                onClick={onLoadMore}
                className={combine(
                  themeClasses.primaryButton,
                  "flex items-center gap-2 min-w-[140px] justify-center w-full xs:w-auto",
                  "hover:scale-105 transform active:scale-95"
                )}
                aria-label="แสดงชมรมเพิ่มเติม"
              >
                <span>แสดงเพิ่มเติม</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {canShowLess && (
              <button
                onClick={onShowLess}
                className={combine(
                  themeClasses.secondaryButton,
                  "flex items-center gap-2 min-w-[140px] justify-center w-full xs:w-auto",
                  "hover:scale-105 transform active:scale-95"
                )}
                aria-label="แสดงชมรมน้อยลง"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>แสดงน้อยลง</span>
              </button>
            )}
          </div>
          
          {/* Enhanced Results Counter */}
          <div className="space-y-1">
            <div className={themeClasses.statsText}>
              แสดง <span className="font-semibold">{stats.displayed}</span> จาก <span className="font-semibold">{stats.total}</span> ชมรม
            </div>
            
            {/* Active Filters Indicator */}
            {(stats.category || stats.campus) && (
              <div className={combine(
                "text-xs sm:text-sm flex flex-wrap items-center justify-center gap-2",
                getValueForTheme("text-white/60", "text-[#006C67]/60")
              )}>
                <span>กรองโดย:</span>
                {stats.category && (
                  <span className={combine(
                    "px-2 py-1 rounded-full text-xs",
                    getValueForTheme("bg-white/10 text-white/80", "bg-[#006C67]/10 text-[#006C67]")
                  )}>
                    {stats.category}
                  </span>
                )}
                {stats.campus && (
                  <span className={combine(
                    "px-2 py-1 rounded-full text-xs",
                    getValueForTheme("bg-white/10 text-white/80", "bg-[#006C67]/10 text-[#006C67]")
                  )}>
                    {stats.campus}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OrganizationContent);