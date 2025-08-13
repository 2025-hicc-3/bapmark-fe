import React from 'react';
import type { SearchResult } from '../../types/search';

interface SearchResultsProps {
  results: SearchResult[];
  onPlaceSelect: (place: SearchResult) => void;
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onPlaceSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">검색 중...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
      {results.map((place) => (
        <div
          key={place.id}
          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onPlaceSelect(place)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {place.name}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {place.roadAddress || place.address}
              </p>
              {place.category && (
                <p className="text-xs text-blue-600 mt-1">{place.category}</p>
              )}
            </div>
            {place.phone && (
              <div className="text-xs text-gray-500 text-right">
                {place.phone}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
