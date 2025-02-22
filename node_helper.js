const https = require('https');
const node_helper = require('node_helper');

module.exports = node_helper.create({
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_WASTE_PLAN') {
            const url = `https://trv.no/wp-json/wasteplan/v2/calendar/${payload.config.id}`;
            const defaultErrorData = { error: true };

            const req = https.get(url, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    let parsedData = defaultErrorData;
                    if (res.statusCode === 200) {
                        try {
                            parsedData = JSON.parse(data);
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    } else {
                        console.error(`HTTP error: ${res.statusCode}`);
                    }
                    this.sendSocketNotification('WASTE_PLAN', parsedData);
                });
            });

            req.on('error', (error) => {
                console.error('Request error:', error.message);
                this.sendSocketNotification('WASTE_PLAN', defaultErrorData);
            });

            req.setTimeout(5000, () => {
                console.error('Request timed out');
                req.abort();
                this.sendSocketNotification('WASTE_PLAN', defaultErrorData);
            });
        }
    },
});
