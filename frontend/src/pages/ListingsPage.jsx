import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ListingCard } from '@/components/ListingCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SkeletonList } from '@/components/SkeletonLoader';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    types: [],
    duration: 'all',
    mode: 'all',
    minPrice: 0,
    maxPrice: 5000
  });

  useEffect(() => {
    fetchListings();
  }, [searchParams, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const type = searchParams.get('type');
      const search = searchParams.get('search');
      
      // Build query params
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (search) params.append('search', search);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice < 5000) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`${API_URL}/api/listings?${params.toString()}`);
      
      if (response.data.success) {
        setListings(response.data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filters.types.length > 0 && !filters.types.includes(listing.type)) {
      return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setFilters({
      types: [],
      duration: 'all',
      mode: 'all',
      minPrice: 0,
      maxPrice: 5000
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }} data-testid="listings-page-title">
              Available Properties
            </h1>
            <p className="text-gray-600 mt-2" data-testid="listings-count">
              {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>
          
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            data-testid="mobile-filters-toggle"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          <main className="flex-1">
            {loading ? (
              <SkeletonList count={9} />
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12" data-testid="no-listings-message">
                <p className="text-xl text-gray-600">No properties match your filters.</p>
                <Button
                  onClick={handleResetFilters}
                  className="mt-4"
                  style={{ backgroundColor: '#2563EB', color: 'white' }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="listings-grid">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
