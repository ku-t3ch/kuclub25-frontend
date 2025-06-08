import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";

interface ViewToggleProps {
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const { getValueForTheme, combine } = useThemeUtils();

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className={combine(
        "flex p-1 rounded-md shadow-sm self-start sm:self-auto",
        getValueForTheme(
          "bg-white/5 border border-white/10",
          "bg-white border border-[#006C67]/20"
        )
      )}
    >
      <button
        className={combine(
          "px-3 py-1 rounded-md text-xs transition-all",
          viewMode === "calendar"
            ? getValueForTheme(
                "bg-white/10 text-white",
                "bg-[#006C67] text-white shadow-sm"
              )
            : getValueForTheme("text-white/60", "text-[#006C67]/60")
        )}
        onClick={() => setViewMode("calendar")}
      >
        ปฏิทิน
      </button>
      <button
        className={combine(
          "px-3 py-1 rounded-md text-xs transition-all",
          viewMode === "list"
            ? getValueForTheme(
                "bg-white/10 text-white",
                "bg-[#006C67] text-white shadow-sm"
              )
            : getValueForTheme("text-white/60", "text-[#006C67]/60")
        )}
        onClick={() => setViewMode("list")}
      >
        รายการ
      </button>
    </motion.div>
  );
};

export default ViewToggle;