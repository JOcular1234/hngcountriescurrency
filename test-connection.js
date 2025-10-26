const axios = require('axios');

async function testConnectivity() {
  console.log('🔍 Testing external API connectivity...\n');

  // Test 1: REST Countries API
  try {
    console.log('1️⃣ Testing REST Countries API...');
    const response = await axios.get('https://restcountries.com/v2/all?fields=name', { timeout: 10000 });
    console.log('✅ REST Countries API - SUCCESS');
    console.log(`   Retrieved ${response.data.length} countries\n`);
  } catch (error) {
    console.log('❌ REST Countries API - FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 2: Exchange Rate API
  try {
    console.log('2️⃣ Testing Exchange Rate API...');
    const response = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 10000 });
    console.log('✅ Exchange Rate API - SUCCESS');
    console.log(`   Retrieved ${Object.keys(response.data.rates).length} exchange rates\n`);
  } catch (error) {
    console.log('❌ Exchange Rate API - FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 3: General Internet
  try {
    console.log('3️⃣ Testing general internet (Google)...');
    await axios.get('https://www.google.com', { timeout: 10000 });
    console.log('✅ Google - SUCCESS\n');
  } catch (error) {
    console.log('❌ Google - FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('📊 Diagnosis:');
  console.log('─────────────────────────────────────');
  console.log('If all tests failed → Check internet connection');
  console.log('If Google works but APIs fail → DNS/Firewall issue');
  console.log('If only one API fails → That specific service is down');
  console.log('\n💡 Solutions:');
  console.log('1. Change DNS to 8.8.8.8 (Google DNS)');
  console.log('2. Disable VPN temporarily');
  console.log('3. Check firewall settings');
  console.log('4. Try mobile hotspot');
}

testConnectivity();
