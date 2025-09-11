'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::personal-tankstelle.personal-tankstelle', ({ strapi }) => ({
    async personByTankkarte(ctx) {
        strapi.log.info('[Custom] personByTankkarte called');
        const { ptid } = ctx.params;

        if (!ptid) {
            return ctx.badRequest('Bitte Tankkarten-ID (ptid) angeben.');
        }

        try {
            // Tankkarte suchen + Person laden
            const tankkarte = await strapi.db
                .query('api::personal-tankstelle.personal-tankstelle')
                .findOne({
                    where: { ptid },
                    populate: { personal: true },
                });

            if (!tankkarte || !tankkarte.personal) {
                return ctx.notFound('Keine Person zu dieser Tankkarte gefunden.');
            }

            const sanitized = await this.sanitizeOutput(tankkarte.personal, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[Custom] Fehler in personByTankkarte:', err);
            return ctx.internalServerError('Fehler bei personByTankkarte');
        }
    },
}));
