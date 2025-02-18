"use client";
import { useState } from "react";
import categories from "./categories";

const CategoryGrid = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    onSelectCategory(categoryName);
  };

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex space-x-3 px-4 overflow-x-scroll whitespace-nowrap scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 p-3 rounded-lg shadow-md border min-w-[90px] sm:min-w-[110px] md:min-w-[130px] lg:min-w-[160px] ${
              selectedCategory === category.name ? "bg-blue-100 border-blue-500 text-blue-600" : "bg-white border-gray-200 text-black"
            }`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex justify-center items-center bg-gray-200 rounded-full text-xl sm:text-2xl md:text-3xl">
              {category.icon}
            </div>
            <p className="text-xs sm:text-sm text-center mt-1 font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;