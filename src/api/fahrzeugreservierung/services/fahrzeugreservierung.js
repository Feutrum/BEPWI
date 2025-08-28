'use strict';
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = () => ({
    async assertAvailability(fahrzeugId, startzeit, endzeit, excludeId) {
        if (!fahrzeugId) throw new ApplicationError('fahrzeug (ID) fehlt für Konfliktprüfung');
        if (!startzeit || !endzeit) throw new ApplicationError('Zeitraum fehlt für Konfliktprüfung');

        const filters = {
            fahrzeug: fahrzeugId,
            $and: [
                { startzeit: { $lt: endzeit } },
                { endzeit:   { $gt: startzeit } }
            ]
        };
        if (excludeId) {
            filters.id = { $ne: excludeId };
        }

        const matches = await strapi.entityService.findMany(
            'api::fahrzeugreservierung.fahrzeugreservierung',
            { filters, limit: 1 }
        );

        if (matches && matches.length) {
            throw new ApplicationError(
                'Zeitkonflikt: Für dieses Fahrzeug existiert bereits eine Reservierung im Zeitraum.'
            );
        }
    }
});
