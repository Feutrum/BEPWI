'use strict';

/**
 * RBAC Setup Bootstrap
 * Creates initial roles and permissions for BEPWI system
 */

module.exports = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'users-permissions',
  });

  // Define role configurations
  const roleConfigs = [
    {
      name: 'Farm Manager',
      description: 'Full administrative access to all farm operations',
      type: 'farm-manager',
      permissions: {
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
      }
    },
    {
      name: 'Office Staff',
      description: 'Administrative access to customer and sales management',
      type: 'office-staff',
      permissions: {
        'api::kunde.kunde': ['find', 'findOne', 'create', 'update'],
        'api::personal.personal': ['find', 'findOne'],
        'api::fahrzeug.fahrzeug': ['find', 'findOne'],
        'api::artikel.artikel': ['find', 'findOne'],
        'api::bestand.bestand': ['find', 'findOne'],
        'api::angebot.angebot': ['find', 'findOne', 'create', 'update'],
        'api::auftrag.auftrag': ['find', 'findOne', 'create', 'update'],
        'api::position.position': ['find', 'findOne'],
        'api::qualifikation.qualifikation': ['find', 'findOne'],
      }
    },
    {
      name: 'Field Worker',
      description: 'Basic access to field operations and equipment',
      type: 'field-worker',
      permissions: {
        'api::fahrzeug.fahrzeug': ['find', 'findOne'],
        'api::artikel.artikel': ['find', 'findOne'],
        'api::bestand.bestand': ['find', 'findOne'],
        'api::feld.feld': ['find', 'findOne'],
        'api::aktion.aktion': ['find', 'findOne', 'create'],
        'api::lagerbewegung.lagerbewegung': ['find', 'findOne', 'create'],
      }
    },
    {
      name: 'Customer',
      description: 'Limited access for customers to view their data',
      type: 'customer',
      permissions: {
        'api::angebot.angebot': ['find', 'findOne'],
        'api::auftrag.auftrag': ['find', 'findOne'],
      }
    }
  ];

  try {
    console.log('🔐 Setting up RBAC roles and permissions...');

    for (const roleConfig of roleConfigs) {
      // Check if role already exists
      const existingRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: roleConfig.type }
      });

      if (existingRole) {
        console.log(`  ✓ Role "${roleConfig.name}" already exists, skipping...`);
        continue;
      }

      // Create the role
      const role = await strapi.query('plugin::users-permissions.role').create({
        data: {
          name: roleConfig.name,
          description: roleConfig.description,
          type: roleConfig.type,
        }
      });

      console.log(`  ✓ Created role: ${roleConfig.name}`);

      // Set up permissions for this role
      const permissions = {};

      for (const [contentType, actions] of Object.entries(roleConfig.permissions)) {
        permissions[contentType] = {};

        for (const action of actions) {
          permissions[contentType][action] = {
            enabled: true,
            policy: '',
          };
        }
      }

      // Store permissions
      await pluginStore.set({
        key: `role_${role.id}`,
        value: permissions,
      });

      console.log(`  ✓ Set permissions for role: ${roleConfig.name}`);
    }

    console.log('✅ RBAC setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up RBAC:', error);
  }
};