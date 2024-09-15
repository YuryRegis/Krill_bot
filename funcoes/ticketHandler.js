const Discord = require('discord.js');

const getID = require('./ids.json');
const {run: errorLog} = require('./errorHandler');
const {run: logHandler} = require('./logHandler');

async function createTicketChannel(client, interaction, name) {
    try {
        const userId = interaction.user.id;
        const userTag = interaction.user.username;
        const permissionsIds = [userId, getID.cargo.ADMIN, getID.cargo.STAFF];

        const allowedPermissions = permissionsIds.map(id => {
            return { id, allow: [
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AddReactions,
                Discord.PermissionFlagsBits.ReadMessageHistory,
            ]}
        });

        return await interaction.guild.channels.create({
            name,
            type: Discord.ChannelType.GuildText,
            reason: `Ticket aberto por ${userTag}`,
            PermissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                },
                ...allowedPermissions,
            ],
        });
    } catch (error) {
        errorLog({message: 'CREATE_TICKET_CHANNEL_ERROR:', client, error});
    }
}

async function denunciaHandler(client, interaction) {
    try {    
        const userTag = interaction.user.username;
        logHandler({message: `Denúncia aberta por ${interaction.user.tag}`, client});

        const name = `denuncia-${userTag}`;
        const userTicketChannel = interaction.guild.channels.cache.find(channel => channel.name === name);
        if (userTicketChannel) {
            return interaction.reply({ content: `⚠️ Você já possui uma denúncia aberta em ${userTicketChannel}.`, ephemeral: true });
        }

        const ticketChannel = await createTicketChannel(client, interaction, name);
        interaction.reply({ content: `🚨 Denúncia aberta em ${ticketChannel}.`, ephemeral: true });

        const denunciaEmbed = new Discord.EmbedBuilder()
        .setColor('#237feb')
        .setTitle('🚨    [TICKET] Denúncia')
        .setThumbnail('https://media1.tenor.com/m/FrZXsAxDHhUAAAAC/sky-moth.gif')
        .addFields(
            {name: "Denúncia anônima:", value: "Esta denúncia não é anônima. Caso deseje abrir uma denúncia anônima, utilize o comando `!denuncia`."},
            {name: "Observação:", value: "Ao fechar o ticket, este canal será excluído."}
        )
        .setDescription('Você abriu um chamado de denúncia com a nossa equipe. Este chat é privado e apenas você e a equipe de suporte podem ver as mensagens.')
        .setFooter({text: interaction.guild.name, icon_url: interaction.guild.iconURL({dinamic: true})});

        const closeButton = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        const ticketMessage = await ticketChannel.send({ embeds: [denunciaEmbed], components: [closeButton] });
        ticketMessage.pin();
    } catch (error) {
        errorLog({message: 'DENUNCIA_HANDLER_ERROR:', client, error});
    }
}

async function criticaHandler(client, interaction) {
    try {    
        const userTag = interaction.user.username;
        logHandler({message: `Canal de crítica aberto por ${interaction.user.tag}`, client});

        const name = `critica-${userTag}`;
        const userTicketChannel = interaction.guild.channels.cache.find(channel => channel.name === name);
        if (userTicketChannel) {
            return interaction.reply({ content: `⚠️ Você já possui um canal de crítica aberto em ${userTicketChannel}.`, ephemeral: true });
        }

        const ticketChannel = await createTicketChannel(client, interaction, name);
        interaction.reply({ content: `🎯 Canal para realizar uma crítica aberto em ${ticketChannel}.`, ephemeral: true });

        const denunciaEmbed = new Discord.EmbedBuilder()
        .setColor('#237feb')
        .setTitle('🎯    [TICKET] Críticas')
        .setThumbnail('https://media.tenor.com/Abm7Wlts7dEAAAAM/moth-children-of-the-light.gif')
        .setDescription('Você abriu um chamado para realizar uma crítica. Este chat é privado e apenas você e a equipe de suporte podem ver as mensagens.')
        .setFields({name: "Observação:", value: "Ao fechar o ticket, este canal será excluído."})
        .setFooter({text: interaction.guild.name, icon_url: interaction.guild.iconURL({dinamic: true})});

        const closeButton = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        const ticketMessage = await ticketChannel.send({ embeds: [denunciaEmbed], components: [closeButton] });
        ticketMessage.pin();
    } catch (error) {
        errorLog({message: 'CRITICA_HANDLER_ERROR:', client, error});
    }
}

async function suggestionHandler(client, interaction) {
    try {    
        const userTag = interaction.user.username;
        logHandler({message: `Canal de sugestões aberto por ${interaction.user.tag}`, client});

        const name = `sugestao-${userTag}`;
        const userTicketChannel = interaction.guild.channels.cache.find(channel => channel.name === name);
        if (userTicketChannel) {
            return interaction.reply({ content: `⚠️ Você já possui um canal de sugestões aberto em ${userTicketChannel}.`, ephemeral: true });
        }

        const ticketChannel = await createTicketChannel(client, interaction, name);
        interaction.reply({ content: `🎯 Canal para realizar sugestões aberto em ${ticketChannel}.`, ephemeral: true });

        const denunciaEmbed = new Discord.EmbedBuilder()
        .setColor('#237feb')
        .setTitle('🎯    [TICKET] Sugestões')
        .setThumbnail('https://media.tenor.com/cL5IVBQVaOQAAAAi/krill-kiss-sky.gif')
        .setFields({name: "Observação:", value: "Ao fechar o ticket, este canal será excluído."})
        .setDescription('Você abriu um chamado para realizar sugestões junto à nossa equipe. Este chat é privado e apenas você e a equipe de suporte podem ver as mensagens.')
        .setFooter({text: interaction.guild.name, icon_url: interaction.guild.iconURL({dinamic: true})});

        const closeButton = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        const ticketMessage = await ticketChannel.send({ embeds: [denunciaEmbed], components: [closeButton] });
        ticketMessage.pin();
    } catch (error) {
        errorLog({message: 'CRITICA_HANDLER_ERROR:', client, error});
    }
}

exports.run = async (client, interaction) => {
    try {
        const ticketOption = interaction.values[0];
        switch (ticketOption) {
            case 'denuncia':
                denunciaHandler(client, interaction);
                break;
            case 'critica':
                criticaHandler(client, interaction);
                break;
            case 'sugestao':
                suggestionHandler(client, interaction);
                break;
            default:
                break;
        }
    } catch (error) {
        errorLog({message: 'TICKET_HANDLER_ERROR:', client, error});
    }
};
