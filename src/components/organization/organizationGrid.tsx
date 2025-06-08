"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import OrganizationCard from "../ui/cardOrganization";

interface OrganizationGridProps {
  organizations: any[];
  viewMode: "grid" | "list";
  gridClasses: string;
  animationVariants: any;
}

const OrganizationGrid = memo(({
  organizations,
  viewMode,
  gridClasses,
  animationVariants
}: OrganizationGridProps) => (
  <motion.div
    className={gridClasses}
    variants={animationVariants.container}
    initial="hidden"
    animate="visible"
  >
    {organizations.map((organization) => (
      <OrganizationCard
        key={organization.id}
        organization={organization}
        viewMode={viewMode}
        variants={animationVariants.item}
      />
    ))}
  </motion.div>
));

OrganizationGrid.displayName = "OrganizationGrid";

export default OrganizationGrid;