"use client";

import React, { memo } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  themeClasses: any;
}

const SearchBar = memo(({ 
  searchQuery, 
  onSearch, 
  themeClasses 
}: SearchBarProps) => (
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="ค้นหาชมรม..."
      value={searchQuery}
      onChange={(e) => onSearch(e.target.value)}
      className={themeClasses.searchInput}
    />
    <svg className={themeClasses.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
));

SearchBar.displayName = "SearchBar";

export default SearchBar;