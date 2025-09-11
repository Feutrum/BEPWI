// src/api/fahrzeug/controllers/fahrzeug.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::fahrzeug.fahrzeug', ({ strapi }) => ({
    async byStandort(ctx) {
        strapi.log.info('[fahrzeug.byStandort] hit');
        const standortId = Number(ctx.params.standortId);
        if (!standortId) return ctx.badRequest('Bitte Standort-ID angeben.');

        try {
            // entspricht: ?filters[fahrzeug_standorts][standort][id][$eq]=:standortId
            const rows = await strapi.db.query('api::fahrzeug.fahrzeug').findMany({
                where: { fahrzeug_standorts: { standort: { id: standortId } } },
                populate: ctx.query.populate || undefined,   // optional
                select: ctx.query.fields || undefined,       // optional
                orderBy: ctx.query.sort || undefined,        // optional
            });

            strapi.log.info(`[byStandort] result count=${rows.length}`);

            const sanitized = await this.sanitizeOutput(rows, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[fahrzeug.byStandort] Fehler:', err);
            return ctx.internalServerError('Fehler bei byStandort');
        }
    },
}));
