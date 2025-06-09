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
        "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25",
        "bg-[#006C67] hover:bg-[#005550] text-white shadow-[#006C67]/25"
      )
    ),
    secondaryButton: combine(
      "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 border text-sm sm:text-base",
      getValueForTheme(
        "bg-white/5 hover:bg-white/10 text-white border-white/20",
        "bg-white hover:bg-gray-50 text-[#006C67] border-gray-300"
      )
    ),
    emptyStateContainer: "text-center py-8 sm:py-12 px-4",
    emptyStateIcon: combine(
      "w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center",
      getValueForTheme("bg-white/10", "bg-[#006C67]/10")
    ),
    emptyStateTitle: combine(
      "text-lg sm:text-xl font-semibold mb-2",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    emptyStateText: combine(
      "text-sm sm:text-base max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 leading-relaxed",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    )
  };

  // Loading State
  if (loading) {
    return (
      <LoadingSkeleton 
        viewMode="grid" 
        themeClasses={{}} 
      />
    );
  }

  // Empty State
  if (organizations.length === 0) {
    return (
      <div className={themeClasses.emptyStateContainer}>
        <div className={themeClasses.emptyStateIcon}>
          <svg
            className="w-8 h-8 sm:w-12 sm:h-12 opacity-70"
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
          ไม่พบชมรมที่ตรงกับเงื่อนไข
        </h3>
        <p className={themeClasses.emptyStateText}>
          ลองปรับเปลี่ยนคำค้นหา ประเภทองค์กร หรือวิทยาเขต หรือล้างตัวกรองทั้งหมด
        </p>
        <button
          onClick={onClearFilters}
          className={combine(
            themeClasses.primaryButton,
            "w-full xs:w-auto"
          )}
        >
          ล้างตัวกรองทั้งหมด
        </button>
      </div>
    );
  }


  return (
    <div id="organizations-grid">
      <OrganizationGrid
        organizations={paginatedOrganizations}
        viewMode="grid"
        gridClasses={gridClasses}
        animationVariants={{
          container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
          item: { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }
        }}
      />
      
      {/* Mobile-Optimized Pagination Controls */}
      {(hasMoreItems || canShowLess) && (
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 items-center">
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full xs:w-auto">
            {hasMoreItems && (
              <button
                onClick={onLoadMore}
                className={combine(
                  themeClasses.primaryButton,
                  "flex items-center gap-2 min-w-[140px] justify-center w-full xs:w-auto"
                )}
              >
                <span>แสดงเพิ่มเติม</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {canShowLess && (
              <button
                onClick={onShowLess}
                className={combine(
                  themeClasses.secondaryButton,
                  "flex items-center gap-2 min-w-[140px] justify-center w-full xs:w-auto"
                )}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>แสดงน้อยลง</span>
              </button>
            )}
          </div>
          
          {/* Results Counter */}
          <div className="text-center">
            <span className={combine(
              "text-xs sm:text-sm",
              getValueForTheme("text-white/70", "text-[#006C67]/70")
            )}>
              แสดง {stats.displayed} จาก {stats.total} ชมรม
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OrganizationContent);