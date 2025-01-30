import {
  FaMicrochip,
  FaBowlFood,
  FaShirt,
  FaBook,
  FaCar,
  FaMusic,
  FaGamepad,
  FaDesktop,
} from "react-icons/fa6";
import { FaSmile } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";
import { AiFillMedicineBox } from "react-icons/ai";

const categories = [
  { id: "1", name: "Electronics", icon: <FaMicrochip /> },
  { id: "2", name: "Foods & Drinks", icon: <FaBowlFood /> },
  { id: "3", name: "Beauty", icon: <FaSmile /> },
  { id: "4", name: "Furnitures", icon: <MdTableRestaurant /> },
  { id: "5", name: "Fashion", icon: <FaShirt /> },
  { id: "6", name: "Health", icon: <AiFillMedicineBox /> },
  { id: "7", name: "Stationery", icon: <FaBook /> },
  { id: "8", name: "Vehicles", icon: <FaCar /> },
  { id: "9", name: "Musical instruments", icon: <FaMusic /> },
  { id: "10", name: "Video Games", icon: <FaGamepad /> },
  { id: "11", name: "Computers", icon: <FaDesktop /> },
];

const CategoryGrid = () => {
  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex space-x-6 px-4">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center">
            {/* Oval Container */}
            <div className="w-32 h-12 flex justify-center items-center bg-gray-200 text-black rounded-full text-xl">
              {category.icon}
            </div>
            {/* Category Name */}
            <p className="text-sm text-center mt-2 text-black">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
