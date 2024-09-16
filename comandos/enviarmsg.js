const Discord = require('discord.js');

const config = require("../config.json");
const { run: errorLog } = require('../funcoes/errorHandler');
const { run: logMessage } = require('../funcoes/logHandler');
const { MessageEmbed, MessageCollector } = require('discord.js'),
    { verificaPerm } = require('../funcoes/members'),
    getID = require('../funcoes/ids.json');

exports.help = {
    name: "enviarmsg"
}

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const hasPermission = await verificaPerm(message.member);
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Envie uma mensagem decorada (embed) para um canal específico.')
            .addFields(
                {name: 'Descrição:', value: 'O bot irá criar um canal temporário para te auxiliar na criação da mensagem decorada (embed).'},
                {name: 'Observação:', value: 'Use menções apenas em canais que o usuário esteja presente. Em canais privados, utilize o ID do usuário alvo.'},
                {name: 'Permissão:', value: 'Administradores, Moderadores e Staffs'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});

        if (hasHelperFlag || !hasPermission) {
            await message.reply({ embeds: [embedHelper], ephemeral: true });
            return message.delete();
        }
        await message.delete();

        let index = 0,
            respostas = [],
            cancelado = false,
            perguntas = [
                'Mencione o canal para qual deseja enviar a mensagem:',
                'Mencione os cargos ou pessoas para qual a mensagem é direcionada (digite "\`nada\`" para nenhuma menção):',
                'Titulo da mensagem (digite "\`nada\`" para mensagem sem título):',
                'Mensagem:',
                'Envie uma imagem (digite "\`nada\`" para mensagem sem imagem):',
                'Envie uma thumbnail (digite "\`nada\`" para mensagem sem thumbnail):'
            ];

        const salaLogs = await message.guild.channels.cache.get(getID.sala.LOGS2),
            author = await message.author,
            avatar = await message.guild.members.resolve(author.id).user.avatarURL();

        const novaSala = await message.guild.channels.create({
            name: "nova_mensagem_" + author.id, 
            type: Discord.ChannelType.GuildText,
            PermissionOverwrites: [{
                id: message.guild.id,
                deny: [Discord.PermissionFlagsBits.ViewChannel],
            },
            {
                id: message.author.id,
                allow: [Discord.PermissionFlagsBits.ViewChannel],
            }]
        });

        const filtro = f => !f.author.bot;
        await novaSala.send(`${author}, irei te auxiliar no processo de envio de mensagem.
            \n Digite \`!cancelar\` a qualquer momento para **cancelar** e **deletar** este canal.\n\n\n`)
            .then(async firstMessage => await firstMessage.pin())
        
            // PERGUNTA CANAL 
        await novaSala.send(perguntas[index])
            .then(() => {
                let coletor = new MessageCollector(novaSala, filtro);
                coletor.on('collect', async (msg, col) => {
                    try {
                        if (/cancelar/.test(msg.content)) {
                            cancelado = true;
                            coletor.stop();
                        }
                        let mencao = await msg.mentions.channels.first();
                        if (mencao)
                            coletor.stop();
                    } catch (error) {
                        errorLog({ message: 'ENVIARMSG_CHANNEL_COLLECTOR_ERROR: ', client, error });
                    }
                });
                coletor.on('end', async coletado => {
                    try {
                        if (cancelado) {
                            novaSala.delete();
                            return;
                        }
                        let captura = coletado.first();
                        respostas[index] = captura.mentions.channels.first();
                        index++;

                        // PERGUNTA MENÇÕES 
                        novaSala.send(perguntas[index])
                            .then(() => {
                                let coletor = new MessageCollector(novaSala, filtro);
                                coletor.on('collect', async (msg, col) => {
                                    try {
                                        if (msg.content) {
                                            if (/cancelar/.test(msg.content.split(" ")[0])) {
                                                cancelado = true;
                                                coletor.stop();
                                                return;
                                            }
                                            coletor.stop();
                                        }
                                    } catch (error) {
                                        errorLog({ message: 'ENVIARMSG_MENTION_COLLECTOR_ERROR: ', client, error });
                                    }
                                });
                                coletor.on('end', async coletado => {
                                    try {
                                        let captura = coletado.first();
                                        if (cancelado) {
                                            novaSala.delete();
                                            return;
                                        }
                                        if (/nada/.test(captura.content.split(" ")[0]))
                                            respostas[index] = null;
                                        else
                                            respostas[index] = captura.content;
                                        index++;

                                        // PERGUNTA TITULO
                                        novaSala.send(perguntas[index])
                                            .then(() => {
                                                let coletor = new MessageCollector(novaSala, filtro);
                                                coletor.on('collect', async (msg, col) => {
                                                    try {
                                                        if (msg.content) {
                                                            if (/cancelar/.test(msg.content.split(" ")[0])) {
                                                                cancelado = true;
                                                                coletor.stop();
                                                                return;
                                                            }
                                                            coletor.stop();
                                                        }
                                                    } catch (error) {
                                                        errorLog({ message: 'ENVIARMSG_TITLE_COLLECTOR_ERROR: ', client, error });
                                                    }
                                                });
                                                coletor.on('end', async coletado => {
                                                    try {
                                                        let captura = coletado.first();
                                                        if (cancelado) {
                                                            novaSala.delete();
                                                            return;
                                                        }
                                                        if (/nada/.test(captura.content.split(" ")[0]))
                                                            respostas[index] = null;
                                                        else
                                                            respostas[index] = captura.content;
                                                        index++;

                                                        // PERGUNTA DESCRICAO (MENSAGEM)
                                                        novaSala.send(perguntas[index]).then(() => {
                                                            let coletor = new MessageCollector(novaSala, filtro);
                                                            coletor.on('collect', async (msg, col) => {
                                                                try {
                                                                    if (msg.content) {
                                                                        if (/cancelar/.test(msg.content.split(" ")[0])) {
                                                                            cancelado = true;
                                                                            coletor.stop();
                                                                            return;
                                                                        }
                                                                        coletor.stop();
                                                                    }
                                                                } catch (error) {
                                                                    errorLog({ message: 'ENVIARMSG_DESCRIPTION_COLLECTOR_ERROR: ', client, error });
                                                                }
                                                            });
                                                            coletor.on('end', async coletado => {
                                                                try {
                                                                    let captura = coletado.first();
                                                                    if (cancelado) {
                                                                        novaSala.delete();
                                                                        return;
                                                                    }
                                                                    respostas[index] = captura.content;
                                                                    index++;

                                                                    // PERGUNTA IMAGEM 
                                                                    novaSala.send(perguntas[index]).then(() => {
                                                                        let coletor = new MessageCollector(novaSala, filtro);
                                                                        coletor.on('collect', async (msg, col) => {
                                                                            try {
                                                                                if (msg.content) {
                                                                                    if (/cancelar/.test(msg.content.split(" ")[0])) {
                                                                                        cancelado = true;
                                                                                        coletor.stop();
                                                                                    }
                                                                                    if (/nada/.test(msg.content.split(" ")[0]))
                                                                                        coletor.stop();
                                                                                }
                                                                                let atch = await msg.attachments.first(1);
                                                                                if (atch[0])
                                                                                    coletor.stop();
                                                                            } catch (error) {
                                                                                errorLog({ message: 'ENVIARMSG_IMAGE_COLLECTOR_ERROR: ', client, error });
                                                                            }
                                                                        });
                                                                        coletor.on('end', async coletado => {
                                                                            try {
                                                                                if (cancelado) {
                                                                                    novaSala.delete();
                                                                                    return;
                                                                                }

                                                                                let captura = await coletado.first().attachments.first();
                                                                                respostas[index] = captura ? captura.proxyURL : respostas[index] = null;
                                                                                index++;

                                                                                // PERGUNTA THUMBNAIL
                                                                                novaSala.send(perguntas[index]).then(() => {
                                                                                    let coletor = new MessageCollector(novaSala, filtro);
                                                                                    coletor.on('collect', async (msg, col) => {
                                                                                        try {
                                                                                            if (msg.content) {
                                                                                                if (/cancelar/.test(msg.content.split(" ")[0])) {
                                                                                                    cancelado = true;
                                                                                                    coletor.stop();
                                                                                                }
                                                                                                if (/nada/.test(msg.content.split(" ")[0]))
                                                                                                    coletor.stop();
                                                                                            }
                                                                                            let atch = await msg.attachments.first(1);
                                                                                            if (atch[0])
                                                                                                coletor.stop();
                                                                                        } catch (error) {
                                                                                            errorLog({ message: 'ENVIARMSG_THUMBNAIL_COLLECTOR_ERROR: ', client, error });
                                                                                        }
                                                                                    });
                                                                                    coletor.on('end', async coletado => {
                                                                                        try {
                                                                                            if (cancelado) {
                                                                                                novaSala.delete();
                                                                                                return;
                                                                                            }
                                                                                            let captura = await coletado.first().attachments.first();                                                                                            
                                                                                            respostas[index] = captura ? captura.proxyURL : respostas[index] = null;
                                                                                            index++;

                                                                                            //FIM DE PERGUNTAS
                                                                                            let canal = respostas[0],
                                                                                                ments = respostas[1] || null,
                                                                                                titulo = respostas[2] ? `**${respostas[2].toUpperCase()}**` : null,
                                                                                                msge = respostas[3] || null,
                                                                                                img = respostas[4] || null,
                                                                                                thumb = respostas[5] || 'https://i.ibb.co/6RKGTjC/LogoTSGB.png',
                                                                                                username = message.author.globalName,
                                                                                                mbrRle = message.member.roles.highest.name,
                                                                                                embed = new Discord.EmbedBuilder()
                                                                                                    .setAuthor({ name: `[${mbrRle}] ${username}`, iconURL: avatar })
                                                                                                    .setFooter({text:`${message.guild.name} - Tudo sobre Sky`})
                                                                                                    .setDescription(`${ments || ''}\n\n` + msge)
                                                                                                    .setColor('#237feb')
                                                                                                    .setThumbnail(thumb)
                                                                                                    .setTitle(titulo)
                                                                                                    .setImage(img);
                                                                                            if (!canal) {
                                                                                                salaLogs.send(`${author}, houve um erro ao capturar a sala para qual você quer enviar a mensagem. Por gentileza, tente novamente.`);
                                                                                                return novaSala.delete();
                                                                                            }

                                                                                            await canal.send({embeds: [embed]})
                                                                                            setTimeout(() => {
                                                                                                novaSala.delete();
                                                                                            }, 15000);
                                                                                            return;
                                                                                        } catch (error) {
                                                                                            errorLog({ message: 'ENVIARMSG_THUMBNAIL_COLLECTOR_END_ERROR: ', client, error });
                                                                                        }
                                                                                    });
                                                                                });
                                                                            } catch (error) {
                                                                                errorLog({ message: 'ENVIARMSG_IMAGE_COLLECTOR_END_ERROR: ', client, error });
                                                                            }
                                                                        });
                                                                    });
                                                                } catch (error) {
                                                                    errorLog({ message: 'ENVIARMSG_DESCRIPTION_COLLECTOR_END_ERROR: ', client, error });
                                                                }
                                                            });
                                                        });
                                                    } catch (error) {
                                                        errorLog({ message: 'ENVIARMSG_TITLE_COLLECTOR_END_ERROR: ', client, error });
                                                    }
                                                });
                                            });
                                    } catch (error) {
                                        errorLog({ message: 'ENVIARMSG_MENTION_COLLECTOR_END_ERROR: ', client, error });
                                    }
                                });
                            });
                    } catch (error) {
                        errorLog({ message: 'ENVIARMSG_CHANNEL_COLLECTOR_END_ERROR: ', client, error });
                    }
                });
            });

        if (cancelado) {
            logMessage({ message: `${message.author} cancelou o envio de mensagem.`, client });
            await novaSala.delete();
            return;
        }
    } catch (error) {
        errorLog({ message: 'ENVIAR_MSG_ERROR: ', client, error });
    }
}
