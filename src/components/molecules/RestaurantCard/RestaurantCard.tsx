import React from 'react';
import { MapPin, Star, Phone, Globe, Shield } from 'lucide-react';
import { Restaurant } from '../../../types';
import { useTheme } from '../../../hooks/useTheme';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  const { theme } = useTheme();

  const getPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={() => onSelect(restaurant)}
    >
      {/* Restaurant Image */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={restaurant.photos[0]} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={theme.spacing.md}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-semibold ${theme.colors.text} flex-1`}>
            {restaurant.name}
          </h3>
          <span className={`text-sm ${theme.colors.textSecondary} ml-2`}>
            {getPriceLevel(restaurant.priceLevel)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span className={`text-sm ${theme.colors.textSecondary}`}>
            {restaurant.address} • {restaurant.distance} mi
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
          <span className={`text-sm font-medium ${theme.colors.text} mr-1`}>
            {restaurant.rating}
          </span>
          <span className={`text-sm ${theme.colors.textSecondary}`}>
            ({restaurant.reviewCount} reviews)
          </span>
        </div>

        {/* Gluten-Free Info */}
        <div className={`${theme.colors.background} ${theme.borderRadius.sm} p-3 mb-3`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">
              Gluten-Free Options
            </span>
            <div className="flex items-center">
              <Shield className={`h-4 w-4 mr-1 ${getSafetyColor(restaurant.glutenFreeOptions.safetyRating)}`} />
              <span className={`text-sm font-medium ${getSafetyColor(restaurant.glutenFreeOptions.safetyRating)}`}>
                {restaurant.glutenFreeOptions.safetyRating}/5
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {restaurant.glutenFreeOptions.hasMenu && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                GF Menu
              </span>
            )}
            {restaurant.glutenFreeOptions.hasDedicatedPrep && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Dedicated Prep
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center justify-between text-sm">
          {restaurant.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-1" />
              <span className={theme.colors.textSecondary}>
                {restaurant.phone}
              </span>
            </div>
          )}
          {restaurant.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-red-600 hover:text-red-700">
                Website
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};