"use client";

import React, { useMemo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

interface OrganizationHeroSectionProps {
  organization: any;
  organizationInfo: any;
  scrollY: number;
  onBack: () => void;
}

// Move constants outside component to prevent recreation
const ANIMATION_VARIANTS = {
  backButton: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    hover: { x: -5 },
    tap: { scale: 0.95 }
  },
  imageContainer: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  title: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.1 }
  },
  alternativeName: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  tag: {
    hover: { y: -2 }
  }
} as const;

// Memoized image error handler
const createImageErrorHandler = (onError: () => void) => {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const placeholder = target.nextElementSibling as HTMLElement;
    if (placeholder) placeholder.style.display = "flex";
    onError();
  };
};

// Memoized SVG placeholder component
const ImagePlaceholder = React.memo(() => (
  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd"
    />
  </svg>
));
ImagePlaceholder.displayName = "ImagePlaceholder";

const OrganizationHeroSection: React.FC<OrganizationHeroSectionProps> = ({
  organization,
  organizationInfo,
  scrollY,
  onBack,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const [imageError, setImageError] = useState(false);

  // Memoized theme values to prevent recalculation
  const themeStyles = useMemo(() => ({
    backgroundBlob1: getValueForTheme("bg-blue-600/10", "bg-[#006C67]/10"),
    backgroundBlob2: getValueForTheme("bg-purple-600/10", "bg-[#006C67]/15"),
    backButton: getValueForTheme(
      "text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10",
      "text-[#006C67]/70 hover:text-[#006C67] bg-white border border-[#006C67]/20 hover:bg-[#006C67]/5"
    ),
    imageContainer: getValueForTheme(
      "shadow-blue-900/20 border border-white/10 group-hover:border-white/20",
      "shadow-[#006C67]/20 border border-[#006C67]/20 group-hover:border-[#006C67]/40"
    ),
    placeholder: getValueForTheme(
      "bg-gray-700 text-gray-400",
      "bg-[#006C67]/10 text-[#006C67]/50"
    ),
    titleGradient: getValueForTheme(
      "bg-gradient-to-r from-white via-blue-100 to-purple-100",
      "bg-gradient-to-r from-[#006C67] via-[#006C67]/90 to-[#006C67]/80"
    ),
    alternativeText: getValueForTheme("text-white/70", "text-[#006C67]/70"),
    orgTypeTag: getValueForTheme(
      "bg-blue-500/30 border border-blue-500/40",
      "bg-[#006C67]/20 border border-[#006C67]/30"
    ),
    campusTag: getValueForTheme(
      "bg-purple-500/30 border border-purple-500/40",
      "bg-[#006C67]/30 border border-[#006C67]/40"
    )
  }), [getValueForTheme]);

  // Memoized parallax transforms for better performance
  const parallaxStyles = useMemo(() => ({
    blob1: { transform: `translateY(${scrollY * 0.1}px)` },
    blob2: { transform: `translateY(${scrollY * 0.05}px)` }
  }), [scrollY]);

  // Memoized error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageErrorHandler = useMemo(
    () => createImageErrorHandler(handleImageError),
    [handleImageError]
  );

  // Memoized organization tags
  const organizationTags = useMemo(() => {
    const tags = [];
    
    if (organizationInfo.orgType) {
      tags.push({
        key: 'orgType',
        text: organizationInfo.orgType,
        className: themeStyles.orgTypeTag
      });
    }
    
    if (organizationInfo.campus) {
      tags.push({
        key: 'campus',
        text: organizationInfo.campus,
        className: themeStyles.campusTag
      });
    }
    
    return tags;
  }, [organizationInfo.orgType, organizationInfo.campus, themeStyles.orgTypeTag, themeStyles.campusTag]);

  // Memoized alternative names with proper transitions
  const alternativeNames = useMemo(() => {
    return organizationInfo.alternativeNames.map((name: any, index: number) => ({
      ...name,
      transition: {
        duration: 0.5,
        delay: 0.15 + index * 0.05
      }
    }));
  }, [organizationInfo.alternativeNames]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background decorations with optimized transforms */}
      <div
        className={combine(
          "absolute -top-16 -right-16 w-60 xs:w-72 sm:w-96 h-60 xs:h-72 sm:h-96 rounded-full blur-3xl opacity-70",
          themeStyles.backgroundBlob1
        )}
        style={parallaxStyles.blob1}
      />
      <div
        className={combine(
          "absolute top-24 -left-16 w-48 xs:w-60 sm:w-72 h-48 xs:h-60 sm:h-72 rounded-full blur-3xl opacity-70",
          themeStyles.backgroundBlob2
        )}
        style={parallaxStyles.blob2}
      />

      <div className="container mx-auto px-4 md:px-6 pt-8 pb-12 relative z-10">
        {/* Back Button */}
        <motion.button
          variants={ANIMATION_VARIANTS.backButton}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={onBack}
          className={combine(
            "mb-8 px-4 py-2 flex items-center rounded-full shadow-lg group transition-all",
            themeStyles.backButton
          )}
        >
          <span className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span>ย้อนกลับ</span>
        </motion.button>

        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
          {/* Organization Image */}
          <motion.div
            variants={ANIMATION_VARIANTS.imageContainer}
            initial="initial"
            animate="animate"
            className="relative z-10 group"
          >
            <div
              className={combine(
                "relative w-48 sm:w-52 md:w-72 h-48 sm:h-52 md:h-72 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500",
                themeStyles.imageContainer
              )}
            >
              {organization.org_image && !imageError ? (
                <img
                  src={organization.org_image}
                  alt={organizationInfo.displayName}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={imageErrorHandler}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}

              {/* Fallback placeholder */}
              <div
                className={combine(
                  "w-full h-full flex items-center justify-center",
                  themeStyles.placeholder,
                  (!organization.org_image || imageError) ? "flex" : "hidden"
                )}
              >
                <ImagePlaceholder />
              </div>

              {/* Organization tags */}
              {organizationTags.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  {organizationTags.map((tag) => (
                    <motion.div
                      key={tag.key}
                      variants={ANIMATION_VARIANTS.tag}
                      whileHover="hover"
                      className={combine(
                        "backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 shadow-lg",
                        tag.className
                      )}
                    >
                      {tag.text}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Organization Info */}
          <div className="flex-1 max-w-3xl justify-center items-center">
            <motion.h1
              variants={ANIMATION_VARIANTS.title}
              initial="initial"
              animate="animate"
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 text-center lg:text-left"
            >
              <span
                className={combine(
                  "bg-clip-text text-transparent inline-block",
                  themeStyles.titleGradient
                )}
              >
                {organizationInfo.displayName}
              </span>
            </motion.h1>

            {/* Alternative names */}
            {alternativeNames.length > 0 && (
              <div className="space-y-1 mb-6">
                {alternativeNames.map((name, index) => (
                  <motion.h2
                    key={`${name.text}-${index}`}
                    variants={ANIMATION_VARIANTS.alternativeName}
                    initial="initial"
                    animate="animate"
                    transition={name.transition}
                    className={combine(
                      "text-base sm:text-xl font-light text-center lg:text-left",
                      themeStyles.alternativeText
                    )}
                  >
                    {name.text}
                  </motion.h2>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrganizationHeroSection);