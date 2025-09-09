'use strict';

/**
 * werkstatt router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::werkstatt.werkstatt');
