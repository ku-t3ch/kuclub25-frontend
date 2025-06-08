"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { useOrganizationsWithFilters } from "../../hooks/useOrganization";

// Import components
import OrganizationHeader from "../../components/organization/organizationHeader";
import OrganizationGrid from "../../components/organization/organizationGrid";
import LoadingSkeleton from "../../components/ui/loading/loadingOrganization";
import ErrorState from "../../components/ui/error/errorOrganizationID";
import EmptyState from "../../components/ui/empty/emptyStateOrganization";

const OrganizationsPage: React.FC = () => {
  const { combine, getValueForTheme } = useThemeUtils();
  const {
    organizations,
    filteredOrganizations,
    loading,
    error,
    setFilters,
    currentFilters,
    clearError,
  } = useOrganizationsWithFilters();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"name" | "views" | "latest">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Memoized theme classes for performance
  const themeClasses = useMemo(() => ({
    pageBackground: combine(
      "min-h-screen pt-16 md:pt-20",
      getValueForTheme("bg-ku-primary-dark", "bg-gray-50")
    ),
    headerContainer: combine(
      "sticky top-16 md:top-20 z-40 backdrop-blur-md border-b",
      getValueForTheme(
        "bg-ku-primary-dark/90 border-gray-700/50",
        "bg-white/90 border-gray-200/50"
      )
    ),
    title: combine(
      "text-3xl lg:text-4xl font-bold mb-2",
      getValueForTheme("text-white", "text-gray-900")
    ),
    statsBadge: combine(
      "px-3 py-1 rounded-full font-medium",
      getValueForTheme("bg-blue-500/20 text-blue-300", "bg-[#006C67]/10 text-[#006C67]")
    ),
    categoryText: getValueForTheme("text-gray-300", "text-gray-600"),
    searchInput: combine(
      "w-full px-4 py-2.5 pl-10 rounded-xl border text-sm",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      getValueForTheme(
        "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/25",
        "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    searchIcon: combine(
      "absolute left-3 top-3 w-4 h-4",
      getValueForTheme("text-gray-400", "text-gray-400")
    ),
    filterButton: combine(
      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      "flex items-center gap-2 whitespace-nowrap"
    ),
    filterButtonActive: getValueForTheme("bg-blue-600 text-white", "bg-[#006C67] text-white"),
    filterButtonInactive: getValueForTheme("bg-gray-800/50 text-gray-300 hover:bg-gray-700", "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"),
    filtersContainer: combine(
      "mt-6 p-4 rounded-xl border",
      getValueForTheme("bg-gray-800/30 border-gray-700", "bg-gray-50 border-gray-200")
    ),
    filterLabel: combine(
      "block text-sm font-medium mb-2",
      getValueForTheme("text-gray-300", "text-gray-700")
    ),
    filterSelect: combine(
      "w-full px-3 py-2 rounded-lg border text-sm",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      getValueForTheme(
        "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/25",
        "bg-white border-gray-200 text-gray-900 focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    viewModeButton: "flex-1 px-3 py-2 text-sm font-medium transition-all duration-200",
    viewModeActive: getValueForTheme("bg-blue-600 text-white", "bg-[#006C67] text-white"),
    viewModeInactive: getValueForTheme("bg-gray-800 text-gray-300 hover:bg-gray-700", "bg-gray-200 text-gray-700 hover:bg-gray-300"),
    errorContainer: combine(
      "mb-6 p-4 rounded-xl border-l-4",
      getValueForTheme("bg-red-900/20 border-red-500 text-red-300", "bg-red-50 border-red-500 text-red-700")
    ),
    skeleton: combine(
      "animate-pulse rounded-2xl",
      getValueForTheme("bg-gray-700/30", "bg-gray-200")
    ),
    emptyStateContainer: combine(
      "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
      getValueForTheme("bg-gray-700/30", "bg-gray-100")
    ),
    emptyStateTitle: combine(
      "text-xl font-semibold mb-2",
      getValueForTheme("text-white", "text-gray-900")
    ),
    emptyStateText: combine(
      "text-sm max-w-md mx-auto mb-6",
      getValueForTheme("text-gray-300", "text-gray-600")
    ),
    clearButton: combine(
      "px-6 py-3 rounded-xl font-medium transition-all duration-200",
      getValueForTheme("bg-blue-600 hover:bg-blue-700 text-white", "bg-[#006C67] hover:bg-[#005550] text-white")
    )
  }), [combine, getValueForTheme]);

  // Memoized categories
  const categories = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(organizations.map(org => org.org_type_name).filter(Boolean))
    );
    return [
      { id: undefined, name: "ทั้งหมด" },
      ...uniqueTypes.map(type => ({ id: type, name: type }))
    ];
  }, [organizations]);

  // Optimized handlers with useCallback
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters({
      ...currentFilters,
      search: query || undefined,
    });
  }, [currentFilters, setFilters]);

  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setSelectedCategory(categoryId);
    setFilters({
      ...currentFilters,
      orgTypeName: categoryId,
    });
  }, [currentFilters, setFilters]);

  const handleSortChange = useCallback((sort: "name" | "views" | "latest") => {
    setSortBy(sort);
    setFilters({
      ...currentFilters,
      sortBy: sort,
      sortOrder: sort === "views" ? "desc" : "asc",
    });
  }, [currentFilters, setFilters]);

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setSortBy("name");
    setFilters({});
  }, [setFilters]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Animation variants (simplified for performance)
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
      }
    },
    item: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    },
    header: {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }
  }), []);

  // Grid class computation
  const gridClasses = useMemo(() => {
    return `grid gap-6 ${viewMode === "grid" 
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
      : "grid-cols-1"
    }`;
  }, [viewMode]);

  return (
    <div className={themeClasses.pageBackground}>
      {/* Header Section */}
      <OrganizationHeader
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        filteredOrganizations={filteredOrganizations}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        categories={categories}
        sortBy={sortBy}
        viewMode={viewMode}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onViewModeChange={handleViewModeChange}
        themeClasses={themeClasses}
        animationVariants={animationVariants}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <ErrorState
            error={error}
            onClearError={clearError}
            themeClasses={themeClasses}
            getValueForTheme={getValueForTheme}
          />
        )}

        {/* Loading State */}
        {loading && (
          <LoadingSkeleton 
            viewMode={viewMode} 
            themeClasses={themeClasses} 
          />
        )}

        {/* Organizations Grid/List */}
        {!loading && filteredOrganizations.length > 0 && (
          <OrganizationGrid
            organizations={filteredOrganizations}
            viewMode={viewMode}
            gridClasses={gridClasses}
            animationVariants={animationVariants}
          />
        )}

        {/* Empty State */}
        {!loading && filteredOrganizations.length === 0 && (
          <EmptyState
            themeClasses={themeClasses}
            combine={combine}
            getValueForTheme={getValueForTheme}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;