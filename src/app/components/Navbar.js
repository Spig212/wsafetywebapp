import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-pink-400 to-pink-600 p-4 shadow-lg rounded-b-lg animate-fade-in">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-extrabold tracking-wide">Women's Safety Web App</h1>
        <div className="space-x-6 text-lg">
          <Link href="/" className="text-white transition-all hover:text-gray-200 hover:underline">
                       
          </Link>
          <Link href="/sensors" className="text-white transition-all hover:text-gray-200 hover:underline">
                 
          </Link>
          <Link href="/emergency" className="text-white transition-all hover:text-gray-200 hover:underline">
                      
          </Link>
        </div>
      </div>
    </nav>
  );
}
