'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/personal-tankstelle/:ptid/person',
            handler: 'personal-tankstelle.personByTankkarte',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
