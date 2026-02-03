import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { ImageCarousel } from '@/components/ImageCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Heart, MapPin, Bed, Bath, Maximize, CheckCircle2, 
  Share2, Navigation, Star, User, Phone 
} from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/localStorage';
import ChatButton from '@/components/ChatButton';
import ChatModal from '@/components/ChatModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function ListingDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    fetchReviews();
  }, [params.id]);

  useEffect(() => {
    if (listing) {
      setFavorite(isFavorite(listing._id));
    }
  }, [listing]);

  const fetchListingDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/listings/${params.id}`);
      if (response.data.success) {
        setListing(response.data.listing);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/listing/${params.id}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleFavorite = () => {
    if (!listing) return;
    
    if (favorite) {
      removeFavorite(listing._id);
      setFavorite(false);
    } else {
      addFavorite(listing._id);
      setFavorite(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleOpenInMaps = () => {
    if (listing?.googleMapsLink) {
      window.open(listing.googleMapsLink, '_blank');
    } else if (listing?.latitude && listing?.longitude) {
      window.open(`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`, '_blank');
    } else {
      alert('Location coordinates not available');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(`${API_URL}/api/reviews`, {
        listingId: params.id,
        rating,
        comment
      });

      if (response.data.success) {
        alert('Review submitted successfully!');
        setRating(0);
        setComment('');
        fetchReviews();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  const typeColors = { room: '#2563EB', house: '#10B981', lodge: '#1F2937', pg: '#F59E0B', hostel: '#8B5CF6' };
  const badgeColor = typeColors[listing.type] || '#1F2937';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Listings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                style={{ color: favorite ? '#EF4444' : undefined }}
              >
                <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-8">
          <ImageCarousel images={listing.images || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{listing.addressText}</span>
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: badgeColor, color: 'white' }}>
                    {listing.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-gray-700 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{listing.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{listing.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-2" />
                    <span>{listing.squareFeet} sq ft</span>
                  </div>
                </div>

                <div className="text-3xl font-bold" style={{ color: '#2563EB' }}>
                  ${listing.price}/month
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {listing.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Facilities */}
            {listing.facilities && listing.facilities.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <CheckCircle2 className="h-5 w-5 mr-2" style={{ color: '#10B981' }} />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location & Navigation */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location
                </h2>
                <p className="text-gray-700 mb-4">{listing.addressText}</p>
                {(listing.latitude && listing.longitude) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>Coordinates:</strong> {listing.latitude}, {listing.longitude}
                    </p>
                  </div>
                )}
                <Button
                  onClick={handleOpenInMaps}
                  className="w-full"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Open in Google Maps
                </Button>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {isAuthenticated && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                  
                  {/* Average Rating */}
                  {reviews.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold ml-2">
                          {reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length}
                        </span>
                        <span className="text-gray-600 ml-2">({reviews.length} reviews)</span>
                      </div>
                    </div>
                  )}

                  {/* Add Review Form */}
                  {user?.role === 'CUSTOMER' && (
                    <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-3">Add Your Review</h3>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="text-2xl"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment (optional)
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Share your experience..."
                          maxLength={500}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submittingReview || !rating}
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="font-medium">{review.userId?.name || 'Anonymous'}</span>
                            <div className="ml-auto flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="ml-1 font-medium">{review.rating}</span>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            {listing.ownerId && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Owner Information</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {listing.ownerId.name || 'Property Owner'}
                      </p>
                      <p className="text-sm text-gray-600">{listing.ownerId.email}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => alert('Contact feature coming soon!')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Property Status */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Property Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge style={{ backgroundColor: '#10B981', color: 'white' }}>
                      {listing.status || 'Available'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed</span>
                    <span className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
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
