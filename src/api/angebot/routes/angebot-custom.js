'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/angebots/:id/convert-to-order',
            handler: 'angebot.convertToOrder',
            config: { auth: false, policies: [], middlewares: [] },
        },
        {
            method: 'GET',
            path: '/angebots/by-kunde/:kundeId',
            handler: 'angebot.byKunde',
            config: { auth: false, policies: [], middlewares: [] },
        },
    ],
};