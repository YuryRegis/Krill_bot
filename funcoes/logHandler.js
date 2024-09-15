const getID = require('./ids.json');

exports.run = async payload => {
    try {
        const message = payload?.message;
        const client = payload?.client;

        const logRoom = await client.channels.cache.get(getID.sala.LOGS);
        await logRoom.send(message);
    } catch (error) {
        const jsonErrorMessage = JSON.stringify(error);
        const errorMessage = jsonErrorMessage ? jsonErrorMessage : error;

        console.error('LOG_HANDLER_ERROR:', errorMessage);
    }
}
