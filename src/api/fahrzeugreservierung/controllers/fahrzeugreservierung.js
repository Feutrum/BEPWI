'use strict';

/**
 * fahrzeugreservierung controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { ApplicationError, ValidationError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::fahrzeugreservierung.fahrzeugreservierung',
    ({ strapi }) => ({

        // POST /fahrzeugreservierungs
        // Neue Reservierung anlegen
        async create(ctx) {
            const body = ctx.request.body?.data || ctx.request.body || {};
            const { startzeit, endzeit, fahrzeug } = body;

            // Eigene Business-Logik: Startzeit muss vor Endzeit liegen
            if (new Date(startzeit) >= new Date(endzeit)) {
                throw new ValidationError('startzeit muss vor endzeit liegen');
            }

            // Konfliktprüfung (Service)
            await strapi
                .service('api::fahrzeugreservierung.fahrzeugreservierung')
                .assertAvailability(fahrzeug, startzeit, endzeit, null);

            // Danach übernimmt Strapi die eigentliche Erstellung
            const entity = await strapi.entityService.create(
                'api::fahrzeugreservierung.fahrzeugreservierung',
                { data: body, populate: { fahrzeug: true, fahrer: true } }
            );

            ctx.body = entity;
        },

        // Reservierung genehmigen
        async approve(ctx) {
            const id = ctx.params.id;

            const resv = await strapi.entityService.findOne(
                'api::fahrzeugreservierung.fahrzeugreservierung',
                id,
                { populate: { fahrzeug: true } }
            );
            if (!resv) throw new ApplicationError('Reservierung nicht gefunden');

            // beim Genehmigen erneut prüfen
            await strapi
                .service('api::fahrzeugreservierung.fahrzeugreservierung')
                .assertAvailability(resv.fahrzeug.id, resv.startzeit, resv.endzeit, resv.id);

            // Update nur genehmigt=true
            const updated = await strapi.entityService.update(
                'api::fahrzeugreservierung.fahrzeugreservierung',
                id,
                { data: { genehmigt: true }, populate: { fahrzeug: true, fahrer: true } }
            );


            ctx.body = updated;
        },

        // Alle Reservierungen mit Fahrer+Fahrzeug
        async find(ctx) {
            const data = await strapi.entityService.findMany(
                'api::fahrzeugreservierung.fahrzeugreservierung',
                { ...ctx.query, populate: { fahrzeug: true, fahrer: true } }
            );
            ctx.body = data;
        },

        // Einzelne Reservierung mit Fahrer+Fahrzeug
        async findOne(ctx) {
            const id = ctx.params.id;
            const data = await strapi.entityService.findOne(
                'api::fahrzeugreservierung.fahrzeugreservierung',
                id,
                { populate: { fahrzeug: true, fahrer: true } }
            );
            ctx.body = data;
        }

    })
);