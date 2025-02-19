"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaComment, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const Header = () => {

  return (
    <div className="flex justify-between items-center py-4 bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image src="/logo_c.png" alt="Logo" width={40} height={40} className="rounded-full cursor-pointer" />
        </Link>
        <h1 className={`${pacifico.className} text-3xl text-gray-800`}>
          Bazaar
        </h1>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        <FaComment className="text-gray-600 text-xl cursor-pointer hover:text-blue-500 transition duration-300" />
        <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-blue-500 transition duration-300" />
        <FaShoppingCart className="text-gray-600 text-xl cursor-pointer hover:text-blue-500 transition duration-300" />
        <FaUserCircle className="text-gray-600 text-2xl cursor-pointer hover:text-blue-500 transition duration-300" />
      </div>
    </div>
  );
};

export default Header;
