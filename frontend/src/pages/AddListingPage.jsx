import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    mode: 'rent',
    duration: '',
    price: '',
    location: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    features: []
  });

  const availableFeatures = [
    'WiFi', 'Parking', 'Kitchen', 'AC', 'Heating', 'Furnished',
    'Pet-Friendly', 'Garden', 'Balcony', 'Fireplace', 'Pool', 'Gym'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = () => {
    console.log('Listing submitted:', formData);
    alert('Listing created successfully! (Mock submission)');
    navigate('/listings');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.type && formData.mode && formData.duration;
      case 2:
        return formData.title && formData.location && formData.price;
      case 3:
        return formData.bedrooms && formData.bathrooms && formData.size;
      case 4:
        return formData.description;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }} data-testid="add-listing-title">
            List Your Property
          </h1>
          <p className="text-gray-600">Step {step} of 4</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ backgroundColor: '#2563EB', width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>
              {step === 1 && 'Property Type & Mode'}
              {step === 2 && 'Basic Information'}
              {step === 3 && 'Property Details'}
              {step === 4 && 'Description & Features'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#1F2937' }}>
                    Property Type *
                  </Label>
                  <RadioGroup value={formData.type} onValueChange={(val) => handleInputChange('type', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="room" id="type-room" data-testid="property-type-room" />
                      <Label htmlFor="type-room" className="cursor-pointer">Room</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="house" id="type-house" data-testid="property-type-house" />
                      <Label htmlFor="type-house" className="cursor-pointer">House</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lodge" id="type-lodge" data-testid="property-type-lodge" />
                      <Label htmlFor="type-lodge" className="cursor-pointer">Lodge</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#1F2937' }}>
                    Rental Mode *
                  </Label>
                  <RadioGroup value={formData.mode} onValueChange={(val) => handleInputChange('mode', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="mode-rent" data-testid="rental-mode-rent" />
                      <Label htmlFor="mode-rent" className="cursor-pointer">Available for Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="give" id="mode-give" data-testid="rental-mode-give" />
                      <Label htmlFor="mode-give" className="cursor-pointer">Looking to Rent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#1F2937' }}>
                    Rental Duration *
                  </Label>
                  <RadioGroup value={formData.duration} onValueChange={(val) => handleInputChange('duration', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="night" id="duration-night" data-testid="rental-duration-night" />
                      <Label htmlFor="duration-night" className="cursor-pointer">Per Night</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day" id="duration-day" data-testid="rental-duration-day" />
                      <Label htmlFor="duration-day" className="cursor-pointer">Per Day</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="duration-week" data-testid="rental-duration-week" />
                      <Label htmlFor="duration-week" className="cursor-pointer">Per Week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="month" id="duration-month" data-testid="rental-duration-month" />
                      <Label htmlFor="duration-month" className="cursor-pointer">Per Month</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="title" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Property Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Cozy Studio Room in Downtown"
                    className="mt-2"
                    data-testid="property-title-input"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Downtown, San Francisco"
                    className="mt-2"
                    data-testid="property-location-input"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Price ({formData.duration ? `per ${formData.duration}` : ''}) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 450"
                    className="mt-2"
                    data-testid="property-price-input"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label htmlFor="bedrooms" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Number of Bedrooms *
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="e.g., 2"
                    className="mt-2"
                    data-testid="property-bedrooms-input"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Number of Bathrooms *
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="e.g., 1"
                    className="mt-2"
                    data-testid="property-bathrooms-input"
                  />
                </div>

                <div>
                  <Label htmlFor="size" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Size (sqft) *
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g., 800"
                    className="mt-2"
                    data-testid="property-size-input"
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <Label htmlFor="description" className="text-base font-semibold" style={{ color: '#1F2937' }}>
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your property..."
                    className="mt-2 min-h-32"
                    data-testid="property-description-input"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#1F2937' }}>
                    Features & Amenities
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                          data-testid={`feature-checkbox-${feature.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        />
                        <Label htmlFor={`feature-${feature}`} className="cursor-pointer text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              data-testid="previous-step-button"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              style={{ backgroundColor: '#2563EB', color: 'white' }}
              className="ml-auto"
              data-testid="next-step-button"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              style={{ backgroundColor: '#10B981', color: 'white' }}
              className="ml-auto"
              data-testid="submit-listing-button"
            >
              <Check className="h-5 w-5 mr-2" />
              Submit Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
