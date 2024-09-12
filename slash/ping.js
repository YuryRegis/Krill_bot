const { SlashCommandBuilder } = require('discord.js');
const getID = require('../funcoes/ids.json');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Retorna a latência de resposta do Krill.'),
	execute: async (interaction) => {
        try {
            const ping = interaction.client.ws.ping;
            return interaction.reply("ping?")
                .then( m => 
                    setTimeout(() => {
                        m.edit(`🏓  Pong!\nLatencia --> ${ping}ms`);
                        console.log(`Ping --> ${ping}ms`);
                    }, 3000)
                );
        } catch (error) {
            console.error(error);
            const salaLogs = await interaction?.client?.channels?.cache?.get(getID.sala.LOGS);
            if(salaLogs) salaLogs.send(`Erro ao executar comando user: \`\`\`${JSON.stringify(error)}\`\`\``);
	    }
    },
};