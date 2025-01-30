"use client"
import Image from "next/image";
import { FaBell, FaComment } from "react-icons/fa6";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <Image src="/logo_c.png" alt="Logo" width={40} height={40} className="rounded-full" />
        <h1 className="text-3xl font-bold">Bazaar</h1>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <FaComment className="text-gray-600 text-xl cursor-pointer" />
        <FaBell className="text-gray-600 text-xl cursor-pointer" />
        <Image src="/profileicon.jpg" alt="Profile" width={40} height={40} className="rounded-full" />
      </div>
    </div>
  );
};

export default Header;
