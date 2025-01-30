"use client";
import { useSearch } from "@/context/SearchContext";
import ProductGrid from "../components/ProductGrid";
import Link from "next/link";

export default function ResultsScreen() {
  const { searchResults } = useSearch();

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-2xl font-semibold text-gray-700 text-center mt-8">Search Results</h1>
      <ProductGrid products={searchResults} />
      <Link href="/" className="block text-center mt-4 text-blue-600">Back to Home</Link>
    </div>
  );
}
