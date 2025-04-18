import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, PlusCircle, User, LogOut, Star } from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import { Button } from '../ui/button';
import { NotificationBell } from '../notification-bell';
import { useFavoritesStore } from '../../store/favorites-store';

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-teal-600"
            onClick={closeMobileMenu}
          >
            <Heart className="h-6 w-6" />
            <span className="font-bold text-xl">MediShare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/') ? 'text-teal-600' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/medicines" 
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/medicines') ? 'text-teal-600' : 'text-slate-700'
              }`}
            >
              Medications
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/about') ? 'text-teal-600' : 'text-slate-700'
              }`}
            >
              About
            </Link>
            <Link 
              to="/disclaimer" 
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/disclaimer') ? 'text-teal-600' : 'text-slate-700'
              }`}
            >
              Legal
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'donor' && (
                  <Button 
                    as={Link} 
                    to="/medicines/new" 
                    size="sm"
                    className="flex items-center"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Donate
                  </Button>
                )}
                <Button
                  as={Link}
                  to="/favorites"
                  variant="ghost"
                  size="sm"
                  className="flex items-center relative"
                >
                  <Star className="mr-1 h-4 w-4" />
                  Favorites
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
                <NotificationBell />
                <div className="relative group">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="mr-1">
                      {user.full_name?.split(' ')[0] || 'Account'}
                    </span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                    <div className="p-1">
                      <Link 
                        to="/dashboard" 
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleSignOut} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" as={Link} to="/login">
                  Log In
                </Button>
                <Button size="sm" as={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 border-b border-slate-200">
          <nav className="flex flex-col space-y-4 pt-2">
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-100 ${
                isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/medicines" 
              onClick={closeMobileMenu}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-100 ${
                isActive('/medicines') ? 'text-teal-600 bg-teal-50' : 'text-slate-700'
              }`}
            >
              Medications
            </Link>
            <Link 
              to="/about" 
              onClick={closeMobileMenu}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-100 ${
                isActive('/about') ? 'text-teal-600 bg-teal-50' : 'text-slate-700'
              }`}
            >
              About
            </Link>
            <Link 
              to="/disclaimer" 
              onClick={closeMobileMenu}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-100 ${
                isActive('/disclaimer') ? 'text-teal-600 bg-teal-50' : 'text-slate-700'
              }`}
            >
              Legal
            </Link>
            {user ? (
              <>
                <div className="border-t border-slate-200 my-2 pt-2">
                  {user.role === 'donor' && (
                    <Link 
                      to="/medicines/new" 
                      onClick={closeMobileMenu}
                      className="text-sm font-medium flex items-center px-3 py-2 rounded-md bg-teal-50 text-teal-600"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Donate Medication
                    </Link>
                  )}
                  <Link
                    to="/favorites"
                    onClick={closeMobileMenu}
                    className="text-sm font-medium flex items-center px-3 py-2 mt-2 rounded-md hover:bg-slate-100"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={closeMobileMenu}
                    className="text-sm font-medium flex items-center px-3 py-2 mt-2 rounded-md hover:bg-slate-100"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="text-sm font-medium flex items-center px-3 py-2 mt-2 rounded-md hover:bg-slate-100"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="w-full text-sm font-medium flex items-center px-3 py-2 mt-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-200 my-2 pt-2 flex flex-col space-y-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={closeMobileMenu}
                >
                  Log In
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  className="w-full justify-center"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};