"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

interface OrganizationSidebarSectionProps {
  organizationInfo: any;
  projectCategories: any;
}

// Constants outside component to prevent recreation
const ANIMATION_VARIANTS = {
  statsCard: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.3 }
  },
  contactCard: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.4 }
  },
  socialLink: {
    whileHover: { x: 5 }
  }
} as const;

// Memoized icon components
const StatsIcon = React.memo(() => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
));
StatsIcon.displayName = "StatsIcon";

const ContactIcon = React.memo(() => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
));
ContactIcon.displayName = "ContactIcon";

const FacebookIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
));
FacebookIcon.displayName = "FacebookIcon";

const InstagramIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
));
InstagramIcon.displayName = "InstagramIcon";

// Optimized social link component
const SocialLink = React.memo<{
  href: string;
  icon: React.ReactNode;
  label: string;
  themeStyle: string;
  combine: (...classes: string[]) => string;
}>(({ href, icon, label, themeStyle, combine }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={combine(
      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group",
      themeStyle
    )}
    variants={ANIMATION_VARIANTS.socialLink}
    whileHover="whileHover"
  >
    {icon}
    <span className="group-hover:underline">{label}</span>
  </motion.a>
));
SocialLink.displayName = "SocialLink";

const OrganizationSidebarSection: React.FC<OrganizationSidebarSectionProps> = ({
  organizationInfo,
  projectCategories,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  // Memoized theme values for better performance
  const themeStyles = useMemo(() => ({
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-blue-900/5",
      "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
    ),
    primaryText: getValueForTheme("text-white", "text-[#006C67]"),
    secondaryText: getValueForTheme("text-white/70", "text-[#006C67]/70"),
    accentBlue: getValueForTheme("text-blue-300", "text-[#006C67]"),
    titleGradient: getValueForTheme(
      "bg-gradient-to-r from-white to-blue-100",
      "bg-gradient-to-r from-[#006C67] to-[#006C67]/80"
    ),
    facebookLink: getValueForTheme(
      "bg-blue-500/10 hover:bg-blue-500/20 text-blue-300",
      "bg-blue-50 hover:bg-blue-100 text-blue-600"
    ),
    instagramLink: getValueForTheme(
      "bg-pink-500/10 hover:bg-pink-500/20 text-pink-300",
      "bg-pink-50 hover:bg-pink-100 text-pink-600"
    ),
  }), [getValueForTheme]);

  // Memoized statistics data
  const statsData = useMemo(() => [
    {
      key: 'projects',
      value: projectCategories.counts?.all || 0,
      label: 'กิจกรรมทั้งหมด'
    },
    {
      key: 'views',
      value: (organizationInfo.views || 0).toLocaleString(),
      label: 'ยอดเข้าชม'
    }
  ], [projectCategories.counts?.all, organizationInfo.views]);

  // Memoized social media links
  const socialLinks = useMemo(() => {
    const links = [];
    
    if (organizationInfo.socialMedia?.facebook) {
      links.push({
        key: 'facebook',
        href: organizationInfo.socialMedia.facebook,
        icon: <FacebookIcon />,
        label: 'Facebook',
        themeStyle: themeStyles.facebookLink
      });
    }
    
    if (organizationInfo.socialMedia?.instagram) {
      links.push({
        key: 'instagram',
        href: organizationInfo.socialMedia.instagram,
        icon: <InstagramIcon />,
        label: 'Instagram',
        themeStyle: themeStyles.instagramLink
      });
    }
    
    return links;
  }, [
    organizationInfo.socialMedia?.facebook,
    organizationInfo.socialMedia?.instagram,
    themeStyles.facebookLink,
    themeStyles.instagramLink
  ]);

  // Memoized check for social media existence
  const hasSocialMedia = useMemo(() => 
    socialLinks.length > 0,
    [socialLinks.length]
  );

  return (
    <div className="space-y-8">
      {/* Quick Stats Card */}
      <motion.div
        variants={ANIMATION_VARIANTS.statsCard}
        initial="initial"
        animate="animate"
        className={combine(
          "backdrop-blur-lg rounded-3xl p-6 shadow-xl overflow-hidden relative",
          themeStyles.cardBg
        )}
      >
        <h3
          className={combine(
            "text-lg font-semibold mb-4 bg-clip-text text-transparent inline-flex items-center gap-2",
            themeStyles.titleGradient
          )}
        >
          <span className={themeStyles.accentBlue}>
            <StatsIcon />
          </span>
          สถิติ
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {statsData.map((stat) => (
            <div key={stat.key} className="text-center">
              <div
                className={combine(
                  "text-2xl font-light mb-1",
                  themeStyles.primaryText
                )}
              >
                {stat.value}
              </div>
              <div className={combine("text-sm", themeStyles.secondaryText)}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Information */}
      {hasSocialMedia && (
        <motion.div
          variants={ANIMATION_VARIANTS.contactCard}
          initial="initial"
          animate="animate"
          className={combine(
            "backdrop-blur-lg rounded-3xl p-6 shadow-xl overflow-hidden relative",
            themeStyles.cardBg
          )}
        >
          <h3
            className={combine(
              "text-lg font-semibold mb-4 bg-clip-text text-transparent inline-flex items-center gap-2",
              themeStyles.titleGradient
            )}
          >
            <span className={themeStyles.accentBlue}>
              <ContactIcon />
            </span>
            ติดต่อ
          </h3>

          <div className="space-y-3">
            {socialLinks.map((link) => (
              <SocialLink
                key={link.key}
                href={link.href}
                icon={link.icon}
                label={link.label}
                themeStyle={link.themeStyle}
                combine={combine}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(OrganizationSidebarSection);