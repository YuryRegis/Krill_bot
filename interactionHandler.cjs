const errorLog = require('./funcoes/errorHandler');
const {run: ticketHandler} = require('./funcoes/ticketHandler');

exports.run = async (client, interaction) => {
    try {
        switch (interaction.customId) {
            case 'ticket':
                await ticketHandler(client, interaction);
                break;
            default:
                break;
        }
    } catch (error) {
        errorLog.run({message: 'INTERACTION_HANDLER_ERROR:', client, error});   
    }
}
