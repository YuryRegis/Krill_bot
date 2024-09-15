
const Discord = require('discord.js');

const { verificaRole, verificaRoles } = require('../funcoes/roles');
const {run: logMessage} = require('../funcoes/logHandler');
const {run: errorLog} = require('../funcoes/errorHandler');
const getID = require('../funcoes/ids.json');
const config = require("../config.json");

exports.help = {
    name: "desmutar"
}

exports.run = async (client, message, args) => {
    try {    
        const hasPermission = await verificaRoles(message.member, [getID.cargo.ADMIN, getID.cargo.STAFF]);
        if(!hasPermission) {
            return message.reply("te falta poderes para usar este comando!");
        } 
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Silencie um usuário realizando menção ou inserindo o ID do mesmo.')
            .addFields(
                {name: 'Descrição:', value: 'O bot irá remover a tag "silenciado" e enviar uma mensagem direta notificando o usuário alvo.'},
                {name: 'Observação:', value: 'Use menção apenas em canais que o usuário esteja presente. Em canais privados, utilize o ID do usuário alvo.'},
                {name: 'Permissão:', value: 'Administradores e Staffs'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <@pessoa OU id-da-pessoa>\n\`\`\``},
            )
            .setFooter({text: message.guild.name})

        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        } 
        
        // Captura pessoa mencionada na mensagem
        let alvo = await message.mentions.users.first();
        const targetId = alvo ? alvo.id : args[0];
        var rebelde = await message.guild.members.cache.get(targetId);
        
        // Verifica se ela foi silenciada
        let id = getID.cargo.SILENCIADOS;
        if (await verificaRole(rebelde, id)) {
            await rebelde.roles.remove(id);
            
            // notificando rebelde desmutado
            await rebelde.send(`Você não está mais silenciado.\n`+
            `Cuide para ter um bom relacionamento com seus colegas.\n`+
            `Vamos fazer, juntos, o **nosso servidor** ser um lugar **agradavel para todos.** `)
                .then()
                .catch(error => {
                    errorLog({message: 'DESMUTAR_SEND_DM_ERROR: ', client, error});
                });
            
            const messageToLog = `\`${message.author}\` removeu silenciar de ${rebelde.displayName}.`;
            await logMessage({message: messageToLog, client});
            return message.delete();;
        }
        await message.reply(`o usuário ${rebelde.displayName} precisa estar silenciado para usar !desmutar.`);       
        return message.delete(); 
    } catch (error) {

    } 
}
