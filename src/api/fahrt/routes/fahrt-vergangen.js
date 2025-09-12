'use strict';

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: '/fahrzeug/:fzid/vergangen',
            handler: 'fahrt.getPastReservations',
            config: {
                auth: false,
            },
        },
    ],
};
