module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fahrers/available',
            handler: 'fahrer.available',
            config: {
                auth: false, // oder true, wenn Login nötig sein soll
            },
        },
    ],
};
