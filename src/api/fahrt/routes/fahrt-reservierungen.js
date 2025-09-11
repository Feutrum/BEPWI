'use strict';

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: '/fahrzeug/:fzid/reservierungen',
            handler: 'fahrt.getFutureReservations',
            config: {
                auth: false, // auf true setzen, wenn Auth benötigt wird
            },
        },
    ],
};
