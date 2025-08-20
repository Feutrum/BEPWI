# F6 - Tankvorgänge erfassen und auswerten - Implementation

## Overview
Implementation of fuel tracking system for vehicle fleet management. Drivers can record fuel entries and managers can analyze consumption data.

## Implementation Details

### 1. Database Schema - Tankeintrag Collection

**Location:** `src/api/tankeintrag/content-types/tankeintrag/schema.json`

**Fields:**
- `tank_id` (BigInteger, Required, Unique): Unique identifier for each fuel entry
- `tankdatum` (DateTime, Required): Date and time of refueling
- `tankstelle` (String, Required): Gas station name/location
- `liter` (Decimal, Required): Amount of fuel in liters
- `preis_pro_liter` (Decimal, Required): Price per liter
- `gesamtpreis` (Decimal, Required): Total cost of refueling
- `kilometerstand` (BigInteger, Required): Vehicle mileage at time of refueling
- `treibstoff_art` (String, Required): Fuel type (Benzin, Diesel, Elektro, Hybrid)
- `bemerkung` (Text, Optional): Additional notes/remarks

**Relations:**
- `fahrer` (ManyToOne): Links to Fahrer collection
- `fahrzeug` (ManyToOne): Links to Fahrzeug collection

### 2. API Endpoints

#### Standard CRUD Operations
- `GET /api/tankeintrags` - List all fuel entries
- `POST /api/tankeintrags` - Create new fuel entry
- `GET /api/tankeintrags/:id` - Get specific fuel entry
- `PUT /api/tankeintrags/:id` - Update fuel entry
- `DELETE /api/tankeintrags/:id` - Delete fuel entry

#### Custom Analysis Endpoint
- `GET /api/tankeintrags/analysis` - Get consumption analysis

**Query Parameters for Analysis:**
- `fahrzeugId` (optional): Filter by specific vehicle
- `startDate` (optional): Filter entries from date
- `endDate` (optional): Filter entries to date

**Analysis Response:**
```json
{
  "data": {
    "totalEntries": 0,
    "totalLiters": 0,
    "totalCost": 0,
    "averagePricePerLiter": 0,
    "vehicleStats": {
      "vehicleId": {
        "vehicleName": "Vehicle Name",
        "totalLiters": 0,
        "totalCost": 0,
        "entries": 0
      }
    }
  },
  "entries": [/* Array of fuel entries */]
}
```

### 3. Service Functions

**Location:** `src/api/tankeintrag/services/tankeintrag.js`

#### calculateFuelEfficiency(vehicleId, startDate, endDate)
- Calculates fuel efficiency metrics for a specific vehicle
- Returns consumption per 100km and km per liter
- Requires at least 2 fuel entries with different mileage readings

#### getMonthlyConsumption(vehicleId, year)
- Provides monthly breakdown of fuel consumption for a vehicle
- Returns data grouped by month with totals and averages

### 4. Controller Implementation

**Location:** `src/api/tankeintrag/controllers/tankeintrag.js`

- Extends standard Strapi CRUD operations
- Implements `getConsumptionAnalysis()` method for manager dashboard
- Handles filtering, sorting, and data aggregation
- Populates related fahrer and fahrzeug data

### 5. Updated Relations

#### Fahrer Collection Updates
Added relation:
```json
"tankeintrags": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::tankeintrag.tankeintrag",
  "mappedBy": "fahrer"
}
```

#### Fahrzeug Collection Updates
Added relation:
```json
"tankeintrags": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::tankeintrag.tankeintrag",
  "mappedBy": "fahrzeug"
}
```

## Testing

### Setup Steps
1. Start Strapi server: `npm run dev`
2. Navigate to admin panel: `http://localhost:1337/admin`
3. Complete admin setup if first time
4. Configure permissions in Settings > Roles & Permissions > Public role:
   - Enable `find` and `create` for Tankeintrag
   - Enable `find` for Fahrer and Fahrzeug
   - Enable custom route permissions

### API Test Script
**File:** `test-tankeintrag-api.js`

To run tests:
1. Complete setup steps above
2. Run test script: `node test-tankeintrag-api.js`

**Test Coverage:**
- GET all fuel entries
- POST create new fuel entry
- GET specific fuel entry by ID
- GET consumption analysis
- Verify related collections (fahrer, fahrzeug)

### Sample Request - Create Fuel Entry

```javascript
POST /api/tankeintrags
Content-Type: application/json

{
  "data": {
    "tank_id": 12345,
    "tankdatum": "2024-01-15T10:30:00Z",
    "tankstelle": "Shell Tankstelle Hauptstraße",
    "liter": 45.5,
    "preis_pro_liter": 1.549,
    "gesamtpreis": 70.48,
    "kilometerstand": 85000,
    "treibstoff_art": "Diesel",
    "bemerkung": "Vollgetankt für Geschäftsreise",
    "fahrer": 1,
    "fahrzeug": 2
  }
}
```

## Deployment Steps

1. **Schema Registration**
   - Restart Strapi server to register new collection type
   - Verify Tankeintrag appears in admin panel

2. **Permissions Setup**
   - Configure role-based permissions for fuel entry access
   - Set driver permissions for POST/GET own entries
   - Set manager permissions for analysis endpoints

3. **Data Migration** (if needed)
   - Import existing fuel data
   - Ensure proper foreign key relationships

## Usage Examples

### Driver Workflow
1. Driver logs into system
2. Navigates to fuel entry form
3. Fills required fields (tank_id, date, station, liters, price, mileage)
4. Submits entry via POST /api/tankeintrags

### Manager Analysis Workflow
1. Manager accesses analysis dashboard
2. Optionally filters by vehicle or date range
3. Calls GET /api/tankeintrags/analysis
4. Views consumption statistics and trends

## Future Enhancements

### Possible Extensions
1. **Fuel Efficiency Alerts** - Notify when consumption exceeds thresholds
2. **Cost Trend Analysis** - Track fuel price changes over time
3. **Route Integration** - Link fuel consumption to specific routes
4. **Mobile App** - Dedicated mobile interface for drivers
5. **Photo Upload** - Attach receipts to fuel entries
6. **Automated Import** - Import data from fuel card systems

### Performance Optimizations
1. **Database Indexes** - Add indexes on frequently queried fields
2. **Caching** - Implement caching for analysis queries
3. **Pagination** - Add pagination for large datasets
4. **Bulk Operations** - Support bulk import of fuel entries

## Acceptance Criteria Status

✅ **Collection refueling entry aufgebaut** - Tankeintrag collection created with all required fields  
✅ **Formular mit Feldern** - API endpoints support all required fields from ER diagram  
✅ **APIs für Erfassung** - POST endpoint for creating fuel entries  
✅ **APIs für Analyse** - GET analysis endpoint for consumption data analysis  

## Files Modified/Created

### New Files
- `src/api/tankeintrag/content-types/tankeintrag/schema.json`
- `src/api/tankeintrag/controllers/tankeintrag.js`
- `src/api/tankeintrag/routes/tankeintrag.js`
- `src/api/tankeintrag/services/tankeintrag.js`
- `test-tankeintrag-api.js`

### Modified Files
- `src/api/fahrer/content-types/fahrer/schema.json` - Added tankeintrags relation
- `src/api/fahrzeug/content-types/fahrzeug/schema.json` - Added tankeintrags relation