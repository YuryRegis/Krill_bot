const { MessageEmbed, MessageCollector } = require('discord.js'),
   { verificaPerm } = require('../funcoes/members'),
   getID            = require('../funcoes/ids.json');


exports.help = {
    name: "enviarmsg"
}


let index     = 0,
    respostas = [],
    cancelado = false,
    perguntas = [
    'Mencione o canal para qual deseja enviar a mensagem:',
    'Mencione os cargos ou pessoas para qual a mensagem é direcionada (digite "\`nada\`" para nenhuma menção):',
    'Titulo da mensagem (digite "\`nada\`" para mensagem sem título):',
    'Mensagem:',
    'Envie uma imagem (digite "\`nada\`" para mensagem sem imagem):',
    'Envie uma thumbnail (digite "\`nada\`" para mensagem sem thumbnail):' ];


exports.run = async (client, message, args) => {
    await message.delete();
    
    if(!verificaPerm(message.member)) {
        return message.reply(" você não tem permissão para usar este comando."); 
    }

        const salaLogs = await message.guild.channels.cache.get(getID.sala.LOGS2),
              author   = await message.author,  
              avatar   = await message.guild.members.resolve(author.id).user.avatarURL();

        const novaSala = await message.guild.channels.create("nova_mensagem_"+author.id, {
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

        let inicio = `${author}, irei te auxiliar no processo de envio de mensagem.
        \n Digite \`!cancelar\` a qualquer momento para **cancelar** e **deletar** este canal.\n\n\n`

        const filtro  = f => !f.author.bot;


        // PERGUNTA CANAL 
        await novaSala.send(inicio + perguntas[index])
            .then(()=>{
                let coletor = new MessageCollector(novaSala, filtro);
                coletor.on('collect', async (msg, col) => {

                    if(/cancelar/.test(msg.content)){
                        cancelado = true;
                        coletor.stop();
                    }
                    let mencao = await msg.mentions.channels.first();
                    if(mencao)
                        coletor.stop();
                });
                coletor.on('end', async coletado => {
                    if(cancelado){
                        novaSala.delete();
                        return;
                    }
                    let captura = coletado.first();
                    respostas[index] = captura.mentions.channels.first();
                    index++;


                    // PERGUNTA MENÇÕES 
                    novaSala.send(perguntas[index])
                        .then(()=>{
                            let coletor = new MessageCollector (novaSala, filtro);
                            coletor.on('collect', async (msg, col) => {
                                if(msg.content !== undefined)
                                {
                                    if(/cancelar/.test(msg.content.split(" ")[0])){
                                        cancelado = true;
                                        coletor.stop();
                                        return;
                                    }
                                    coletor.stop();
                                }
                            });
                            coletor.on('end', async coletado => {
                                let captura = coletado.first();
                                if (cancelado){
                                    novaSala.delete();
                                    return;
                                }
                                if(/nada/.test(captura.content.split(" ")[0]))
                                    respostas[index] = null;
                                else
                                    respostas[index] = captura.content;
                                index++;

                    // PERGUNTA TITULO
                    novaSala.send(perguntas[index])
                        .then(()=>{
                            let coletor = new MessageCollector (novaSala, filtro);
                            coletor.on('collect', async (msg, col) => {
                                if(msg.content !== undefined)
                                {
                                    if(/cancelar/.test(msg.content.split(" ")[0])){
                                        cancelado = true;
                                        coletor.stop();
                                        return;
                                    }
                                    coletor.stop();
                                }
                            });
                            coletor.on('end', async coletado => {
                                let captura = coletado.first();
                                if (cancelado){
                                    novaSala.delete();
                                    return;
                                }
                                if(/nada/.test(captura.content.split(" ")[0]))
                                    respostas[index] = null;
                                else
                                    respostas[index] = captura.content;
                                index++;

                                // PERGUNTA DESCRICAO (MENSAGEM)
                                novaSala.send(perguntas[index]).then(()=>{
                                    let coletor = new MessageCollector (novaSala, filtro);
                                    coletor.on('collect', async (msg, col) => {
                                        if(msg.content !== undefined)
                                        {
                                            if(/cancelar/.test(msg.content.split(" ")[0])){
                                                cancelado=true;
                                                coletor.stop();
                                                return;
                                            }
                                            coletor.stop();
                                        }
                                    });
                                    coletor.on('end', async coletado => {
                                        let captura = coletado.first();
                                        if(cancelado){
                                            novaSala.delete();
                                            return;
                                        }
                                        respostas[index] = captura.content;
                                        index++;

                                        // PERGUNTA IMAGEM 
                                        novaSala.send(perguntas[index]).then(()=>{
                                            let coletor = new MessageCollector (novaSala, filtro);
                                            coletor.on('collect', async (msg, col) => {
                                                if(msg.content !== undefined)
                                                {
                                                    if(/cancelar/.test(msg.content.split(" ")[0])){
                                                        cancelado = true;
                                                        coletor.stop();
                                                    }
                                                    if(/nada/.test(msg.content.split(" ")[0]))
                                                        coletor.stop();
                                                }
                                                let atch = await msg.attachments.first(1);
                                                if(atch[0] !== undefined)
                                                    coletor.stop();
                                            });
                                            coletor.on('end', async coletado => {
                                                if(cancelado){
                                                    novaSala.delete();
                                                    return;
                                                }
    
                                                let captura = await coletado.first().attachments.first();
                                                (captura !== undefined) ?
                                                    respostas[index] = captura.proxyURL : respostas[index] = null;
                                                index++;

                                                // PERGUNTA THUMBNAIL
                                                novaSala.send(perguntas[index]).then(()=>{
                                                    let coletor = new MessageCollector(novaSala, filtro);
                                                    coletor.on('collect', async (msg, col) => {
                                                        if(msg.content !== undefined)
                                                        {
                                                            if(/cancelar/.test(msg.content.split(" ")[0])){
                                                                cancelado = true;
                                                                coletor.stop();
                                                            }
                                                            if(/nada/.test(msg.content.split(" ")[0]))
                                                                coletor.stop();
                                                        }
                                                        let atch = await msg.attachments.first(1);
                                                        if(atch[0] !== undefined)
                                                            coletor.stop();
                                                    });
                                                    coletor.on('end', async coletado => {
                                                        if(cancelado){
                                                            novaSala.delete();
                                                            return;
                                                        }
                                                        let captura = await coletado.first().attachments.first();
                                                        (captura !== undefined) ?
                                                            respostas[index] = captura.proxyURL : respostas[index] = null;
                                                        index++;

                                                        //FIM DE PERGUNTAS
                                                        
                                                        
                                                    
                                                        let canal  = respostas[0],
                                                            ments  = respostas[1]
                                                            titulo = respostas[2],
                                                            msge   = respostas[3],
                                                            img    = respostas[4],
                                                            thumb  = respostas[5],
                                                            mbrRle = message.member.roles.highest.name,
                                                            embed  = new MessageEmbed()
                                                                .setTimestamp()
                                                                .setAuthor(mbrRle, avatar)
                                                                .setColor("RANDOM")
                                                                .setFooter(`ThatSkyGameBrasil - Tudo sobre Sky`, message.guild.iconURL());
                                                        if(!canal){
                                                            salaLogs.send(`${author}, houve um erro ao capturar a sala para qual você quer enviar a mensagem. Por gentileza, tente novamente.`);
                                                            return novaSala.delete();
                                                        }
                                                    
                                                        // (!ments) ?
                                                        //     embed.setAuthor(ments, avatar) : embed.setAuthor("",avatar);
                                                        

                                                        if( titulo !== null ) 
                                                            embed.setTitle(`**${titulo}**`);
                                                        
                                                        if( msge !== null ) 
                                                            embed.setDescription(`${ments}\n\n` + msge);
                                                        
                                                        if( img !== null ) 
                                                            embed.setImage(img);
                                                        
                                                        if( thumb === null || !thumb)
                                                            thumb = 'https://i.ibb.co/6RKGTjC/LogoTSGB.png';     
                                                        embed.setThumbnail(thumb);
                                                        
                                                        novaSala.delete();
                                                        
                                                        try { canal.send(embed) }
                                                            catch(error)  {
                                                                salaLogs.send(`!enviarembed error\n \`\`\`${error}\`\`\``);
                                                                console.log(`!enviarembed error: ${error}`);
                                                            };
                                                        return;
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });  
            });
        });

        if(cancelado) {
            console.log("Sala encerrada.");
            return;
        }
} 

