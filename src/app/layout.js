import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
export const metadata = {
  title: "E-commerce Search",
  description: "Reverse Image & Semantic Search for E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex flex-col items-center">
       <SearchProvider> <main className="w-full px-2">{children}</main>
       </SearchProvider>      </body>
    </html>
  );
}
