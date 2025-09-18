'use strict';

/**
 * feld controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::feld.feld', ({ strapi }) => ({
  // Alias for farm/crops endpoint
  async farmCrops(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::feld.feld', {
        ...ctx.query,
        populate: ['aktions']
      });

      const sanitized = await this.sanitizeOutput(entries, ctx);
      return this.transformResponse(sanitized);
    } catch (err) {
      strapi.log.error('[feld.farmCrops] error', err);
      return ctx.badRequest('Error fetching farm crops', { error: err.message });
    }
  },

  // Alias for farm/cultivation endpoint
  async farmCultivation(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::feld.feld', {
        ...ctx.query,
        populate: ['aktions']
      });

      const sanitized = await this.sanitizeOutput(entries, ctx);
      return this.transformResponse(sanitized);
    } catch (err) {
      strapi.log.error('[feld.farmCultivation] error', err);
      return ctx.badRequest('Error fetching farm cultivation', { error: err.message });
    }
  }
}));