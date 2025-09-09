'use strict';

/**
 * werkstatt service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::werkstatt.werkstatt');
