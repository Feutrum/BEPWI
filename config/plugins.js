module.exports = () => ({
  'content-manager': {
    config: {
      // Disable preview URLs to avoid documentId validation errors
      // when accessing content types without specific document context
      previewUrl: false,
    },
  },
  'users-permissions': {
    config: {
      // Configure JWT settings for API authentication
      jwt: {
        expiresIn: '7d',
      },
      // Define custom roles for BEPWI system
      roles: {
        // Farm Manager - Full access to all modules
        farmManager: {
          name: 'Farm Manager',
          description: 'Full administrative access to all farm operations',
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
          }
        },
        // Office Staff - Limited admin access
        officeStaff: {
          name: 'Office Staff',
          description: 'Administrative access to customer and sales management',
          permissions: {
            'api::kunde.kunde': ['find', 'findOne', 'create', 'update'],
            'api::personal.personal': ['find', 'findOne'],
            'api::fahrzeug.fahrzeug': ['find', 'findOne'],
            'api::artikel.artikel': ['find', 'findOne'],
            'api::bestand.bestand': ['find', 'findOne'],
            'api::angebot.angebot': ['find', 'findOne', 'create', 'update'],
            'api::auftrag.auftrag': ['find', 'findOne', 'create', 'update'],
          }
        },
        // Field Worker - Basic operational access
        fieldWorker: {
          name: 'Field Worker',
          description: 'Basic access to field operations and equipment',
          permissions: {
            'api::fahrzeug.fahrzeug': ['find', 'findOne'],
            'api::artikel.artikel': ['find', 'findOne'],
            'api::bestand.bestand': ['find', 'findOne'],
            'api::feld.feld': ['find', 'findOne'],
            'api::aktion.aktion': ['find', 'findOne', 'create'],
          }
        },
        // Customer Portal - External access
        customer: {
          name: 'Customer',
          description: 'Limited access for customers to view their data',
          permissions: {
            'api::angebot.angebot': ['find', 'findOne'],
            'api::auftrag.auftrag': ['find', 'findOne'],
          }
        }
      }
    },
  },
});
