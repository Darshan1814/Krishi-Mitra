import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Loader } from 'lucide-react';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://newsapi.org/v2/everything?q=farmers&language=en&from=2025-07-28&sortBy=publishedAt&apiKey=10d2436900cd4ef3b1580fba32919ec8');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNews(data.articles);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      setError('Error fetching news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Agriculture News</h1>
      
      <div className="grid gap-6">
        {news.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-4">
              {article.urlToImage && (
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              )}
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span>{article.source.name}</span>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;