import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Cloud, FileText, ShoppingBag, TrendingUp, Users, Newspaper, CreditCard, Thermometer, Leaf, LogIn, UserPlus } from 'lucide-react';
import TranslatableText from './TranslatableText';
import homeIcon from '../assets/home.png';
import weatherIcon from '../assets/weather.png';
import ecommerceIcon from '../assets/ecommerce.png';
import newsIcon from '../assets/Latest news.png';
import loanIcon from '../assets/loan.png';
import storageIcon from '../assets/Cold Storage.png';
import diseaseIcon from '../assets/diseases.png';

const GlassNavbar = () => {
  const navItems = [
    { icon: homeIcon, label: 'Home', path: '/' },
    { icon: weatherIcon, label: 'Weather', path: '/weather' },
    { icon: ecommerceIcon, label: 'Shop', path: '/ecommerce' },
    { icon: newsIcon, label: 'News', path: '/news' },
    { icon: loanIcon, label: 'Loans', path: '/loans' },
    { icon: storageIcon, label: 'Storage', path: '/cold-storage' },
    { icon: diseaseIcon, label: 'Disease', path: '/camera' },
    { icon: ShoppingBag, label: 'Dealers', path: '/fertilizer-dealers' },
    { icon: CreditCard, label: 'Schemes', path: '/schemes' },
    { icon: TrendingUp, label: 'Prices', path: '/market-prices' },
    { icon: LogIn, label: 'Login', path: '/login' },
    { icon: UserPlus, label: 'Sign Up', path: '/register' }
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-500/20 backdrop-blur-md rounded-2xl border border-green-300/30 shadow-xl">
        <div className="flex items-center space-x-0 p-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-green-400/30 transition-all duration-300 group"
            >
              {typeof item.icon === 'string' ? (
                <img src={item.icon} alt={item.label} className="w-6 h-6 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" />
              ) : (
                <item.icon className="w-6 h-6 text-white/80 group-hover:text-white transition-all" />
              )}
              <span className="text-xs text-white/80 group-hover:text-white mt-1 text-center">
                <TranslatableText>{item.label}</TranslatableText>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;