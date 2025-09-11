'use strict';

/**
 * werkstatt controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::werkstatt.werkstatt');
