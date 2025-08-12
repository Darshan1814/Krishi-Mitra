from twilio.rest import Client
import requests

client = Client("AC37947924c4f59732a614729521eaa699", "9f54f7b2dd934f5e07aa5ad10e373fcc")

# Get market prices
url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=3'
response = requests.get(url)
prices = response.json()['records'][:3]

message = "🌾 KrishiMitra Market Alert\n\n📊 Current Prices:\n\n"
for i, price in enumerate(prices, 1):
    message += f"{i}. {price['commodity']}: ₹{price['modal_price']}/kg\n   📍 {price['market']}, {price['state']}\n\n"

message += "🔗 More: http://localhost:3000/market-prices"

# Send WhatsApp
msg = client.messages.create(
    from_='whatsapp:+14155238886',
    body=message,
    to='whatsapp:+919405442242'
)

print(f"Sent! SID: {msg.sid}")
print("Check your WhatsApp now!")