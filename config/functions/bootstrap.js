'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 */

module.exports = async () => {
  // Set up RBAC first
  const rbacSetup = require('../../src/bootstrap/rbac-setup');
  await rbacSetup();

  // Check if data already exists to avoid duplicates
  const customerCount = await strapi.entityService.count('api::kunde.kunde');

  if (customerCount > 0) {
    console.log('Database already has data, skipping seed...');
    return;
  }

  console.log('🌱 Seeding database with dummy data...');

  try {
    // Seed customers
    await seedCustomers();

    // Seed personnel and positions
    await seedPersonnel();

    // Seed vehicles and models
    await seedVehicles();

    // Seed articles and stock
    await seedInventory();

    // Seed fields
    await seedFields();

    // Seed offers and orders
    await seedSales();

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Seed functions
async function seedCustomers() {
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
    await strapi.entityService.create('api::kunde.kunde', {
      data: customer
    });
  }
  console.log(`✅ Created ${customers.length} customers`);
}

async function seedPersonnel() {
  // First create positions
  const positions = [
    { bezeichnung: 'Betriebsleiter' },
    { bezeichnung: 'Traktorfahrer' },
    { bezeichnung: 'Erntehelfer' },
    { bezeichnung: 'Mechaniker' },
    { bezeichnung: 'Bürokraft' }
  ];

  const createdPositions = [];
  for (const position of positions) {
    const created = await strapi.entityService.create('api::position.position', {
      data: position
    });
    createdPositions.push(created);
  }

  // Create qualifications
  const qualifications = [
    { bezeichnung: 'Traktorführerschein Klasse T' },
    { bezeichnung: 'LKW-Führerschein Klasse C' },
    { bezeichnung: 'Gabelstapler-Schein' },
    { bezeichnung: 'Pflanzenschutz-Sachkunde' }
  ];

  for (const qualification of qualifications) {
    await strapi.entityService.create('api::qualifikation.qualifikation', {
      data: qualification
    });
  }

  // Create personnel
  const personnel = [
    {
      vorname: 'Hans',
      nachname: 'Mueller',
      geburtsdatum: '1980-05-15',
      telefon: '+49 111 111111',
      email: 'hans.mueller@bepwi.de',
      einstellungsdatum: '2020-01-01',
      status: 'aktiv',
      position: createdPositions[0].id // Betriebsleiter
    },
    {
      vorname: 'Maria',
      nachname: 'Schmidt',
      geburtsdatum: '1990-08-22',
      telefon: '+49 222 222222',
      email: 'maria.schmidt@bepwi.de',
      einstellungsdatum: '2021-03-15',
      status: 'aktiv',
      position: createdPositions[1].id // Traktorfahrer
    },
    {
      vorname: 'Klaus',
      nachname: 'Weber',
      geburtsdatum: '1975-12-10',
      telefon: '+49 333 333333',
      email: 'klaus.weber@bepwi.de',
      einstellungsdatum: '2019-06-01',
      status: 'aktiv',
      position: createdPositions[3].id // Mechaniker
    }
  ];

  for (const person of personnel) {
    await strapi.entityService.create('api::personal.personal', {
      data: person
    });
  }

  console.log(`✅ Created ${positions.length} positions and ${personnel.length} personnel`);
}

async function seedVehicles() {
  // Create vehicle models
  const models = [
    {
      bezeichnung: 'John Deere 6120R',
      gewicht: 8500,
      treibstoff: 'Diesel',
      tankvolumen: 280
    },
    {
      bezeichnung: 'Fendt 724 Vario',
      gewicht: 9200,
      treibstoff: 'Diesel',
      tankvolumen: 300
    },
    {
      bezeichnung: 'MAN TGX 18.480',
      gewicht: 12000,
      treibstoff: 'Diesel',
      tankvolumen: 600
    }
  ];

  const createdModels = [];
  for (const model of models) {
    const created = await strapi.entityService.create('api::modell.modell', {
      data: model
    });
    createdModels.push(created);
  }

  // Create license types
  const licenses = [
    { bezeichnung: 'Klasse T - Traktor' },
    { bezeichnung: 'Klasse C - LKW' },
    { bezeichnung: 'Klasse B - PKW' }
  ];

  const createdLicenses = [];
  for (const license of licenses) {
    const created = await strapi.entityService.create('api::fuehrerschein.fuehrerschein', {
      data: license
    });
    createdLicenses.push(created);
  }

  // Create vehicles
  const vehicles = [
    {
      kennzeichen: 'AG-TR-1001',
      typ: 'traktor',
      hersteller: 'John Deere',
      baujahr: 2020,
      kilometerstand: 1250,
      kraftstoffart: 'diesel',
      status: 'verfügbar',
      tuev_bis: '2025-12-31',
      modell: createdModels[0].id,
      fuehrerschein: createdLicenses[0].id
    },
    {
      kennzeichen: 'AG-TR-1002',
      typ: 'traktor',
      hersteller: 'Fendt',
      baujahr: 2021,
      kilometerstand: 850,
      kraftstoffart: 'diesel',
      status: 'verfügbar',
      tuev_bis: '2026-06-30',
      modell: createdModels[1].id,
      fuehrerschein: createdLicenses[0].id
    },
    {
      kennzeichen: 'AG-LK-2001',
      typ: 'lkw',
      hersteller: 'MAN',
      baujahr: 2019,
      kilometerstand: 45000,
      kraftstoffart: 'diesel',
      status: 'verfügbar',
      tuev_bis: '2025-03-15',
      modell: createdModels[2].id,
      fuehrerschein: createdLicenses[1].id
    }
  ];

  for (const vehicle of vehicles) {
    await strapi.entityService.create('api::fahrzeug.fahrzeug', {
      data: vehicle
    });
  }

  console.log(`✅ Created ${models.length} models and ${vehicles.length} vehicles`);
}

async function seedInventory() {
  // Create storage locations
  const locations = [
    { bezeichnung: 'Hauptlager' },
    { bezeichnung: 'Werkstatt' },
    { bezeichnung: 'Außenlager Feld 1' }
  ];

  const createdLocations = [];
  for (const location of locations) {
    const created = await strapi.entityService.create('api::standort.standort', {
      data: location
    });
    createdLocations.push(created);
  }

  // Create articles
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

  const createdArticles = [];
  for (const article of articles) {
    const created = await strapi.entityService.create('api::artikel.artikel', {
      data: article
    });
    createdArticles.push(created);
  }

  // Create stock entries
  const stockEntries = [
    {
      lagerbestand: 5000,
      reserviert: 0,
      verfuegbar: 5000,
      artikel: createdArticles[0].id, // Diesel
      standort: createdLocations[0].id
    },
    {
      lagerbestand: 1500,
      reserviert: 100,
      verfuegbar: 1400,
      artikel: createdArticles[1].id, // NPK-Dünger
      standort: createdLocations[0].id
    },
    {
      lagerbestand: 800,
      reserviert: 0,
      verfuegbar: 800,
      artikel: createdArticles[2].id, // Weizensaatgut
      standort: createdLocations[2].id
    },
    {
      lagerbestand: 120,
      reserviert: 0,
      verfuegbar: 120,
      artikel: createdArticles[3].id, // Hydrauliköl
      standort: createdLocations[1].id
    }
  ];

  for (const stock of stockEntries) {
    await strapi.entityService.create('api::bestand.bestand', {
      data: stock
    });
  }

  console.log(`✅ Created ${articles.length} articles and ${stockEntries.length} stock entries`);
}

async function seedFields() {
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
    await strapi.entityService.create('api::feld.feld', {
      data: field
    });
  }

  console.log(`✅ Created ${fields.length} fields`);
}

async function seedSales() {
  // Get created customers and articles
  const customers = await strapi.entityService.findMany('api::kunde.kunde');
  const articles = await strapi.entityService.findMany('api::artikel.artikel');

  if (customers.length === 0 || articles.length === 0) {
    console.log('⚠️ Skipping sales data - no customers or articles found');
    return;
  }

  // Create offers
  const offers = [
    {
      gueltigkeitsdatum: '2025-01-15T23:59:59.000Z',
      status: 'gesendet',
      erstellungsdatum: '2024-12-01T10:00:00.000Z',
      gesamtpreis: 2500.00,
      beschreibung: 'Angebot für NPK-Dünger',
      kunde: customers[0].id
    },
    {
      gueltigkeitsdatum: '2025-02-28T23:59:59.000Z',
      status: 'erstellt',
      erstellungsdatum: '2024-12-15T14:30:00.000Z',
      gesamtpreis: 1200.00,
      beschreibung: 'Angebot für Weizensaatgut',
      kunde: customers[1].id
    }
  ];

  const createdOffers = [];
  for (const offer of offers) {
    const created = await strapi.entityService.create('api::angebot.angebot', {
      data: offer
    });
    createdOffers.push(created);
  }

  console.log(`✅ Created ${offers.length} offers`);
}