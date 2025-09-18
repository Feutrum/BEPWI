#!/usr/bin/env node

/**
 * Direct Database Seeding Script
 * Bypasses API and seeds database directly through Strapi
 * Run with: npm run seed
 */

const path = require('path');

async function seedDatabase() {
  process.chdir(path.join(__dirname, '..'));

  // Import Strapi factory
  const { createStrapi } = require('@strapi/strapi');

  let strapi;

  try {
    // Create and load Strapi
    strapi = await createStrapi({ autoReload: false }).load();

    console.log('🌱 Starting direct database seeding...');

    // Seed customers
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

    const createdCustomers = [];
    for (const customer of customers) {
      const created = await strapi.entityService.create('api::kunde.kunde', {
        data: customer
      });
      createdCustomers.push(created);
    }
    console.log(`✅ Created ${customers.length} customers`);

    // Seed positions
    console.log('🔨 Creating positions...');
    const positions = [
      { bezeichnung: 'Betriebsleiter', sollzeit: 40.0, gehalt: 4500.0 },
      { bezeichnung: 'Traktorfahrer', sollzeit: 40.0, gehalt: 3200.0 },
      { bezeichnung: 'Erntehelfer', sollzeit: 35.0, gehalt: 2800.0 },
      { bezeichnung: 'Mechaniker', sollzeit: 40.0, gehalt: 3800.0 },
      { bezeichnung: 'Bürokraft', sollzeit: 37.5, gehalt: 3000.0 }
    ];

    const createdPositions = [];
    for (const position of positions) {
      const created = await strapi.entityService.create('api::position.position', {
        data: position
      });
      createdPositions.push(created);
    }
    console.log(`✅ Created ${positions.length} positions`);

    // Seed personnel first (we'll add qualifications after)
    console.log('👨‍💼 Creating personnel...');
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

    const createdPersonnel = [];
    for (const person of personnel) {
      const created = await strapi.entityService.create('api::personal.personal', {
        data: person
      });
      createdPersonnel.push(created);
    }
    console.log(`✅ Created ${personnel.length} personnel`);

    // Now seed qualifications linked to personnel
    console.log('🎓 Creating qualifications...');
    const qualifications = [
      {
        bezeichnung: 'Traktorführerschein Klasse T',
        erwerbsdatum: '2021-01-15',
        personal: createdPersonnel[1].id // Maria (Traktorfahrer)
      },
      {
        bezeichnung: 'LKW-Führerschein Klasse C',
        erwerbsdatum: '2019-03-10',
        personal: createdPersonnel[0].id // Hans (Betriebsleiter)
      },
      {
        bezeichnung: 'Gabelstapler-Schein',
        erwerbsdatum: '2018-11-22',
        personal: createdPersonnel[2].id // Klaus (Mechaniker)
      },
      {
        bezeichnung: 'Pflanzenschutz-Sachkunde',
        erwerbsdatum: '2020-06-05',
        personal: createdPersonnel[0].id // Hans (Betriebsleiter)
      }
    ];

    for (const qualification of qualifications) {
      await strapi.entityService.create('api::qualifikation.qualifikation', {
        data: qualification
      });
    }
    console.log(`✅ Created ${qualifications.length} qualifications`);

    // Seed license types
    console.log('🪪 Creating license types...');
    const licenseTypes = [
      { bezeichnung: 'Klasse B' },
      { bezeichnung: 'Klasse C' },
      { bezeichnung: 'Klasse T' },
      { bezeichnung: 'Klasse CE' }
    ];

    const createdLicenseTypes = [];
    for (const licenseType of licenseTypes) {
      const created = await strapi.entityService.create('api::fuehrerschein.fuehrerschein', {
        data: licenseType
      });
      createdLicenseTypes.push(created);
    }
    console.log(`✅ Created ${licenseTypes.length} license types`);

    // Seed vehicle models
    console.log('🚜 Creating vehicle models...');
    const vehicleModels = [
      {
        bezeichnung: 'John Deere 6120R',
        gewicht: 7500,
        treibstoff: 'diesel',
        tankvolumen: 280,
        fuehrerscheins: [createdLicenseTypes[2].id] // Klasse T
      },
      {
        bezeichnung: 'Mercedes Actros 1845',
        gewicht: 18000,
        treibstoff: 'diesel',
        tankvolumen: 400,
        fuehrerscheins: [createdLicenseTypes[1].id, createdLicenseTypes[3].id] // Klasse C, CE
      },
      {
        bezeichnung: 'VW Caddy',
        gewicht: 2100,
        treibstoff: 'diesel',
        tankvolumen: 70,
        fuehrerscheins: [createdLicenseTypes[0].id] // Klasse B
      },
      {
        bezeichnung: 'Fendt 936 Vario',
        gewicht: 8200,
        treibstoff: 'diesel',
        tankvolumen: 360,
        fuehrerscheins: [createdLicenseTypes[2].id] // Klasse T
      }
    ];

    const createdVehicleModels = [];
    for (const model of vehicleModels) {
      const created = await strapi.entityService.create('api::modell.modell', {
        data: model
      });
      createdVehicleModels.push(created);
    }
    console.log(`✅ Created ${vehicleModels.length} vehicle models`);

    // Seed locations
    console.log('📍 Creating locations...');
    const locations = [
      {
        bezeichnung: 'Hauptbetrieb',
        plz: '12345',
        ort: 'Berlin',
        strasse: 'Hauptstraße',
        hausnummer: '123'
      },
      {
        bezeichnung: 'Lager Nord',
        plz: '54321',
        ort: 'München',
        strasse: 'Lagerstraße',
        hausnummer: '45'
      },
      {
        bezeichnung: 'Feldstation West',
        plz: '67890',
        ort: 'Hamburg',
        strasse: 'Feldweg',
        hausnummer: '78'
      }
    ];

    const createdLocations = [];
    for (const location of locations) {
      const created = await strapi.entityService.create('api::standort.standort', {
        data: location
      });
      createdLocations.push(created);
    }
    console.log(`✅ Created ${locations.length} locations`);

    // Seed vehicles
    console.log('🚗 Creating vehicles...');
    const vehicles = [
      {
        kennzeichen: 'TK-AG 123',
        modell: 'John Deere 6120R',
        anschaffung: '2020-03-15',
        gewicht: 7500,
        tuev: '2025-06-15',
        status: 'verfügbar'
      },
      {
        kennzeichen: 'TK-AG 456',
        modell: 'Mercedes Actros 1845',
        anschaffung: '2019-08-20',
        gewicht: 18000,
        tuev: '2025-04-10',
        status: 'verfügbar'
      },
      {
        kennzeichen: 'TK-AG 789',
        modell: 'VW Caddy',
        anschaffung: '2021-11-05',
        gewicht: 2100,
        tuev: '2025-12-20',
        status: 'im_einsatz'
      },
      {
        kennzeichen: 'TK-AG 101',
        modell: 'Fendt 936 Vario',
        anschaffung: '2022-02-28',
        gewicht: 8200,
        tuev: '2025-08-15',
        status: 'wartung'
      }
    ];

    const createdVehicles = [];
    for (const vehicle of vehicles) {
      const created = await strapi.entityService.create('api::fahrzeug.fahrzeug', {
        data: vehicle
      });
      createdVehicles.push(created);
    }
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Seed articles
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
      }
    ];

    const createdArticles = [];
    for (const article of articles) {
      const created = await strapi.entityService.create('api::artikel.artikel', {
        data: article
      });
      createdArticles.push(created);
    }
    console.log(`✅ Created ${articles.length} articles`);

    // Seed fields
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

    const createdFields = [];
    for (const field of fields) {
      const created = await strapi.entityService.create('api::feld.feld', {
        data: field
      });
      createdFields.push(created);
    }
    console.log(`✅ Created ${fields.length} fields`);

    // Seed inventory stock
    console.log('📊 Creating inventory stock...');
    const inventoryStock = [
      {
        artikel: createdArticles[0].id, // Diesel
        standort: createdLocations[0].id, // Hauptbetrieb
        menge: 5000.0,
        einheit: 'liter',
        mindestbestand: 1000.0,
        letzteAktualisierung: new Date()
      },
      {
        artikel: createdArticles[1].id, // NPK-Dünger
        standort: createdLocations[1].id, // Lager Nord
        menge: 800.0,
        einheit: 'kg',
        mindestbestand: 500.0,
        letzteAktualisierung: new Date()
      },
      {
        artikel: createdArticles[2].id, // Weizensaatgut
        standort: createdLocations[1].id, // Lager Nord
        menge: 150.0,
        einheit: 'kg',
        mindestbestand: 200.0,
        letzteAktualisierung: new Date()
      }
    ];

    const createdInventory = [];
    for (const stock of inventoryStock) {
      const created = await strapi.entityService.create('api::bestand.bestand', {
        data: stock
      });
      createdInventory.push(created);
    }
    console.log(`✅ Created ${inventoryStock.length} inventory records`);

    // Seed stock movements
    console.log('📈 Creating stock movements...');
    const stockMovements = [
      {
        bestand: createdInventory[0].id, // Diesel stock
        typ: 'eingang',
        menge: 2000.0,
        einheit: 'liter',
        personal: createdPersonnel[0].id, // Hans
        zeitpunkt: new Date('2025-09-15T10:30:00Z'),
        referenz: 'LF-2025-001',
        bemerkung: 'Diesellieferung September'
      },
      {
        bestand: createdInventory[0].id, // Diesel stock
        typ: 'ausgang',
        menge: 500.0,
        einheit: 'liter',
        personal: createdPersonnel[1].id, // Maria
        zeitpunkt: new Date('2025-09-16T08:15:00Z'),
        referenz: 'VB-2025-001',
        bemerkung: 'Betankung Traktor TK-AG 123'
      },
      {
        bestand: createdInventory[1].id, // NPK-Dünger
        typ: 'eingang',
        menge: 300.0,
        einheit: 'kg',
        personal: createdPersonnel[2].id, // Klaus
        zeitpunkt: new Date('2025-09-14T14:20:00Z'),
        referenz: 'LF-2025-002',
        bemerkung: 'Düngerlieferung für Herbstdüngung'
      }
    ];

    for (const movement of stockMovements) {
      await strapi.entityService.create('api::lagerbewegung.lagerbewegung', {
        data: movement
      });
    }
    console.log(`✅ Created ${stockMovements.length} stock movements`);

    // Seed consumables for field actions
    console.log('🧪 Creating consumables...');
    const consumables = [
      {
        bezeichnung: 'Weizen-Saatgut Premium',
        aggregatszustand: 'fest'
      },
      {
        bezeichnung: 'NPK-Volldünger 15-15-15',
        aggregatszustand: 'fest'
      },
      {
        bezeichnung: 'Herbizid Roundup',
        aggregatszustand: 'fluessig'
      },
      {
        bezeichnung: 'Fungizid-Lösung',
        aggregatszustand: 'fluessig'
      }
    ];

    const createdConsumables = [];
    for (const consumable of consumables) {
      const created = await strapi.entityService.create('api::verbrauchsgut.verbrauchsgut', {
        data: consumable
      });
      createdConsumables.push(created);
    }
    console.log(`✅ Created ${consumables.length} consumables`);

    // Seed field actions
    console.log('🌱 Creating field actions...');
    const fieldActions = [
      {
        bezeichnung: 'Weizen-Aussaat Nordfeld',
        typ: 'aussaat',
        feld: createdFields[0].id, // Nordfeld
        personal: [createdPersonnel[0].id, createdPersonnel[1].id], // Hans, Maria
        fahrzeuge: [createdVehicles[0].id], // John Deere
        verbrauchsgueter: [createdConsumables[0].id], // Weizen-Saatgut
        status: 'abgeschlossen',
        startdatum: new Date('2025-09-10T07:00:00Z'),
        enddatum: new Date('2025-09-10T17:00:00Z'),
        kommentar: 'Aussaat erfolgreich abgeschlossen. Wetterbedingungen optimal.'
      },
      {
        bezeichnung: 'Düngung Südfeld',
        typ: 'duengung',
        feld: createdFields[1].id, // Südfeld
        personal: [createdPersonnel[2].id], // Klaus
        fahrzeuge: [createdVehicles[0].id], // John Deere
        verbrauchsgueter: [createdConsumables[1].id], // NPK-Volldünger
        status: 'geplant',
        startdatum: new Date('2025-09-25T08:00:00Z'),
        kommentar: 'Herbstdüngung geplant'
      },
      {
        bezeichnung: 'Bewässerung Westfeld',
        typ: 'bewaesserung',
        feld: createdFields[2].id, // Westfeld
        personal: [createdPersonnel[1].id], // Maria
        status: 'laufend',
        startdatum: new Date('2025-09-18T06:00:00Z'),
        kommentar: 'Bewässerung des Versuchsfelds'
      }
    ];

    const createdActions = [];
    for (const action of fieldActions) {
      const created = await strapi.entityService.create('api::aktion.aktion', {
        data: action
      });
      createdActions.push(created);
    }
    console.log(`✅ Created ${fieldActions.length} field actions`);

    // Seed working hours
    console.log('⏰ Creating working hours...');
    const workingHours = [
      {
        personal: createdPersonnel[0].id, // Hans
        von: new Date('2025-09-17T07:00:00Z'),
        bis: new Date('2025-09-17T16:00:00Z'),
        status: 'geleistet',
        stunden: 8.0,
        taetigkeit: 'Leitung Aussaat-Aktion',
        aktion: createdActions[0].id, // Weizen-Aussaat
        bemerkung: 'Leitung der Aussaat-Aktion'
      },
      {
        personal: createdPersonnel[1].id, // Maria
        von: new Date('2025-09-17T07:30:00Z'),
        bis: new Date('2025-09-17T16:30:00Z'),
        status: 'geleistet',
        stunden: 8.0,
        taetigkeit: 'Traktor-Bedienung',
        aktion: createdActions[0].id, // Weizen-Aussaat
        bemerkung: 'Traktor-Bedienung bei Aussaat'
      },
      {
        personal: createdPersonnel[2].id, // Klaus
        von: new Date('2025-09-16T08:00:00Z'),
        bis: new Date('2025-09-16T17:00:00Z'),
        status: 'geleistet',
        stunden: 8.0,
        taetigkeit: 'Fahrzeug-Wartung',
        bemerkung: 'Wartung und Reparatur Fahrzeuge'
      }
    ];

    for (const workHour of workingHours) {
      await strapi.entityService.create('api::arbeitszeit.arbeitszeit', {
        data: workHour
      });
    }
    console.log(`✅ Created ${workingHours.length} working hour records`);

    // Seed salary records
    console.log('💰 Creating salary records...');
    const salaryRecords = [
      {
        betrag: 4500.0,
        gueltigAb: new Date('2025-01-01'),
        typ: 'grundgehalt',
        personal: createdPersonnel[0].id, // Hans
        position: createdPositions[0].id, // Betriebsleiter
        bemerkung: 'Grundgehalt Betriebsleiter'
      },
      {
        betrag: 3200.0,
        gueltigAb: new Date('2025-01-01'),
        typ: 'grundgehalt',
        personal: createdPersonnel[1].id, // Maria
        position: createdPositions[1].id, // Traktorfahrer
        bemerkung: 'Grundgehalt Traktorfahrer'
      },
      {
        betrag: 3800.0,
        gueltigAb: new Date('2025-01-01'),
        typ: 'grundgehalt',
        personal: createdPersonnel[2].id, // Klaus
        position: createdPositions[3].id, // Mechaniker
        bemerkung: 'Grundgehalt Mechaniker'
      }
    ];

    for (const salary of salaryRecords) {
      await strapi.entityService.create('api::gehalt.gehalt', {
        data: salary
      });
    }
    console.log(`✅ Created ${salaryRecords.length} salary records`);

    // Seed offers
    console.log('💼 Creating offers...');
    const offers = [
      {
        kunde: createdCustomers[0].id, // Bioland Müller GmbH
        gueltigkeitsdatum: new Date('2025-10-15T23:59:59Z'),
        status: 'gesendet',
        erstellungsdatum: new Date('2025-09-15T10:00:00Z'),
        gesamtpreis: 2850.0,
        beschreibung: 'Angebot für NPK-Dünger und Weizensaatgut'
      },
      {
        kunde: createdCustomers[1].id, // Obstbau Schmidt
        gueltigkeitsdatum: new Date('2025-10-30T23:59:59Z'),
        status: 'angenommen',
        erstellungsdatum: new Date('2025-09-10T14:30:00Z'),
        gesamtpreis: 1200.0,
        beschreibung: 'Angebot für Diesel-Lieferung'
      },
      {
        kunde: createdCustomers[2].id, // Landwirtschaft Weber
        gueltigkeitsdatum: new Date('2025-11-20T23:59:59Z'),
        status: 'erstellt',
        erstellungsdatum: new Date('2025-09-18T09:15:00Z'),
        gesamtpreis: 3400.0,
        beschreibung: 'Großauftrag für Saatgut und Düngemittel'
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

    // Seed orders (from accepted offers)
    console.log('📋 Creating orders...');
    const orders = [
      {
        angebot: createdOffers[1].id, // From accepted offer (Obstbau Schmidt)
        auftragsdatum: new Date('2025-09-12T10:00:00Z'),
        lieferdatum: new Date('2025-09-20T09:00:00Z'),
        status: 'in_bearbeitung',
        gesamtpreis: 1200.0,
        fahrzeug: createdVehicles[1].id, // Mercedes Actros
        fahrer: createdPersonnel[0].id // Hans
      }
    ];

    for (const order of orders) {
      await strapi.entityService.create('api::auftrag.auftrag', {
        data: order
      });
    }
    console.log(`✅ Created ${orders.length} orders`);

    // Seed RBAC roles and test users
    console.log('🔐 Creating RBAC roles and test users...');

    // Define roles according to frontend guide
    const roles = [
      {
        name: 'Geschäftsleitung',
        description: 'Management with full access to all modules',
        type: 'geschaeftsleitung'
      },
      {
        name: 'HR-Mitarbeiter',
        description: 'HR staff with personnel and salary management access',
        type: 'hr-mitarbeiter'
      },
      {
        name: 'Mitarbeiter',
        description: 'Basic employee with limited access',
        type: 'mitarbeiter'
      }
    ];

    const createdRoles = [];
    for (const roleData of roles) {
      // Check if role already exists
      const existingRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: roleData.type }
      });

      if (existingRole) {
        console.log(`  ✓ Role "${roleData.name}" already exists`);
        createdRoles.push(existingRole);
        continue;
      }

      // Create new role
      const role = await strapi.query('plugin::users-permissions.role').create({
        data: roleData
      });

      createdRoles.push(role);
      console.log(`  ✓ Created role: ${roleData.name}`);
    }

    // Create test users for each role
    console.log('👥 Creating test users...');
    const testUsers = [
      {
        username: 'management@bepwi.de',
        email: 'management@bepwi.de',
        password: 'TestPass123!',
        confirmed: true,
        blocked: false,
        role: createdRoles.find(r => r.type === 'geschaeftsleitung')?.id
      },
      {
        username: 'hr@bepwi.de',
        email: 'hr@bepwi.de',
        password: 'TestPass123!',
        confirmed: true,
        blocked: false,
        role: createdRoles.find(r => r.type === 'hr-mitarbeiter')?.id
      },
      {
        username: 'employee@bepwi.de',
        email: 'employee@bepwi.de',
        password: 'TestPass123!',
        confirmed: true,
        blocked: false,
        role: createdRoles.find(r => r.type === 'mitarbeiter')?.id
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`  ✓ User "${userData.email}" already exists`);
        continue;
      }

      // Create user with plain password (Strapi will hash it automatically)
      const user = await strapi.entityService.create('plugin::users-permissions.user', {
        data: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          confirmed: userData.confirmed,
          blocked: userData.blocked,
          role: userData.role,
          provider: 'local'
        }
      });

      createdUsers.push(user);
      console.log(`  ✓ Created user: ${userData.email}`);
    }

    console.log(`✅ Created ${createdRoles.length} roles and ${createdUsers.length} test users`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Positions: ${positions.length}`);
    console.log(`- Personnel: ${personnel.length}`);
    console.log(`- Qualifications: ${qualifications.length}`);
    console.log(`- License Types: ${licenseTypes.length}`);
    console.log(`- Vehicle Models: ${vehicleModels.length}`);
    console.log(`- Locations: ${locations.length}`);
    console.log(`- Vehicles: ${vehicles.length}`);
    console.log(`- Articles: ${articles.length}`);
    console.log(`- Fields: ${fields.length}`);
    console.log(`- Inventory Stock: ${inventoryStock.length}`);
    console.log(`- Stock Movements: ${stockMovements.length}`);
    console.log(`- Consumables: ${consumables.length}`);
    console.log(`- Field Actions: ${fieldActions.length}`);
    console.log(`- Working Hours: ${workingHours.length}`);
    console.log(`- Salary Records: ${salaryRecords.length}`);
    console.log(`- Offers: ${offers.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log(`- RBAC Roles: ${roles.length}`);
    console.log(`- Test Users: ${testUsers.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('✨ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });