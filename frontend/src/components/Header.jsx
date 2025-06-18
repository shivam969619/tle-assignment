
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            StudentsHub
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Students</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Analytics</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors py-2">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors py-2">Students</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors py-2">Analytics</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors py-2">About</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
