'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

// Hilfsfunktion: Datum in YYYY-MM-DD umwandeln
const ymd = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const utc = new Date(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()));
    return utc.toISOString().slice(0, 10);
};

module.exports = createCoreController('api::fahrzeug.fahrzeug', ({ strapi }) => ({

    // Custom-Endpoint: Alle Fahrzeuge, die an einem bestimmten Standort stehen
    async byStandort(ctx) {
        strapi.log.info('[fahrzeug.byStandort] hit');
        const standortId = Number(ctx.params.standortId);
        if (!standortId) return ctx.badRequest('Bitte Standort-ID angeben.');

        try {
            const rows = await strapi.db.query('api::fahrzeug.fahrzeug').findMany({
                where: { fahrzeug_standorts: { standort: { id: standortId } } },
                populate: ctx.query.populate || undefined,  // Relationen optional laden
                select: ctx.query.fields || undefined,      // bestimmte Felder auswählen
                orderBy: ctx.query.sort || undefined,       // Sortierung aus Query übernehmen
            });

            strapi.log.info(`[byStandort] result count=${rows.length}`);

            const sanitized = await this.sanitizeOutput(rows, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[fahrzeug.byStandort] Fehler:', err);
            return ctx.internalServerError('Fehler bei byStandort');
        }
    },

    // Custom-Endpoint: Fahrzeuge mit TÜV in den nächsten N Tagen (Standard: 30)
    async anstehend(ctx) {
        strapi.log.info('[fahrzeug.anstehend] nur TÜV in den nächsten Tagen');

        const days = Number(ctx.query.days) > 0 ? Number(ctx.query.days) : 30;

        // Zeitfenster berechnen
        const today = new Date(); today.setHours(0,0,0,0);
        const horizon = new Date(today); horizon.setDate(horizon.getDate() + days);

        const fromStr = ymd(today);
        const toStr   = ymd(horizon);

        const { populate, fields, sort, pagination } = ctx.query;

        try {
            const entities = await strapi.entityService.findMany('api::fahrzeug.fahrzeug', {
                filters: { tuev: { $between: [fromStr, toStr] } },
                populate,
                fields,
                sort,
                ...(pagination && { pagination }),
            });

            strapi.log.info(`[fahrzeug.anstehend] tuev count=${entities.length}`);

            const sanitized = await this.sanitizeOutput(entities, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[fahrzeug.anstehend] Fehler:', err);
            return ctx.internalServerError('Fehler bei anstehend (TÜV)');
        }
    },

}));
