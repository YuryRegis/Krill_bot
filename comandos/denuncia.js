const Discord = require("discord.js");
const config = require("../config.json");
const logMessage = require("../funcoes/logHandler");
const errorLog = require("../funcoes/errorHandler");
const {rolesCollection} = require('../models/roles');
const {channelsCollection} = require('../models/channels');


exports.run = async (client, message, args) => {
    try {
        const channelsIds = await channelsCollection();
        const rolesIds = await rolesCollection();

        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Use este comando para enviar uma mensagem anônima para os administradores, staff e moderadores.')
            .addFields(
                {name: 'Descrição:', value: 'Envie uma mensagem anônima para os administradores, staff e moderadores do servidor.'},
                {name: 'Maneira 1:', value: 'Um canal temporário será criando para que você adicione uma mensagem e evidências (anexos). O mesmo será excluído automaticamente ao enviar sua primeira mensagem, adicione todas as evidências em uma única mensagem.'},
                {name: 'Maneira 2:', value: 'Envie uma mensagem simples (sem anexos) diretamente aos para os administradores, staff e moderadores do servidor sem a necessidade de criar uma sala temporária.'},
                {name: 'Permissão:', value: 'Qualquer membro do servidor.'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\`\n\`\`\`bash\n${config.prefix}${exports.help.name} <mensagem>\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        if (hasHelperFlag) {
            message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }
        const mensagem = `<@&${rolesIds.MODERADOR}> <@&${rolesIds.STAFF}> <@&${rolesIds.ADMIN}> temos uma denúncia anônima.`;
        if (args.length > 1) {
            const msg = args.join(" ");
            await logMessage.run({message: `${mensagem}\n\n${msg}`, client});
            return message.delete(); 
        }

        message.delete();
    
        let denRoom = await message.guild.channels.cache.get(channelsIds.DENUNCIA),
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
                                content  = coletado.first().content;                                
                            
                            if (anexos && anexos.size > 0) {
                                anexos = anexos.map(attachment => new Discord.AttachmentBuilder(attachment.proxyURL));
                            } else {
                                anexos = [];
                            }
                            await denRoom.send({content: `${mensagem}\n\n${content}`, files: anexos});                        
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
    name: "denuncia",
    isRestricted: false,
}