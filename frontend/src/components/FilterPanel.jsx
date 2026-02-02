import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    onFilterChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleTypeToggle = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleDurationChange = (duration) => {
    onFilterChange({ ...filters, duration });
  };

  const handleModeChange = (mode) => {
    onFilterChange({ ...filters, mode });
  };

  return (
    <Card data-testid="filter-panel">
      <CardHeader>
        <CardTitle style={{ color: '#1F2937' }}>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-semibold mb-3 block" style={{ color: '#1F2937' }}>
            Rental Mode
          </Label>
          <RadioGroup value={filters.mode} onValueChange={handleModeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="mode-all" data-testid="mode-filter-all" />
              <Label htmlFor="mode-all" className="cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="mode-rent" data-testid="mode-filter-rent" />
              <Label htmlFor="mode-rent" className="cursor-pointer">Want to Rent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="give" id="mode-give" data-testid="mode-filter-give" />
              <Label htmlFor="mode-give" className="cursor-pointer">Give on Rent</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block" style={{ color: '#1F2937' }}>
            Property Type
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-room"
                checked={filters.types.includes('room')}
                onCheckedChange={() => handleTypeToggle('room')}
                data-testid="type-filter-room"
              />
              <Label htmlFor="type-room" className="cursor-pointer">Room</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-house"
                checked={filters.types.includes('house')}
                onCheckedChange={() => handleTypeToggle('house')}
                data-testid="type-filter-house"
              />
              <Label htmlFor="type-house" className="cursor-pointer">House</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-lodge"
                checked={filters.types.includes('lodge')}
                onCheckedChange={() => handleTypeToggle('lodge')}
                data-testid="type-filter-lodge"
              />
              <Label htmlFor="type-lodge" className="cursor-pointer">Lodge</Label>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block" style={{ color: '#1F2937' }}>
            Duration
          </Label>
          <RadioGroup value={filters.duration} onValueChange={handleDurationChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="duration-all" data-testid="duration-filter-all" />
              <Label htmlFor="duration-all" className="cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="night" id="duration-night" data-testid="duration-filter-night" />
              <Label htmlFor="duration-night" className="cursor-pointer">Per Night</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="day" id="duration-day" data-testid="duration-filter-day" />
              <Label htmlFor="duration-day" className="cursor-pointer">Per Day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="duration-week" data-testid="duration-filter-week" />
              <Label htmlFor="duration-week" className="cursor-pointer">Per Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="duration-month" data-testid="duration-filter-month" />
              <Label htmlFor="duration-month" className="cursor-pointer">Per Month</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block" style={{ color: '#1F2937' }}>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-2"
            data-testid="price-range-slider"
          />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onReset}
          data-testid="reset-filters-button"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};
