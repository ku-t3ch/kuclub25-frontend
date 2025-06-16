"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { Organization } from "../../types/organization";
import { useUpdateOrganizationViews } from "../../hooks/useOrganization";

interface CardOrganizationProps {
  organization: Organization;
  onClick?: () => void;
  className?: string;
  onViewsUpdate?: (id: string, newViewCount: number) => void;
}

const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPuC5hOC4oeC5iOC4oeC4_teC4o-C4ueC4m-C4oOC4suC4nTwvdGV4dD48L3N2Zz4=";

const ANIMATION_VARIANTS = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4 },
    tap: { scale: 0.98 },
  },
  image: {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  },
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  arrow: {
    initial: { x: 0 },
    hover: { x: 2 },
  },
  overlay: {
    initial: { scale: 0, borderRadius: "100%" },
    hover: { scale: 1, borderRadius: "0.5rem" },
  },
  glow: {
    initial: { opacity: 0 },
    hover: { opacity: 1 },
  },
} as const;

const THEME_CLASSES = {
  card: {
    light: "bg-white border border-gray-200 hover:border-[#006C67]/30 shadow-gray-200/50",
    dark: "bg-black/2 border border-white/15 hover:border-[#8bbda3]/50 shadow-[#8bbda3]/10",
  },
  title: {
    light: "text-gray-800 group-hover:text-[#006C67]",
    dark: "text-white group-hover:text-[#54CF90]",
  },
  views: {
    light: "text-gray-500",
    dark: "text-white/50",
  },
  secondaryName: {
    light: "text-gray-500",
    dark: "text-white/60",
  },
  typeTag: {
    light: "bg-gradient-to-r from-[#006C67]/95 to-teal-600/95 text-white shadow-[#006C67]/40 border border-[#006C67]/50",
    dark: "bg-[#54CF90]/85 text-white border border-[#54CF90]/50 shadow-black/30",
  },
  button: {
    light: "text-[#006C67]/90 bg-gradient-to-r from-[#006C67]/10 to-teal-600/10 hover:from-[#006C67]/20 hover:to-teal-600/20 hover:text-[#006C67] border border-[#006C67]/20 hover:border-[#006C67]/30 shadow-[#006C67]/5",
    dark: "text-white/90 bg-gradient-to-r from-[#006C67] via-[#54CF90]/70 to-[#54CF90]/50 hover:from-[#54CF90]/50 hover:to-[#54CF90]/50 hover:text-white border border-[#54CF90]/30 hover:border-[#54CF90]/40 shadow-white/5",
  },
  buttonOverlay: {
    light: "bg-gradient-to-r from-[#006C67]/20 to-teal-500/20",
    dark: "bg-gradient-to-r from-[#54CF90]/20 to-[#54CF90]/20",
  },
  glow: {
    light: "bg-gradient-to-t from-[#006C69]/10 to-transparent",
    dark: "bg-gradient-to-t from-[#54CF90]/10 to-transparent",
  },
} as const;

const PlaceholderIcon = memo(() => (
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
));
PlaceholderIcon.displayName = "PlaceholderIcon";

const ViewIcon = memo(() => (
  <>
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
  </>
));
ViewIcon.displayName = "ViewIcon";

const ArrowIcon = memo(() => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M14 5l7 7m0 0l-7 7m7-7H3"
  />
));
ArrowIcon.displayName = "ArrowIcon";

