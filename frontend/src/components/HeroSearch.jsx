import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Building2, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedType) params.append('type', selectedType);
    navigate(`/listings?${params.toString()}`);
  };

  const propertyTypes = [
    { value: 'room', label: 'Rooms', icon: Home },
    { value: 'house', label: 'Houses', icon: Building2 },
    { value: 'lodge', label: 'Lodges', icon: Mountain }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto" data-testid="hero-search">
      <Card className="p-6 shadow-xl">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by location, city, or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                data-testid="hero-search-input"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8"
              style={{ backgroundColor: '#2563EB', color: 'white' }}
              data-testid="hero-search-button"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Quick search by type:</p>
          <div className="flex flex-wrap gap-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setSelectedType(type.value);
                    navigate(`/listings?type=${type.value}`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: selectedType === type.value ? '#2563EB' : '#E5E7EB',
                    backgroundColor: selectedType === type.value ? '#EFF6FF' : 'white',
                    color: selectedType === type.value ? '#2563EB' : '#6B7280'
                  }}
                  data-testid={`quick-search-${type.value}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
