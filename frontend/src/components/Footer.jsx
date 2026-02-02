import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" style={{ color: '#2563EB' }} />
              <span className="text-lg font-bold" style={{ color: '#1F2937' }}>RentSpace</span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted platform for finding the perfect rental space.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2937' }}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings" className="text-gray-600 hover:text-gray-900">Browse Listings</Link>
              </li>
              <li>
                <Link to="/add-listing" className="text-gray-600 hover:text-gray-900">List Property</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 hover:text-gray-900">My Favorites</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2937' }}>Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings?type=room" className="text-gray-600 hover:text-gray-900">Rooms</Link>
              </li>
              <li>
                <Link to="/listings?type=house" className="text-gray-600 hover:text-gray-900">Houses</Link>
              </li>
              <li>
                <Link to="/listings?type=lodge" className="text-gray-600 hover:text-gray-900">Lodges</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2937' }}>Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@rentspace.com
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © 2025 RentSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
