"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  themeClasses: any;
  combine: (...classes: string[]) => string;
  getValueForTheme: (darkValue: string, lightValue: string) => string;
  onClearFilters: () => void;
}

const EmptyState = memo(({
  themeClasses,
  combine,
  getValueForTheme,
  onClearFilters
}: EmptyStateProps) => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className={themeClasses.emptyStateContainer}>
      <svg className={combine("w-12 h-12", getValueForTheme("text-gray-400", "text-gray-400"))} 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className={themeClasses.emptyStateTitle}>
      ไม่พบชมรมที่ตรงกับเงื่อนไข
    </h3>
    <p className={themeClasses.emptyStateText}>
      ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรองใหม่
    </p>
    <motion.button
      onClick={onClearFilters}
      className={themeClasses.clearButton}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      ล้างตัวกรอง
    </motion.button>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

export default EmptyState;