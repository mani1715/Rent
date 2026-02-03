import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, User, Home } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.role) {
      setError('Please select your account type');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);

    if (result.success) {
      // Navigate based on role
      if (formData.role === 'OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Home className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">RentSpace</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-lg text-gray-600">
            Join us to find your perfect rental space or list your property
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Account Type Selection */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-4">
                I am a... <span className="text-red-500">*</span>
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Owner Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('OWNER')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.role === 'OWNER'
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        formData.role === 'OWNER' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Property Owner</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        List and manage your rental properties
                      </p>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex items-center">
                          <span className="mr-2 text-blue-600">✓</span>
                          Create property listings
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-blue-600">✓</span>
                          Manage bookings & inquiries
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-blue-600">✓</span>
                          Chat with potential renters
                        </li>
                      </ul>
                    </div>
                  </div>
                  {formData.role === 'OWNER' && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-blue-600 text-white rounded-full p-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>

                {/* Customer Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('CUSTOMER')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.role === 'CUSTOMER'
                      ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-300 bg-white hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        formData.role === 'CUSTOMER' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Customer</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Find your perfect rental space
                      </p>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-600">✓</span>
                          Browse properties
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-600">✓</span>
                          Save favorites & reviews
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-600">✓</span>
                          Contact property owners
                        </li>
                      </ul>
                    </div>
                  </div>
                  {formData.role === 'CUSTOMER' && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-600 text-white rounded-full p-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
