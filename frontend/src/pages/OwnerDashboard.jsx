import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Plus, Home, Star, Eye } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalReviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch owner's listings
      const listingsRes = await axios.get(`${API_URL}/api/listings?ownerId=${user.id}`);
      if (listingsRes.data.success) {
        setListings(listingsRes.data.listings);
        setStats(prev => ({ ...prev, totalListings: listingsRes.data.listings.length }));
      }

      // Fetch owner profile
      try {
        const profileRes = await axios.get(`${API_URL}/api/owner/profile`);
        if (profileRes.data.success) {
          setProfile(profileRes.data.profile);
        }
      } catch (error) {
        // Profile doesn't exist yet
        console.log('No profile found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`${API_URL}/api/listings/${id}`);
      setListings(listings.filter(l => l._id !== id));
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Profile Alert */}
        {!profile && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ Please complete your owner profile to start adding listings.
              <Link to="/owner/profile" className="ml-2 font-medium underline">
                Complete Profile
              </Link>
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/owner/add-listing"
            className={`flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              !profile ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <Plus className="mr-2" />
            Add New Listing
          </Link>
          <Link
            to="/owner/profile"
            className="flex items-center justify-center px-6 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition"
          >
            {profile ? 'Edit Profile' : 'Complete Profile'}
          </Link>
        </div>

        {/* Listings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
          </div>
          <div className="p-6">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No listings yet</p>
                {profile && (
                  <Link
                    to="/owner/add-listing"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-200">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Home className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{listing.addressText}</p>
                      <p className="text-lg font-bold text-blue-600 mb-4">${listing.price}/month</p>
                      <div className="flex space-x-2">
                        <Link
                          to={`/listing/${listing._id}`}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 text-center"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteListing(listing._id)}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
