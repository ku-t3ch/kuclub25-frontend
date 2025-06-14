"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  
  filteredOrganizations,
  activeCategory,
  categories,
  loading,
  onCategoryChange
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get active category name
  const activeCategoryName = useMemo(() =>
    categories.find(cat => cat.id === activeCategory)?.name || "ทั้งหมด",
    [categories, activeCategory]
  );

  // Pagination logic
  const itemsPerPage = isMobile ? 8 : 12;
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  
  const displayedOrganizations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrganizations.slice(startIndex, endIndex);
  }, [filteredOrganizations, currentPage, itemsPerPage]);

  const hasResults = !loading && filteredOrganizations.length > 0;
  const isEmpty = !loading && filteredOrganizations.length === 0;

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Pagination helpers
  const getVisiblePages = () => {
    const delta = isMobile ? 1 : 2; // Show fewer pages on mobile
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    const resultsSection = document.querySelector('[data-results-section]');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants (simplified)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full overflow-hidden bg-transparent z-1">

      <div className="relative px-4 xs:px-5 sm:px-6 lg:px-8 py-2 z-1">
        <div className="max-w-7xl mx-auto">

          {/* Organizations Grid */}
          {hasResults && (
            <>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={currentPage} // Force re-animation on page change
              >
                {displayedOrganizations.map((organization) => (
                  <motion.div key={organization.id} variants={itemVariants} layout>
                    <CardOrganization organization={organization} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex flex-col items-center mt-8 sm:mt-12 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-1 mt-5  sm:space-x-2">
                    {/* Previous Button */}
                    <motion.button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={combine(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "flex items-center space-x-1",
                        currentPage === 1
                          ? getValueForTheme(
                              "text-gray-500 cursor-not-allowed",
                              "text-gray-400 cursor-not-allowed"
                            )
                          : getValueForTheme(
                              "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
                              "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
                            )
                      )}
                      whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                      whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">ก่อนหน้า</span>
                    </motion.button>

                    {/* First Page */}
                    {!getVisiblePages().includes(1) && (
                      <>
                        <motion.button
                          onClick={() => handlePageChange(1)}
                          className={combine(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            getValueForTheme(
                              "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
                              "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
                            )
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          1
                        </motion.button>
                        {!getVisiblePages().includes(2) && (
                          <span className={combine(
                            "px-2 text-sm",
                            getValueForTheme("text-gray-500", "text-gray-400")
                          )}>
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Visible Pages */}
                    {getVisiblePages().map((page) => (
                      <motion.button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={combine(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          page === currentPage
                            ? getValueForTheme(
                                "bg-[#54CF90]/75 text-white shadow-lg",
                                "bg-[#006C67] text-white shadow-lg"
                              )
                            : getValueForTheme(
                                "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
                                "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
                              )
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {page}
                      </motion.button>
                    ))}

                    {/* Last Page */}
                    {!getVisiblePages().includes(totalPages) && (
                      <>
                        {!getVisiblePages().includes(totalPages - 1) && (
                          <span className={combine(
                            "px-2 text-sm",
                            getValueForTheme("text-gray-500", "text-gray-400")
                          )}>
                            ...
                          </span>
                        )}
                        <motion.button
                          onClick={() => handlePageChange(totalPages)}
                          className={combine(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            getValueForTheme(
                              "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
                              "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
                            )
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {totalPages}
                        </motion.button>
                      </>
                    )}

                    {/* Next Button */}
                    <motion.button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={combine(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "flex items-center space-x-1",
                        currentPage === totalPages
                          ? getValueForTheme(
                              "text-gray-500 cursor-not-allowed",
                              "text-gray-400 cursor-not-allowed"
                            )
                          : getValueForTheme(
                              "text-[#54CF90] hover:text-[#54CF90]/80 hover:bg-white/10",
                              "text-[#006C67] hover:text-[#005550] hover:bg-[#006C67]/10"
                            )
                      )}
                      whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                      whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                    >
                      <span className="hidden sm:inline">ถัดไป</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={combine(
                  "animate-pulse rounded-2xl h-64 sm:h-80",
                  getValueForTheme("bg-gray-700/30", "bg-gray-200/80")
                )}>
                  <div className={combine(
                    "h-32 sm:h-48 rounded-t-2xl mb-3 sm:mb-4",
                    getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                  )} />
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className={combine(
                      "h-3 sm:h-4 rounded w-3/4",
                      getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                    )} />
                    <div className={combine(
                      "h-2 sm:h-3 rounded w-1/2",
                      getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                    )} />
                    <div className={combine(
                      "h-6 sm:h-8 rounded-lg w-full mt-3 sm:mt-4",
                      getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                    )} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {isEmpty && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={combine(
                "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
                getValueForTheme("bg-gray-700/30", "bg-gray-100")
              )}>
                <svg className={combine("w-12 h-12", getValueForTheme("text-gray-400", "text-gray-400"))}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className={combine(
                "text-lg sm:text-xl font-semibold mb-2",
                getValueForTheme("text-white", "text-gray-900")
              )}>
                ไม่พบชมรมในหมวดหมู่นี้
              </h3>
              <p className={combine(
                "text-xs sm:text-sm max-w-md mx-auto mb-4 sm:mb-6",
                getValueForTheme("text-gray-300", "text-gray-600")
              )}>
                ลองเลือกหมวดหมู่อื่น หรือดูชมรมทั้งหมดเพื่อค้นพบชมรมที่น่าสนใจ
              </p>
              <motion.button
                onClick={() => onCategoryChange(undefined)}
                className={combine(
                  "px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200",
                  getValueForTheme("bg-[#54CF90] hover:bg-[#54CF90]/80 text-white", "bg-[#006C67] hover:bg-[#005550] text-white")
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ดูชมรมทั้งหมด
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

    </section>
  );
};

export default memo(OrganizationSection, (prevProps, nextProps) => {
  // เปรียบเทียบ array reference แทน length
  const isSameArray = prevProps.filteredOrganizations === nextProps.filteredOrganizations;
  const isSameCategory = prevProps.activeCategory === nextProps.activeCategory;
  const isSameLoading = prevProps.loading === nextProps.loading;
  
  // ถ้า array reference เหมือนกัน และ category + loading เหมือนกัน = ไม่ต้อง re-render
  return isSameArray && isSameCategory && isSameLoading;
});