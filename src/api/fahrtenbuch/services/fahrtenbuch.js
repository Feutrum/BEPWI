'use strict';

/**
 * fahrtenbuch service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::fahrtenbuch.fahrtenbuch');
