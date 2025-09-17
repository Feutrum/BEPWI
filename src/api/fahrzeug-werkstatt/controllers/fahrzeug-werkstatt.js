'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

// Hilfsfunktion: Wandelt ein Datum ins Format YYYY-MM-DD um
const ymd = (d) => {
    const x = new Date(d); x.setHours(0, 0, 0, 0);
    const utc = new Date(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()));
    return utc.toISOString().slice(0, 10);
};

module.exports = createCoreController('api::fahrzeug-werkstatt.fahrzeug-werkstatt', () => ({
    // Custom-Endpoint: gibt alle Werkstatt-Termine in den nächsten X Tagen zurück (Default: 30)
    async anstehend(ctx) {
        const days = Number(ctx.query.days) > 0 ? Number(ctx.query.days) : 30;

        // heutiges Datum und Zeitraumgrenze berechnen
        const today = new Date(); today.setHours(0,0,0,0);
        const horizon = new Date(today); horizon.setDate(horizon.getDate() + days);

        const fromStr = ymd(today);
        const toStr   = ymd(horizon);

        // Abfrage der Werkstatt-Termine mit verknüpftem Fahrzeug + Werkstatt
        const rows = await strapi.entityService.findMany('api::fahrzeug-werkstatt.fahrzeug-werkstatt', {
            filters: { startdatum: { $between: [fromStr, toStr] } },
            populate: {
                fahrzeug: true,     // nur Fahrzeug-Relation laden
                werkstatt: true,    // nur Werkstatt-Relation laden
            },
            sort: [{ startdatum: 'asc' }],
        });

        // Strapi-Response zurückgeben
        return this.transformResponse(rows);
    },
}));
