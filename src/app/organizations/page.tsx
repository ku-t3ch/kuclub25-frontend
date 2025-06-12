"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { useOrganizationsWithFilters } from "../../hooks/useOrganization";
import { useCampuses } from "../../hooks/useCampuses";
import OrganizationPageHeader from "../../components/organization/organizationHeader";
import OrganizationEnhancedFilters from "../../components/organization/organizationEnhancedFilters";
import OrganizationContent from "../../components/organization/organizationContent";

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

  const {
    campuses,
    loading: campusLoading,
    error: campusError,
  } = useCampuses();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCampus, setSelectedCampus] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"name" | "views" | "latest">("name");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const INITIAL_ITEMS = 12;
  const ITEMS_PER_PAGE = 8;

  // Helper function สำหรับการเทียบ campus name
  const isCampusMatch = useCallback((orgCampusName: string | null | undefined, selectedCampusName: string): boolean => {
    if (!orgCampusName || !selectedCampusName) return false;
    return orgCampusName === selectedCampusName;
  }, []);

  // Filter organizations by campus
  const campusFilteredOrganizations = useMemo(() => {
    if (!selectedCampus || campuses.length === 0) {
      return filteredOrganizations;
    }

    const selectedCampusData = campuses.find(campus => campus.id === selectedCampus);
    if (!selectedCampusData) {
      return filteredOrganizations;
    }

    return filteredOrganizations.filter(org =>
      isCampusMatch(org.campus_name, selectedCampusData.name)
    );
  }, [filteredOrganizations, selectedCampus, campuses, isCampusMatch]);


  const themeClasses = useMemo(() => ({
    pageBackground: combine(
      "min-h-screen pt-14 sm:pt-16 md:pt-20",
      getValueForTheme(
        "bg-[#ffff]/2",
        "bg-gradient-to-b from-white via-gray-50 to-gray-100"
      )
    ),
    contentContainer: "max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
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

  // Campus options for select
  const campusOptions = useMemo(() => [
    { id: undefined, name: "ทุกวิทยาเขต" },
    ...campuses.map(campus => ({ id: campus.id, name: campus.name }))
  ], [campuses]);

  // Optimized handlers with useCallback
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setFilters({
      ...currentFilters,
      search: query || undefined,
    });
  }, [currentFilters, setFilters]);

  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setFilters({
      ...currentFilters,
      orgTypeName: categoryId,
    });
  }, [currentFilters, setFilters]);

  const handleCampusChange = useCallback((campusId: string | undefined) => {
    setSelectedCampus(campusId);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: "name" | "views" | "latest") => {
    setSortBy(sort);
    setCurrentPage(1);
    setFilters({
      ...currentFilters,
      sortBy: sort,
      sortOrder: sort === "views" ? "desc" : "asc",
    });
  }, [currentFilters, setFilters]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setSelectedCampus(undefined);
    setSortBy("name");
    setCurrentPage(1);
    setFilters({});
    setShowFilters(false);
  }, [setFilters]);

  // Pagination handlers
  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleShowLess = useCallback(() => {
    setCurrentPage(1);
    document.getElementById('organizations-grid')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Updated responsive grid classes - mobile shows 2 columns
  const gridClasses = useMemo(() => {
    return "grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  }, []);

  // Paginated organizations
  const paginatedOrganizations = useMemo(() => {
    const totalItemsToShow = INITIAL_ITEMS + (currentPage - 1) * ITEMS_PER_PAGE;
    return campusFilteredOrganizations.slice(0, totalItemsToShow);
  }, [campusFilteredOrganizations, currentPage]);

  // Check if there are more items to load
  const hasMoreItems = useMemo(() => {
    const totalItemsToShow = INITIAL_ITEMS + (currentPage - 1) * ITEMS_PER_PAGE;
    return campusFilteredOrganizations.length > totalItemsToShow;
  }, [campusFilteredOrganizations.length, currentPage]);

  // Check if we can show less
  const canShowLess = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // Stats computation
  const stats = useMemo(() => {
    const selectedCampusName = selectedCampus 
      ? campuses.find(c => c.id === selectedCampus)?.name 
      : null;
    
    return {
      total: campusFilteredOrganizations.length,
      displayed: paginatedOrganizations.length,
      category: selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : null,
      campus: selectedCampusName
    };
  }, [campusFilteredOrganizations.length, paginatedOrganizations.length, selectedCategory, categories, selectedCampus, campuses]);

  return (
    <div className={themeClasses.pageBackground}>
      <div className={themeClasses.contentContainer}>
        {/* Page Header with Error Handling */}
        <OrganizationPageHeader
          title="ค้นหาชมรมและองค์กรนิสิต"
          error={error}
          campusError={campusError}
          onClearError={clearError}
        />

        {/* Enhanced Filters Section */}
        <OrganizationEnhancedFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedCampus={selectedCampus}
          sortBy={sortBy}
          showFilters={showFilters}
          categories={categories}
          campusOptions={campusOptions}
          campusLoading={campusLoading}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCampusChange={handleCampusChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          onToggleFilters={toggleFilters}
        />


        {/* Organizations Content */}
        <OrganizationContent
          loading={loading}
          organizations={campusFilteredOrganizations}
          paginatedOrganizations={paginatedOrganizations}
          hasMoreItems={hasMoreItems}
          canShowLess={canShowLess}
          stats={stats}
          gridClasses={gridClasses}
          onLoadMore={handleLoadMore}
          onShowLess={handleShowLess}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default OrganizationsPage;