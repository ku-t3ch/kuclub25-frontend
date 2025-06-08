"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useThemeUtils } from '../../hooks/useThemeUtils';
import { useOrganizations } from '../../hooks/useOrganization';
import { useOrganizationTypes } from '../../hooks/useOrganizationType';
import CardOrganization from '../../components/ui/cardOrganization';
import CategorySection from '../../components/home/categorySection';

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    } 
  },
  exit: { opacity: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.05 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  }
};

// Search Input Component
const SearchInput = React.memo<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}>(({ value, onChange, placeholder = "ค้นหาชมรม...", disabled = false }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={combine(
          "relative flex items-center rounded-2xl border shadow-sm transition-all duration-300",
          getValueForTheme(
            "bg-white/10 backdrop-blur-sm border-white/20 focus-within:border-blue-400/50",
            "bg-white border-gray-200 focus-within:border-primary/50"
          )
        )}
      >
        <div className="pl-4 pr-2">
          <svg
            className={combine(
              "w-5 h-5",
              getValueForTheme("text-white/50", "text-gray-400")
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={combine(
            "flex-1 py-3 pr-4 bg-transparent border-none outline-none",
            "text-sm md:text-base font-medium",
            getValueForTheme(
              "text-white placeholder-white/60",
              "text-gray-900 placeholder-gray-500"
            )
          )}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className={combine(
              "mr-3 p-1 rounded-full transition-colors",
              getValueForTheme(
                "text-white/50 hover:text-white hover:bg-white/10",
                "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.div>
    </div>
  );
});
SearchInput.displayName = "SearchInput";

// Filter Stats Component
const FilterStats = React.memo<{
  total: number;
  filtered: number;
  activeCategory: string | undefined;
  searchQuery: string;
  categories: Array<{ id: string | undefined; name: string }>;
}>(({ total, filtered, activeCategory, searchQuery, categories }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const activeCategoryName = useMemo(() => 
    categories.find(cat => cat.id === activeCategory)?.name || "ทั้งหมด",
    [categories, activeCategory]
  );

  const hasFilters = activeCategory !== undefined || searchQuery.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={combine(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4",
        "p-4 rounded-xl border",
        getValueForTheme(
          "bg-white/5 border-white/10",
          "bg-gray-50 border-gray-200"
        )
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <h2 className={combine(
          "text-lg sm:text-xl font-semibold",
          getValueForTheme("text-white", "text-gray-900")
        )}>
          ชมรมทั้งหมด
        </h2>
        
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className={combine(
              "text-sm",
              getValueForTheme("text-white/70", "text-gray-600")
            )}>
              ใน
            </span>
            <span className={combine(
              "px-2 py-1 rounded-full text-xs font-medium",
              getValueForTheme(
                "bg-blue-500/20 text-blue-300",
                "bg-primary/10 text-primary"
              )
            )}>
              {activeCategoryName}
            </span>
            {searchQuery && (
              <>
                <span className={combine(
                  "text-sm",
                  getValueForTheme("text-white/70", "text-gray-600")
                )}>
                  ค้นหา:
                </span>
                <span className={combine(
                  "px-2 py-1 rounded-full text-xs font-medium max-w-32 truncate",
                  getValueForTheme(
                    "bg-purple-500/20 text-purple-300",
                    "bg-purple-100 text-purple-700"
                  )
                )}>
                  "{searchQuery}"
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className={combine(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
          getValueForTheme(
            "bg-white/10 text-white/80",
            "bg-white text-gray-700 border border-gray-200"
          )
        )}>
          <span className="font-medium">{filtered.toLocaleString()}</span>
          <span>ชมรม</span>
        </div>
        
        {hasFilters && filtered !== total && (
          <div className={combine(
            "text-xs",
            getValueForTheme("text-white/60", "text-gray-500")
          )}>
            จากทั้งหมด {total.toLocaleString()}
          </div>
        )}
      </div>
    </motion.div>
  );
});
FilterStats.displayName = "FilterStats";

// Empty State Component
const EmptyState = React.memo<{
  searchQuery: string;
  activeCategory: string | undefined;
  onClearFilters: () => void;
}>(({ searchQuery, activeCategory, onClearFilters }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const hasFilters = activeCategory !== undefined || searchQuery.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 sm:py-24"
    >
      <div className={combine(
        "w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
        getValueForTheme("bg-gray-700/30", "bg-gray-100")
      )}>
        <svg 
          className={combine(
            "w-8 h-8 sm:w-10 sm:h-10",
            getValueForTheme("text-gray-500", "text-gray-400")
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      
      <h3 className={combine(
        "text-lg sm:text-xl font-semibold mb-3",
        getValueForTheme("text-white", "text-gray-900")
      )}>
        {hasFilters ? "ไม่พบชมรมที่ตรงกับการค้นหา" : "ไม่มีข้อมูลชมรม"}
      </h3>
      
      <p className={combine(
        "text-sm sm:text-base max-w-md mx-auto mb-6",
        getValueForTheme("text-white/70", "text-gray-600")
      )}>
        {hasFilters 
          ? "ลองปรับเปลี่ยนคำค้นหาหรือหมวดหมู่ เพื่อค้นหาชมรมที่คุณสนใจ"
          : "ขณะนี้ยังไม่มีข้อมูลชมรมในระบบ"
        }
      </p>

      {hasFilters && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearFilters}
          className={combine(
            "px-6 py-3 rounded-xl font-medium transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            getValueForTheme(
              "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
              "bg-gradient-to-r from-primary to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
            )
          )}
        >
          ล้างตัวกรอง
        </motion.button>
      )}
    </motion.div>
  );
});
EmptyState.displayName = "EmptyState";

// Loading Skeleton Component
const LoadingSkeleton = React.memo(() => {
  const { combine, getValueForTheme } = useThemeUtils();

  return (
    <div className="space-y-8">
      {/* Search and filters skeleton */}
      <div className="space-y-6">
        <div className={combine(
          "h-12 rounded-2xl animate-pulse max-w-2xl mx-auto",
          getValueForTheme("bg-gray-700/30", "bg-gray-200")
        )} />
        <div className={combine(
          "h-16 rounded-xl animate-pulse",
          getValueForTheme("bg-gray-700/30", "bg-gray-200")
        )} />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={combine(
            "animate-pulse rounded-2xl overflow-hidden",
            getValueForTheme("bg-gray-700/30", "bg-gray-200")
          )}>
            <div className={combine(
              "h-48 mb-4",
              getValueForTheme("bg-gray-600/40", "bg-gray-300")
            )} />
            <div className="p-4 space-y-3">
              <div className={combine(
                "h-4 rounded",
                getValueForTheme("bg-gray-600/40", "bg-gray-300")
              )} />
              <div className={combine(
                "h-3 rounded w-3/4",
                getValueForTheme("bg-gray-600/40", "bg-gray-300")
              )} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
LoadingSkeleton.displayName = "LoadingSkeleton";

export default function OrganizationsPage() {
  const { combine, getValueForTheme } = useThemeUtils();
  const router = useRouter();
  
  // Data hooks
  const { organizations, loading: orgsLoading, error: orgsError } = useOrganizations();
  const { organizationTypes, loading: typesLoading } = useOrganizationTypes();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized categories
  const categories = useMemo(() => {
    const allCategory = { id: undefined, name: "ทั้งหมด" };
    const typeCategories = organizationTypes.map((type) => ({
      id: type.name,
      name: type.name,
    }));
    return [allCategory, ...typeCategories];
  }, [organizationTypes]);

  // Search function
  const searchOrganizations = useCallback((query: string, orgs: typeof organizations) => {
    if (!query.trim()) return orgs;

    const searchTerm = query.toLowerCase().trim();
    return orgs.filter((org) => {
      return (
        org.orgnameth?.toLowerCase().includes(searchTerm) ||
        org.orgnameen?.toLowerCase().includes(searchTerm) ||
        org.org_nickname?.toLowerCase().includes(searchTerm) ||
        org.description?.toLowerCase().includes(searchTerm) ||
        org.org_type_name?.toLowerCase().includes(searchTerm)
      );
    });
  }, []);

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchOrganizations(searchQuery, filtered);
    }

    // Apply category filter
    if (activeCategory !== undefined) {
      filtered = filtered.filter(org => org.org_type_name === activeCategory);
    }

    return filtered;
  }, [organizations, searchQuery, activeCategory, searchOrganizations]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => setIsSearching(false), 300);
  }, []);

  const handleCategoryChange = useCallback((categoryName: string | undefined) => {
    setActiveCategory(categoryName);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory(undefined);
    setIsSearching(false);
  }, []);

  const handleOrganizationClick = useCallback((orgId: string) => {
    router.push(`/organizations/${orgId}`);
  }, [router]);

  // Loading state
  const loading = orgsLoading || typesLoading || isSearching;

  // Theme values
  const themeValues = useMemo(() => ({
    containerBg: getValueForTheme(
      "bg-gradient-to-b from-[#051D35] to-[#091428]",
      "bg-gradient-to-b from-white to-gray-50"
    ),
    backgroundAccent1: getValueForTheme("bg-blue-500/20", "bg-primary/10"),
    backgroundAccent2: getValueForTheme("bg-purple-500/15", "bg-teal-500/10"),
  }), [getValueForTheme]);

  // Error handling
  if (orgsError) {
    return (
      <div className={combine("min-h-screen pt-16 md:pt-20", themeValues.containerBg)}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className={combine(
            "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
            getValueForTheme("bg-red-500/20", "bg-red-50")
          )}>
            <svg className={combine("w-8 h-8", getValueForTheme("text-red-400", "text-red-500"))} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className={combine("text-2xl font-bold mb-4", getValueForTheme("text-white", "text-gray-900"))}>
            เกิดข้อผิดพลาด
          </h1>
          <p className={combine("mb-6", getValueForTheme("text-white/70", "text-gray-600"))}>
            {orgsError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={combine(
              "px-6 py-3 rounded-lg font-medium transition-all duration-300",
              getValueForTheme(
                "bg-blue-600 hover:bg-blue-700 text-white",
                "bg-primary hover:bg-primary/90 text-white"
              )
            )}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={combine("min-h-screen pt-16 md:pt-20", themeValues.containerBg)}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={combine(
          "absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl",
          themeValues.backgroundAccent1
        )} />
        <div className={combine(
          "absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl",
          themeValues.backgroundAccent2
        )} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className={combine(
              "text-3xl sm:text-4xl lg:text-5xl font-bold",
              "bg-gradient-to-r bg-clip-text text-transparent",
              getValueForTheme(
                "from-white via-blue-100 to-purple-100",
                "from-gray-800 via-primary to-teal-600"
              )
            )}>
              ชมรมทั้งหมด
            </h1>
            <p className={combine(
              "text-base sm:text-lg max-w-2xl mx-auto",
              getValueForTheme("text-white/80", "text-gray-600")
            )}>
              ค้นพบและเข้าร่วมชมรมที่ตรงกับความสนใจของคุณ
            </p>
          </motion.div>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            disabled={loading}
          />

          {/* Category Filter */}
          <CategorySection
            categories={categories}
            activeCategory={activeCategory}
            totalClubCount={organizations.length}
            loading={loading}
            onCategoryChange={handleCategoryChange}
          />

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : filteredOrganizations.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <FilterStats
                  total={organizations.length}
                  filtered={filteredOrganizations.length}
                  activeCategory={activeCategory}
                  searchQuery={searchQuery}
                  categories={categories}
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                >
                  {filteredOrganizations.map((organization, index) => (
                    <motion.div
                      key={organization.id}
                      variants={itemVariants}
                      custom={index}
                      layout
                    >
                      <CardOrganization
                        organization={organization}
                        onClick={() => handleOrganizationClick(organization.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}