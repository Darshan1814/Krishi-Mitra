const ColdStorageScraper = require('./utils/coldStorageScraper');

async function testScraper() {
  console.log('Testing Cold Storage Scraper...\n');
  
  const scraper = new ColdStorageScraper();
  
  try {
    const results = await scraper.scrapeAllSources();
    
    console.log(`\n✅ Successfully scraped ${results.length} cold storage facilities\n`);
    
    if (results.length > 0) {
      console.log('Sample results:');
      results.slice(0, 3).forEach((facility, index) => {
        console.log(`\n${index + 1}. ${facility.name}`);
        console.log(`   Address: ${facility.address}`);
        console.log(`   Phone: ${facility.phone}`);
        console.log(`   Capacity: ${facility.capacity}`);
        console.log(`   Source: ${facility.source}`);
      });
      
      // Group by source
      const bySource = results.reduce((acc, item) => {
        acc[item.source] = (acc[item.source] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📊 Results by source:');
      Object.entries(bySource).forEach(([source, count]) => {
        console.log(`   ${source}: ${count} facilities`);
      });
    }
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  }
}

testScraper();