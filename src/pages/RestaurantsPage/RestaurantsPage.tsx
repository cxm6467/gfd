import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { RestaurantCard } from '../../components/molecules/RestaurantCard';
import { Button } from '../../components/atoms/Button';
import { Restaurant } from '../../types';
import { RestaurantService, RestaurantFilters } from '../../services/restaurantService';
import { LocationService } from '../../services/locationService';
import { useTheme } from '../../hooks/useTheme';

export const RestaurantsPage: React.FC = () => {
  const { theme } = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RestaurantFilters>({
    maxDistance: 10,
    minRating: 4.0,
    requiresDedicatedPrep: false
  });
  
  const [isTestMode] = useState(() => {
    const stored = localStorage.getItem('VITE_TEST_MODE');
    return stored ? stored === 'true' : import.meta.env.VITE_TEST_MODE !== 'false';
  });

  const restaurantService = RestaurantService.getInstance();
  const locationService = LocationService.getInstance();

  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      // TODO: Get user's actual location
      const location = await locationService.getCurrentLocation();
      if (location) {
        const results = await restaurantService.findNearbyRestaurants(
          location.latitude,
          location.longitude,
          filters
        );
        setRestaurants(results);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    console.log('Selected restaurant:', restaurant);
    // TODO: Navigate to restaurant detail page or show modal
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto pt-4 md:pt-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
              GF'd Restaurants{isTestMode && import.meta.env.VITE_TEST_MODE === 'true' && <span className="text-red-600"> • San Francisco</span>}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.md} focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md p-4 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Max Distance (miles)
                </label>
                <select
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({...filters, maxDistance: Number(e.target.value)})}
                  className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2`}
                >
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
                  className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2`}
                >
                  <option value={3.0}>3.0+</option>
                  <option value={3.5}>3.5+</option>
                  <option value={4.0}>4.0+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dedicatedPrep"
                  checked={filters.requiresDedicatedPrep}
                  onChange={(e) => setFilters({...filters, requiresDedicatedPrep: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="dedicatedPrep" className={`text-sm ${theme.colors.text}`}>
                  Requires dedicated GF prep area
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className={theme.colors.textSecondary}>Finding gluten-free restaurants...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                Found {filteredRestaurants.length} restaurants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={handleRestaurantSelect}
                />
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${theme.colors.textSecondary} mb-4`}>
                  No restaurants found matching your criteria
                </p>
                <Button onClick={() => setFilters({ maxDistance: 25, minRating: 3.0 })}>
                  Expand Search
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};