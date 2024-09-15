const Discord = require('discord.js');
const { execute } = require('./ping');

module.exports = {
    category: 'suporte',
    data: new Discord.SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Abre um ticket para denúncia, críticas ou sujestões.'),
    execute: async interaction => {
        try {
            const ticketEmbed = new Discord.EmbedBuilder()
                .setTimestamp()
                .setColor('#237feb')
                .setTitle('Alô suporte! ☎')
                .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
                .setDescription('Abra um chamado para fazer uma denúncia, crítica ou sugestão.')
                .setFooter({text: interaction.guild.name, icon_url: interaction.guild.iconURL({dinamic: true})});
                
            const menuDisplay = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('ticket')
                        .setPlaceholder('Selecione um motivo:')
                        .addOptions([
                            {
                                label: 'Denúncia',
                                value: 'denuncia',
                                description: 'Denuncie uma situação ou infração.',
                                emoji: '🚨'
                            },
                            {
                                label: 'Crítica',
                                value: 'critica',
                                description: 'Faça uma crítica construtiva.',
                                emoji: '🎯'
                            },
                            {
                                label: 'Sugestão',
                                value: 'sugestao',
                                description: 'Deixe sua sugestão para melhorar o servidor.',
                                emoji: '📝'
                            }
                        ])
                );
            await interaction.reply({ embeds: [ticketEmbed], components: [menuDisplay], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Erro ao abrir ticket.', ephemeral: true });
        }
    }
}