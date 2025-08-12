from twilio.rest import Client

client = Client("AC37947924c4f59732a614729521eaa699", "9f54f7b2dd934f5e07aa5ad10e373fcc")

# Check WhatsApp sandbox settings
try:
    sandbox = client.messaging.v1.services.list()
    print("Sandbox info:")
    for service in sandbox:
        print(f"Service SID: {service.sid}")
        print(f"Friendly Name: {service.friendly_name}")
except Exception as e:
    print(f"Error: {e}")

# Send simple message
message = client.messages.create(
    from_='whatsapp:+14155238886',
    body='Test from KrishiMitra',
    to='whatsapp:+919405442242'
)

print(f"\nMessage Status: {message.status}")
print(f"Error Code: {message.error_code}")
print(f"Error Message: {message.error_message}")