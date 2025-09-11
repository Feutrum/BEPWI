'use strict';
module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fahrzeugs/by-standort/:standortId',
            handler: 'fahrzeug.byStandort',
            config: { auth: false, policies: [], middlewares: [] },

        },
    ],
};
