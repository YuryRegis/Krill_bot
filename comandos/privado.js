const Discord    = require("discord.js"),
{ verificaPerm } = require('../funcoes/members'),
getID            = require('../funcoes/ids.json');
const { get } = require("request-promise-native");
const members = require("../funcoes/members");



function listeningMessage (sala, mensagem) {
    sala.send(mensagem)
        .then(() => {
                
            let filtro  = f => !f.author.bot && verificaPerm(f.member) && /!/.test(f);
            let coletor = new Discord.MessageCollector(sala, filtro);
            
            coletor.on('collect', async (msg, col) => {
                let mencao = await msg.mentions.members.first(); 
                console.log(msg.content)

                if(msg.content !== undefined || mencao !== undefined)
                    coletor.stop();
            })
            
            coletor.on('end', async coletado => {
                if (coletado === undefined)
                    return;
                
                let captura = await coletado.first();
                let membro  = await captura.mentions.members.first();
                
                if(membro && /!add/.test(captura.content)) {
                    sala.overwritePermissions([
                        {
                            id: membro.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                    ], `Permissão concedida para sala ${sala}`);

                    listeningMessage(sala, `Permissão concedida para ${membro}`);
                }
                
                if(/!encerrar/.test(captura.content)) {
                    let salaLogs = await captura.guild.channels.cache.get(getID.sala.LOGS);
                    salaLogs.send(`${captura.author.tag} encerrou a sala privada ${sala.name}`);
                    sala.delete();
                }
            })
    })
}


exports.run = async (client, message, args) => {
    message.delete();
    
    let autor   = message.author,
        tag     = 'p_' + autor.tag + '🔐',
        info    = `${autor} você criou um chat **privado**🔐 com <@${getID.cargo.MODERADOR}> <@${getID.cargo.STAFF}> <@${getID.cargo.ADMIN}>. `;
    // let novaRole = await message.guild.createRole({
    //     name: tag,
    //     hoist: false,
    //     mentionable: false,
    // });

    let salaLogs = await message.guild.channels.cache.get(getID.sala.LOGS);
        
    salaLogs.send(`${message.author} estes são os comandos válidos apenas para sala privada:` +
            "```!add <@usuario> ==> Adiciona usuario na sala privada.\n!encerrar ==> Encerra e apaga chat privado.```");

    let novaSala = await message.guild.channels.create(tag, {
        type: 'text',
        permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
        },
        {
            id: message.author.id,
            allow: ['VIEW_CHANNEL'],
        },
        {
            id: getID.cargo.MODERADOR,
            allow: ['VIEW_CHANNEL'],
        },
        {
            id: getID.cargo.STAFF,
            allow: ['VIEW_CHANNEL'],
        },
        {
            id: getID.cargo.ADMIN,
            allow: ['VIEW_CHANNEL'],
        }]
    })
    
    await novaSala.send({files:['https://pngimage.net/wp-content/uploads/2018/06/privado-png-2.png']});

    listeningMessage(novaSala, info + 'O uso indevido deste comando, sem necessidade, irá gerar **advertência** e, em caso de reincidência, sujeito à **banimento**.');

    return;
}

exports.help = {
    name: "privado"
}