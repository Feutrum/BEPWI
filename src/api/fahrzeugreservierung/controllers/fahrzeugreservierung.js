'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { ValidationError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::fahrzeugreservierung.fahrzeugreservierung', ({ strapi }) => ({

    // POST /fahrzeugreservierungs
    // Nur Business-Logik: Zeit prüfen + Konfliktprüfung
    async create(ctx) {
        const body = ctx.request.body?.data || ctx.request.body || {};
        const { startzeit, endzeit, fahrzeug } = body;

        if (!startzeit || !endzeit) throw new ValidationError('startzeit und endzeit sind erforderlich');
        if (new Date(startzeit) >= new Date(endzeit)) {
            throw new ValidationError('startzeit muss vor endzeit liegen');
        }
        if (!fahrzeug) throw new ValidationError('fahrzeug (Relation-ID) ist erforderlich');

        await strapi
            .service('api::fahrzeugreservierung.fahrzeugreservierung')
            .assertAvailability(fahrzeug, startzeit, endzeit, null);

        const entity = await strapi.entityService.create(
            'api::fahrzeugreservierung.fahrzeugreservierung',
            { data: body, populate: { fahrzeug: true, fahrer: true } }
        );

        ctx.body = entity;
    },

    // GET /fahrzeugreservierungs
    async find(ctx) {
        const data = await strapi.entityService.findMany(
            'api::fahrzeugreservierung.fahrzeugreservierung',
            { ...ctx.query, populate: { fahrzeug: true, fahrer: true } }
        );
        ctx.body = data;
    },

    // GET /fahrzeugreservierungs/:id
    async findOne(ctx) {
        const id = ctx.params.id;
        const data = await strapi.entityService.findOne(
            'api::fahrzeugreservierung.fahrzeugreservierung',
            id,
            { populate: { fahrzeug: true, fahrer: true } }
        );
        ctx.body = data;
    }

}));
