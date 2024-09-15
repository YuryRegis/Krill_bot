const Discord = require("discord.js");
const getID = require("../funcoes/ids.json");
const errorLog = require("../funcoes/errorHandler");


exports.run = async (client, message, args) => {
    try {
        message.delete();
    
        let denRoom = await message.guild.channels.cache.get(getID.sala.DENUNCIA),
            logRoom = await message.guild.channels.cache.get(getID.sala.AVISOS),
            autor   = message.author,
            tag     = 'd_' + autor.tag + '🔐',
            info    = `${autor} explique detalhadamente sua denúncia. Adicione imagem/print em uma única mensagem, se houver.`;
        // let novaRole = await message.guild.createRole({
        //     name: tag,
        //     hoist: false,
        //     mentionable: false,
        // });

        let novaSala = await message.guild.channels.create(tag, {
            type: 'text',
            permissionOverwrites: [{
                id: message.guild.id,   
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: message.author.id,
                allow: ['VIEW_CHANNEL'],
            }]
        });
        
        await novaSala.send({files: ['https://media.discordapp.net/attachments/698341432167104613/1270529662803771405/2_20240806_205028_0001.png']});

        novaSala.send(info + '\nNão se preocupe, apenas você pode ver esta sala. Ela se destruirá automaticamente e sua mensagem será enviada aos Admins de forma anônima.')
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
                        // console.log(coletado.first().attachments.first())
                        let resposta = await coletado.first().attachments.first(),
                            content  = await coletado.first().content,
                            mensagem = `<@${getID.cargo.MODERADOR}> <@${getID.cargo.STAFF}> <@${getID.cargo.ADMIN}> temos uma denúncia anônima.`;
                        
                        if(resposta !== undefined)
                            resposta = resposta.proxyURL;
                        
                        await denRoom.send(mensagem);
                        await denRoom.send(content,{files: [resposta]});
                    
                        novaSala.delete();
                    })
                } catch (error) {
                    errorLog.run({message: 'DENUNCIA_ERROR:', client, error});
                }
            })
    } catch (error) {
        errorLog.run({message: 'DENUNCIA_ERROR:', client, error});
    }
}

exports.help = {
    name: "denuncia"
}