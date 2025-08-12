from twilio.rest import Client

client = Client("AC37947924c4f59732a614729521eaa699", "9f54f7b2dd934f5e07aa5ad10e373fcc")

message = client.messages.create(
    from_='whatsapp:+14155238886',
    body='🌾 KrishiMitra Test Message\n\nThis is a test message to verify WhatsApp delivery.',
    to='whatsapp:+919405442242'
)

print(f"Message SID: {message.sid}")
print(f"Status: {message.status}")
print(f"To: {message.to}")
print(f"From: {message.from_}")