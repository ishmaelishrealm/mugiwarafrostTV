// Test script for Bunny.net webhook automation
// Run with: node scripts/test-webhook.js

const testWebhook = async () => {
  const webhookUrl = 'http://localhost:3000/api/bunny/webhook';
  
  // Test webhook payload
  const testPayload = {
    eventType: "VideoEncoded",
    videoGuid: "test-video-guid-123",
    title: "My Status as an Assassin Obviously Exceeds the Hero's - Episode 1",
    libraryId: "506159"
  };

  console.log('🧪 Testing Bunny.net webhook automation...');
  console.log('📤 Sending test payload:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Webhook test failed!');
      console.log('🚨 Error:', result);
    }
  } catch (error) {
    console.error('💥 Webhook test error:', error.message);
  }
};

// Only run if this script is executed directly
if (require.main === module) {
  testWebhook();
}

module.exports = { testWebhook };
