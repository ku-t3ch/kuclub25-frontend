"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

interface OrganizationAboutSectionProps {
  organizationInfo: any;
}

// Constants outside component to prevent recreation
const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.1 }
} as const;

// Memoized SVG icon component
const InfoIcon = React.memo(() => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
));
InfoIcon.displayName = "InfoIcon";

// Optimized category item component
const CategoryItem = React.memo<{
  title: string;
  value: string;
  themeStyles: any;
  combine: (...classes: string[]) => string;
  getValueForTheme: (dark: string, light: string) => string;
}>(({ title, value, themeStyles, combine, getValueForTheme }) => (
  <div
    className={combine(
      "p-4 rounded-xl transition-colors duration-200",
      getValueForTheme("bg-white/5 hover:bg-white/10", "bg-gray-50 hover:bg-gray-100")
    )}
  >
    <h4
      className={combine(
        "text-sm font-medium mb-2",
        themeStyles.secondaryText
      )}
    >
      {title}
    </h4>
    <p
      className={combine(
        "text-base font-medium",
        themeStyles.primaryText
      )}
    >
      {value}
    </p>
  </div>
));
CategoryItem.displayName = "CategoryItem";

const OrganizationAboutSection: React.FC<OrganizationAboutSectionProps> = ({
  organizationInfo,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  // Memoized theme values for better performance
  const themeStyles = useMemo(() => ({
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-blue-900/5",
      "bg-white border-gray-200 shadow-gray-200/20"
    ),
    primaryText: getValueForTheme("text-white", "text-gray-800"),
    secondaryText: getValueForTheme("text-white/70", "text-gray-600"),
    accentBlue: getValueForTheme("text-blue-300", "text-primary"),
    titleGradient: getValueForTheme(
      "bg-gradient-to-r from-white to-blue-100",
      "bg-gradient-to-r from-gray-800 to-primary"
    ),
    detailsCard: getValueForTheme(
      "bg-white/5 border-blue-400/50",
      "bg-gray-50 border-primary/50"
    )
  }), [getValueForTheme]);

  // Memoized organization categories
  const organizationCategories = useMemo(() => {
    const categories = [];
    
    if (organizationInfo.orgType) {
      categories.push({
        key: 'orgType',
        title: 'ประเภทองค์กร',
        value: organizationInfo.orgType
      });
    }
    
    if (organizationInfo.campus) {
      categories.push({
        key: 'campus',
        title: 'วิทยาเขต',
        value: organizationInfo.campus
      });
    }
    
    return categories;
  }, [organizationInfo.orgType, organizationInfo.campus]);

  // Memoized check for details section
  const hasDetails = useMemo(() => 
    organizationInfo.details && 
    organizationInfo.details !== "ไม่มีรายละเอียดเพิ่มเติม",
    [organizationInfo.details]
  );

  // Memoized description content
  const descriptionContent = useMemo(() => 
    organizationInfo.description || "องค์กรนี้ไม่มีคำอธิบายเพิ่มเติมในขณะนี้",
    [organizationInfo.description]
  );

  return (
    <motion.div
      {...ANIMATION_CONFIG}
      className={combine(
        "backdrop-blur-lg rounded-3xl p-8 shadow-xl overflow-hidden relative",
        themeStyles.cardBg
      )}
    >
      {/* Header */}
      <h2
        className={combine(
          "text-2xl md:text-3xl font-bold bg-clip-text text-transparent inline-flex items-center gap-3 mb-6",
          themeStyles.titleGradient
        )}
      >
        <span className={themeStyles.accentBlue}>
          <InfoIcon />
        </span>
        เกี่ยวกับเรา
      </h2>

      <div className="space-y-6">
        {/* Organization Description */}
        <section>
          <h3
            className={combine(
              "text-lg font-medium mb-3",
              themeStyles.primaryText
            )}
          >
            คำอธิบายองค์กร
          </h3>
          <p
            className={combine(
              "text-base leading-relaxed",
              themeStyles.secondaryText
            )}
          >
            {descriptionContent}
          </p>
        </section>

        {/* Organization Details */}
        {hasDetails && (
          <section>
            <h3
              className={combine(
                "text-lg font-medium mb-3",
                themeStyles.primaryText
              )}
            >
              รายละเอียดเพิ่มเติม
            </h3>
            <div
              className={combine(
                "p-4 rounded-xl border transition-colors duration-200",
                themeStyles.detailsCard
              )}
            >
              <p
                className={combine(
                  "text-base leading-relaxed whitespace-pre-line",
                  themeStyles.secondaryText
                )}
              >
                {organizationInfo.details}
              </p>
            </div>
          </section>
        )}

        {/* Organization Categories */}
        {organizationCategories.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {organizationCategories.map((category) => (
                <CategoryItem
                  key={category.key}
                  title={category.title}
                  value={category.value}
                  themeStyles={themeStyles}
                  combine={combine}
                  getValueForTheme={getValueForTheme}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(OrganizationAboutSection);