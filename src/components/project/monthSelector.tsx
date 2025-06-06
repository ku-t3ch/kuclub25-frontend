import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";

const THAI_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

interface MonthSelectorProps {
  currentDate: Date;
  selectedMonth: number;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  currentDate, 
  selectedMonth, 
  goToPreviousMonth, 
  goToNextMonth 
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={combine(
        "flex justify-between items-center mb-4 backdrop-blur-sm rounded-lg py-2 px-3 shadow-sm",
        getValueForTheme(
          "bg-white/5 border border-white/10",
          "bg-white border border-gray-100"
        )
      )}
    >
      <button
        onClick={goToPreviousMonth}
        className={combine(
          "p-1.5 rounded-full transition-colors",
          getValueForTheme(
            "text-white/60 hover:bg-white/5 hover:text-white",
            "text-gray-400 hover:bg-gray-50 hover:text-primary"
          )
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <h2
        className={getValueForTheme(
          "text-base sm:text-lg font-light text-white",
          "text-base sm:text-lg font-light text-gray-700"
        )}
      >
        {THAI_MONTHS_FULL[selectedMonth]}{" "}
        {currentDate.getFullYear() + 543}
      </h2>

      <button
        onClick={goToNextMonth}
        className={combine(
          "p-1.5 rounded-full transition-colors",
          getValueForTheme(
            "text-white/60 hover:bg-white/5 hover:text-white",
            "text-gray-400 hover:bg-gray-50 hover:text-primary"
          )
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default MonthSelector;