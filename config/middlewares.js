module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'global::business-validation',  // Business validation middleware
  'global::rbac',                 // Role-based access control middleware
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
