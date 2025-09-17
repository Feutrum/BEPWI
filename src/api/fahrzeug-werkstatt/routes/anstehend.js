'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fahrzeug-werkstatts/anstehend',
            handler: 'api::fahrzeug-werkstatt.fahrzeug-werkstatt.anstehend',
            config: { auth: false },
        },
    ],
};
