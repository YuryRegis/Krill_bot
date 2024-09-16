const Discord    = require("discord.js"),
{ verificaPerm } = require('../funcoes/members'),
getID            = require('../funcoes/ids.json');
const config = require("../config.json");
const {run: logMessage} = require('../funcoes/logHandler');
const {run: errorLog} = require('../funcoes/errorHandler');
const { get } = require("request-promise-native");
const members = require("../funcoes/members");


async function listeningMessage (client, sala, mensagem) {
    sala.send(mensagem)
        .then(() => {       
            try {         
                let filtro  = f => !f.author.bot && verificaPerm(f.member) && /!/.test(f);
                let coletor = new Discord.MessageCollector(sala, filtro);
                
                coletor.on('collect', async (msg, col) => {
                    let mencao = await msg.mentions.members.first(); 

                    if(msg.content !== undefined || mencao !== undefined)
                        coletor.stop();
                })
                
                coletor.on('end', async coletado => {
                    try {
                        if (!coletado || !coletado.first())
                            return;
                        
                        let captura = await coletado.first();
                        let membro  = await captura.mentions.members.first();
                        
                        if(membro && /!add/.test(captura.content)) {
                            sala.permissionOverwrites.edit(membro.id, {
                                ViewChannel: true,
                                ReadMessageHistory: true,
                            }, `Permissão concedida para sala ${sala}`);

                            listeningMessage(client, sala, `Permissão concedida para ${membro}`);
                        }
                        
                        if(/!encerrar/.test(captura.content)) {
                            const messageToSend = `${captura.author.username} encerrou a sala privada ${sala.name}`;
                            await logMessage({message: messageToSend, client});
                            sala.delete();
                        }
                    } catch (error) { logMessage({message: 'PRIVADO_COLETOR_ERROR:', client, error}); }
                })
            } catch (error) {
                errorLog({message: 'PRIVADO_LISTENING_ERROR: ', client, error})
            }
        }).catch(error => {
            errorLog({message: 'PRIVADO_LISTENING_MESSAGE_ERROR: ', client, error})
        });
}

exports.help = {
    name: "privado"
}

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Use este comando para criar uma sala privada com administradores, staff e moderadores.')
            .addFields(
                {name: 'Observação:', value: 'Para adicionar novos partipantes na sala, após criada, use o comando: ```bash\n!add <@usuario>```\n'},  
                {name: 'Permissão:', value: 'Qualquer membro do servidor.'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <@usuario> \n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }    
        message.delete();
        
        let autor   = message.author,
            tag     = 'p_' + autor.username + '🔐',
            info    = `${autor} você criou um chat **privado**🔐 com <@&${getID.cargo.MODERADOR}> <@&${getID.cargo.STAFF}> <@&${getID.cargo.ADMIN}>. `;
        // let novaRole = await message.guild.createRole({
        //     name: tag,
        //     hoist: false,
        //     mentionable: false,
        // });
            
        const messageToLog = `Estes são os comandos válidos apenas para sala privada:` +
                "```\n!add <@usuario> ==> Adiciona usuario na sala privada.\n!encerrar ==> Encerra e apaga chat privado.\n```";

        const permissionsIds = [autor.id, getID.cargo.ADMIN, getID.cargo.STAFF];
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
        const closeButton = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Encerrar Sala')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🚪')
            );

        let novaSala = await message.guild.channels.create({
            name: tag,
            type: Discord.ChannelType.GuildText,
            PermissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                },
                ...allowedPermissions,
            ],
        })
        const helper = await novaSala.send({content: messageToLog, components: [closeButton]});
        await helper.pin();

        listeningMessage(client, novaSala, info + 'O uso indevido deste comando, sem necessidade, irá gerar **advertência** e, em caso de reincidência, sujeito à **banimento**.');

        return;
    } catch (error) {
        errorLog({message: 'PRIVADO_COMMAND_ERROR:', client, error});
    }
}
