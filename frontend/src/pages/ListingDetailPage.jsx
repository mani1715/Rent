import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockListings } from '@/data/mockListings';
import { MapPreview } from '@/components/MapPreview';
import { ImageCarousel } from '@/components/ImageCarousel';
import { OwnerProfileCard } from '@/components/OwnerProfileCard';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { ReviewsSection } from '@/components/ReviewsSection';
import { SimilarListings } from '@/components/SimilarListings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Maximize, CheckCircle2, Share2 } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/localStorage';

export default function ListingDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  
  const targetId = parseInt(params.id);
  let foundListing = null;
  
  for (let i = 0; i < mockListings.length; i++) {
    if (mockListings[i].id === targetId) {
      foundListing = mockListings[i];
      break;
    }
  }

  const [favorite, setFavorite] = useState(foundListing ? isFavorite(foundListing.id) : false);

  if (!foundListing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  const listing = foundListing;

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(listing.id);
      setFavorite(false);
    } else {
      addFavorite(listing.id);
      setFavorite(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const typeColors = { room: '#2563EB', house: '#10B981', lodge: '#1F2937' };
  const badgeColor = typeColors[listing.type] || '#1F2937';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} data-testid="back-button">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Listings
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShare}
              data-testid="share-button"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavorite}
              data-testid="listing-detail-favorite-button"
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        <ImageCarousel images={listing.images} title={listing.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }} data-testid="listing-detail-title">
                        {listing.title}
                      </h1>
                      {listing.verified && (
                        <Badge style={{ backgroundColor: '#10B981', color: 'white' }}>
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span data-testid="listing-detail-location">{listing.location}</span>
                    </div>
                    <Badge style={{ backgroundColor: badgeColor, color: 'white' }} data-testid="listing-detail-type-badge">
                      {listing.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold" style={{ color: '#2563EB' }} data-testid="listing-detail-price">
                      ${listing.price}
                    </div>
                    <div className="text-gray-600">/ {listing.duration}</div>
                  </div>
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
