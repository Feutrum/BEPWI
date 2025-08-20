'use strict';

/**
 * fahrzeugreservierung service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = createCoreService('api::fahrzeugreservierung.fahrzeugreservierung', ({ strapi }) => ({

    // Funktion zur Konfliktprüfung
    async assertAvailability(fahrzeugId, startzeit, endzeit, excludeId) {
        const matches = await strapi.entityService.findMany(
            'api::fahrzeugreservierung.fahrzeugreservierung',
            {
                filters: {
                    fahrzeug: fahrzeugId,
                    id: excludeId ? { $ne: excludeId } : undefined,
                    $and: [
                        { startzeit: { $lt: endzeit } },
                        { endzeit:   { $gt: startzeit } }
                    ]
                },
                limit: 1
            }
        );

        if (matches && matches.length) {
            throw new ApplicationError(
                'Zeitkonflikt: Für dieses Fahrzeug existiert bereits eine Reservierung im Zeitraum.'
            );
        }
    }

}));