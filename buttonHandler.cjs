const errorLog = require('./funcoes/errorHandler');
const logHandler = require('./funcoes/logHandler');

exports.run = async (client, interaction) => {
    try {
        switch (interaction.customId) {
            case 'close-ticket':
                await interaction.channel.delete();
                logHandler.run({message: `Ticket fechado por ${interaction.user.username}`, client});
                break;
            default:
                break;
        }
    } catch (error) {
        errorLog.run({message: 'BUTTON_HANDLER_ERROR:', client, error});   
    }
}
