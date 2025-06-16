import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";

interface HeroSectionProps {
  description: string;
  title: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

// Animation constants for better performance
const ANIMATION_CONFIG = {
  default: {
    duration: 0.6,
    ease: "easeOut" as const,
  },
  quick: {
    duration: 0.2,
    ease: "easeOut" as const,
  },
} as const;

// Memoized Loading Icon Component
const LoadingIcon = memo<{ className: string }>(({ className }) => (
  <div className={className}>
    <div className="animate-spin rounded-full h-full w-full border-2 border-white border-t-transparent" />
  </div>
));
LoadingIcon.displayName = "LoadingIcon";

// Memoized Search Icon Component
const SearchIcon = memo<{ className: string }>(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
));
SearchIcon.displayName = "SearchIcon";

// Loading Skeleton Component for SSR
const HeroSkeleton = memo<{
  title: string;
  description: string;
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
}>(({ title, description, getValueForTheme, combine }) => (
  <div className="relative w-full overflow-hidden bg-transparent">
    <div className="container my-auto mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 text-center relative z-10 max-w-7xl pt-6 xs:pt-8 sm:pt-12 md:pt-16 lg:pt-20">
      {/* Title */}
      <h1 className={combine(
        "text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-2 sm:mb-3 md:mb-1",
        "bg-clip-text text-transparent bg-gradient-to-r",
        "break-words text-center leading-tight",
        "max-w-5xl mx-auto px-2",
        getValueForTheme(
          "from-[#54CF90] via-[#54CF90] to-[#54CF90]/90",
          "from-[#006C67] via-[#006C67] to-[#006C67]/80"
        ),
        "py-2 xs:py-3 sm:py-4 md:py-3"
      )}>
        {title}
      </h1>

      {/* Description */}
      <p className={combine(
        "text-sm xs:text-base sm:text-lg md:text-xl max-w-4xl mx-auto mb-6 xs:mb-8 sm:mb-10 md:mb-12",
        getValueForTheme("text-white/80", "text-gray-700"),
        "leading-relaxed px-3 xs:px-4 sm:px-6 md:px-8",
        "text-center break-words hyphens-auto"
      )}>
        {description}
      </p>

      {/* Search form skeleton */}
      <div className="max-w-xl mx-auto relative mb-5 xs:mb-6 sm:mb-8 md:mb-12 px-3 xs:px-4 sm:px-6 md:px-0">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาชมรม..."
            className={combine(
              "w-full py-2.5 xs:py-3 sm:py-3.5 md:py-4 px-3 xs:px-4 sm:px-5 md:px-6 pl-9 xs:pl-10 sm:pl-11 md:pl-12",
              "rounded-full backdrop-blur-sm border shadow-lg text-sm xs:text-base",
              getValueForTheme("bg-white/10 backdrop-blur-sm", "bg-white"),
              getValueForTheme("text-white", "text-gray-900"),
              getValueForTheme("placeholder-gray-300", "placeholder-gray-500"),
              getValueForTheme("border-white/20", "border-gray-200"),
              "focus:outline-none focus:ring-2",
              getValueForTheme(
                "focus:border-[#54CF90] focus:ring-[#54CF90]/25",
                "focus:border-[#006C67] focus:ring-[#006C67]/25"
              ),
              "transition-all duration-300"
            )}
            disabled
            readOnly
          />
          <div className={combine(
            "absolute left-2.5 xs:left-3 sm:left-3.5 md:left-4 top-3 xs:top-3 sm:top-3.5 md:top-4",
            getValueForTheme("text-white/50", "text-gray-400")
          )}>
            <SearchIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
));
HeroSkeleton.displayName = "HeroSkeleton";

const HeroSection = memo<HeroSectionProps>(({
  description,
  title,
  onSearch,
  initialQuery = "",
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { combine, getValueForTheme } = useThemeUtils();

  // Client-side mounting check for SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync with initial query
  useEffect(() => {
    if (isMounted) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, isMounted]);

  // Handle loading state
  useEffect(() => {
    if (isLoading) {
      setIsSearching(true);
    } else {
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Memoized theme values for performance
  const themeValues = useMemo(() => ({
    headingGradient: getValueForTheme(
      "from-[#54CF90] via-[#54CF90] to-[#54CF90]/90",
      "from-[#006C67] via-[#006C67] to-[#006C67]/80"
    ),
    descriptionText: getValueForTheme("text-white/80", "text-gray-700"),
    searchBarBg: getValueForTheme("bg-white/10 backdrop-blur-sm", "bg-white"),
    searchBarText: getValueForTheme("text-white", "text-gray-900"),
    searchBarPlaceholder: getValueForTheme("placeholder-gray-300", "placeholder-gray-500"),
    searchBarBorder: getValueForTheme("border-white/20", "border-gray-200"),
    searchBarFocus: getValueForTheme(
      "focus:border-[#54CF90] focus:ring-[#54CF90]/25",
      "focus:border-[#006C67] focus:ring-[#006C67]/25"
    ),
    searchButton: getValueForTheme(
      "from-[#54CF90] to-[#54CF90]/90",
      "from-[#006C67] to-[#006C67]/90"
    ),
    searchIconColor: getValueForTheme("text-white/50", "text-gray-400"),
    glowEffect: getValueForTheme("bg-[#54CF90]/20", "bg-[#006C67]/20"),
    hoverShadow: getValueForTheme("hover:shadow-[#54CF90]/30", "hover:shadow-[#006C67]/30"),
    loadingIndicator: getValueForTheme(
      "bg-white/10 backdrop-blur-sm border border-white/20",
      "bg-gray-100/80 backdrop-blur-sm border border-gray-200"
    ),
  }), [getValueForTheme]);

  // Memoized event handlers
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim() !== "" && !isSearching) {
      setIsSearching(true);
      onSearch(searchQuery.trim());
    }
  }, [onSearch, searchQuery, isSearching]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // Clear search when input is empty
    if (newValue === "" && onSearch && !isSearching) {
      setIsSearching(false);
      onSearch("");
    }
  }, [onSearch, isSearching]);

  // SSR safety - show skeleton until mounted
  if (!isMounted) {
    return (
      <HeroSkeleton
        title={title}
        description={description}
        getValueForTheme={getValueForTheme}
        combine={combine}
      />
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div className="container my-auto mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 text-center relative z-10 max-w-7xl pt-6 xs:pt-8 sm:pt-12 md:pt-16 lg:pt-20">
        {/* Title */}
        <motion.h1
          className={combine(
            "text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-2 sm:mb-3 md:mb-1",
            "bg-clip-text text-transparent bg-gradient-to-r",
            "break-words text-center leading-tight",
            "max-w-5xl mx-auto px-2",
            themeValues.headingGradient,
            "py-2 xs:py-3 sm:py-4 md:py-3"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_CONFIG.default, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className={combine(
            "text-sm xs:text-base sm:text-lg md:text-xl max-w-4xl mx-auto mb-6 xs:mb-8 sm:mb-10 md:mb-12",
            themeValues.descriptionText,
            "leading-relaxed px-3 xs:px-4 sm:px-6 md:px-8",
            "text-center break-words hyphens-auto"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_CONFIG.default, delay: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Search form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto relative mb-5 xs:mb-6 sm:mb-8 md:mb-12 group px-3 xs:px-4 sm:px-6 md:px-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...ANIMATION_CONFIG.default, delay: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชมรม..."
              className={combine(
                "w-full py-2.5 xs:py-3 sm:py-3.5 md:py-4 px-3 xs:px-4 sm:px-5 md:px-6 pl-9 xs:pl-10 sm:pl-11 md:pl-12",
                "rounded-full backdrop-blur-sm border shadow-lg text-sm xs:text-base",
                themeValues.searchBarBg,
                themeValues.searchBarText,
                themeValues.searchBarPlaceholder,
                themeValues.searchBarBorder,
                "focus:outline-none focus:ring-2",
                themeValues.searchBarFocus,
                "transition-all duration-300",
                isSearching ? "pr-16 xs:pr-20" : "",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              value={searchQuery}
              onChange={handleChange}
              disabled={isSearching}
              autoComplete="off"
              role="searchbox"
              aria-label="ค้นหาชมรม"
            />

            {/* Search button */}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className={combine(
                "absolute right-2 xs:right-1.5 sm:right-2 top-2 xs:top-1.5 sm:top-2",
                "p-1.5 xs:p-1.5 sm:p-2 rounded-full bg-gradient-to-r",
                themeValues.searchButton,
                "hover:shadow-md transition-all duration-300",
                themeValues.hoverShadow,
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-white/20"
              )}
              aria-label={isSearching ? "กำลังค้นหา" : "ค้นหา"}
            >
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={ANIMATION_CONFIG.quick}
                  >
                    <LoadingIcon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={ANIMATION_CONFIG.quick}
                  >
                    <SearchIcon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Search icon */}
            <div className={combine(
              "absolute left-2.5 xs:left-3 sm:left-3.5 md:left-4 top-3 xs:top-3 sm:top-3.5 md:top-4",
              themeValues.searchIconColor
            )}>
              <SearchIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
            </div>

            {/* Glow effect */}
            <div
              className={combine(
                "absolute inset-0 -z-10 blur-md xs:blur-lg sm:blur-xl rounded-full opacity-0 group-focus-within:opacity-70 transition-opacity duration-300",
                themeValues.glowEffect
              )}
              aria-hidden="true"
            />

            {/* Loading text */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={ANIMATION_CONFIG.quick}
                  className={combine(
                    "absolute top-full left-0 right-0 mt-2 text-center text-xs",
                    themeValues.searchIconColor
                  )}
                >
                  กำลังค้นหา...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={ANIMATION_CONFIG.quick}
              className={combine(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                themeValues.loadingIndicator,
                themeValues.descriptionText
              )}
            >
              <LoadingIcon className="w-4 h-4" />
              <span className="text-sm">กำลังโหลดข้อมูล...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;