"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

interface LoadingSkeletonProps {
  viewMode: "grid" | "list";
  count?: number;
}

const LoadingSkeleton = memo<LoadingSkeletonProps>(({ 
  viewMode, 
  count = 8
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  // Memoized theme classes
  const themeClasses = useMemo(() => ({
    // Card background and border
    card: combine(
      "relative overflow-hidden rounded-xl border shadow-sm",
      getValueForTheme(
        "bg-white/5 border-white/10 backdrop-blur-sm",
        "bg-white border-gray-200"
      )
    ),
    
    // Skeleton elements
    skeleton: {
      base: combine(
        "rounded animate-pulse",
        getValueForTheme(
          "bg-white/10",
          "bg-gray-200"
        )
      ),
      image: combine(
        "rounded-lg animate-pulse",
        getValueForTheme(
          "bg-white/15",
          "bg-gray-300"
        )
      ),
      text: combine(
        "rounded animate-pulse",
        getValueForTheme(
          "bg-white/8",
          "bg-gray-200"
        )
      ),
      tag: combine(
        "rounded-full animate-pulse",
        getValueForTheme(
          "bg-white/12",
          "bg-gray-250"
        )
      ),
      button: combine(
        "rounded-lg animate-pulse",
        getValueForTheme(
          "bg-white/15",
          "bg-gray-300"
        )
      ),
    },
    
    // Shimmer effect
    shimmer: combine(
      "absolute inset-0 -translate-x-full bg-gradient-to-r",
      getValueForTheme(
        "from-transparent via-white/10 to-transparent",
        "from-transparent via-gray-100 to-transparent"
      )
    ),
  }), [getValueForTheme, combine]);

  // Grid classes based on view mode
  const gridClasses = viewMode === "grid" 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
    : "grid-cols-1";

  // Individual skeleton item height based on view mode
  const skeletonHeight = viewMode === "grid" ? "h-80" : "h-32";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      },
    },
  };

  // Shimmer animation
  const shimmerVariants = {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 1.8,
          ease: "easeInOut",
        },
      },
    },
  };

  // Memoized skeleton element component
  const SkeletonElement = memo<{ 
    className?: string; 
    style?: React.CSSProperties;
    variant?: 'base' | 'image' | 'text' | 'tag' | 'button';
  }>(({ className = "", style, variant = 'base' }) => (
    <div 
      className={combine(themeClasses.skeleton[variant], className)}
      style={style}
    />
  ));
  SkeletonElement.displayName = "SkeletonElement";

  // Grid skeleton content component
  const GridSkeletonContent = memo(() => (
    <div className="p-4 xs:p-5 h-full flex flex-col">
      {/* Image placeholder */}
      <SkeletonElement 
        variant="image"
        className="w-full h-40 xs:h-44 mb-4" 
      />
      
      {/* Title placeholder */}
      <SkeletonElement 
        variant="text"
        className="h-4 xs:h-5 mb-2" 
        style={{ width: '80%' }} 
      />
      
      {/* Subtitle placeholder */}
      <SkeletonElement 
        variant="text"
        className="h-3 xs:h-4 mb-3" 
        style={{ width: '60%' }} 
      />
      
      {/* Description placeholders */}
      <div className="space-y-2 xs:space-y-3 flex-1">
        <SkeletonElement variant="text" className="h-3" />
        <SkeletonElement 
          variant="text"
          className="h-3" 
          style={{ width: '90%' }} 
        />
        <SkeletonElement 
          variant="text"
          className="h-3" 
          style={{ width: '75%' }} 
        />
      </div>
      
      {/* Tags placeholder */}
      <div className="flex gap-2 mb-4 mt-3">
        <SkeletonElement variant="tag" className="h-6 xs:h-7 w-16 xs:w-20" />
        <SkeletonElement variant="tag" className="h-6 xs:h-7 w-20 xs:w-24" />
        <SkeletonElement variant="tag" className="h-6 xs:h-7 w-14 xs:w-16" />
      </div>
      
      {/* Button placeholder */}
      <SkeletonElement variant="button" className="h-8 xs:h-10" />
    </div>
  ));
  GridSkeletonContent.displayName = "GridSkeletonContent";

  // List skeleton content component
  const ListSkeletonContent = memo(() => (
    <div className="p-4 xs:p-5 h-full flex">
      {/* Image placeholder */}
      <SkeletonElement 
        variant="image"
        className="w-20 xs:w-24 h-20 xs:h-24 mr-4 flex-shrink-0" 
      />
      
      <div className="flex-1 min-w-0">
        {/* Title placeholder */}
        <SkeletonElement 
          variant="text"
          className="h-4 xs:h-5 mb-2" 
          style={{ width: '70%' }} 
        />
        
        {/* Subtitle placeholder */}
        <SkeletonElement 
          variant="text"
          className="h-3 xs:h-4 mb-2" 
          style={{ width: '50%' }} 
        />
        
        {/* Description placeholders */}
        <div className="space-y-1 xs:space-y-2 mb-3">
          <SkeletonElement 
            variant="text"
            className="h-3" 
            style={{ width: '90%' }} 
          />
          <SkeletonElement 
            variant="text"
            className="h-3" 
            style={{ width: '75%' }} 
          />
        </div>
        
        {/* Tags placeholder - horizontal layout for list view */}
        <div className="flex gap-1 xs:gap-2">
          <SkeletonElement variant="tag" className="h-5 xs:h-6 w-12 xs:w-16" />
          <SkeletonElement variant="tag" className="h-5 xs:h-6 w-16 xs:w-20" />
        </div>
      </div>
    </div>
  ));
  ListSkeletonContent.displayName = "ListSkeletonContent";

  // Memoized skeleton items
  const skeletonItems = useMemo(() => 
    Array.from({ length: count }, (_, i) => i), 
    [count]
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={combine("grid gap-4 sm:gap-6", gridClasses)}
    >
      {skeletonItems.map((i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className={combine(skeletonHeight, themeClasses.card)}
        >
          {/* Enhanced shimmer effect */}
          <motion.div 
            variants={shimmerVariants}
            animate="animate"
            className={themeClasses.shimmer}
            style={{
              animationDelay: `${i * 0.1}s`, // Stagger shimmer animations
            }}
          />
          
          {viewMode === "grid" ? (
            <GridSkeletonContent />
          ) : (
            <ListSkeletonContent />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;