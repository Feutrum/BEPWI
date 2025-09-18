'use strict';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces permissions based on user roles for BEPWI system
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;

    // Skip RBAC for admin users and public routes
    if (!user || ctx.request.url.startsWith('/admin') || ctx.request.url.startsWith('/auth')) {
      return await next();
    }

    // Extract API endpoint from request URL
    const urlParts = ctx.request.url.split('/');
    const apiIndex = urlParts.indexOf('api');

    if (apiIndex === -1 || !urlParts[apiIndex + 1]) {
      return await next();
    }

    const contentType = `api::${urlParts[apiIndex + 1]}.${urlParts[apiIndex + 1]}`;
    const method = ctx.request.method.toLowerCase();

    // Map HTTP methods to Strapi actions
    const actionMap = {
      'get': urlParts[apiIndex + 2] ? 'findOne' : 'find',
      'post': 'create',
      'put': 'update',
      'patch': 'update',
      'delete': 'delete'
    };

    const requiredAction = actionMap[method];

    if (!requiredAction) {
      return await next();
    }

    // Get user role and check permissions
    const userRole = user.role?.type || 'authenticated';
    const hasPermission = await checkUserPermission(userRole, contentType, requiredAction, user, ctx);

    if (!hasPermission) {
      return ctx.forbidden('Access denied: Insufficient permissions for this action');
    }

    await next();
  };
};

/**
 * Check if user has permission for specific action on content type
 */
async function checkUserPermission(userRole, contentType, action, user, ctx) {
  // Role-based permission matrix
  const rolePermissions = {
    // Farm Manager - Full access
    'farm-manager': {
      'api::kunde.kunde': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::personal.personal': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::fahrzeug.fahrzeug': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::artikel.artikel': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::bestand.bestand': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::feld.feld': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::angebot.angebot': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::auftrag.auftrag': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::aktion.aktion': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::position.position': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::qualifikation.qualifikation': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::gehalt.gehalt': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::lagerbewegung.lagerbewegung': ['find', 'findOne', 'create', 'update', 'delete'],
    },

    // Office Staff - Administrative access to customer and sales
    'office-staff': {
      'api::kunde.kunde': ['find', 'findOne', 'create', 'update'],
      'api::personal.personal': ['find', 'findOne'],
      'api::fahrzeug.fahrzeug': ['find', 'findOne'],
      'api::artikel.artikel': ['find', 'findOne'],
      'api::bestand.bestand': ['find', 'findOne'],
      'api::angebot.angebot': ['find', 'findOne', 'create', 'update'],
      'api::auftrag.auftrag': ['find', 'findOne', 'create', 'update'],
      'api::position.position': ['find', 'findOne'],
      'api::qualifikation.qualifikation': ['find', 'findOne'],
    },

    // Field Worker - Basic operational access
    'field-worker': {
      'api::fahrzeug.fahrzeug': ['find', 'findOne'],
      'api::artikel.artikel': ['find', 'findOne'],
      'api::bestand.bestand': ['find', 'findOne'],
      'api::feld.feld': ['find', 'findOne'],
      'api::aktion.aktion': ['find', 'findOne', 'create'],
      'api::lagerbewegung.lagerbewegung': ['find', 'findOne', 'create'],
    },

    // Customer - External access to their own data
    'customer': {
      'api::angebot.angebot': ['find', 'findOne'],
      'api::auftrag.auftrag': ['find', 'findOne'],
    },

    // Default authenticated user - minimal access
    'authenticated': {
      'api::artikel.artikel': ['find', 'findOne'],
      'api::feld.feld': ['find', 'findOne'],
    }
  };

  const permissions = rolePermissions[userRole];

  if (!permissions) {
    return false;
  }

  const allowedActions = permissions[contentType];

  if (!allowedActions || !allowedActions.includes(action)) {
    return false;
  }

  // Additional data filtering for customer role
  if (userRole === 'customer') {
    return await applyCustomerDataFilter(contentType, action, user, ctx);
  }

  return true;
}

/**
 * Apply data filtering for customer role to ensure they only see their own data
 */
async function applyCustomerDataFilter(contentType, action, user, ctx) {
  if (!user.customer_id) {
    return false;
  }

  // For customer role, add filters to only show their own data
  if (contentType === 'api::angebot.angebot' || contentType === 'api::auftrag.auftrag') {
    // Modify query to filter by customer ID
    if (action === 'find') {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          kunde: user.customer_id
        }
      };
    } else if (action === 'findOne') {
      // For findOne, we'll validate ownership in the controller
      ctx.state.customerFilter = { kunde: user.customer_id };
    }
  }

  return true;
}