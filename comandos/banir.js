const Discord = require('discord.js');

const config = require("../config.json");
const {run: errorLog} = require('../funcoes/errorHandler');
const {run: logMessage} = require('../funcoes/logHandler');
const { verificaRole }  = require('../funcoes/roles'),
      { verificaRoles } = require('../funcoes/roles'),
      { embedSimples }  = require('../funcoes/messages'),
      getID             = require('../funcoes/ids.json');


exports.help = {
    name: "banir",
    isRestricted: true,
}


exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setImage('https://media1.tenor.com/images/7129d4fbd2bd63ab987a768951ff44cb/tenor.gif')
            .setDescription('Banir um usuário realizando menção ou inserindo o ID do mesmo.')
            .addFields(
                {name: 'Descrição:', value: 'O bot irá enviar uma mensagem direta justicando o ban para o usuário alvo, banindo logo em seguida.'},
                {name: 'Observação:', value: 'Use menção apenas em canais que o usuário esteja presente. Em canais privados, utilize o ID do usuário alvo.'},
                {name: 'Permissão:', value: 'Administradores'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <@pessoa OU id-da-pessoa>\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        const msg = args.slice(1).join(" ");    
        if (hasHelperFlag || !msg) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }

        let permAdmin = await verificaRole(message.member, getID.cargo.ADMIN);
        const permStaff = await verificaRole(message.member, getID.cargo.STAFF);
    
        if(!permAdmin)
            if (!permStaff)
                return message.reply(`você não possui permissão.`);

        const salaAviso  = await client.channels.cache.get(getID.sala.AVISOS),
            memberMention = await message.mentions.users.first(),
            motivoBan  = args.slice(1).join(" ");
        
        const targetId = memberMention ? memberMention.id : args[0];     
        const membroAlvo = await message.guild.members.cache.get(targetId);
        
        if(!targetId)
            return message.reply({embeds: [embedHelper], ephemeral: true});
        
        let membroUser = message.member,//await userToMember(membroAlvo, message),
            permAlvo   = await verificaRoles(membroUser, [getID.cargo.STAFF, getID.cargo.MODERADOR]);
            
        if(!permAdmin && permAlvo)
            return message.reply({embeds: [embedHelper], ephemeral: true});

        if(!membroAlvo) {
            return logMessage({message: `${message.author} Membro não encontrado: \nTarget ID - ${targetId}`, client});
        }
        
        let msgMembro  = `${message.author} baniu você pelo seguinte motivo:\n\n${motivoBan}\n\n` +
                            `Você não poderá interagir no servidor **ThatSkyGameBrasil**`,
            nomeMembro = membroUser.globalName;
        
        // Mensagem privada para o membro banido
        await membroAlvo.send(msgMembro)
            .then( () => {
                const messageToLog = `Membro ${membroAlvo} banido.\n\`\`\`MOTIVO:\n${motivoBan}\`\`\``;
                return logMessage({message: messageToLog, client});
            })
            .catch(erro => {
                errorLog({message: 'BANIR_SEND_LOG_ERROR: ', client, erro});
            });
        
        // Banindo membro e enviando aviso após banimento
        await membroUser.ban({reason: motivoBan + `Você não poderá interagir no servidor TSGB`})
            .then( async () => {
                let cor    = '#CF3F47',
                    titulo = '**USUÁRIO BANIDO**',
                    thumb  = 'https://i.ibb.co/6RKGTjC/LogoTSGB.png',
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
                    .catch(error => errorLog({message: 'BANIR_SEND_WARNING_ERROR: ', client, error}));
            })
            .catch(error => errorLog({message: 'BANIR_BAN_API_ERROR: ', client, error}));;

        await message.delete();
        return;
    } catch (error) {
        errorLog({message: 'BANIR_ERROR: ', client, error});
    }
}
