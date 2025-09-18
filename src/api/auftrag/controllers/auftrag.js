'use strict';

/**
 * auftrag controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::auftrag.auftrag', ({ strapi }) => ({
    // Override find method to apply customer filtering
    async find(ctx) {
        const { user } = ctx.state;

        // Apply customer filtering for customer role
        if (user && user.role?.type === 'customer' && user.customer_id) {
            ctx.query = {
                ...ctx.query,
                filters: {
                    ...ctx.query.filters,
                    angebot: {
                        kunde: user.customer_id
                    }
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
            const auftrag = await strapi.entityService.findOne('api::auftrag.auftrag', ctx.params.id, {
                populate: { angebot: { populate: { kunde: true } } }
            });

            if (!auftrag || auftrag.angebot?.kunde?.id !== user.customer_id) {
                return ctx.forbidden('Access denied to this record');
            }
        }

        return super.findOne(ctx);
    },
}));