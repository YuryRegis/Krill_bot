const Discord = require('discord.js');

const {updateRoles} = require('../models/roles');
const {run: errorLog} = require('./errorHandler');
const {run: logHandler} = require('./logHandler');
const {updatechannels} = require('../models/channels');


module.exports = {
    configIdModal: async (client, interaction) => {
        try {
                const type = interaction.customId;
                const option = interaction.values[0];
                
                const texts = {
                    'set-roles': {
                        title: `Configuração do cargo ${option}`,
                        label: 'Digite o novo ID',
                    },
                    'set-channels': {
                        title: `Configuração do canal ${option}`,
                        label: 'Digite o novo ID',
                    },
                };

                const modal = new Discord.ModalBuilder()
                    .setCustomId(`${type}|${option}`)
                    .setTitle(texts[type].title);
                
                const textInput = new Discord.TextInputBuilder()
                    .setMaxLength(19)
                    .setCustomId('new-id')
                    .setLabel(texts[type].label)
                    .setStyle(Discord.TextInputStyle.Short);

                const firstActionRow = new Discord.ActionRowBuilder().addComponents(textInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            } catch (error) {
                errorLog({message: 'CONFIG_ID_MODAL_ERROR:', client, error});
            }
    },
    configIdHandler: async (client, interaction) => {
        try {
            const [type, option] = interaction.customId.split('|');
            
            const newId = interaction.fields.getTextInputValue('new-id');
            if (!newId) {
                return interaction.reply({content: 'Infelizmente não detectei um ID válido.', ephemeral: true});
            }
            const JsonObj = JSON.parse(`{"${option}": "${newId}"}`);
            const messageToLog = `${option} atualizado para ${newId}`;
            switch (type) {
                case 'set-roles':
                    await updateRoles(JsonObj);
                    logHandler({message: messageToLog, client});
                    break;
                case 'set-channels':
                    await updatechannels(JsonObj);
                    break;
                default:
                    break;
            }
            return await interaction.reply({content: messageToLog, ephemeral: true});
        } catch (error) {
            errorLog({message: 'CONFIG_ID_HANDLER_ERROR:', client, error});
        }
    }
}    
