import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendingItem {
  rank: number;
  term: string;
  searches: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

const trendingData: TrendingItem[] = [
  { rank: 1, term: 'iPhone', searches: 45, trend: 'up', percentage: 20 },
  { rank: 2, term: 'Voiture', searches: 38, trend: 'up', percentage: 15 },
  { rank: 3, term: 'Appartement', searches: 32, trend: 'stable', percentage: 2 },
  { rank: 4, term: 'Samsung Galaxy', searches: 28, trend: 'up', percentage: 25 },
  { rank: 5, term: 'PlayStation', searches: 25, trend: 'up', percentage: 40 }
];

const TrendingSearches: React.FC = () => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Recherches tendances</h2>
          </div>
          <span className="text-sm text-gray-500">Mis à jour en temps réel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingData.map((item) => (
            <div
              key={item.rank}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.rank}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.term}</h3>
                    <p className="text-sm text-gray-500">{item.searches} recherches</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(item.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                    {item.trend === 'stable' ? 'Stable' : `${item.percentage}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Basé sur 108 recherches récentes
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingSearches;