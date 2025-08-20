// Test script for Tankeintrag API endpoints
// Run this after starting the Strapi server with: npm run dev

const API_BASE = 'http://localhost:1337/api';

// Test data
const testTankeintrag = {
  data: {
    tank_id: 12345,
    tankdatum: '2024-01-15T10:30:00Z',
    tankstelle: 'Shell Tankstelle Hauptstraße',
    liter: 45.5,
    preis_pro_liter: 1.549,
    gesamtpreis: 70.48,
    kilometerstand: 85000,
    treibstoff_art: 'Diesel',
    bemerkung: 'Vollgetankt für Geschäftsreise'
  }
};

async function testAPI() {
  console.log('🧪 Testing Tankeintrag API endpoints...\n');

  try {
    // Test 1: GET all tankeintrags (should be empty initially)
    console.log('1. Testing GET /api/tankeintrags');
    const getResponse = await fetch(`${API_BASE}/tankeintrags`);
    const getData = await getResponse.json();
    console.log(`   Status: ${getResponse.status}`);
    console.log(`   Data count: ${getData.data?.length || 0}\n`);

    // Test 2: POST create new tankeintrag
    console.log('2. Testing POST /api/tankeintrags');
    const postResponse = await fetch(`${API_BASE}/tankeintrags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTankeintrag)
    });
    const postData = await postResponse.json();
    console.log(`   Status: ${postResponse.status}`);
    
    if (postResponse.ok) {
      console.log(`   Created tankeintrag with ID: ${postData.data.id}`);
      console.log(`   Tank ID: ${postData.data.attributes.tank_id}`);
      console.log(`   Tankstelle: ${postData.data.attributes.tankstelle}`);
      console.log(`   Liter: ${postData.data.attributes.liter}`);
      console.log(`   Gesamtpreis: €${postData.data.attributes.gesamtpreis}\n`);
      
      // Test 3: GET specific tankeintrag
      console.log(`3. Testing GET /api/tankeintrags/${postData.data.id}`);
      const getSingleResponse = await fetch(`${API_BASE}/tankeintrags/${postData.data.id}`);
      const getSingleData = await getSingleResponse.json();
      console.log(`   Status: ${getSingleResponse.status}`);
      console.log(`   Retrieved tankeintrag: ${getSingleData.data.attributes.tankstelle}\n`);
      
      // Test 4: GET analysis endpoint
      console.log('4. Testing GET /api/tankeintrags/analysis');
      const analysisResponse = await fetch(`${API_BASE}/tankeintrags/analysis`);
      const analysisData = await analysisResponse.json();
      console.log(`   Status: ${analysisResponse.status}`);
      
      if (analysisResponse.ok) {
        console.log(`   Total entries: ${analysisData.data.totalEntries}`);
        console.log(`   Total liters: ${analysisData.data.totalLiters.toFixed(2)} L`);
        console.log(`   Total cost: €${analysisData.data.totalCost.toFixed(2)}`);
        console.log(`   Average price/liter: €${analysisData.data.averagePricePerLiter.toFixed(3)}\n`);
      }
      
    } else {
      console.log(`   Error: ${postData.error?.message || 'Unknown error'}\n`);
    }

    // Test 5: GET all fahrzeug and fahrer to verify relations work
    console.log('5. Testing related collections');
    
    const fahrersResponse = await fetch(`${API_BASE}/fahrers`);
    const fahrersData = await fahrersResponse.json();
    console.log(`   Fahrers available: ${fahrersData.data?.length || 0}`);
    
    const fahrzeugsResponse = await fetch(`${API_BASE}/fahrzeugs`);
    const fahrzeugsData = await fahrzeugsResponse.json();
    console.log(`   Fahrzeugs available: ${fahrzeugsData.data?.length || 0}\n`);

    console.log('✅ API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Start Strapi server with: npm run dev');
    console.log('   2. Server should be running on http://localhost:1337');
    console.log('   3. Complete the initial admin setup');
    console.log('   4. Configure API permissions in admin panel:');
    console.log('      Settings > Roles & Permissions > Public role');
    console.log('      Enable find/create for Tankeintrag, Fahrer, Fahrzeug');
  }
}

// Run tests
testAPI();