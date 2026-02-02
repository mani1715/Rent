import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, User } from 'lucide-react';

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectRole, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if role is already set
  React.useEffect(() => {
    if (user?.role) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    const result = await selectRole(selectedRole);
    setLoading(false);

    if (result.success) {
      if (selectedRole === 'OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Choose Your Role
          </h2>
          <p className="text-gray-600">
            Select how you want to use our platform. This choice is permanent.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Owner Card */}
          <button
            onClick={() => setSelectedRole('OWNER')}
            className={`p-8 rounded-lg border-2 transition-all text-left ${
              selectedRole === 'OWNER'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  selectedRole === 'OWNER' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Building2 className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Property Owner</h3>
                <p className="text-gray-600 mb-4">
                  List your properties for rent and manage bookings
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Add and manage listings
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Set your own prices
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Track property performance
                  </li>
                </ul>
              </div>
            </div>
            {selectedRole === 'OWNER' && (
              <div className="mt-4 text-blue-600 font-medium text-sm">Selected ✓</div>
            )}
          </button>

          {/* Customer Card */}
          <button
            onClick={() => setSelectedRole('CUSTOMER')}
            className={`p-8 rounded-lg border-2 transition-all text-left ${
              selectedRole === 'CUSTOMER'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300 bg-white hover:border-green-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  selectedRole === 'CUSTOMER' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <User className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer</h3>
                <p className="text-gray-600 mb-4">
                  Find and rent properties that match your needs
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Browse available properties
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Save favorites
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Leave reviews and ratings
                  </li>
                </ul>
              </div>
            </div>
            {selectedRole === 'CUSTOMER' && (
              <div className="mt-4 text-green-600 font-medium text-sm">Selected ✓</div>
            )}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Confirming...' : 'Continue'}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            ⚠️ This choice cannot be changed later
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
