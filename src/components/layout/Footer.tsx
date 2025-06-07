"use client";

import React, { memo } from "react";
import Image from "next/image";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import LOGO from "../../assets/logo.png";

const Footer: React.FC = () => {
    const { combine, getValueForTheme } = useThemeUtils();
    
    return (
        <footer 
            className={combine(
                "pt-10 xs:pt-12 sm:pt-16 pb-6 xs:pb-7 sm:pb-8 border-t",
                getValueForTheme(
                    "bg-ku-primary border-white/10", 
                    "bg-white border-gray-200"
                )
            )}
        >
            <div className="container mx-auto px-4 xs:px-5 sm:px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-6 md:mb-0">
                        {/* KU Logo */}
                        <Image
                            src={LOGO}
                            alt="KU Logo"
                            className={combine(
                                "h-8 xs:h-9 sm:h-10 w-auto mr-3 xs:mr-3.5 sm:mr-4 opacity-80 hover:opacity-100 transition-opacity",
                                getValueForTheme("brightness-100", "brightness-90")
                            )}
                            width={40}
                            height={40}
                            priority
                        />
                        
                        <div>
                            <div 
                                className={combine(
                                    "font-medium text-sm xs:text-base sm:text-lg",
                                    getValueForTheme(
                                        "text-white", 
                                        "text-ku-primary"
                                    )
                                )}
                            >
                                KU CLUB
                            </div>
                            <div 
                                className={combine(
                                    "text-xs xs:text-sm sm:text-base",
                                    getValueForTheme(
                                        "text-white/70", 
                                        "text-gray-600"
                                    )
                                )}
                            >
                                มหาวิทยาลัยเกษตรศาสตร์
                            </div>
                        </div>
                    </div>

                    {/* Copyright text */}
                    <div 
                        className={combine(
                            "text-xs xs:text-sm text-center md:text-right",
                            getValueForTheme(
                                "text-white/60", 
                                "text-gray-500"
                            )
                        )}
                    >
                        <p>© {new Date().getFullYear()} มหาวิทยาลัยเกษตรศาสตร์</p>
                        <p className="mt-1">สงวนลิขสิทธิ์</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);