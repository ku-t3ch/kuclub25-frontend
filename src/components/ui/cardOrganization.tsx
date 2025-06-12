"use client";

import React, { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { Organization } from "../../types/organization";

interface CardOrganizationProps {
  organization: Organization;
  onClick?: () => void;
  className?: string;
}

const CardOrganization: React.FC<CardOrganizationProps> = ({
  organization,
  onClick,
  className = "",
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  // Destructure organization data
  const {
    id,
    org_image: image,
    orgnameth: name_th,
    orgnameen: name_en,
    org_nickname: nickname,
    description,
    org_type_name: type,
    views: view,
  } = organization;

  // Memoized values for performance
  const displayName = useMemo(() => {
    return nickname || name_en || name_th;
  }, [nickname, name_en, name_th]);

  const secondaryName = useMemo(() => {
    return nickname ? name_en : name_th;
  }, [nickname, name_en, name_th]);

  const formattedViews = useMemo(() => {
    const viewCount = Number(view) || 0;
    if (viewCount > 999) {
      return `${Math.floor(viewCount / 1000)}k`;
    }
    return viewCount.toLocaleString();
  }, [view]);

  // Handle click with optimization
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Handle image error
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPuC5hOC4oeC5iOC4oeC4-teC4o+C4ueC4m+C4oOC4suC4nTwvdGV4dD48L3N2Zz4=";
    },
    []
  );

  return (
    <motion.div
      className={combine(
        "group relative w-full backdrop-blur-sm rounded-2xl overflow-hidden",
        "h-full flex flex-col transition-all duration-500 cursor-pointer",
        "shadow-sm hover:shadow-xl",
        getValueForTheme(
          "bg-black/2 border border-white/15 hover:border-[#8bbda3]/50 shadow-[#8bbda3]/10",
          "bg-white border border-gray-200 hover:border-[#006C67]/30 shadow-gray-200/50"
        ),
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      layout
    >
      {/* Image Section */}
      <div className="aspect-[16/9] relative overflow-hidden group">
        {image ? (
          <div className="w-full h-full relative">
            <motion.img
              src={image}
              alt={displayName}
              className="w-full h-full object-cover object-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          </div>
        ) : (
          <div
            className={combine(
              "flex items-center justify-center h-full w-full",
              getValueForTheme(
                "text-white/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80",
                "text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200"
              )
            )}
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Type Tag */}
        {type && (
          <div className="absolute top-2 xs:top-1.5 sm:top-3 md:top-3 left-2.5 xs:left-1.5 sm:left-2 md:left-3">
            <div
              className={combine(
                "backdrop-blur-sm rounded-full shadow-sm flex items-center",
                "px-1 xs:px-1.5 sm:px-2 md:px-3 py-px xs:py-0.5 sm:py-1",
                getValueForTheme(
                  "bg-[#54CF90]/70  text-white  border border-[#54CF90]/30",
                  "bg-gradient-to-r from-[#006C67]/90 to-teal-600/90 text-white shadow-[#006C67]/20 border border-[#006C67]/30"
                )
              )}
            >
              <span className="bg-white/30 hidden xs:block w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-0.5 xs:mr-1 sm:mr-1.5" />
              <span className="text-[0.5rem] xs:text-3xs sm:text-2xs md:text-xs font-medium truncate max-w-[80px] xs:max-w-[100px] sm:max-w-full">
                {type}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 xs:p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and View Count */}
          <div className="flex justify-between items-start mb-1 xs:mb-1 sm:mb-1.5">
            <h3
              className={combine(
                "font-semibold line-clamp-1 transition-colors duration-300",
                "text-sm xs:text-2xs sm:text-base md:text-lg",
                getValueForTheme(
                  "text-white group-hover:text-[#54CF90]",
                  "text-gray-800 group-hover:text-[#006C67]"
                )
              )}
            >
              {displayName}
            </h3>

            {view >= 0 && (
              <span
                className={combine(
                  "flex items-center ml-1 xs:ml-1 sm:ml-1.5 md:ml-2",
                  "text-xs xs:text-3xs sm:text-2xs md:text-xs",
                  getValueForTheme("text-white/50", "text-gray-500")
                )}
              >
                <svg
                  className="w-2.5 xs:w-2 sm:w-2.5 md:w-3 h-2.5 xs:h-2 sm:h-2.5 md:h-3 mr-1 xs:mr-0.5 sm:mr-0.75 md:mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="hidden xs:inline">
                  {Number(view).toLocaleString()}
                </span>
                <span className="xs:hidden">{formattedViews}</span>
              </span>
            )}
          </div>

          {/* Secondary Name */}
          {secondaryName && secondaryName !== displayName && (
            <div
              className={combine(
                "line-clamp-1 mb-2 xs:mb-1 sm:mb-1.5",
                "text-xs xs:text-3xs sm:text-3xs md:text-2xs",
                getValueForTheme("text-white/60", "text-gray-500")
              )}
            >
              {secondaryName}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/organizations/${id}`} className="block">
          <motion.button
            className={combine(
              "w-full relative overflow-hidden rounded-lg transition-all duration-300",
              "group/btn flex justify-center items-center shadow-inner",
              "py-1.5 xs:py-1.5 sm:py-2 md:py-2.5",
              getValueForTheme(
                "text-white/90 bg-gradient-to-r from-[#006C67] via-[#54CF90]/70 to-[#54CF90]/50 hover:from-[#54CF90]/50 hover:to-[#54CF90]/50 hover:text-white border border-[#54CF90]/30 hover:border-[#54CF90]/40 shadow-white/5",
                "text-[#006C67]/90 bg-gradient-to-r from-[#006C67]/10 to-teal-600/10 hover:from-[#006C67]/20 hover:to-teal-600/20 hover:text-[#006C67] border border-[#006C67]/20 hover:border-[#006C67]/30 shadow-[#006C67]/5"
              )
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            <span className="relative z-10 flex items-center justify-center text-inherit font-medium tracking-wide text-xs xs:text-2xs sm:text-xs md:text-sm">
              รายละเอียด
              <motion.svg
                className={combine(
                  "w-3 xs:w-2.5 sm:w-3 md:w-4 h-3 xs:h-2.5 sm:h-3 md:h-4 ml-1.5 xs:ml-1 sm:ml-1.5 md:ml-2",
                  getValueForTheme(
                    "text-[#54CF90] group-hover/btn:text-white",
                    "text-[#006C67]/70 group-hover/btn:text-[#006C67]"
                  )
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </motion.svg>
            </span>

            {/* Hover effect overlay */}
            <motion.div
              className={combine(
                "absolute inset-0 opacity-0 group-hover/btn:opacity-100",
                getValueForTheme(
                  "bg-gradient-to-r from-[#54CF90]/20 to-[#54CF90]/20",
                  "bg-gradient-to-r from-[#006C67]/20 to-teal-500/20"
                )
              )}
              initial={{ scale: 0, borderRadius: "100%" }}
              whileHover={{
                scale: 1,
                borderRadius: "0.5rem",
                transition: { duration: 0.4, ease: "easeOut" },
              }}
            />
          </motion.button>
        </Link>
      </div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className={combine(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none",
          getValueForTheme(
            "bg-gradient-to-t from-[#54CF90]/10 to-transparent",
            "bg-gradient-to-t from-[#006C69]/10 to-transparent"
          )
        )}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Memoized component for performance
export default memo(CardOrganization, (prevProps, nextProps) => {
  return (
    prevProps.organization.id === nextProps.organization.id &&
    prevProps.organization.views === nextProps.organization.views
  );
});
