const { SlashCommandBuilder } = require('discord.js');
const {run: errorLog} = require('../funcoes/errorHandler');


module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Retorna a latência de resposta do Krill.'),
	execute: async (interaction) => {
        try {          
            const ping = interaction.client.ws.ping;
            const m = await interaction.reply("ping?");     
            setTimeout(() => {
                m.edit(`🏓  Pong!\nLatencia --> ${ping}ms`);
                console.log(`Ping --> ${ping}ms`);
            }, 3000)
                
        } catch (error) {
            errorLog({message: 'PING_ERROR:', client: interaction.client, error});
	    }
    },
};
