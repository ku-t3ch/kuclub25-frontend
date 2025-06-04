"use client";

import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeUtils } from '../../hooks/useThemeUtils';
import { motion, AnimatePresence } from 'framer-motion';

export const ApiStatus: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuthContext();
  const { combine, getValueForTheme } = useThemeUtils();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 right-4 z-40"
      >
        <div className={combine(
          "px-3 py-2 rounded-lg shadow-lg",
          getValueForTheme(
            "bg-yellow-500/20 border border-yellow-500/30",
            "bg-yellow-50 border border-yellow-200"
          )
        )}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <span className={combine(
              "text-xs font-medium",
              getValueForTheme("text-yellow-400", "text-yellow-600")
            )}>
              Connecting...
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-20 right-4 z-40"
        >
          <div className={combine(
            "px-3 py-2 rounded-lg shadow-lg",
            getValueForTheme(
              "bg-green-500/20 border border-green-500/30",
              "bg-green-50 border border-green-200"
            )
          )}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={combine(
                "text-xs font-medium",
                getValueForTheme("text-green-400", "text-green-600")
              )}>
                API Ready
              </span>
            </div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-20 right-4 z-40"
        >
          <div className={combine(
            "px-3 py-2 rounded-lg shadow-lg cursor-pointer",
            getValueForTheme(
              "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30",
              "bg-red-50 border border-red-200 hover:bg-red-100"
            )
          )}
          title={`Error: ${error}`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className={combine(
                "text-xs font-medium",
                getValueForTheme("text-red-400", "text-red-600")
              )}>
                API Error
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-20 right-4 z-40"
        >
          <div className={combine(
            "px-3 py-2 rounded-lg shadow-lg",
            getValueForTheme(
              "bg-gray-500/20 border border-gray-500/30",
              "bg-gray-50 border border-gray-200"
            )
          )}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className={combine(
                "text-xs font-medium",
                getValueForTheme("text-gray-400", "text-gray-600")
              )}>
                Disconnected
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};