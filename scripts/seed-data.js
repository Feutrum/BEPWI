#!/usr/bin/env node

/**
 * Manual Database Seeding Script
 * Run with: node scripts/seed-data.js
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:1337/api';
const ADMIN_API_BASE = 'http://localhost:1337/admin';

// Store created entity IDs for relationships
const createdEntities = {
  positions: [],
  qualifications: [],
  licenses: [],
  models: [],
  locations: [],
  customers: [],
  articles: [],
  personnel: [],
  vehicles: []
};

async function getAuthToken() {
  try {
    const response = await fetch(`${ADMIN_API_BASE}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'admin@example.com', // Change to your admin email
        password: 'your-admin-password'   // Change to your admin password
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate. Check your admin credentials.');
    }

    const data = await response.json();
    return data.jwt;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('Please update the admin credentials in this script.');
    process.exit(1);
  }
}

async function createEntity(endpoint, data, token) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create ${endpoint}: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error creating ${endpoint}:`, error.message);
    throw error;
  }
}

async function seedPositions(token) {
  console.log('🔨 Creating positions...');
  const positions = [
    { bezeichnung: 'Betriebsleiter' },
    { bezeichnung: 'Traktorfahrer' },
    { bezeichnung: 'Erntehelfer' },
    { bezeichnung: 'Mechaniker' },
    { bezeichnung: 'Bürokraft' }
  ];

  for (const position of positions) {
    const created = await createEntity('/positions', position, token);
    createdEntities.positions.push(created.data);
  }
  console.log(`✅ Created ${positions.length} positions`);
}

async function seedQualifications(token) {
  console.log('🎓 Creating qualifications...');
  const qualifications = [
    { bezeichnung: 'Traktorführerschein Klasse T' },
    { bezeichnung: 'LKW-Führerschein Klasse C' },
    { bezeichnung: 'Gabelstapler-Schein' },
    { bezeichnung: 'Pflanzenschutz-Sachkunde' }
  ];

  for (const qualification of qualifications) {
    const created = await createEntity('/qualifikations', qualification, token);
    createdEntities.qualifications.push(created.data);
  }
  console.log(`✅ Created ${qualifications.length} qualifications`);
}

async function seedCustomers(token) {
  console.log('👥 Creating customers...');
  const customers = [
    {
      name: 'Bioland Müller GmbH',
      telefon: '+49 123 456789',
      plz: '12345',
      ort: 'Berlin',
      strasse: 'Hauptstraße',
      hausnummer: '123',
      iban: 'DE89370400440532013000'
    },
    {
      name: 'Obstbau Schmidt',
      telefon: '+49 987 654321',
      plz: '54321',
      ort: 'München',
      strasse: 'Gartenweg',
      hausnummer: '45',
      iban: 'DE89370400440532013001'
    },
    {
      name: 'Landwirtschaft Weber',
      telefon: '+49 555 123456',
      plz: '67890',
      ort: 'Hamburg',
      strasse: 'Feldstraße',
      hausnummer: '78',
      iban: 'DE89370400440532013002'
    }
  ];

  for (const customer of customers) {
    const created = await createEntity('/kundes', customer, token);
    createdEntities.customers.push(created.data);
  }
  console.log(`✅ Created ${customers.length} customers`);
}

async function seedPersonnel(token) {
  console.log('👨‍💼 Creating personnel...');

  if (createdEntities.positions.length === 0) {
    console.log('⚠️ No positions found, skipping personnel creation');
    return;
  }

  const personnel = [
    {
      vorname: 'Hans',
      nachname: 'Mueller',
      geburtsdatum: '1980-05-15',
      telefon: '+49 111 111111',
      email: 'hans.mueller@bepwi.de',
      einstellungsdatum: '2020-01-01',
      status: 'aktiv',
      position: createdEntities.positions[0].id // Betriebsleiter
    },
    {
      vorname: 'Maria',
      nachname: 'Schmidt',
      geburtsdatum: '1990-08-22',
      telefon: '+49 222 222222',
      email: 'maria.schmidt@bepwi.de',
      einstellungsdatum: '2021-03-15',
      status: 'aktiv',
      position: createdEntities.positions[1].id // Traktorfahrer
    },
    {
      vorname: 'Klaus',
      nachname: 'Weber',
      geburtsdatum: '1975-12-10',
      telefon: '+49 333 333333',
      email: 'klaus.weber@bepwi.de',
      einstellungsdatum: '2019-06-01',
      status: 'aktiv',
      position: createdEntities.positions[3].id // Mechaniker
    }
  ];

  for (const person of personnel) {
    const created = await createEntity('/personals', person, token);
    createdEntities.personnel.push(created.data);
  }
  console.log(`✅ Created ${personnel.length} personnel`);
}

async function seedArticles(token) {
  console.log('📦 Creating articles...');
  const articles = [
    {
      bezeichnung: 'Diesel',
      kategorie: 'Kraftstoff',
      einheit: 'liter',
      mindestbestand: 1000,
      zustand: 'neu',
      beschreibung: 'Diesel für Fahrzeuge und Maschinen'
    },
    {
      bezeichnung: 'NPK-Dünger 15-15-15',
      kategorie: 'Düngemittel',
      einheit: 'kg',
      mindestbestand: 500,
      zustand: 'neu',
      beschreibung: 'Universaldünger für alle Kulturen'
    },
    {
      bezeichnung: 'Weizensaatgut',
      kategorie: 'Saatgut',
      einheit: 'kg',
      mindestbestand: 200,
      zustand: 'neu',
      beschreibung: 'Winterweizen Sorte Elixer'
    },
    {
      bezeichnung: 'Traktor-Hydrauliköl',
      kategorie: 'Betriebsstoffe',
      einheit: 'liter',
      mindestbestand: 50,
      zustand: 'neu',
      beschreibung: 'Hydrauliköl für Traktoren'
    }
  ];

  for (const article of articles) {
    const created = await createEntity('/artikels', article, token);
    createdEntities.articles.push(created.data);
  }
  console.log(`✅ Created ${articles.length} articles`);
}

async function seedFields(token) {
  console.log('🌾 Creating fields...');
  const fields = [
    {
      bezeichnung: 'Nordfeld',
      groesse: 15.5,
      einheit: 'ha',
      beschreibung: 'Hauptfeld für Getreideanbau'
    },
    {
      bezeichnung: 'Südfeld',
      groesse: 12.3,
      einheit: 'ha',
      beschreibung: 'Feld für Hackfrüchte'
    },
    {
      bezeichnung: 'Westfeld',
      groesse: 8.7,
      einheit: 'ha',
      beschreibung: 'Versuchsfeld für neue Sorten'
    }
  ];

  for (const field of fields) {
    await createEntity('/felds', field, token);
  }
  console.log(`✅ Created ${fields.length} fields`);
}

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log('Make sure Strapi is running on http://localhost:1337');

  try {
    // Get authentication token
    const token = await getAuthToken();
    console.log('✅ Authenticated successfully');

    // Seed data in correct order (dependencies first)
    await seedPositions(token);
    await seedQualifications(token);
    await seedCustomers(token);
    await seedPersonnel(token);
    await seedArticles(token);
    await seedFields(token);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Positions: ${createdEntities.positions.length}`);
    console.log(`- Qualifications: ${createdEntities.qualifications.length}`);
    console.log(`- Customers: ${createdEntities.customers.length}`);
    console.log(`- Personnel: ${createdEntities.personnel.length}`);
    console.log(`- Articles: ${createdEntities.articles.length}`);
    console.log('\n🔗 You can now view the data at:');
    console.log('- Admin Panel: http://localhost:1337/admin');
    console.log('- API Documentation: http://localhost:1337/documentation');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };