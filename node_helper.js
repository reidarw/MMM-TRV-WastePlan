const request = require('request');
const node_helper = require("node_helper");

module.exports = node_helper.create({
    socketNotificationReceived: function (notification, payload) {
        const self = this;
        if (notification === "GET_WASTE_PLAN") {
            const url = 'https://trv.no/wp-json/wasteplan/v2/calendar/' + payload.config.id;
            let returnData = {error: true};
            request({
                method: 'GET',
                uri: url,
                rejectUnauthorized: false,
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    returnData = JSON.parse(body);
                }
                self.sendSocketNotification("WASTE_PLAN", returnData);
            });
        }
    },
});
