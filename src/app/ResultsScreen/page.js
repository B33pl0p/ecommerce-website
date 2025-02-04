"use client";
import { useSearch } from "@/context/SearchContext";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import Header from "../components/Header";

export default function ResultsScreen() {
  const { searchResults } = useSearch();

  return (
    <div className="container mx-auto px-6">
      <Header>
      </Header>
      <div className="mt-6 mb-4">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-semibold text-gray-700 text-center mt-4">Search Results</h1>
      
      {/* ✅ Show results if available */}
      {searchResults && searchResults.length > 0 ? (
        <ProductGrid products={searchResults} />
      ) : (
        <p className="text-center text-gray-500 mt-6">No products found. Try another search.</p>
      )}

      {/* ✅ Keep Back to Home link */}
      <Link href="/" className="block text-center mt-4 text-blue-600">Back to Home</Link>
    </div>
  );
}
