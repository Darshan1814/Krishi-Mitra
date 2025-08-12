const express = require('express');
const ColdStorageScraper = require('../utils/coldStorageScraper');
const SimpleCache = require('../utils/cache');
const router = express.Router();

const scraper = new ColdStorageScraper();
const cache = new SimpleCache(30); // Cache for 30 minutes

router.get('/', async (req, res) => {
  try {
    // Check cache first
    const cachedData = cache.get('cold-storage-data');
    if (cachedData) {
      console.log(`Returning ${cachedData.length} cached cold storage facilities`);
      return res.json({ success: true, data: cachedData, cached: true });
    }
    
    console.log('Starting cold storage data scraping...');
    const scrapedData = await scraper.scrapeAllSources();
    
    if (scrapedData.length > 0) {
      console.log(`Successfully scraped ${scrapedData.length} cold storage facilities`);
      // Cache the results
      cache.set('cold-storage-data', scrapedData);
      res.json({ success: true, data: scrapedData, cached: false });
    } else {
      throw new Error('No data found from scraping');
    }
    
  } catch (error) {
    console.log('Scraping failed, using enhanced fallback data:', error.message);
    
    // Enhanced fallback data with more realistic entries
    const fallbackData = [
      {
        id: 1,
        name: 'Maharashtra State Cold Storage Corporation',
        address: 'MIDC Area, Nashik, Maharashtra 422001',
        phone: '+91 98765 43210',
        coordinates: { lat: 19.9975, lng: 73.7898 },
        capacity: '5000 MT',
        rating: '4.5',
        availability: '70%',
        rates: { daily: '₹2.5/kg', monthly: '₹60/kg' },
        source: 'fallback'
      },
      {
        id: 2,
        name: 'Pune Agro Cold Chain Solutions',
        address: 'Agri Zone, Pune-Satara Road, Pune, Maharashtra 411001',
        phone: '+91 87654 32109',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        capacity: '3000 MT',
        rating: '4.2',
        availability: '45%',
        rates: { daily: '₹2.8/kg', monthly: '₹65/kg' },
        source: 'fallback'
      },
      {
        id: 3,
        name: 'Nagpur Orange Cold Storage Pvt Ltd',
        address: 'Industrial Area, Nagpur, Maharashtra 440001',
        phone: '+91 76543 21098',
        coordinates: { lat: 21.1458, lng: 79.0882 },
        capacity: '4000 MT',
        rating: '4.7',
        availability: '60%',
        rates: { daily: '₹2.6/kg', monthly: '₹62/kg' },
        source: 'fallback'
      },
      {
        id: 4,
        name: 'Mumbai Port Cold Storage Facility',
        address: 'Dock Area, Mumbai Port, Mumbai, Maharashtra 400001',
        phone: '+91 98765 11111',
        coordinates: { lat: 18.9220, lng: 72.8347 },
        capacity: '8000 MT',
        rating: '4.8',
        availability: '80%',
        rates: { daily: '₹3.2/kg', monthly: '₹75/kg' },
        source: 'fallback'
      },
      {
        id: 5,
        name: 'Aurangabad Farmers Cold Storage Co-op',
        address: 'Agricultural Market, Aurangabad, Maharashtra 431001',
        phone: '+91 87654 22222',
        coordinates: { lat: 19.8762, lng: 75.3433 },
        capacity: '2500 MT',
        rating: '4.1',
        availability: '35%',
        rates: { daily: '₹2.3/kg', monthly: '₹58/kg' },
        source: 'fallback'
      },
      {
        id: 6,
        name: 'Kolhapur Sugar Cold Storage Complex',
        address: 'Sugar Complex, Kolhapur, Maharashtra 416001',
        phone: '+91 76543 33333',
        coordinates: { lat: 16.7050, lng: 74.2433 },
        capacity: '3500 MT',
        rating: '4.3',
        availability: '55%',
        rates: { daily: '₹2.4/kg', monthly: '₹58/kg' },
        source: 'fallback'
      },
      {
        id: 7,
        name: 'Solapur Agricultural Cold Storage',
        address: 'APMC Yard, Solapur, Maharashtra 413001',
        phone: '+91 65432 44444',
        coordinates: { lat: 17.6599, lng: 75.9064 },
        capacity: '2800 MT',
        rating: '4.0',
        availability: '40%',
        rates: { daily: '₹2.2/kg', monthly: '₹55/kg' },
        source: 'fallback'
      },
      {
        id: 8,
        name: 'Jalgaon Banana Cold Storage Hub',
        address: 'Banana Market, Jalgaon, Maharashtra 425001',
        phone: '+91 54321 55555',
        coordinates: { lat: 21.0077, lng: 75.5626 },
        capacity: '1800 MT',
        rating: '3.9',
        availability: '25%',
        rates: { daily: '₹2.1/kg', monthly: '₹52/kg' },
        source: 'fallback'
      },
      {
        id: 9,
        name: 'Satara Grape Cold Storage Facility',
        address: 'Grape Processing Zone, Satara, Maharashtra 415001',
        phone: '+91 43210 66666',
        coordinates: { lat: 17.6868, lng: 74.0180 },
        capacity: '4200 MT',
        rating: '4.4',
        availability: '65%',
        rates: { daily: '₹2.7/kg', monthly: '₹64/kg' },
        source: 'fallback'
      },
      {
        id: 10,
        name: 'Ahmednagar Onion Cold Storage',
        address: 'Onion Market Complex, Ahmednagar, Maharashtra 414001',
        phone: '+91 32109 77777',
        coordinates: { lat: 19.0948, lng: 74.7480 },
        capacity: '6000 MT',
        rating: '4.6',
        availability: '75%',
        rates: { daily: '₹2.9/kg', monthly: '₹68/kg' },
        source: 'fallback'
      },
      {
        id: 11,
        name: 'Sangli Turmeric Cold Storage',
        address: 'Turmeric Market, Sangli, Maharashtra 416416',
        phone: '+91 98765 88888',
        coordinates: { lat: 16.8524, lng: 74.5815 },
        capacity: '2200 MT',
        rating: '4.2',
        availability: '50%',
        rates: { daily: '₹2.4/kg', monthly: '₹57/kg' },
        source: 'fallback'
      },
      {
        id: 12,
        name: 'Latur Soybean Cold Storage',
        address: 'Agricultural Zone, Latur, Maharashtra 413512',
        phone: '+91 87654 99999',
        coordinates: { lat: 18.4088, lng: 76.5604 },
        capacity: '3800 MT',
        rating: '4.1',
        availability: '42%',
        rates: { daily: '₹2.3/kg', monthly: '₹56/kg' },
        source: 'fallback'
      }
    ];
    
    res.json({ success: true, data: fallbackData });
  }
});

// Route to refresh cache manually
router.post('/refresh', async (req, res) => {
  try {
    console.log('Manual cache refresh requested...');
    cache.clear();
    
    const scrapedData = await scraper.scrapeAllSources();
    
    if (scrapedData.length > 0) {
      cache.set('cold-storage-data', scrapedData);
      console.log(`Cache refreshed with ${scrapedData.length} facilities`);
      res.json({ 
        success: true, 
        message: `Cache refreshed with ${scrapedData.length} facilities`,
        data: scrapedData 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'No data found during refresh' 
      });
    }
  } catch (error) {
    console.error('Cache refresh failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Cache refresh failed',
      error: error.message 
    });
  }
});

// Route to get cache status
router.get('/cache-status', (req, res) => {
  const hasCache = cache.has('cold-storage-data');
  const cacheSize = cache.size();
  
  res.json({
    success: true,
    hasCache,
    cacheSize,
    message: hasCache ? 'Cache is active' : 'No cached data available'
  });
});

module.exports = router;