"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import LOGO from "../../assets/logo.png";
import LOGO_LIGHT from "../../assets/logo_light.png";

const Footer: React.FC = () => {
    const { combine, getValueForTheme, resolvedTheme } = useThemeUtils();
    
    // Memoized logo selection based on theme
    const currentLogo = useMemo(() => {
        return resolvedTheme === "light" ? LOGO_LIGHT : LOGO;
    }, [resolvedTheme]);

    // Minimal theme styles
    const themeStyles = useMemo(() => ({
        container: getValueForTheme(
            "bg-[#ffff]/2 border-[#ffff]/10", 
            "bg-white border-gray-100"
        ),
        primaryText: getValueForTheme("text-white", "text-gray-900"),
        secondaryText: getValueForTheme("text-gray-400", "text-gray-500"),
        logoOpacity: getValueForTheme("opacity-90", "opacity-100"),
    }), [getValueForTheme]);
    
    return (
        <footer className={combine(
            "border-t backdrop-blur-sm",
            "py-6 md:py-8",
            "px-4 sm:px-6 lg:px-8",
            themeStyles.container
        )}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                        <Image
                            src={currentLogo}
                            alt="KU Logo"
                            className={combine(
                                "h-8 w-auto transition-opacity duration-200",
                                themeStyles.logoOpacity,
                                "hover:opacity-100"
                            )}
                            width={32}
                            height={32}
                            priority
                        />
                        <div className="text-center sm:text-left">
                            <h3 className={combine(
                                "text-sm font-medium",
                                themeStyles.primaryText
                            )}>
                                KU Club & Activity
                            </h3>
                            <p className={combine(
                                "text-xs mt-0.5",
                                themeStyles.secondaryText
                            )}>
                                มหาวิทยาลัยเกษตรศาสตร์
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className={combine(
                        "text-center sm:text-right",
                        "text-xs",
                        themeStyles.secondaryText
                    )}>
                        <p>© {new Date().getFullYear()} สงวนลิขสิทธิ์</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);