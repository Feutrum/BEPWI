// src/api/angebot/controllers/angebot.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::angebot.angebot', ({ strapi }) => ({
    // Override find method to apply customer filtering
    async find(ctx) {
        const { user } = ctx.state;

        // Apply customer filtering for customer role
        if (user && user.role?.type === 'customer' && user.customer_id) {
            ctx.query = {
                ...ctx.query,
                filters: {
                    ...ctx.query.filters,
                    kunde: user.customer_id
                }
            };
        }

        return super.find(ctx);
    },

    // Override findOne method to apply customer filtering
    async findOne(ctx) {
        const { user } = ctx.state;

        if (user && user.role?.type === 'customer' && user.customer_id) {
            // First check if the record belongs to the customer
            const angebot = await strapi.entityService.findOne('api::angebot.angebot', ctx.params.id, {
                populate: { kunde: true }
            });

            if (!angebot || angebot.kunde?.id !== user.customer_id) {
                return ctx.forbidden('Access denied to this record');
            }
        }

        return super.findOne(ctx);
    },
    async convertToOrder(ctx) {
        strapi.log.info('[angebot.convertToOrder] hit');
        const angebotId = Number(ctx.params.id);
        if (!angebotId) return ctx.badRequest('Bitte Angebot-ID angeben.');

        try {
            // Check if offer exists and is accepted
            const angebot = await strapi.entityService.findOne('api::angebot.angebot', angebotId, {
                populate: { kunde: true }
            });

            if (!angebot) {
                strapi.log.warn('[convertToOrder] Angebot not found:', angebotId);
                return ctx.notFound('Angebot nicht gefunden');
            }

            if (angebot.status !== 'angenommen') {
                strapi.log.warn('[convertToOrder] Angebot not accepted:', angebot.status);
                return ctx.badRequest('Nur angenommene Angebote können in Aufträge umgewandelt werden');
            }

            // Check if order already exists
            const existingOrder = await strapi.db.query('api::auftrag.auftrag').findOne({
                where: { angebot: { id: angebotId } }
            });

            if (existingOrder) {
                strapi.log.warn('[convertToOrder] Order already exists for offer:', angebotId);
                return ctx.badRequest('Für dieses Angebot existiert bereits ein Auftrag');
            }

            // Business Logic: Convert offer to order (VT-05)
            const auftrag = await strapi.entityService.create('api::auftrag.auftrag', {
                data: {
                    angebot: angebotId,
                    status: 'offen',
                    auftragsdatum: new Date().toISOString()
                }
            });

            strapi.log.info(`[convertToOrder] Order created successfully: ${auftrag.id} for offer: ${angebotId}`);

            const sanitized = await this.sanitizeOutput(auftrag, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[angebot.convertToOrder] Fehler:', err);
            return ctx.internalServerError('Fehler bei Auftrag-Erstellung');
        }
    },

    async byKunde(ctx) {
        strapi.log.info('[angebot.byKunde] hit');
        const kundeId = Number(ctx.params.kundeId);
        if (!kundeId) return ctx.badRequest('Bitte Kunden-ID angeben.');

        try {
            const angebots = await strapi.db.query('api::angebot.angebot').findMany({
                where: { kunde: { id: kundeId } },
                populate: ctx.query.populate || undefined,
                select: ctx.query.fields || undefined,
                orderBy: ctx.query.sort || { erstellungsdatum: 'desc' }
            });

            strapi.log.info(`[byKunde] result count=${angebots.length}`);

            const sanitized = await this.sanitizeOutput(angebots, ctx);
            return this.transformResponse(sanitized);
        } catch (err) {
            strapi.log.error('[angebot.byKunde] Fehler:', err);
            return ctx.internalServerError('Fehler bei byKunde');
        }
    }
}));