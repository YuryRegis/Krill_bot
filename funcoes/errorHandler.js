const getID = require('./ids.json');

exports.run = async payload => {
    try {
        const error = payload.error;
        const client = payload.client;
        const message = payload.message;
        
        const isNotEmptyError = Object.keys(error).length === 0;
        const parsedJsonError = isNotEmptyError ? error : JSON.stringify(error);
        const isValidString = typeof parsedJsonError === 'string';
        const isNotEmptyObject = isValidString && (!parsedJsonError || parsedJsonError !== '{}');
        const errorMessage = isNotEmptyObject ? parsedJsonError : error;
        
        console.error(message, errorMessage);
        await client.channels.cache.get(getID.sala.LOGS).send(`${message}: ${error}`);
    } catch (error) {
        console.error(payload?.message, payload?.error);
    }
}