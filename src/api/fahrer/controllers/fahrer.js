'use strict';

/**
 * fahrer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::fahrer.fahrer', ({ strapi }) => ({
    async available(ctx) {
        try {
            const fahrer = await strapi.entityService.findMany('api::fahrer.fahrer', {
                filters: { verfuegbar: true },
                populate: ['fahrzeugreservierungs'], // Relationen gleich mitladen
            });

            return fahrer;
        } catch (err) {
            ctx.throw(500, err);
        }
    },
}));

