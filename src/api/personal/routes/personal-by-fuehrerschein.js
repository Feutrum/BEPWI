'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/personals/by-fuehrerschein/:fsId',
            handler: 'personal.byFuehrerschein',
            config: { auth: false, policies: [], middlewares: [] },
        },
    ],
};
