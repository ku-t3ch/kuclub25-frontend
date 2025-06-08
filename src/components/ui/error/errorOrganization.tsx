"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  error: string;
  onClearError: () => void;
  themeClasses: any;
  getValueForTheme: (darkValue: string, lightValue: string) => string;
}

const ErrorState = memo(({
  error,
  onClearError,
  themeClasses,
  getValueForTheme
}: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={themeClasses.errorContainer}
  >
    <div className="flex items-center justify-between">
      <p>{error}</p>
      <button
        onClick={onClearError}
        className={getValueForTheme("text-red-400 hover:text-red-300", "text-red-600 hover:text-red-500")}
      >
        ✕
      </button>
    </div>
  </motion.div>
));

ErrorState.displayName = "ErrorState";

export default ErrorState;