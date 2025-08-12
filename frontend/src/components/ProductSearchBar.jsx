import React from 'react';
import { Search } from 'lucide-react';
import TranslatableText from './TranslatableText';

const ProductSearchBar = ({ searchTerm, setSearchTerm, onSearch, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for fertilizers, pesticides, seeds, equipment..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={!searchTerm.trim() || loading}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Searching...' : <TranslatableText>Search</TranslatableText>}
        </button>
      </div>
    </form>
  );
};

export default ProductSearchBar;