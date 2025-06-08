"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import CardOrganization from "../ui/cardOrganization";
import { Organization } from "../../types/organization";
import { Vortex } from "@/components/ui/vortex";

interface OrganizationSectionProps {
  organizations: Organization[];
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
  const [showAll, setShowAll] = useState(false);
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

  // Display logic with different limits for mobile/desktop
  const { displayedOrganizations, hasMore, limit } = useMemo(() => {
    const limit = isMobile ? 8 : 12;
    if (showAll) {
      return {
        displayedOrganizations: filteredOrganizations,
        hasMore: false,
        limit
      };
    }
    return {
      displayedOrganizations: filteredOrganizations.slice(0, limit),
      hasMore: filteredOrganizations.length > limit,
      limit
    };
  }, [filteredOrganizations, showAll, isMobile]);

  const hasResults = !loading && filteredOrganizations.length > 0;
  const isEmpty = !loading && filteredOrganizations.length === 0;

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

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
    <section className="relative w-full overflow-hidden bg-transparent">

      <div className="relative px-4 xs:px-5 sm:px-6 lg:px-8 py-2 z-10">
        <div className="max-w-7xl mx-auto">

          {/* Results Header */}
          {hasResults && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={combine(
                    "text-2xl md:text-3xl font-bold mb-2",
                    getValueForTheme("text-white", "text-gray-900")
                  )}>
                    {activeCategory === undefined ? "ชมรมทั้งหมด" : activeCategoryName}
                  </h2>
                  <p className={combine(
                    "text-sm md:text-base",
                    getValueForTheme("text-gray-300", "text-gray-600")
                  )}>
                    พบ <span className={combine(
                      "font-semibold",
                      getValueForTheme("text-blue-300", "text-[#006C67]")
                    )}>
                      {filteredOrganizations.length}
                    </span> ชมรม
                    {activeCategory !== undefined && (
                      <> ในหมวดหมู่ <span className="font-medium">{activeCategoryName}</span></>
                    )}
                  </p>
                </div>

                {/* Grid view button */}
                <button
                  className={combine(
                    "hidden sm:block p-2 rounded-lg transition-colors duration-200",
                    getValueForTheme(
                      "bg-white/10 hover:bg-white/20 text-white",
                      "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    )
                  )}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* Organizations Grid */}
          {hasResults && (
            <>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {displayedOrganizations.map((organization) => (
                  <motion.div key={organization.id} variants={itemVariants} layout>
                    <CardOrganization organization={organization} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Show More Button */}
              {hasMore && (
                <motion.div
                  className="text-center mt-6 sm:mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => setShowAll(true)}
                    className={combine(
                      "px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-200",
                      "border-2 border-dashed",
                      getValueForTheme(
                        "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200",
                        "border-[#006C67]/30 bg-[#006C67]/10 hover:bg-[#006C67]/20 text-[#006C67] hover:text-[#005550]"
                      )
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ดูชมรมทั้งหมด ({filteredOrganizations.length - limit} เพิ่มเติม)
                  </motion.button>
                </motion.div>
              )}
            </>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                  getValueForTheme("bg-blue-600 hover:bg-blue-700 text-white", "bg-[#006C67] hover:bg-[#005550] text-white")
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
  return (
    prevProps.filteredOrganizations.length === nextProps.filteredOrganizations.length &&
    prevProps.activeCategory === nextProps.activeCategory &&
    prevProps.loading === nextProps.loading
  );
});