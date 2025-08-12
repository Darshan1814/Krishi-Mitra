import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, language }) => {
  const texts = {
    en: {
      placeholder: 'Search for fertilizers, pesticides, seeds...',
      search: 'Search'
    },
    hi: {
      placeholder: 'उर्वरक, कीटनाशक, बीज खोजें...',
      search: 'खोजें'
    }
  };

  const t = texts[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          {t.search}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;