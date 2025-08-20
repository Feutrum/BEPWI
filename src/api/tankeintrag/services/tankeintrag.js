'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tankeintrag.tankeintrag', ({ strapi }) => ({
  async calculateFuelEfficiency(vehicleId, startDate, endDate) {
    const tankeintraege = await strapi.entityService.findMany('api::tankeintrag.tankeintrag', {
      filters: {
        fahrzeug: vehicleId,
        ...(startDate && endDate ? {
          tankdatum: {
            $gte: startDate,
            $lte: endDate,
          }
        } : {})
      },
      sort: { tankdatum: 'asc', kilometerstand: 'asc' }
    });

    if (tankeintraege.length < 2) {
      return null;
    }

    let totalDistance = 0;
    let totalFuel = 0;
    
    for (let i = 1; i < tankeintraege.length; i++) {
      const currentEntry = tankeintraege[i];
      const previousEntry = tankeintraege[i - 1];
      
      const distance = currentEntry.kilometerstand - previousEntry.kilometerstand;
      if (distance > 0) {
        totalDistance += distance;
        totalFuel += parseFloat(currentEntry.liter);
      }
    }

    if (totalDistance === 0 || totalFuel === 0) {
      return null;
    }

    return {
      totalDistance,
      totalFuel,
      consumptionPer100km: (totalFuel / totalDistance) * 100,
      kmPerLiter: totalDistance / totalFuel
    };
  },

  async getMonthlyConsumption(vehicleId, year) {
    const tankeintraege = await strapi.entityService.findMany('api::tankeintrag.tankeintrag', {
      filters: {
        fahrzeug: vehicleId,
        tankdatum: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        }
      },
      sort: { tankdatum: 'asc' }
    });

    const monthlyData = {};
    
    tankeintraege.forEach(entry => {
      const month = new Date(entry.tankdatum).getMonth() + 1;
      if (!monthlyData[month]) {
        monthlyData[month] = {
          totalLiters: 0,
          totalCost: 0,
          entries: 0
        };
      }
      monthlyData[month].totalLiters += parseFloat(entry.liter);
      monthlyData[month].totalCost += parseFloat(entry.gesamtpreis);
      monthlyData[month].entries += 1;
    });

    return monthlyData;
  }
}));