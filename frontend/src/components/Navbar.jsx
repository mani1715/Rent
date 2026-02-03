import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Heart, Home, Menu, X, User, LogOut, LayoutDashboard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="navbar-logo">
            <Home className="h-8 w-8" style={{ color: '#2563EB' }} />
            <span className="text-xl font-bold" style={{ color: '#1F2937' }}>RentSpace</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search by location or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                data-testid="navbar-search-input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                data-testid="navbar-search-button"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/listings" data-testid="navbar-listings-link">
              <Button variant="ghost" style={{ color: '#1F2937' }}>
                Browse
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Link to="/favorites" data-testid="navbar-favorites-link">
                <Button variant="ghost" style={{ color: '#1F2937' }}>
                  <Heart className="h-5 w-5 mr-2" />
                  Favorites
                </Button>
              </Link>
            )}

            {isOwner && (
              <>
                <Link to="/owner/dashboard" data-testid="navbar-dashboard-link">
                  <Button variant="ghost" style={{ color: '#1F2937' }}>
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/owner/inbox" data-testid="navbar-inbox-link">
                  <Button variant="ghost" style={{ color: '#1F2937' }}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link to="/owner/add-listing" data-testid="navbar-add-listing-link">
                  <Button style={{ backgroundColor: '#2563EB', color: 'white' }}>
                    List Property
                  </Button>
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" style={{ color: '#1F2937' }}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button style={{ backgroundColor: '#2563EB', color: 'white' }}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 mt-1">{user?.role}</p>
                    </div>
                    {isOwner && (
                      <Link
                        to="/owner/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="navbar-mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4" data-testid="navbar-mobile-menu">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  data-testid="navbar-mobile-search-input"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
            <Link to="/listings" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="ghost" className="w-full justify-start" data-testid="navbar-mobile-listings-link">
                Browse
              </Button>
            </Link>
            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="ghost" className="w-full justify-start" data-testid="navbar-mobile-favorites-link">
                <Heart className="h-5 w-5 mr-2" />
                Favorites
              </Button>
            </Link>
            <Link to="/add-listing" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full" style={{ backgroundColor: '#2563EB', color: 'white' }} data-testid="navbar-mobile-add-listing-link">
                List Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
