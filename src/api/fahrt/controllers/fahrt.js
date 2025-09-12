'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::fahrt.fahrt', ({ strapi }) => ({
    /**
     * Custom Endpoint: Alle zukünftigen Reservierungen für ein Fahrzeug
     */
    async getFutureReservations(ctx) {
        try {
            const { fzid } = ctx.params; // Fahrzeug-FZID aus URL
            const heute = new Date();

            // Suche alle Fahrten, deren ende_d >= heute UND fahrzeug.fzid == fzid
            const fahrten = await strapi.db.query('api::fahrt.fahrt').findMany({
                where: {
                    ende_d: { $gte: heute },
                    fahrzeug: { fzid: fzid },
                },
                populate: {
                    personal: true,
                    fahrzeug: true,
                },
                orderBy: { start_d: 'asc' },
            });

            return fahrten;
        } catch (err) {
            ctx.throw(500, 'Fehler beim Abrufen der Reservierungen: ' + err.message);
        }
    },
}));

