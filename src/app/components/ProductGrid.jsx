import Link from "next/link";
import { useSearch } from "@/context/SearchContext";

const ProductGrid = ({ products }) => {
  const { setSelectedProduct } = useSearch(); // ✅ Get function to store product in Context API

  const handleViewDetails = (product) => {
    setSelectedProduct(product); // ✅ Store product in Context API
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto px-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-md p-4 rounded-lg md:p-6 lg:p-8"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md md:h-48 lg:h-64"
          />
          <h3 className="text-lg font-medium text-gray-800 mt-2 line-clamp-2 lg:text-xl lg:mt-4">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500"> Category: {product.category || "Uncategorized"}</p> {/* Display Category */}
          <p className="text-gray-600 md:text-lg">
            {product.price ? `Rs ${product.price}` : "Price: N/A"}
          </p>

          {/* View Details Button */}
          <Link href="/product" passHref>
            <button
              className="mt-3 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 lg:py-3"
              onClick={() => handleViewDetails(product)} // ✅ Store product in Context before navigating
            >
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
