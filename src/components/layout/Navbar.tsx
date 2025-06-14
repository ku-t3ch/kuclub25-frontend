"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import LogoDark from "../../assets/logo.png";
import LogoLight from "../../assets/logo.png";


const SunIcon = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-yellow-300"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
));

const MoonIcon = React.memo(({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
));

// Memoized theme toggle button
const ThemeToggleButton = React.memo(
  ({
    onClick,
    resolvedTheme,
    className,
    isMobile = false,
  }: {
    onClick: () => void;
    resolvedTheme: string;
    className: string;
    isMobile?: boolean;
  }) => (
    <button onClick={onClick} className={className} aria-label="สลับธีม">
      {resolvedTheme === "dark" ? (
        <SunIcon />
      ) : (
        <MoonIcon className={isMobile ? "h-4 w-4 text-[#006C67]" : "h-5 w-5 text-slate-300 dark:text-[#006C67]"} />
      )}
    </button>
  )
);

// Memoized hamburger button
const HamburgerButton = React.memo(
  ({
    isOpen,
    onClick,
    className,
    getValueForTheme,
  }: {
    isOpen: boolean;
    onClick: () => void;
    className: string;
    getValueForTheme: (dark: string, light: string) => string;
  }) => (
    <button className={className} onClick={onClick} aria-label="Toggle menu">
      <div className="w-5 flex flex-col items-center justify-center gap-1">
        <span
          className={`h-0.5 block origin-center rounded-full transition-all duration-300 ${
            isOpen ? "w-5 rotate-45 translate-y-1.5" : "w-5"
          } ${getValueForTheme("bg-white", "bg-[#006C67]")}`}
        />
        <span
          className={`h-0.5 block rounded-full transition-all duration-300 ${
            isOpen ? "w-0 opacity-0" : "w-4"
          } ${getValueForTheme("bg-white", "bg-[#006C67]")}`}
        />
        <span
          className={`h-0.5 block origin-center rounded-full transition-all duration-300 ${
            isOpen ? "w-5 -rotate-45 -translate-y-1.5" : "w-5"
          } ${getValueForTheme("bg-white", "bg-[#006C67]")}`}
        />
      </div>
    </button>
  )
);

// Memoized navigation link component
const NavLink = React.memo(
  ({
    href,
    isActive,
    className,
    children,
    onClick,
  }: {
    href: string;
    isActive: boolean;
    className: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
);

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { combine, getValueForTheme, resolvedTheme } = useThemeUtils();
  const { scrollY } = useScroll();

  // Memoized navigation links
  const navLinks = useMemo(
    () => [
      { path: "/", label: "หน้าหลัก" },
      { path: "/organizations", label: "ชมรม" },
      { path: "/projects", label: "กิจกรรม" },
    ],
    []
  );

  // Optimized scroll handler
  useEffect(() => {
    return scrollY.onChange((latest) => {
      const shouldScroll = latest > 10;
      if (shouldScroll !== scrolled) {
        setScrolled(shouldScroll);
      }
    });
  }, [scrollY, scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Memoized handlers
  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }, [theme, setTheme]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoized styles
  const headerClasses = useMemo(
    () =>
      combine(
        "fixed w-full top-0 z-50 transition-all duration-300",
        scrolled
          ? getValueForTheme(
              "bg-ku-primary/80 backdrop-blur-md shadow-lg shadow-black/10 border-b border-white/5",
              "bg-green-50/90 backdrop-blur-md shadow-lg shadow-green-100/20 border-b border-green-100"
            )
          : "bg-transparent"
      ),
    [combine, getValueForTheme, scrolled]
  );

  const themeButtonClasses = useMemo(
    () =>
      combine(
        "p-2.5 rounded-full ml-2 flex items-center justify-center hover:scale-110 transition-all",
        getValueForTheme(
          "bg-[#54CF90]/20 border border-[#54CF90]/30 hover:bg-[#54CF90]/30",
          "bg-[#006C67]/10 border border-[#006C67]/20 hover:bg-[#006C67]/15"
        )
      ),
    [combine, getValueForTheme]
  );

  const mobileThemeButtonClasses = useMemo(
    () =>
      combine(
        "p-2 rounded-full flex items-center justify-center hover:scale-110 transition-all",
        getValueForTheme(
          "bg-[#54CF90]/20 border border-[#54CF90]/30 hover:bg-[#54CF90]/30",
          "bg-[#006C67]/10 border border-[#006C67]/20 hover:bg-[#006C67]/15"
        )
      ),
    [combine, getValueForTheme]
  );

  const hamburgerClasses = useMemo(
    () =>
      combine(
        "flex flex-col justify-center items-center w-10 h-10 rounded-full transition-all",
        getValueForTheme(
          "bg-[#54CF90]/20 border border-[#54CF90]/30 hover:bg-[#54CF90]/30",
          "bg-[#006C67]/10 border border-[#006C67]/20 hover:bg-[#006C67]/15"
        )
      ),
    [combine, getValueForTheme]
  );

  const getNavLinkClasses = useCallback(
    (isActive: boolean, isMobile: boolean = false) =>
      combine(
        isMobile
          ? "block px-4 py-3 rounded-lg transition-all duration-200 font-medium mb-1"
          : "px-4 py-2 rounded-full transition-all duration-200 font-medium",
        isActive
          ? getValueForTheme(
              isMobile
                ? "bg-gradient-to-r from-[#015a5e] via-[#54CF90] to-[#54CF90]/90 text-white border border-[#54CF90]/30"
                : "bg-gradient-to-r from-[#015a5e]/10 via-[#54CF90]/10 to-[#54CF90]/10 text-[#54CF90] border border-[#54CF90]/30",
              "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
            )
          : getValueForTheme(
              "text-white/80 hover:text-white hover:bg-white/10",
              "text-gray-700 hover:text-[#006C67] hover:bg-[#006C67]/5"
            )
      ),
    [combine, getValueForTheme]
  );

  // Memoized motion variants
  const mobileMenuVariants = useMemo(
    () => ({
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.3 },
    }),
    []
  );

  // Memoized logo
  const currentLogo = useMemo(() => {
    return resolvedTheme === "light" ? LogoLight : LogoDark;
  }, [resolvedTheme]);

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-200">
              <Image
                src={currentLogo}
                alt="KU Club Logo"
                className="w-full h-full object-cover"
                width={80}
                height={80}
                priority
                sizes="(max-width: 640px) 40px, 48px"
              />
            </div>

            <div className="hidden sm:flex flex-col">
              <span
                className={combine(
                  "font-bold text-2xl sm:text-3xl tracking-wider hover:scale-105 transition-transform",
                  getValueForTheme(
                    "bg-gradient-to-r from-[#54CF90] via-[#54CF90]/90 to-[#54CF90]/80 bg-clip-text text-transparent",
                    "text-[#006C67]"
                  )
                )}
              >
                KU CLUB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  href={link.path}
                  isActive={isActive}
                  className={getNavLinkClasses(isActive)}
                >
                  {link.label}
                </NavLink>
              );
            })}

            <ThemeToggleButton
              onClick={toggleTheme}
              resolvedTheme={resolvedTheme}
              className={themeButtonClasses}
            />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggleButton
              onClick={toggleTheme}
              resolvedTheme={resolvedTheme}
              className={mobileThemeButtonClasses}
              isMobile
            />

            <HamburgerButton
              isOpen={isOpen}
              onClick={toggleMenu}
              className={hamburgerClasses}
              getValueForTheme={getValueForTheme}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              {...mobileMenuVariants}
              className={combine(
                "md:hidden mt-4 rounded-xl overflow-hidden border shadow-xl",
                getValueForTheme(
                  "bg-ku-primary/90 backdrop-blur-xl border-white/10",
                  "bg-[#006C67]/5 backdrop-blur-xl border-[#006C67]/20"
                )
              )}
            >
              <div className="p-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <NavLink
                      key={link.path}
                      href={link.path}
                      isActive={isActive}
                      className={getNavLinkClasses(isActive, true)}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default React.memo(NavBar);