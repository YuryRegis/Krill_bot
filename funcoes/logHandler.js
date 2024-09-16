const {channelsCollection} = require('../models/channels');

exports.run = async payload => {
    try {
        const channelsIds = await channelsCollection();

        const message = payload?.message;
        const client = payload?.client;

        const logRoom = await client.channels.cache.get(channelsIds.LOGS);
        await logRoom.send(message);
    } catch (error) {
        const jsonErrorMessage = JSON.stringify(error);
        const errorMessage = jsonErrorMessage ? jsonErrorMessage : error;

        console.error('LOG_HANDLER_ERROR:', errorMessage);
    }
}
