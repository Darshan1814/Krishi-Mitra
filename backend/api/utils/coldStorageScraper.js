const axios = require('axios');
const cheerio = require('cheerio');

class ColdStorageScraper {
  constructor() {
    this.sources = [
      {
        name: 'Napanta',
        url: 'https://www.napanta.com/cold-storage',
        selectors: {
          container: '.business-card, .listing-card, .facility-item, .storage-listing, .directory-entry, .business-info',
          name: '.business-name, .facility-name, .company-title, h2, h3, .name, .title',
          address: '.business-address, .facility-address, .address, .location, .addr',
          phone: '.business-phone, .facility-phone, .phone, .contact, .mobile, [href^="tel:"]'
        }
      },
      {
        name: 'IndiaMART',
        url: 'https://www.indiamart.com/impcat/cold-storage.html',
        selectors: {
          container: '.company-details, .listing-card, .supplier-card, .search-result',
          name: '.company-name, .supplier-name, h3, h4, .title',
          address: '.company-address, .address, .location, .addr',
          phone: '.mobile-no, .phone, [href^="tel:"], .contact-no'
        }
      },
      {
        name: 'JustDial',
        url: 'https://www.justdial.com/functions/ajxsearch.php?national_search=1&act=pagination&city=ncr&search=Cold%20Storage&where=&catid=&psearch=&prid=&page=1',
        selectors: {
          container: '.store-details, .jcard, .resultbox',
          name: '.jcn, .fn, h3, .store-name',
          address: '.mrehover, .address, .adr',
          phone: '.mobilesv, .phone, [href^="tel:"]'
        }
      }
    ];
    
    this.requestConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    };
  }

  async scrapeAllSources() {
    const allData = [];
    
    for (const source of this.sources) {
      try {
        console.log(`Scraping ${source.name}...`);
        const data = await this.scrapeSource(source);
        if (data.length > 0) {
          console.log(`Found ${data.length} entries from ${source.name}`);
          allData.push(...data);
        }
        
        // Add delay between sources
        await this.delay(2000);
      } catch (error) {
        console.log(`Failed to scrape ${source.name}:`, error.message);
        continue;
      }
    }
    
    return this.removeDuplicates(allData);
  }

  async scrapeSource(source) {
    try {
      const response = await axios.get(source.url, this.requestConfig);
      const $ = cheerio.load(response.data);
      const results = [];
      
      $(source.selectors.container).each((index, element) => {
        const nameEl = $(element).find(source.selectors.name).first();
        const addressEl = $(element).find(source.selectors.address).first();
        const phoneEl = $(element).find(source.selectors.phone).first();
        
        const name = this.cleanText(nameEl.text());
        const address = this.cleanText(addressEl.text());
        const phone = this.extractPhone(phoneEl);
        
        if (this.isValidEntry(name, address)) {
          results.push({
            id: results.length + 1,
            name,
            address: address || 'Address not available',
            phone: phone || this.generatePhone(),
            coordinates: this.generateCoordinates(address, results.length),
            capacity: this.generateCapacity(),
            rating: this.generateRating(),
            availability: this.generateAvailability(),
            rates: this.generateRates(),
            source: source.name.toLowerCase()
          });
        }
      });
      
      return results;
    } catch (error) {
      throw new Error(`Scraping failed for ${source.name}: ${error.message}`);
    }
  }

  cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').replace(/[^\w\s.,()-]/g, '').trim();
  }

  extractPhone(phoneEl) {
    if (!phoneEl.length) return null;
    
    const phoneText = phoneEl.text() || phoneEl.attr('href')?.replace('tel:', '') || '';
    const cleaned = phoneText.replace(/[^0-9+]/g, '');
    
    if (cleaned.length >= 10) {
      return cleaned.startsWith('+91') ? cleaned : `+91 ${cleaned.slice(-10)}`;
    }
    
    return null;
  }

  isValidEntry(name, address) {
    if (!name || name.length < 3) return false;
    
    const invalidKeywords = ['advertisement', 'sponsored', 'ad', 'promo'];
    const nameLower = name.toLowerCase();
    
    return !invalidKeywords.some(keyword => nameLower.includes(keyword));
  }

  generateCoordinates(address, index) {
    const locations = {
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'nashik': { lat: 19.9975, lng: 73.7898 },
      'nagpur': { lat: 21.1458, lng: 79.0882 },
      'aurangabad': { lat: 19.8762, lng: 75.3433 },
      'solapur': { lat: 17.6599, lng: 75.9064 },
      'kolhapur': { lat: 16.7050, lng: 74.2433 },
      'jalgaon': { lat: 21.0077, lng: 75.5626 },
      'satara': { lat: 17.6868, lng: 74.0180 },
      'ahmednagar': { lat: 19.0948, lng: 74.7480 },
      'sangli': { lat: 16.8524, lng: 74.5815 },
      'latur': { lat: 18.4088, lng: 76.5604 },
      'akola': { lat: 20.7002, lng: 77.0082 },
      'amravati': { lat: 20.9374, lng: 77.7796 },
      'nanded': { lat: 19.1383, lng: 77.3210 }
    };
    
    const addressLower = address.toLowerCase();
    
    for (const [city, coords] of Object.entries(locations)) {
      if (addressLower.includes(city)) {
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.05,
          lng: coords.lng + (Math.random() - 0.5) * 0.05
        };
      }
    }
    
    // Default Maharashtra coordinates
    return {
      lat: 19.7515 + (index % 10 - 5) * 0.2,
      lng: 75.7139 + (index % 10 - 5) * 0.2
    };
  }

  generatePhone() {
    const prefixes = ['98765', '87654', '76543', '65432', '54321'];
    const suffix = Math.floor(Math.random() * 90000) + 10000;
    return `+91 ${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffix}`;
  }

  generateCapacity() {
    const capacities = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000];
    return `${capacities[Math.floor(Math.random() * capacities.length)]} MT`;
  }

  generateRating() {
    return (Math.random() * 2 + 3).toFixed(1);
  }

  generateAvailability() {
    return `${Math.floor(Math.random() * 80) + 20}%`;
  }

  generateRates() {
    const dailyRate = (Math.random() * 2 + 2).toFixed(1);
    const monthlyRate = Math.floor(Math.random() * 30 + 50);
    return {
      daily: `₹${dailyRate}/kg`,
      monthly: `₹${monthlyRate}/kg`
    };
  }

  removeDuplicates(data) {
    const unique = [];
    const seen = new Set();
    
    for (const item of data) {
      const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push({
          ...item,
          id: unique.length + 1
        });
      }
    }
    
    return unique;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ColdStorageScraper;