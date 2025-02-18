import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductGrid = ({ products }) => {
  const { setSelectedProduct } = useSearch();

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <div className="w-full h-48 flex justify-center items-center overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500">Category: {product.category || "Uncategorized"}</p>
            <p className="text-gray-700 font-semibold">{product.price ? `Rs ${product.price}` : "Price: N/A"}</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  {i < product.rating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <Link href="/product" passHref>
              <button
                className="mt-3 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => handleViewDetails(product)}
              >
                View Details
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;