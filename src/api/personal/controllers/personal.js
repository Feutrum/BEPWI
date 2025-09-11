'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::personal.personal', ({ strapi }) => ({
    async byFuehrerschein(ctx) {
        strapi.log.info('[personal.byFuehrerschein] hit');
        const fsId = Number(ctx.params.fsId);
        if (!fsId) {
            return ctx.badRequest('Bitte eine Führerschein-ID angeben.');
        }

        try {
            const people = await strapi.entityService.findMany('api::personal.personal', {
                filters: { fuehrerscheins: { id: fsId } },   // Personen mit FS-ID
                populate: ctx.query.populate,                // optional
            });

            const sanitized = await this.sanitizeOutput(people, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[personal.byFuehrerschein] error', err);
            return ctx.internalServerError('Fehler bei der Führerschein-Suche');
        }
    },
}));
