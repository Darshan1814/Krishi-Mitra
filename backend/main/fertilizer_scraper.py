from flask import Flask, request, jsonify
from flask_cors import CORS
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import requests
import json
import re

app = Flask(__name__)
CORS(app)

def scrape_amazon_fertilizers(query):
    """Scrape Amazon for fertilizer products"""
    products = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Navigate to Amazon search
            search_url = f"https://www.amazon.in/s?k={query}+fertilizer"
            page.goto(search_url, wait_until='networkidle')
            page.wait_for_timeout(2000)
            
            # Extract product data
            product_containers = page.query_selector_all('[data-component-type="s-search-result"]')
            
            for container in product_containers[:5]:
                try:
                    # Get product title
                    title_elem = container.query_selector('h2 a span')
                    title = title_elem.inner_text().strip() if title_elem else None
                    
                    # Get product image
                    img_elem = container.query_selector('img')
                    image = img_elem.get_attribute('src') if img_elem else None
                    
                    # Get price
                    price_elem = container.query_selector('.a-price-whole')
                    price = f"₹{price_elem.inner_text().strip()}" if price_elem else "Price not available"
                    
                    # Get rating
                    rating_elem = container.query_selector('.a-icon-alt')
                    rating_text = rating_elem.get_attribute('textContent') if rating_elem else "4.0"
                    rating = re.findall(r'\d+\.\d+', rating_text)[0] if re.findall(r'\d+\.\d+', rating_text) else "4.0"
                    
                    if title and image:
                        products.append({
                            'title': title[:80],
                            'image': image,
                            'price': price,
                            'rating': float(rating),
                            'platform': 'Amazon'
                        })
                except Exception as e:
                    continue
            
            browser.close()
    except Exception as e:
        print(f"Amazon scraping error: {e}")
    
    return products

def scrape_flipkart_fertilizers(query):
    """Scrape Flipkart for fertilizer products"""
    products = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Navigate to Flipkart search
            search_url = f"https://www.flipkart.com/search?q={query}+fertilizer"
            page.goto(search_url, wait_until='networkidle')
            page.wait_for_timeout(2000)
            
            # Extract product data
            product_containers = page.query_selector_all('._1AtVbE')
            
            for container in product_containers[:5]:
                try:
                    # Get product title
                    title_elem = container.query_selector('._4rR01T')
                    title = title_elem.inner_text().strip() if title_elem else None
                    
                    # Get product image
                    img_elem = container.query_selector('img')
                    image = img_elem.get_attribute('src') if img_elem else None
                    
                    # Get price
                    price_elem = container.query_selector('._30jeq3')
                    price = price_elem.inner_text().strip() if price_elem else "Price not available"
                    
                    if title and image:
                        products.append({
                            'title': title[:80],
                            'image': image,
                            'price': price,
                            'rating': 4.2,
                            'platform': 'Flipkart'
                        })
                except Exception as e:
                    continue
            
            browser.close()
    except Exception as e:
        print(f"Flipkart scraping error: {e}")
    
    return products

def scrape_bighaat_fertilizers(query):
    """Scrape BigHaat for fertilizer products"""
    products = []
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        url = f'https://www.bighaat.com/catalogsearch/result/?q={query}'
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        items = soup.find_all('div', class_='product-item-info')[:5]
        
        for item in items:
            try:
                title_elem = item.find('a', class_='product-item-link')
                title = title_elem.get_text().strip() if title_elem else None
                
                img_elem = item.find('img')
                image = img_elem.get('src') if img_elem else None
                
                price_elem = item.find('span', class_='price')
                price = price_elem.get_text().strip() if price_elem else "Price not available"
                
                if title and image:
                    products.append({
                        'title': title[:80],
                        'image': image,
                        'price': price,
                        'rating': 4.1,
                        'platform': 'BigHaat'
                    })
            except Exception as e:
                continue
                
    except Exception as e:
        print(f"BigHaat scraping error: {e}")
    
    return products

@app.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    all_products = []
    
    # Scrape from all platforms
    amazon_products = scrape_amazon_fertilizers(query)
    flipkart_products = scrape_flipkart_fertilizers(query)
    bighaat_products = scrape_bighaat_fertilizers(query)
    
    # Combine all products
    for i, product in enumerate(amazon_products):
        all_products.append({
            'id': f'amz_{i}',
            'name': product['title'],
            'image': product['image'],
            'price': product['price'],
            'rating': product['rating'],
            'platform': product['platform'],
            'url': f"https://amazon.in/s?k={query}"
        })
    
    for i, product in enumerate(flipkart_products):
        all_products.append({
            'id': f'fk_{i}',
            'name': product['title'],
            'image': product['image'],
            'price': product['price'],
            'rating': product['rating'],
            'platform': product['platform'],
            'url': f"https://flipkart.com/search?q={query}"
        })
    
    for i, product in enumerate(bighaat_products):
        all_products.append({
            'id': f'bh_{i}',
            'name': product['title'],
            'image': product['image'],
            'price': product['price'],
            'rating': product['rating'],
            'platform': product['platform'],
            'url': f"https://bighaat.com/catalogsearch/result/?q={query}"
        })
    
    return jsonify({
        'query': query,
        'products': all_products,
        'total': len(all_products)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5005)