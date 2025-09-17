'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fahrzeugs/anstehend',
            handler: 'fahrzeug.anstehend',
            config: { auth: false },
        },
    ],
};
