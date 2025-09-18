'use strict';

/**
 * Business Logic Validation Middleware
 * Implements critical business rules for BEPWI system
 */

// Custom error types for business rules
class BusinessRuleError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'BusinessRuleError';
    this.code = code;
  }
}

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info('[business-validation] Processing request:', ctx.method, ctx.path);

    // Skip admin and content-manager routes
    if (ctx.path.startsWith('/admin') || ctx.path.startsWith('/content-manager')) {
      return await next();
    }

    // Only validate create and update operations
    if (ctx.method === 'POST' || ctx.method === 'PUT') {
      const data = ctx.request.body?.data;

      if (data) {
        try {
          // Stock Validation (LV-05): Prevent negative stock
          if (data.lagerbestand !== undefined && data.lagerbestand < 0) {
            strapi.log.warn('[business-validation] Negative stock rejected:', data.lagerbestand);
            throw new BusinessRuleError('Lagerbestand cannot be negative', 'NEGATIVE_STOCK');
          }

          if (data.menge !== undefined && data.menge < 0) {
            strapi.log.warn('[business-validation] Negative quantity rejected:', data.menge);
            throw new BusinessRuleError('Menge cannot be negative', 'NEGATIVE_QUANTITY');
          }

          // Salary Validation (PP-01, PP-04): Ensure reasonable salary ranges
          if (data.gehalt !== undefined) {
            if (data.gehalt < 0) {
              strapi.log.warn('[business-validation] Negative salary rejected:', data.gehalt);
              throw new BusinessRuleError('Gehalt cannot be negative', 'NEGATIVE_SALARY');
            }
            if (data.gehalt > 200000) {
              strapi.log.warn('[business-validation] Excessive salary rejected:', data.gehalt);
              throw new BusinessRuleError('Gehalt cannot exceed 200,000', 'EXCESSIVE_SALARY');
            }
          }

          // Working Hours Validation (PP-09): German labor law compliance
          if (data.arbeitszeit !== undefined && data.arbeitszeit > 60) {
            strapi.log.warn('[business-validation] Excessive working hours rejected:', data.arbeitszeit);
            throw new BusinessRuleError('Arbeitszeit cannot exceed 60 hours per week', 'EXCESSIVE_HOURS');
          }

          if (data.sollzeit !== undefined && data.sollzeit > 60) {
            strapi.log.warn('[business-validation] Excessive target hours rejected:', data.sollzeit);
            throw new BusinessRuleError('Sollzeit cannot exceed 60 hours per week', 'EXCESSIVE_TARGET_HOURS');
          }

          // Minimum stock validation for articles
          if (data.mindestbestand !== undefined && data.mindestbestand < 0) {
            strapi.log.warn('[business-validation] Negative minimum stock rejected:', data.mindestbestand);
            throw new BusinessRuleError('Mindestbestand cannot be negative', 'NEGATIVE_MIN_STOCK');
          }

          // Vehicle weight validation
          if (data.gewicht !== undefined && data.gewicht <= 0) {
            strapi.log.warn('[business-validation] Invalid vehicle weight rejected:', data.gewicht);
            throw new BusinessRuleError('Fahrzeuggewicht must be greater than 0', 'INVALID_WEIGHT');
          }

          // Field size validation
          if (data.groesse !== undefined && data.groesse <= 0) {
            strapi.log.warn('[business-validation] Invalid field size rejected:', data.groesse);
            throw new BusinessRuleError('Feldgroesse must be greater than 0', 'INVALID_FIELD_SIZE');
          }

          strapi.log.info('[business-validation] Validation passed for:', ctx.path);

        } catch (err) {
          if (err instanceof BusinessRuleError) {
            strapi.log.error('[business-validation] Business rule violation:', err.message);
            return ctx.badRequest(err.message, {
              code: err.code,
              field: getFieldFromPath(ctx.path),
              details: {
                error: err.name,
                message: err.message,
                code: err.code
              }
            });
          }
          // Re-throw non-business rule errors
          throw err;
        }
      }
    }

    await next();
  };
};

/**
 * Extract field context from request path
 */
function getFieldFromPath(path) {
  if (path.includes('/bestand')) return 'lagerbestand';
  if (path.includes('/personal')) return 'gehalt';
  if (path.includes('/position')) return 'sollzeit';
  if (path.includes('/artikel')) return 'mindestbestand';
  if (path.includes('/fahrzeug')) return 'gewicht';
  if (path.includes('/feld')) return 'groesse';
  return 'unknown';
}