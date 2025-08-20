'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tankeintrags/analysis',
      handler: 'tankeintrag.getConsumptionAnalysis',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};