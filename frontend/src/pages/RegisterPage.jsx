import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join KrishiMitra</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${
                formData.role === 'farmer' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm">Farmer</span>
              </label>
              <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${
                formData.role === 'vendor' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={formData.role === 'vendor'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm">Vendor</span>
              </label>
              <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${
                formData.role === 'expert' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="expert"
                  checked={formData.role === 'expert'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm">Expert</span>
              </label>
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;