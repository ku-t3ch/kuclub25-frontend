"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import CardOrganization from "../ui/cardOrganization";

interface OrganizationCardProps {
  organization: any;
  viewMode: "grid" | "list";
  variants: any;
}

const OrganizationCard = memo(({ 
  organization, 
  viewMode, 
  variants 
}: OrganizationCardProps) => (
  <motion.div
    variants={variants}
    layout
    className={viewMode === "list" ? "w-full" : ""}
  >
    <CardOrganization 
      organization={organization} 
      variant={viewMode === "list" ? "horizontal" : "vertical"}
    />
  </motion.div>
));

OrganizationCard.displayName = "OrganizationCard";

export default OrganizationCard;