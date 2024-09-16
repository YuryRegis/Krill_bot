const Discord = require("discord.js");      
const config  = require("../config.json");
const { verificaRoles } = require('../funcoes/roles');
const {run: errorLog} = require('../funcoes/errorHandler');
const {run: logMessage} = require('../funcoes/logHandler');
const {rolesCollection} = require('../models/roles');


exports.help = {
    name: "enviarpv",
    isRestricted: true,
}

exports.run = async (client, message, args) => {
   try {
        const rolesIds = await rolesCollection();
        
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Envia uma mensagem privada através do Krill.')
            .addFields(
                {name: 'Descrição:', value: 'O Krill irá enviar uma mensagem direta com a sua mensagem personalizada.'},
                {name: 'Observação:', value: 'Use menção apenas em canais que o usuário esteja presente. Em canais privados, utilize o ID do usuário alvo.'},
                {name: 'Permissão:', value: 'Administradores e Staff'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <@pessoa OU id-da-pessoa> <mensagem>\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        
        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }
        await message.delete();
        
        if(verificaRoles(message.member, [rolesIds.ADMIN, rolesIds.STAFF])) {
            let mensaoUsuario = /@/;
            let canal = await message.channel;

            if(!isNaN(args[0])) {
                let membro = await canal.guild.members.cache.get(args[0]);

                if(!membro) {
                    await logMessage({message: `${message.author} Membro não encontrado.`, client});
                    return;
                }
                return membro.send( `${membro.user.username}: ${args.slice(1).join(" ")}` )
                    .then()
                    .catch(error => errorLog({message: 'ENVIARPV_MD_ERROR: ', client, error}));          
            } 
            if(mensaoUsuario.test(args[0])) {
                let membro = message.mentions.members.first();

                if(!membro) {
                    await logMessage({message: `${message.author} Membro não encontrado.`, client});
                    return;
                }
                const username = membro.user.username.replace(/\d+/g, '')
                return membro.send( `${username}: ${args.slice(1).join(" ")}` )
                    .then()
                    .catch(err => { canal.send("Terminal `!enviarpv`" + `\`\`\`${err}\`\`\``) }); 
            } else {
                const messageToReply = `${message.author} Erro de sintaxe. Use \`!enviarpv @usuario\` ou \`!enviarpv idUsuario\``;
                logMessage({message: messageToReply, client});
            }
        } else {
            return message.reply(`Apenas <@&${rolesIds.ADMIN}> ou <@&${rolesIds.STAFF}> podem usar este comando.`);
        }
   } catch (error) {
        errorLog({message: 'ENVIARPV_ERROR: ', client, error});
   }
}
