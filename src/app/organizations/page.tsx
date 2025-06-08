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
      getValueForTheme(
        "bg-gradient-to-b from-[#051D35] to-[#0A1A2F] text-white",
        "bg-gradient-to-b from-white to-gray-50 text-[#006C67]"
      )
    ),
    headerContainer: combine(
      "sticky top-16 md:top-20 z-40 backdrop-blur-md border-b",
      getValueForTheme(
        "bg-[#051D35]/90 border-white/10",
        "bg-white/90 border-[#006C67]/20"
      )
    ),
    title: combine(
      "text-3xl lg:text-4xl font-bold mb-2",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    statsBadge: combine(
      "px-3 py-1 rounded-full font-medium",
      getValueForTheme("bg-blue-500/20 text-blue-300", "bg-[#006C67]/10 text-[#006C67]")
    ),
    categoryText: getValueForTheme("text-white/70", "text-[#006C67]/70"),
    searchInput: combine(
      "w-full px-4 py-2.5 pl-10 rounded-xl border text-sm",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      getValueForTheme(
        "bg-white/5 border-white/10 text-white placeholder-white/50 focus:border-blue-500 focus:ring-blue-500/25",
        "bg-white border-[#006C67]/20 text-[#006C67] placeholder-[#006C67]/50 focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    searchIcon: combine(
      "absolute left-3 top-3 w-4 h-4",
      getValueForTheme("text-white/50", "text-[#006C67]/50")
    ),
    filterButton: combine(
      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      "flex items-center gap-2 whitespace-nowrap"
    ),
    filterButtonActive: getValueForTheme("bg-blue-600 text-white", "bg-[#006C67] text-white"),
    filterButtonInactive: getValueForTheme(
      "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10",
      "bg-white text-[#006C67]/70 hover:bg-[#006C67]/5 border border-[#006C67]/20"
    ),
    filtersContainer: combine(
      "mt-6 p-4 rounded-xl border",
      getValueForTheme("bg-white/5 border-white/10", "bg-gray-50 border-[#006C67]/20")
    ),
    filterLabel: combine(
      "block text-sm font-medium mb-2",
      getValueForTheme("text-white/80", "text-[#006C67]/80")
    ),
    filterSelect: combine(
      "w-full px-3 py-2 rounded-lg border text-sm",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      getValueForTheme(
        "bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/25",
        "bg-white border-[#006C67]/20 text-[#006C67] focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    viewModeButton: "flex-1 px-3 py-2 text-sm font-medium transition-all duration-200",
    viewModeActive: getValueForTheme("bg-blue-600 text-white", "bg-[#006C67] text-white"),
    viewModeInactive: getValueForTheme(
      "bg-white/5 text-white/70 hover:bg-white/10",
      "bg-gray-200 text-[#006C67]/70 hover:bg-[#006C67]/10"
    ),
    errorContainer: combine(
      "mb-6 p-4 rounded-xl border-l-4",
      getValueForTheme(
        "bg-red-500/10 border-red-500 text-red-300",
        "bg-red-50 border-red-500 text-red-700"
      )
    ),
    skeleton: combine(
      "animate-pulse rounded-2xl",
      getValueForTheme("bg-white/10", "bg-gray-200")
    ),
    emptyStateContainer: combine(
      "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
      getValueForTheme("bg-white/10", "bg-[#006C67]/10")
    ),
    emptyStateTitle: combine(
      "text-xl font-semibold mb-2",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    emptyStateText: combine(
      "text-sm max-w-md mx-auto mb-6",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    ),
    clearButton: combine(
      "px-6 py-3 rounded-xl font-medium transition-all duration-200",
      getValueForTheme(
        "bg-blue-600 hover:bg-blue-700 text-white",
        "bg-[#006C67] hover:bg-[#005550] text-white"
      )
    ),
    // Additional theme classes for better consistency
    contentContainer: combine(
      "backdrop-blur-sm rounded-xl border",
      getValueForTheme("bg-white/5 border-white/10", "bg-white border-[#006C67]/20")
    ),
    sectionTitle: combine(
      "text-xl font-semibold mb-4",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    primaryButton: combine(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
      getValueForTheme(
        "bg-blue-600 hover:bg-blue-700 text-white",
        "bg-[#006C67] hover:bg-[#005550] text-white"
      )
    ),
    secondaryButton: combine(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
      getValueForTheme(
        "bg-white/5 hover:bg-white/10 text-white border border-white/20",
        "bg-white hover:bg-[#006C67]/5 text-[#006C67] border border-[#006C67]/20"
      )
    ),
    card: combine(
      "p-6 rounded-xl border shadow-lg transition-all duration-200",
      getValueForTheme(
        "bg-white/5 border-white/10 hover:bg-white/10",
        "bg-white border-[#006C67]/20 hover:shadow-[#006C67]/10"
      )
    ),
    cardTitle: combine(
      "text-lg font-semibold mb-2",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    cardText: combine(
      "text-sm",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    ),
    badge: combine(
      "px-2 py-1 rounded-full text-xs font-medium",
      getValueForTheme("bg-blue-500/20 text-blue-300", "bg-[#006C67]/10 text-[#006C67]")
    ),
    divider: getValueForTheme("border-white/10", "border-[#006C67]/20"),
    link: combine(
      "transition-colors duration-200",
      getValueForTheme(
        "text-blue-300 hover:text-blue-200",
        "text-[#006C67] hover:text-[#005550]"
      )
    ),
    // Loading states
    loadingCard: combine(
      "p-6 rounded-xl border animate-pulse",
      getValueForTheme("bg-white/5 border-white/10", "bg-gray-50 border-gray-200")
    ),
    loadingText: combine(
      "h-4 rounded mb-2",
      getValueForTheme("bg-white/10", "bg-gray-200")
    ),
    loadingTitle: combine(
      "h-6 rounded mb-4",
      getValueForTheme("bg-white/15", "bg-gray-300")
    ),
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