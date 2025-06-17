import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  isImageCropped?: boolean; // เพิ่ม flag สำหรับรูปที่ crop แล้ว
  showQualityBadge?: boolean; // แสดง badge คุณภาพ
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  fallback,
  isImageCropped = false,
  showQualityBadge = false,
  onError,
  onLoad
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบว่าเป็นรูป 400x400 หรือไม่
  const is400x400Image = useMemo(() => {
    return src.includes('400x400') || 
           src.includes('_cropped_400x400') || 
           isImageCropped;
  }, [src, isImageCropped]);

  // สร้าง optimized src สำหรับรูป 400x400
  const optimizedSrc = useMemo(() => {
    if (is400x400Image && !src.includes('_cropped_400x400')) {
      // เพิ่ม _cropped_400x400 ในชื่อไฟล์
      const extension = src.split('.').pop();
      const baseName = src.replace(`.${extension}`, '');
      return `${baseName}_cropped_400x400.${extension}?quality=90`;
    }
    return src;
  }, [src, is400x400Image]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);
    
    if (onError) {
      onError(e);
    } else {
      const target = e.target as HTMLImageElement;
      
      // ใช้ fallback หรือ placeholder
      if (fallback) {
        target.src = fallback;
      } else {
        // สร้าง SVG placeholder สำหรับรูป 400x400
        target.src = `data:image/svg+xml;base64,${btoa(`
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="#f3f4f6"/>
            <rect x="50" y="50" width="300" height="300" fill="#e5e7eb" rx="20"/>
            <circle cx="200" cy="150" r="30" fill="#d1d5db"/>
            <rect x="120" y="220" width="160" height="80" fill="#d1d5db" rx="10"/>
            <text x="200" y="350" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">
              ${is400x400Image ? 'รูปภาพ 400×400' : 'ไม่มีรูปภาพ'}
            </text>
          </svg>
        `)}`;
      }
    }
  }, [onError, fallback, is400x400Image]);

  // สไตล์สำหรับรูป 400x400
  const imageStyles = useMemo(() => {
    const baseStyles = {
      filter: "contrast(1.1) saturate(1.1) brightness(1.02)",
      imageRendering: "high-quality" as const,
      objectPosition: "center center" as const,
    };

    // ใช้ contain สำหรับทุกรูปเพื่อแสดงรูปเต็มไม่ครอบตัด
    return {
      ...baseStyles,
      objectFit: "contain" as const,
      filter: is400x400Image 
        ? "contrast(1.15) saturate(1.15) brightness(1.05)" 
        : "contrast(1.1) saturate(1.1) brightness(1.02)",
    };
  }, [is400x400Image]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm">
              {is400x400Image ? 'กำลังโหลดรูป 400×400...' : 'กำลังโหลด...'}
            </div>
          </div>
        </div>
      )}

      {/* Background blur layer - ใช้แบบเดียวกันทุกรูป */}
      {optimizedSrc && !hasError && imageLoaded && (
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${optimizedSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(20px) brightness(0.3) saturate(1.2)',
            transform: 'scale(1.1)',
            opacity: 0.8,
          }}
        />
      )}
      
      {/* Main image */}
      <motion.img
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full transition-all duration-400 ${className}`}
        style={imageStyles}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : 0.95
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Quality badge สำหรับรูป 400x400 */}
      {showQualityBadge && is400x400Image && imageLoaded && !hasError && (
        <motion.div
          className="absolute top-2 right-2 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-green-400/50 shadow-lg">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">400×400</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Information overlay สำหรับรูป 400x400 */}
      {is400x400Image && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <div className="text-white/80 text-xs text-center">
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>รูปภาพคุณภาพสูง 400×400 พิกเซล</span>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
};

export default OptimizedImage;