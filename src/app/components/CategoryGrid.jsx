import { useState } from "react";
import categories from "./categories"; // ✅ Import category list

const CategoryGrid = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    onSelectCategory(categoryName); // ✅ Fetch filtered products
  };

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex space-x-6 px-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-110 ${
              selectedCategory === category.name ? "text-blue-600" : "text-black"
            }`}
          >
            <div className="w-32 h-12 flex justify-center items-center bg-gray-200 rounded-full text-xl">
              {category.icon}
            </div>
            <p className="text-sm text-center mt-2">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
