

const { ReactionCollector } = require('discord.js');
const { verificaRole }  = require('../funcoes/roles'),
      { verificaRoles } = require('../funcoes/roles'),
      { userToMember }  = require('../funcoes/members'),
      { embedSimples }  = require('../funcoes/messages'),
      getID             = require('../funcoes/ids.json');


exports.help = {
    name: "banir"
}


exports.run = async (client, message, args) => {
    let permAdmin = await verificaRole(message.member, getID.cargo.ADMIN),
        permStaff = await verificaRole(message.member, getID.cargo.STAFF);
    
    if(!permAdmin)
         if (!permStaff)
            return message.reply(`você não possui permissão.`);

    const salaLogs   = await client.channels.cache.get(getID.sala.LOGS),
          salaAviso  = await client.channels.cache.get(getID.sala.AVISOS),
          membroAlvo = await message.mentions.users.first(),
          motivoBan  = args.slice(1).join(" ");
    
    if(membroAlvo === undefined)
        return message.reply(`não detectei nenhuma menção de usuário no comando.`);
    
    let membroUser = await userToMember(membroAlvo, message),
        permAlvo   = await verificaRoles(membroUser, [getID.cargo.STAFF, getID.cargo.MODERADOR]);
    
    console.log(permAlvo, membroAlvo);
    if(!permAdmin && permAlvo)
          return message.reply(`banir membros com cargo @Staff ou @Moderador requer previlégios de Administrador.`);
    
    let msgMembro  = `${message.author} baniu você pelo seguinte motivo:\n\n${motivoBan}\n\n` +
                           `Você não poderá interagir no servidor **ThatSkyGameBrasil**`,
        nomeMembro = membroAlvo.tag;
    
    // Mensagem privada para o membro banido
    await membroAlvo.send(msgMembro)
        .then( () => salaLogs.send(`Membro ${membroAlvo} banido.\n\`\`\`MOTIVO:\n${motivoBan}\`\`\``))
        .catch(erro => {
            console.log(`Ban error => ${erro}`);
            salaLogs.send(`Ban Error (Terminal):\n\`\`\`Não posso enviar mensagem privada\n\n${erro}\`\`\``);
        });
    
    // Banindo membro e enviando aviso após banimento
    await membroUser.ban({reason: motivoBan + `Você não poderá interagir no servidor TSGB`})
        .then( async () => {
            let cor    = '#CF3F47',
                titulo = '**BANIDO**',
                thumb  = 'https://i.ibb.co/FD93h6p/KRILL.png',
                imagem = 'https://media1.tenor.com/images/7129d4fbd2bd63ab987a768951ff44cb/tenor.gif',
                descricao = `OPA! Parece que ${nomeMembro} foi pego por um Krill !!!`,
                embed  = await embedSimples(cor, titulo, thumb, descricao, imagem);
            
            salaAviso.send(embed)
                .then( async msg => {
                    // Reagir a mensagem com emotes do Krill
                    let cabeca = await client.emojis.cache.get('698231847330644068'), 
                        corpo  = await client.emojis.cache.get('698231902993121370'), 
                        calda  = await client.emojis.cache.get('698231942205931570');

                    await msg.react(cabeca);
                    await msg.react(corpo);
                    await msg.react(calda);
                })
                .catch(err => salaLogs.send(`Terminal Ban\n\`\`\`${err}\`\`\``))
        })
        .catch(err => {
            console.log(`Ban error => ${err}`);
            salaLogs.send(`Terminal Ban\n\`\`\`${err}\`\`\``);
        });

    message.delete();
    return;
}
