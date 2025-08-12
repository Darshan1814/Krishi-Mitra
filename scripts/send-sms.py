from twilio.rest import Client
import requests

def get_market_prices():
    try:
        url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=3'
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.ok and data.get('records'):
            return data['records'][:3]
        return []
    except:
        return []

client = Client("AC37947924c4f59732a614729521eaa699", "9f54f7b2dd934f5e07aa5ad10e373fcc")

prices = get_market_prices()
message = "KrishiMitra Market Alert\n\nCurrent Prices:\n"

for i, price in enumerate(prices, 1):
    commodity = price.get('commodity', 'N/A')
    modal_price = price.get('modal_price', 'N/A')
    market = price.get('market', 'N/A')
    message += f"{i}. {commodity}: Rs{modal_price}/kg ({market})\n"

message += "\nMore: http://localhost:3000/market-prices"

sms = client.messages.create(
    body=message,
    from_='+18777804236',
    to='+919405442242'
)

print(f"SMS sent! SID: {sms.sid}")