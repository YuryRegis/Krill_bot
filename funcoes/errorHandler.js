const getID = require('./ids.json');

exports.run = async payload => {
    try {
        const error = payload?.error;
        const client = payload?.client;
        const message = payload?.message;
        
        const parsedJsonError = JSON.stringify(error);
        const errorMessage = Boolean(parsedJsonError) ? parsedJsonError : error;
        
        console.error(message, errorMessage);
        await client.channels.cache.get(getID.sala.LOGS).send(`${message}: ${error}`);
    } catch (error) {
        console.error(payload?.message, payload?.error);
    }
}
