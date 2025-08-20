'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tankeintrag.tankeintrag', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    return response;
  },

  async find(ctx) {
    const response = await super.find(ctx);
    return response;
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);
    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    const response = await super.delete(ctx);
    return response;
  },

  async getConsumptionAnalysis(ctx) {
    try {
      const { fahrzeugId, startDate, endDate } = ctx.query;
      
      let filters = {};
      
      if (fahrzeugId) {
        filters.fahrzeug = fahrzeugId;
      }
      
      if (startDate || endDate) {
        filters.tankdatum = {};
        if (startDate) {
          filters.tankdatum.$gte = startDate;
        }
        if (endDate) {
          filters.tankdatum.$lte = endDate;
        }
      }

      const tankeintraege = await strapi.entityService.findMany('api::tankeintrag.tankeintrag', {
        filters,
        populate: ['fahrer', 'fahrzeug'],
        sort: { tankdatum: 'asc' }
      });

      const analysis = {
        totalEntries: tankeintraege.length,
        totalLiters: 0,
        totalCost: 0,
        averagePricePerLiter: 0,
        fuelConsumption: {},
        vehicleStats: {}
      };

      tankeintraege.forEach(entry => {
        analysis.totalLiters += parseFloat(entry.liter);
        analysis.totalCost += parseFloat(entry.gesamtpreis);

        const vehicleId = entry.fahrzeug?.id;
        if (vehicleId) {
          if (!analysis.vehicleStats[vehicleId]) {
            analysis.vehicleStats[vehicleId] = {
              vehicleName: entry.fahrzeug.name,
              totalLiters: 0,
              totalCost: 0,
              entries: 0
            };
          }
          analysis.vehicleStats[vehicleId].totalLiters += parseFloat(entry.liter);
          analysis.vehicleStats[vehicleId].totalCost += parseFloat(entry.gesamtpreis);
          analysis.vehicleStats[vehicleId].entries += 1;
        }
      });

      if (analysis.totalLiters > 0) {
        analysis.averagePricePerLiter = analysis.totalCost / analysis.totalLiters;
      }

      ctx.body = {
        data: analysis,
        entries: tankeintraege
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));