const CardOrganization: React.FC<CardOrganizationProps> = memo(({
  organization,
  className = "",
  onViewsUpdate,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const router = useRouter();
  const { updateViews } = useUpdateOrganizationViews();
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    id,
    org_image: image,
    orgnameth: name_th,
    orgnameen: name_en,
    org_nickname: nickname,
    org_type_name: type,
    views: view,
  } = organization;

  const computedValues = useMemo(() => {
    const displayName = nickname || name_en || name_th;
    const secondaryName = nickname ? name_en : name_th;
    const viewCount = Number(view) || 0;
    const formattedViews = viewCount > 999 ? `${Math.floor(viewCount / 1000)}k` : viewCount.toLocaleString();
    const isSquareImage = image && (
      image.includes("400x400") ||
      image.includes("200x200") ||
      (image.match(/\d+x\d+/) && image.match(/(\d+)x\1/))
    );

    return {
      displayName,
      secondaryName,
      formattedViews,
      isSquareImage: Boolean(isSquareImage),
    };
  }, [nickname, name_en, name_th, view, image]);

  const themeClasses = useMemo(() => ({
    card: getValueForTheme(THEME_CLASSES.card.dark, THEME_CLASSES.card.light),
    title: getValueForTheme(THEME_CLASSES.title.dark, THEME_CLASSES.title.light),
    views: getValueForTheme(THEME_CLASSES.views.dark, THEME_CLASSES.views.light),
    secondaryName: getValueForTheme(THEME_CLASSES.secondaryName.dark, THEME_CLASSES.secondaryName.light),
    typeTag: getValueForTheme(THEME_CLASSES.typeTag.dark, THEME_CLASSES.typeTag.light),
    button: getValueForTheme(THEME_CLASSES.button.dark, THEME_CLASSES.button.light),
    buttonOverlay: getValueForTheme(THEME_CLASSES.buttonOverlay.dark, THEME_CLASSES.buttonOverlay.light),
    glow: getValueForTheme(THEME_CLASSES.glow.dark, THEME_CLASSES.glow.light),
    placeholder: getValueForTheme(
      "text-white/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80",
      "text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200"
    ),
  }), [getValueForTheme]);

  const imageStyles = useMemo(() => ({
    filter: "contrast(1.05) saturate(1.05) brightness(1.02)",
    imageRendering: "high-quality" as const,
    objectPosition: "center center" as const,
    objectFit: (computedValues.isSquareImage ? "contain" : "cover") as const,
    ...(computedValues.isSquareImage && { padding: "8px" }),
  }), [computedValues.isSquareImage]);

  const backgroundBlurStyle = useMemo(() => image ? ({
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: computedValues.isSquareImage
      ? "blur(30px) brightness(0.3) saturate(1.8) contrast(1.3)"
      : "blur(25px) brightness(0.4) saturate(1.5) contrast(1.2)",
    transform: "scale(1.15)",
    opacity: computedValues.isSquareImage ? 0.9 : 0.8,
  }) : {}, [image, computedValues.isSquareImage]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = FALLBACK_IMAGE;
  }, []);

  const handleCardClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isNavigating) return; // ป้องกันการคลิกซ้ำ
    
    setIsNavigating(true);

    try {
      // อัพเดท view count ก่อนไปหน้า detail
      const newViewCount = await updateViews(id);
      
      if (newViewCount !== null && onViewsUpdate) {
        onViewsUpdate(id, newViewCount);
      }

      router.push(`/organizations/${id}`);
    } catch (error) {
      console.warn("ไม่สามารถอัพเดทจำนวนการดูได้:", error);
      router.push(`/organizations/${id}`);
    } finally {
      // Reset state หลังจาก navigate เสร็จ
      setTimeout(() => setIsNavigating(false), 1000);
    }
  }, [id, router, updateViews, onViewsUpdate, isNavigating]);

  return (
    <motion.div
      className={combine(
        "group relative w-full backdrop-blur-sm rounded-2xl overflow-hidden",
        "h-full flex flex-col transition-all duration-500 cursor-pointer",
        "shadow-sm hover:shadow-xl",
        themeClasses.card,
        className
      )}
      {...ANIMATION_VARIANTS.card}
      onClick={handleCardClick}
      layout
    >
      <div className="aspect-[16/9] relative overflow-hidden group">
        {image ? (
          <div className="w-full h-full relative">
            <motion.img
              src={image}
              alt={computedValues.displayName}
              className={combine(
                "w-full h-full transition-all duration-400 object-center",
                computedValues.isSquareImage ? "object-contain" : "object-cover",
                "[image-rendering:crisp-edges] [image-rendering:-webkit-optimize-contrast]",
                "backdrop-blur-sm",
                computedValues.isSquareImage && "drop-shadow-sm"
              )}
              style={imageStyles}
              {...(computedValues.isSquareImage 
                ? { ...ANIMATION_VARIANTS.image, whileHover: { scale: 1.02 } }
                : ANIMATION_VARIANTS.image
              )}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onError={handleImageError}
              loading="lazy"
            />

            <div className="absolute inset-0 -z-10" style={backgroundBlurStyle} />

            <div className={combine(
              "absolute inset-0 transition-opacity duration-300",
              computedValues.isSquareImage
                ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40"
                : "bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-50 group-hover:opacity-30"
            )} />

            {computedValues.isSquareImage && (
              <div
                className={combine(
                  "absolute inset-3 rounded-xl border-2 opacity-0 transition-all duration-300",
                  "group-hover:opacity-30 group-hover:inset-2",
                  getValueForTheme(
                    "border-[#54CF90]/40 shadow-[#54CF90]/20",
                    "border-[#006C67]/30 shadow-[#006C67]/10"
                  )
                )}
                style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)" }}
              />
            )}
          </div>
        ) : (
          <div className={combine("flex items-center justify-center h-full w-full", themeClasses.placeholder)}>
            <PlaceholderIcon />
          </div>
        )}

        {type && (
          <div className="absolute top-2 xs:top-1.5 sm:top-3 md:top-3 left-2.5 xs:left-1.5 sm:left-2 md:left-3 z-20">
            <div className={combine(
              "backdrop-blur-md rounded-full shadow-lg flex items-center transition-transform duration-300",
              "px-1 xs:px-1.5 sm:px-2 md:px-3 py-px xs:py-0.5 sm:py-1",
              "group-hover:scale-105",
              themeClasses.typeTag
            )}>
              <span className="bg-white/50 hidden xs:block w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-0.5 xs:mr-1 sm:mr-1.5 animate-pulse" />
              <span className="text-[0.5rem] xs:text-3xs sm:text-2xs md:text-xs font-bold truncate max-w-[80px] xs:max-w-[100px] sm:max-w-full">
                {type}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 xs:p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1 xs:mb-1 sm:mb-1.5">
            <h3 className={combine(
              "font-semibold line-clamp-1 transition-colors duration-300",
              "text-sm xs:text-2xs sm:text-base md:text-lg",
              themeClasses.title
            )}>
              {computedValues.displayName}
            </h3>

            {view >= 0 && (
              <span className={combine(
                "flex items-center ml-1 xs:ml-1 sm:ml-1.5 md:ml-2",
                "text-xs xs:text-3xs sm:text-2xs md:text-xs",
                themeClasses.views
              )}>
                <svg
                  className="w-2.5 xs:w-2 sm:w-2.5 md:w-3 h-2.5 xs:h-2 sm:h-2.5 md:h-3 mr-1 xs:mr-0.5 sm:mr-0.75 md:mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <ViewIcon />
                </svg>
                <span className="hidden xs:inline">{Number(view).toLocaleString()}</span>
                <span className="xs:hidden">{computedValues.formattedViews}</span>
              </span>
            )}
          </div>

          {computedValues.secondaryName && computedValues.secondaryName !== computedValues.displayName && (
            <div className={combine(
              "line-clamp-1 mb-2 xs:mb-1 sm:mb-1.5",
              "text-xs xs:text-3xs sm:text-3xs md:text-2xs",
              themeClasses.secondaryName
            )}>
              {computedValues.secondaryName}
            </div>
          )}
        </div>

        <motion.button
          className={combine(
            "w-full relative overflow-hidden rounded-lg transition-all duration-300",
            "group/btn flex justify-center items-center shadow-inner",
            "py-1.5 xs:py-1.5 sm:py-2 md:py-2.5",
            themeClasses.button
          )}
          {...ANIMATION_VARIANTS.button}
          type="button"
        >
          <span className="relative z-10 flex items-center justify-center text-inherit font-medium tracking-wide text-xs xs:text-2xs sm:text-xs md:text-sm">
            รายละเอียด
            <motion.svg
              className="w-3 xs:w-2.5 sm:w-3 md:w-4 h-3 xs:h-2.5 sm:h-3 md:h-4 ml-1.5 xs:ml-1 sm:ml-1.5 md:ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              {...ANIMATION_VARIANTS.arrow}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ArrowIcon />
            </motion.svg>
          </span>

          <motion.div
            className={combine("absolute inset-0 opacity-0 group-hover/btn:opacity-100", themeClasses.buttonOverlay)}
            {...ANIMATION_VARIANTS.overlay}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.button>
      </div>

      <motion.div
        className={combine(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none",
          themeClasses.glow
        )}
        {...ANIMATION_VARIANTS.glow}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

CardOrganization.displayName = "CardOrganization";

export default memo(CardOrganization, (prevProps, nextProps) => {
  return (
    prevProps.organization.id === nextProps.organization.id &&
    prevProps.organization.views === nextProps.organization.views &&
    prevProps.className === nextProps.className
  );
});