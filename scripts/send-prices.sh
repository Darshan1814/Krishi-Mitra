#!/bin/bash

# Send market prices via WhatsApp
echo "📱 Sending current market prices via WhatsApp..."

# Default phone number or use provided argument
PHONE_NUMBER=${1:-"+919405442242"}

echo "📞 Sending to: $PHONE_NUMBER"

# Run the market price sender
node send-market-prices.js "$PHONE_NUMBER"