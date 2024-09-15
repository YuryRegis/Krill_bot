const Discord = require("discord.js");
const getID = require("../funcoes/ids.json");
const errorLog = require("../funcoes/errorHandler");


exports.run = async (client, message, args) => {
    try {
        message.delete();
    
        let denRoom = await message.guild.channels.cache.get(getID.sala.DENUNCIA),
            autor   = message.author,
            info    = `${autor.globalName} explique detalhadamente sua denúncia`;
        // let novaRole = await message.guild.createRole({
        //     name: tag,
        //     hoist: false,
        //     mentionable: false,
        // });
        const name = `🔐-denuncia-anonima-${autor.username.match(/\d+/g)[0]}`;
        const userTicketChannel = await message.guild.channels.cache.find(channel => channel.name === name);
        if (userTicketChannel) {
            return message.reply({ content: `⚠️ Você já possui uma denúncia aberta em ${userTicketChannel}.`, ephemeral: true });
        }
        let novaSala = await message.guild.channels.create( 
            {
                name: name,
                reason: `Denuncia anônima aberta.`,
                type: Discord.ChannelType.GuildText,
                PermissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: autor.id,
                        allow: [
                            Discord.PermissionFlagsBits.EmbedLinks,
                            Discord.PermissionFlagsBits.ViewChannel,
                            Discord.PermissionFlagsBits.AttachFiles,
                            Discord.PermissionFlagsBits.SendMessages,
                            Discord.PermissionFlagsBits.AddReactions,
                            Discord.PermissionFlagsBits.ReadMessageHistory,
                        ],
                    },
                ],
            },
        );

        const denunciaEmbed = new Discord.EmbedBuilder()
        .setColor('#237feb')
        .setDescription(info)
        .setTitle('🚨    [TICKET] Denúncia anônima')
        .setThumbnail('https://media1.tenor.com/m/FrZXsAxDHhUAAAAC/sky-moth.gif')
        .addFields(
            {
                name: "Evidências:", 
                value: "Caso tenha evidências, adicione a imagem/print à sua denúncia tudo em uma única mensagem."
            },
            {
                name: "Denúncia anônima:", 
                value: "Não se preocupe, esta sala está oculta para todos os membros, staffs, moderadores e administradores. Apenas você ou dono podem ver esta sala."
            },
            {   name: "Observação:", 
                value: "Esta sala se destruirá automaticamente e sua mensagem será enviada aos Admins e Staffs de forma anônima, ou seja, sem revelar sua identidade."
            }
        )
        .setFooter({text: message.guild.name, icon_url: message.guild.iconURL({dinamic: true})});

        const closeButton = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        await novaSala.send({ embeds: [denunciaEmbed], components: [closeButton] })
            .then(sendedMessage => sendedMessage.pin())
            .then(() => {
                try {
                    let filtro  = f => !f.author.bot;
                    let coletor = new Discord.MessageCollector(novaSala, filtro);
                    
                    coletor.on('collect', async (msg, col) => {
                        let atch = await msg.attachments.first(1);
                        console.log(msg.content)
                        if (atch[0] !== undefined)
                            coletor.stop();
                        else if(msg.content !== undefined)
                            coletor.stop();
                    })

                    coletor.on('end', async coletado => {
                        try {
                            let anexos = coletado.first().attachments,
                                content  = coletado.first().content,
                                mensagem = `<@&${getID.cargo.MODERADOR}> <@&${getID.cargo.STAFF}> <@&${getID.cargo.ADMIN}> temos uma denúncia anônima.`;
                            
                                if (anexos && anexos.size > 0) {
                                    anexos = anexos.map(attachment => new Discord.AttachmentBuilder(attachment.proxyURL));
                                } else {
                                    anexos = [];
                                }
                            
                            await denRoom.send(mensagem);
                            await denRoom.send({content, files: anexos});
                        
                            novaSala.delete();
                        } catch (error) {
                            errorLog.run({message: 'DENUNCIA_COLECTOR_ERROR:', client, error});
                        }
                    })
                } catch (error) {
                    errorLog.run({message: 'DENUNCIA_SEND_ERROR:', client, error});
                }
            })
    } catch (error) {
        console.log('DENUNCIA_ERROR:', error);
        errorLog.run({message: 'DENUNCIA_ERROR:', client, error});
    }
}

exports.help = {
    name: "denuncia"
}