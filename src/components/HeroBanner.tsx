import React from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const HeroBanner: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="py-12 bg-cover bg-center rounded-2xl"
          style={{ backgroundImage: "url('/adinsertion_banner.png')" }}
        >
          <div className="flex items-center justify-center text-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                C'est le moment de vendre
              </h1>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
                <Plus className="mr-2 h-4 w-4" /> Publier une annonce
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;