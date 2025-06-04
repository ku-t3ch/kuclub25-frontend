import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";

interface HeroSectionProps {
  description: string;
  title: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

const defaultTransition = {
  duration: 0.6,
  ease: "easeOut" as const,
};

const HeroSection: React.FC<HeroSectionProps> = ({
  description,
  title,
  onSearch,
  initialQuery = "",
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const { combine, getValueForTheme } = useThemeUtils();

  // อัพเดทค่า searchQuery เมื่อ initialQuery เปลี่ยนแปลง
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Handle loading state changes
  useEffect(() => {
    if (isLoading) {
      setIsSearching(true);
    } else {
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSearch && searchQuery.trim() !== "") {
        setIsSearching(true);
        onSearch(searchQuery.trim());
      }
    },
    [onSearch, searchQuery]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchQuery(newValue);

      if (newValue === "" && onSearch) {
        setIsSearching(false);
        onSearch("");
      }
    },
    [onSearch]
  );

  // Memoized theme values for performance
  const themeValues = useMemo(
    () => ({
      containerBg: getValueForTheme("text-white", "text-gray-800"),
      headingGradient: getValueForTheme(
        "from-blue-400 via-blue-300 to-purple-400",
        "from-[#006C67] via-[#006C67] to-[#006C67]/80"
      ),
      descriptionText: getValueForTheme("text-white/80", "text-gray-700"),
      searchBarBg: getValueForTheme("bg-white/10 backdrop-blur-sm", "bg-white"),
      searchBarText: getValueForTheme("text-white", "text-gray-900"),
      searchBarPlaceholder: getValueForTheme(
        "placeholder-gray-300",
        "placeholder-gray-500"
      ),
      searchBarBorder: getValueForTheme("border-white/20", "border-gray-200"),
      searchBarFocus: getValueForTheme(
        "focus:border-blue-400 focus:ring-blue-400/25",
        "focus:border-[#006C67] focus:ring-[#006C67]/25"
      ),
      searchButton: getValueForTheme(
        "from-blue-600 to-blue-700",
        "from-[#006C67] to-[#006C67]/90"
      ),
      searchIconColor: getValueForTheme("text-white/50", "text-gray-400"),
      glowEffect: getValueForTheme("bg-blue-500/20", "bg-[#006C67]/20"),
      hoverShadow: getValueForTheme(
        "hover:shadow-blue-600/30",
        "hover:shadow-[#006C67]/30"
      ),
    }),
    [getValueForTheme]
  );

  return (
    <div
      className={combine(
        themeValues.containerBg,
        "py-8 xs:py-10 sm:py-16 md:py-24 relative overflow-hidden"
      )}
    >
      {/* Background elements */}
      <div
        className={combine(
          "absolute -top-10 xs:-top-14 sm:-top-20 md:-top-40 -right-10 xs:-right-14 sm:-right-20 md:-right-40",
          "w-40 xs:w-56 sm:w-64 md:w-96 h-40 xs:h-56 sm:h-64 md:h-96",
          getValueForTheme("bg-blue-500/30", "bg-[#006C67]/10"),
          "rounded-full blur-[40px] xs:blur-[50px] sm:blur-[70px] md:blur-[100px]"
        )}
      ></div>

      <div
        className={combine(
          "absolute -bottom-10 xs:-bottom-14 sm:-bottom-20 md:-bottom-40 -left-10 xs:-left-14 sm:-left-20 md:-left-40",
          "w-40 xs:w-56 sm:w-64 md:w-96 h-40 xs:h-56 sm:h-64 md:h-96",
          getValueForTheme("bg-purple-500/20", "bg-[#006C67]/8"),
          "rounded-full blur-[40px] xs:blur-[50px] sm:blur-[70px] md:blur-[100px]"
        )}
      ></div>

      {/* Additional background elements */}
      <div
        className={combine(
          "absolute top-5 xs:top-8 sm:top-10 md:top-20 left-5 xs:left-8 sm:left-10 md:left-20",
          "w-36 xs:w-40 sm:w-48 md:w-72 h-36 xs:h-40 sm:h-48 md:h-72",
          getValueForTheme("bg-blue-400/30", "bg-[#006C67]/8"),
          "rounded-full blur-[30px] xs:blur-[40px] sm:blur-[50px] md:blur-[80px]"
        )}
      ></div>

      <div
        className={combine(
          "absolute bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-10 right-3 xs:right-4 sm:right-5 md:right-10",
          "w-32 xs:w-40 sm:w-56 md:w-80 h-32 xs:h-40 sm:h-56 md:h-80",
          getValueForTheme("bg-purple-400/20", "bg-[#006C67]/8"),
          "rounded-full blur-[30px] xs:blur-[40px] sm:blur-[60px] md:blur-[90px]"
        )}
      ></div>

      {/* Mesh gradient overlay */}
      <div
        className={combine(
          "absolute inset-0",
          getValueForTheme(
            "bg-gradient-to-b from-transparent to-ku-primary-dark/80",
            "bg-gradient-to-b from-transparent to-white/80"
          ),
          "z-0"
        )}
      ></div>

      {/* Light beam effect */}
      <motion.div
        className={combine(
          "absolute -top-10 xs:-top-12 sm:-top-20 left-1/2 transform -translate-x-1/2",
          "w-3/4 xs:w-2/3 sm:w-1/2 md:w-1/3 h-[12rem] xs:h-[15rem] sm:h-[20rem] md:h-[30rem]",
          getValueForTheme(
            "bg-gradient-to-b from-blue-500/20 to-transparent",
            "bg-gradient-to-b from-[#006C67]/10 to-transparent"
          ),
          "rotate-12 blur-xl xs:blur-2xl sm:blur-3xl z-0"
        )}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.8, 1, 0.8],
          rotate: [12, 15, 12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container my-auto mx-auto px-3 xs:px-4 sm:px-6 text-center relative z-10 max-w-5xl">
        {/* Title */}
        <motion.h1
          className={combine(
            "text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 xs:mb-3",
            "bg-clip-text text-transparent bg-gradient-to-r",
            themeValues.headingGradient,
            "py-2 xs:py-3 sm:py-4 md:py-5"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...defaultTransition, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className={combine(
            "text-sm xs:text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-10",
            themeValues.descriptionText,
            "leading-relaxed px-1 xs:px-2 sm:px-4 md:px-6"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...defaultTransition, delay: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Search form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto relative mb-5 xs:mb-6 sm:mb-8 md:mb-12 group px-3 xs:px-4 sm:px-6 md:px-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...defaultTransition, delay: 0.5 }}
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
                isSearching ? "pr-16 xs:pr-20" : ""
              )}
              value={searchQuery}
              onChange={handleChange}
              disabled={isSearching}
            />

            {/* Search button */}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className={combine(
                "absolute right-1 xs:right-1.5 sm:right-2 top-1 xs:top-1.5 sm:top-2",
                "p-1.5 xs:p-1.5 sm:p-2 rounded-full bg-gradient-to-r",
                themeValues.searchButton,
                "hover:shadow-md transition duration-300",
                themeValues.hoverShadow,
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  >
                    <div className="animate-spin rounded-full h-full w-full border-2 border-white border-t-transparent"></div>
                  </motion.div>
                ) : (
                  <motion.svg
                    key="search"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {/* Search icon */}
            <div
              className={combine(
                "absolute left-2.5 xs:left-3 sm:left-3.5 md:left-4 top-2.5 xs:top-3 sm:top-3.5 md:top-4",
                themeValues.searchIconColor
              )}
            >
              <svg
                className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            {/* Search input glow effect */}
            <div
              className={combine(
                "absolute inset-0 -z-10 blur-md xs:blur-lg sm:blur-xl rounded-full opacity-0 group-focus-within:opacity-70 transition-opacity duration-300",
                themeValues.glowEffect
              )}
            ></div>

            {/* Loading indicator text */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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

        {/* Loading state indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={combine(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                getValueForTheme(
                  "bg-white/10 backdrop-blur-sm border border-white/20",
                  "bg-gray-100/80 backdrop-blur-sm border border-gray-200"
                ),
                themeValues.descriptionText
              )}
            >
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">กำลังโหลดข้อมูล...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom decorative wave */}
      <div
        className={combine(
          "absolute bottom-0 left-0 right-0 h-5 xs:h-6 sm:h-8 md:h-10",
          getValueForTheme(
            "bg-gradient-to-t from-ku-primary/80 to-transparent",
            "bg-gradient-to-t from-white/80 to-transparent"
          ),
          "z-5"
        )}
      ></div>
    </div>
  );
};

export default React.memo(HeroSection);