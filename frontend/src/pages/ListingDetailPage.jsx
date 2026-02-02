import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockListings } from '@/data/mockListings';
import { MapPreview } from '@/components/MapPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Maximize, CheckCircle2 } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/localStorage';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = mockListings.find(l => l.id === parseInt(id));
  const [favorite, setFavorite] = useState(listing ? isFavorite(listing.id) : false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(listing.id);
      setFavorite(false);
    } else {
      addFavorite(listing.id);
      setFavorite(true);
    }
  };

  const typeColors = { room: '#2563EB', house: '#10B981', lodge: '#1F2937' };
  const badgeColor = typeColors[listing.type] || '#1F2937';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6" data-testid="back-button">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-96 object-cover" data-testid="listing-detail-image" />
                <Badge className="absolute top-4 left-4 text-sm px-3 py-1" style={{ backgroundColor: badgeColor, color: 'white' }} data-testid="listing-detail-type-badge">
                  {listing.type.toUpperCase()}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }} data-testid="listing-detail-title">{listing.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span data-testid="listing-detail-location">{listing.location}</span>
                    </div>
                  </div>
                  <button onClick={handleFavorite} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-testid="listing-detail-favorite-button">
                    <Heart className={`h-6 w-6 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-gray-200 mb-6">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="font-semibold" data-testid="listing-detail-bedrooms">{listing.bedrooms}</span>
                    <span className="text-gray-600 ml-1">Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="font-semibold" data-testid="listing-detail-bathrooms">{listing.bathrooms}</span>
                    <span className="text-gray-600 ml-1">Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="font-semibold" data-testid="listing-detail-size">{listing.size}</span>
                    <span className="text-gray-600 ml-1">sqft</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#1F2937' }}>Description</h2>
                  <p className="text-gray-700 leading-relaxed" data-testid="listing-detail-description">{listing.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#1F2937' }}>Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center" data-testid={`feature-${idx}`}>
                        <CheckCircle2 className="h-5 w-5 mr-2" style={{ color: '#10B981' }} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <MapPreview coordinates={listing.coordinates} location={listing.location} />
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Price</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold" style={{ color: '#2563EB' }} data-testid="listing-detail-price">${listing.price}</span>
                    <span className="text-xl text-gray-600 ml-2">/ {listing.duration}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" style={{ backgroundColor: '#10B981', color: 'white' }} data-testid="contact-owner-button">Contact Owner</Button>
                  <Button variant="outline" className="w-full" size="lg" data-testid="schedule-visit-button">Schedule Visit</Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3" style={{ color: '#1F2937' }}>Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{listing.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium capitalize">{listing.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{listing.size} sqft</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
