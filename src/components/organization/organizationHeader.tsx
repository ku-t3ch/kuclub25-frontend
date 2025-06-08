"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./searchBar";
import FilterControls from "./filterController";

interface OrganizationHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string | undefined;
  filteredOrganizations: any[];
  showFilters: boolean;
  toggleFilters: () => void;
  categories: Array<{ id: string | undefined; name: string }>;
  sortBy: "name" | "views" | "latest";
  viewMode: "grid" | "list";
  onCategoryChange: (categoryId: string | undefined) => void;
  onSortChange: (sort: "name" | "views" | "latest") => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  themeClasses: any;
  animationVariants: any;
}

const OrganizationHeader = memo(({
  searchQuery,
  onSearch,
  selectedCategory,
  filteredOrganizations,
  showFilters,
  toggleFilters,
  categories,
  sortBy,
  viewMode,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  themeClasses,
  animationVariants
}: OrganizationHeaderProps) => (
  <motion.div 
    className={themeClasses.headerContainer}
    variants={animationVariants.header}
    initial="hidden"
    animate="visible"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Stats */}
        <div className="flex-1">
          <h1 className={themeClasses.title}>ชมรมทั้งหมด</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className={themeClasses.statsBadge}>
              {filteredOrganizations.length} ชมรม
            </span>
            {selectedCategory && (
              <span className={themeClasses.categoryText}>
                ในหมวดหมู่: <span className="font-medium">{selectedCategory}</span>
              </span>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:min-w-96">
          <SearchBar 
            searchQuery={searchQuery}
            onSearch={onSearch}
            themeClasses={themeClasses}
          />

          {/* Filter Toggle */}
          <button
            onClick={toggleFilters}
            className={`${themeClasses.filterButton} ${
              showFilters ? themeClasses.filterButtonActive : themeClasses.filterButtonInactive
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            ตัวกรอง
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <FilterControls
              categories={categories}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              viewMode={viewMode}
              onCategoryChange={onCategoryChange}
              onSortChange={onSortChange}
              onViewModeChange={onViewModeChange}
              themeClasses={themeClasses}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
));

OrganizationHeader.displayName = "OrganizationHeader";

export default OrganizationHeader;