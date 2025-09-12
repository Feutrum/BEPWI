'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::fahrt.fahrt', ({ strapi }) => ({
    /**
     * Custom Endpoint: Alle zukünftigen Reservierungen für ein Fahrzeug
     */
    async getFutureReservations(ctx) {
        try {
            const { fzid } = ctx.params;
            const heute = new Date();

            const fahrten = await strapi.db.query('api::fahrt.fahrt').findMany({
                where: {
                    ende_d: { $gte: heute },
                    fahrzeug: { fzid: fzid },
                    publishedAt: { $notNull: true }, // nur veröffentlichte Fahrten
                },
                populate: {
                    personal: true,
                    fahrzeug: true,
                },
                orderBy: { start_d: 'asc' },
            });

            // Duplikate nach ID entfernen
            return Array.from(new Map(fahrten.map(f => [f.id, f])).values());
        } catch (err) {
            ctx.throw(500, 'Fehler beim Abrufen der zukünftigen Reservierungen: ' + err.message);
        }
    },

    /**
     * Custom Endpoint: Alle vergangenen Fahrten für ein Fahrzeug
     */
    async getPastReservations(ctx) {
        try {
            const { fzid } = ctx.params;
            const heute = new Date();

            const fahrten = await strapi.db.query('api::fahrt.fahrt').findMany({
                where: {
                    ende_d: { $lt: heute },
                    fahrzeug: { fzid: fzid },
                    publishedAt: { $notNull: true },
                },
                populate: {
                    personal: true,
                    fahrzeug: true,
                },
                orderBy: { start_d: 'desc' },
            });

            return Array.from(new Map(fahrten.map(f => [f.id, f])).values());
        } catch (err) {
            ctx.throw(500, 'Fehler beim Abrufen der vergangenen Fahrten: ' + err.message);
        }
    },
}));

