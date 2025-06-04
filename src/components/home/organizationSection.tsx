"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import CardOrganization from "../ui/cardOrganization";
import { Organization } from "../../types/organization";

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

  // Get active category name
  const activeCategoryName = useMemo(() => 
    categories.find(cat => cat.id === activeCategory)?.name || "ทั้งหมด",
    [categories, activeCategory]
  );

  const hasResults = !loading && filteredOrganizations.length > 0;
  const isEmpty = !loading && filteredOrganizations.length === 0;

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
    <section className="relative px-4 xs:px-5 sm:px-6 lg:px-8 py-8">
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

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className={getValueForTheme("text-gray-400", "text-gray-500")}>
                กำลังแสดง:
              </span>
              <span className={combine(
                "px-2 py-1 rounded-full text-xs font-medium",
                getValueForTheme("bg-blue-500/20 text-blue-200", "bg-[#006C67]/10 text-[#006C67]")
              )}>
                {activeCategoryName}
              </span>
              <span className={combine("text-xs", getValueForTheme("text-gray-400", "text-gray-500"))}>
                ({filteredOrganizations.length} ชมรม)
              </span>
            </div>
          </motion.div>
        )}

        {/* Organizations Grid */}
        {hasResults && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredOrganizations.map((organization) => (
              <motion.div key={organization.id} variants={itemVariants} layout>
                <CardOrganization organization={organization} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={combine(
                "animate-pulse rounded-2xl h-80",
                getValueForTheme("bg-gray-700/30", "bg-gray-200/80")
              )}>
                <div className={combine(
                  "h-48 rounded-t-2xl mb-4",
                  getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                )} />
                <div className="p-4 space-y-3">
                  <div className={combine(
                    "h-4 rounded w-3/4",
                    getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                  )} />
                  <div className={combine(
                    "h-3 rounded w-1/2",
                    getValueForTheme("bg-gray-600/40", "bg-gray-300/60")
                  )} />
                  <div className={combine(
                    "h-8 rounded-lg w-full mt-4",
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
              "text-xl font-semibold mb-2",
              getValueForTheme("text-white", "text-gray-900")
            )}>
              ไม่พบชมรมในการค้นหานี้
            </h3>
            <p className={combine(
              "text-sm max-w-md mx-auto mb-6",
              getValueForTheme("text-gray-300", "text-gray-600")
            )}>
              ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ต่างๆ เพื่อค้นพบชมรมที่น่าสนใจ
            </p>
            <motion.button
              onClick={() => onCategoryChange(undefined)}
              className={combine(
                "px-6 py-3 rounded-xl font-medium transition-all duration-200",
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