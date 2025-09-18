'use strict';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces permissions based on user roles for BEPWI system
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;

    // Debug logging
    if (ctx.request.url.includes('user') && ctx.method === 'PUT') {
      console.log('[RBAC Debug] URL:', ctx.request.url);
      console.log('[RBAC Debug] Path:', ctx.path);
      console.log('[RBAC Debug] Method:', ctx.method);
      console.log('[RBAC Debug] User:', user?.username);
    }

    // Skip RBAC for admin, content-manager, auth, and plugin routes
    const skipPaths = [
      '/admin',
      '/content-manager',
      '/auth',
      '/users-permissions',
      '/upload',
      '/documentation',
      '/_health'
    ];

    const shouldSkip = !user || skipPaths.some(path =>
      ctx.request.url.startsWith(path) ||
      ctx.request.url.includes(path + '/') ||
      ctx.path.startsWith(path) ||
      ctx.path.includes(path + '/')
    );

    if (shouldSkip) {
      console.log('[RBAC] Skipping for:', ctx.request.url);
      return await next();
    }

    // Only process API routes
    if (!ctx.request.url.includes('/api/')) {
      console.log('[RBAC] Not an API route, skipping:', ctx.request.url);
      return await next();
    }

    // Extract API endpoint from request URL
    const urlParts = ctx.request.url.split('/');
    const apiIndex = urlParts.indexOf('api');

    if (apiIndex === -1 || !urlParts[apiIndex + 1]) {
      console.log('[RBAC] Invalid API route structure:', ctx.request.url);
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
    // Geschäftsleitung (Management) - Full access
    'geschaeftsleitung': {
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

    // HR-Mitarbeiter (HR Staff) - Personnel and administrative access
    'hr-mitarbeiter': {
      'api::kunde.kunde': ['find', 'findOne', 'create', 'update'],
      'api::personal.personal': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::fahrzeug.fahrzeug': ['find', 'findOne'],
      'api::artikel.artikel': ['find', 'findOne'],
      'api::bestand.bestand': ['find', 'findOne'],
      'api::angebot.angebot': ['find', 'findOne', 'create', 'update'],
      'api::auftrag.auftrag': ['find', 'findOne', 'create', 'update'],
      'api::position.position': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::qualifikation.qualifikation': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::gehalt.gehalt': ['find', 'findOne', 'create', 'update', 'delete'],
      'api::arbeitszeit.arbeitszeit': ['find', 'findOne', 'create', 'update', 'delete'],
    },

    // Mitarbeiter (Employee) - Basic operational access
    'mitarbeiter': {
      'api::fahrzeug.fahrzeug': ['find', 'findOne'],
      'api::artikel.artikel': ['find', 'findOne'],
      'api::bestand.bestand': ['find', 'findOne'],
      'api::feld.feld': ['find', 'findOne'],
      'api::aktion.aktion': ['find', 'findOne', 'create', 'update'],
      'api::lagerbewegung.lagerbewegung': ['find', 'findOne', 'create'],
      'api::arbeitszeit.arbeitszeit': ['find', 'findOne', 'create', 'update'],
      'api::personal.personal': ['find', 'findOne'], // Can view own profile
      'api::gehalt.gehalt': ['find', 'findOne'], // Can view own salary
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