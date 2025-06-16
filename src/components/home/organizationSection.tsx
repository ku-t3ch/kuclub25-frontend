"use client";

import React, {
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import CardOrganization from "../ui/cardOrganization";
import { Organization } from "../../types/organization";

interface OrganizationSectionProps {
  filteredOrganizations: Organization[];
  activeCategory: string | undefined;
  categories: Array<{ id: string | undefined; name: string }>;
  loading: boolean;
  onCategoryChange: (categoryId: string | undefined) => void;
}

const ITEMS_PER_PAGE = {
  mobile: 8,
  desktop: 16,
} as const;

const PAGINATION_DELTA = {
  mobile: 1,
  desktop: 2,
} as const;

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  },
  pagination: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  },
  emptyState: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
} as const;

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return { isMobile, isClient };
};

// Memoized Loading Skeleton Component
const LoadingSkeleton = memo<{
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
  count?: number;
}>(({ getValueForTheme, combine, count = 8 }) => {
  const skeletonItems = useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-6">
      {skeletonItems.map((i) => (
        <div
          key={i}
          className={combine(
            "animate-pulse rounded-2xl h-64 sm:h-80 overflow-hidden",
            getValueForTheme("bg-gray-700/30", "bg-gray-200/80")
          )}
        >
          <div
            className={combine(
              "h-32 sm:h-48 rounded-t-2xl mb-3 sm:mb-4",
              getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
            )}
          />
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div
              className={combine(
                "h-3 sm:h-4 rounded w-3/4",
                getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
              )}
            />
            <div
              className={combine(
                "h-2 sm:h-3 rounded w-1/2",
                getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
              )}
            />
            <div
              className={combine(
                "h-6 sm:h-8 rounded-lg w-full mt-3 sm:mt-4",
                getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
LoadingSkeleton.displayName = "LoadingSkeleton";

// Memoized Empty State Component
const EmptyState = memo<{
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
  onShowAll: () => void;
}>(({ getValueForTheme, combine, onShowAll }) => {
  return (
    <motion.div
      className="text-center py-16"
      variants={ANIMATION_VARIANTS.emptyState}
      initial="hidden"
      animate="visible"
    >
      <div
        className={combine(
          "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
          getValueForTheme("bg-gray-700/30", "bg-gray-100")
        )}
      >
        <svg
          className={combine(
            "w-12 h-12",
            getValueForTheme("text-gray-400", "text-gray-400")
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3
        className={combine(
          "text-lg sm:text-xl font-semibold mb-2",
          getValueForTheme("text-white", "text-gray-900")
        )}
      >
        ไม่พบชมรมในหมวดหมู่นี้
      </h3>
      <p
        className={combine(
          "text-xs sm:text-sm max-w-md mx-auto mb-4 sm:mb-6",
          getValueForTheme("text-gray-300", "text-gray-600")
        )}
      >
        ลองเลือกหมวดหมู่อื่น หรือดูชมรมทั้งหมดเพื่อค้นพบชมรมที่น่าสนใจ
      </p>
      <motion.button
        onClick={onShowAll}
        className={combine(
          "px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200",
          getValueForTheme(
            "bg-[#54CF90] hover:bg-[#54CF90]/80 text-white",
            "bg-[#006C67] hover:bg-[#005550] text-white"
          )
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
      >
        ดูชมรมทั้งหมด
      </motion.button>
    </motion.div>
  );
});
EmptyState.displayName = "EmptyState";

// Memoized Pagination Button Component
const PaginationButton = memo<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  className: string;
}>(({ children, onClick, disabled = false, active = false, className }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      type="button"
    >
      {children}
    </motion.button>
  );
});
PaginationButton.displayName = "PaginationButton";

const OrganizationSection = memo<OrganizationSectionProps>(
  ({
    filteredOrganizations,
    activeCategory,
    categories,
    loading,
    onCategoryChange,
  }) => {
    const { combine, getValueForTheme } = useThemeUtils();
    const { isMobile, isClient } = useResponsive();
    const [currentPage, setCurrentPage] = useState(1);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Memoized calculations
    const itemsPerPage = useMemo(
      () => (isMobile ? ITEMS_PER_PAGE.mobile : ITEMS_PER_PAGE.desktop),
      [isMobile]
    );

    const totalPages = useMemo(
      () => Math.ceil(filteredOrganizations.length / itemsPerPage),
      [filteredOrganizations.length, itemsPerPage]
    );

    const displayedOrganizations = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredOrganizations.slice(startIndex, endIndex);
    }, [filteredOrganizations, currentPage, itemsPerPage]);

    const activeCategoryName = useMemo(
      () =>
        categories.find((cat) => cat.id === activeCategory)?.name || "ทั้งหมด",
      [categories, activeCategory]
    );

    // Status flags
    const hasResults = !loading && filteredOrganizations.length > 0;
    const isEmpty = !loading && filteredOrganizations.length === 0;

    // Reset to first page when category changes
    useEffect(() => {
      setCurrentPage(1);
    }, [activeCategory]);

    // Pagination helpers
    const getVisiblePages = useCallback(() => {
      const delta = isMobile
        ? PAGINATION_DELTA.mobile
        : PAGINATION_DELTA.desktop;
      const start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, currentPage + delta);

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }, [currentPage, totalPages, isMobile]);

    const handlePageChange = useCallback(
      (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        setCurrentPage(page);

        // Smooth scroll to results
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
      [totalPages, currentPage]
    );

    const handleShowAll = useCallback(() => {
      onCategoryChange(undefined);
    }, [onCategoryChange]);

    // Memoized theme classes
    const themeClasses = useMemo(
      () => ({
        paginationButton: {
          base: "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          active: getValueForTheme(
            "bg-[#54CF90]/75 text-white shadow-lg",
            "bg-[#006C67] text-white shadow-lg"
          ),
          inactive: getValueForTheme(
            "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
            "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
          ),
          disabled: getValueForTheme(
            "text-gray-500 cursor-not-allowed",
            "text-gray-400 cursor-not-allowed"
          ),
        },
        ellipsis: combine(
          "px-2 text-sm",
          getValueForTheme("text-gray-500", "text-gray-400")
        ),
      }),
      [getValueForTheme, combine]
    );

    const visiblePages = getVisiblePages();
    const showFirstPage = !visiblePages.includes(1);
    const showLastPage = !visiblePages.includes(totalPages);
    const showFirstEllipsis = showFirstPage && !visiblePages.includes(2);
    const showLastEllipsis =
      showLastPage && !visiblePages.includes(totalPages - 1);

    // Don't render anything until client-side hydration
    if (!isClient) {
      return (
        <section className="relative w-full overflow-hidden bg-transparent z-1">
          <div className="relative px-4 xs:px-5 sm:px-6 lg:px-8 py-2 z-1">
            <div className="max-w-7xl mx-auto">
              <LoadingSkeleton
                getValueForTheme={getValueForTheme}
                combine={combine}
                count={8}
              />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="relative w-full overflow-hidden bg-transparent z-1">
        <div className="relative px-4 xs:px-5 sm:px-6 lg:px-8 py-2 z-1">
          <div
            className="max-w-7xl mx-auto"
            ref={resultsRef}
            data-results-section
          >
            {/* Loading State */}
            {loading && (
              <LoadingSkeleton
                getValueForTheme={getValueForTheme}
                combine={combine}
                count={itemsPerPage}
              />
            )}

            {/* Organizations Grid */}
            {hasResults && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-6"
                  variants={ANIMATION_VARIANTS.container}
                  initial="hidden"
                  animate="visible"
                >
                  {displayedOrganizations.map((organization) => (
                    <motion.div
                      key={organization.id}
                      variants={ANIMATION_VARIANTS.item}
                      layout
                    >
                      <CardOrganization organization={organization} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex flex-col items-center mt-8 sm:mt-12 space-y-4"
                    variants={ANIMATION_VARIANTS.pagination}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Previous Button */}
                      <PaginationButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={combine(
                          themeClasses.paginationButton.base,
                          "flex items-center space-x-1",
                          currentPage === 1
                            ? themeClasses.paginationButton.disabled
                            : themeClasses.paginationButton.inactive
                        )}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span className="hidden sm:inline">ก่อนหน้า</span>
                      </PaginationButton>

                      {/* First Page */}
                      {showFirstPage && (
                        <>
                          <PaginationButton
                            onClick={() => handlePageChange(1)}
                            className={combine(
                              themeClasses.paginationButton.base,
                              themeClasses.paginationButton.inactive
                            )}
                          >
                            1
                          </PaginationButton>
                          {showFirstEllipsis && (
                            <span className={themeClasses.ellipsis}>...</span>
                          )}
                        </>
                      )}

                      {/* Visible Pages */}
                      {visiblePages.map((page) => (
                        <PaginationButton
                          key={page}
                          onClick={() => handlePageChange(page)}
                          active={page === currentPage}
                          className={combine(
                            themeClasses.paginationButton.base,
                            page === currentPage
                              ? themeClasses.paginationButton.active
                              : themeClasses.paginationButton.inactive
                          )}
                        >
                          {page}
                        </PaginationButton>
                      ))}

                      {/* Last Page */}
                      {showLastPage && (
                        <>
                          {showLastEllipsis && (
                            <span className={themeClasses.ellipsis}>...</span>
                          )}
                          <PaginationButton
                            onClick={() => handlePageChange(totalPages)}
                            className={combine(
                              themeClasses.paginationButton.base,
                              themeClasses.paginationButton.inactive
                            )}
                          >
                            {totalPages}
                          </PaginationButton>
                        </>
                      )}

                      {/* Next Button */}
                      <PaginationButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={combine(
                          themeClasses.paginationButton.base,
                          "flex items-center space-x-1",
                          currentPage === totalPages
                            ? themeClasses.paginationButton.disabled
                            : themeClasses.paginationButton.inactive
                        )}
                      >
                        <span className="hidden sm:inline">ถัดไป</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </PaginationButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Empty State */}
            {isEmpty && (
              <EmptyState
                getValueForTheme={getValueForTheme}
                combine={combine}
                onShowAll={handleShowAll}
              />
            )}
          </div>
        </div>
      </section>
    );
  }
);

OrganizationSection.displayName = "OrganizationSection";

// Optimized memo comparison
export default memo(OrganizationSection, (prevProps, nextProps) => {
  return (
    prevProps.filteredOrganizations === nextProps.filteredOrganizations &&
    prevProps.activeCategory === nextProps.activeCategory &&
    prevProps.loading === nextProps.loading &&
    prevProps.categories === nextProps.categories
  );
});
