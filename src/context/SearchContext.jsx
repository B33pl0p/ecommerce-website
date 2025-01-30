"use client"
import { createContext, useContext, useState } from "react";

// Create Context
const SearchContext = createContext();

// Provider Component
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // ✅ Store selected product

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, selectedProduct, setSelectedProduct }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook for Using Search Context
export const useSearch = () => useContext(SearchContext);
