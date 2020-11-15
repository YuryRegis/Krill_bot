const Discord = require("discord.js");
const getID = require("../funcoes/ids.json");


exports.run = async (client, message, args) => {
    message.delete();
    
    let denRoom = await message.guild.channels.cache.get(getID.sala.DENUNCIA),
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
    
    await novaSala.send({files: ['https://i1.wp.com/www.prosaude.org.br/wp-content/uploads/2019/09/CanalDenuncia.png']});

    novaSala.send(info + '\nNão se preocupe, apenas você pode ver esta sala. Ela se destruirá automaticamente e sua mensagem será enviada aos Admins de forma anônima.')
            .then(() => {
                
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
            })

    return;
    
}

exports.help = {
    name: "denuncia"
}