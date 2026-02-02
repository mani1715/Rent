import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockListings } from '@/data/mockListings';
import { ListingCard } from '@/components/ListingCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SkeletonList } from '@/components/SkeletonLoader';

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    types: [],
    duration: 'all',
    mode: 'all',
    minPrice: 0,
    maxPrice: 5000
  });

  useEffect(() => {
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    if (type) {
      setFilters(prev => ({ ...prev, types: [type] }));
    }
    
    if (search) {
      // Search is handled in the filtering logic
    }

    // Simulate loading for skeleton
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const filteredListings = mockListings.filter(listing => {
    const search = searchParams.get('search')?.toLowerCase() || '';
    
    if (filters.types.length > 0 && !filters.types.includes(listing.type)) {
      return false;
    }
    
    if (filters.duration !== 'all' && listing.duration !== filters.duration) {
      return false;
    }
    
    if (filters.mode !== 'all' && listing.mode !== filters.mode) {
      return false;
    }
    
    if (listing.price < filters.minPrice || listing.price > filters.maxPrice) {
      return false;
    }
    
    if (search && !listing.title.toLowerCase().includes(search) && 
        !listing.location.toLowerCase().includes(search) &&
        !listing.type.toLowerCase().includes(search)) {
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
