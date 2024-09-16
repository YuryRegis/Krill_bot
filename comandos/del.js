const Discord          = require('discord.js');

const config = require("../config.json");
const { verificaPerm } = require('../funcoes/members');
const {run: logMessage} = require('../funcoes/logHandler');    
const {run: logError} = require('../funcoes/errorHandler');


exports.help = {
    name: "del",
    isRestricted: true,
}
//comando para apagar multiplas mensagens
exports.run = async (client, message, args) => {
    try {
        const salaAtual = await message.channel;
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Use este comando para deletar mensagens de um canal.')
            .addFields(
                {name: 'Permissão:', value: 'Administração, Moderação, Staff'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <quantidade> \n\`\`\``},
                {name: 'Exemplo (apagando 5 mensagens):', value: `\`\`\`bash\n${config.prefix}${exports.help.name} 5 \n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }
        const permissao = await verificaPerm(message.member);    
        if(!permissao)
            return message.reply("te falta **poderes** para usar este comando!");

        let num = 2;
        if(!isNaN(args[0]))
            num = parseInt(args[0]) + 1;

        let captura = await salaAtual.messages.fetch({limit: num});
        
        salaAtual.bulkDelete(parseInt(captura.size), true)
            .then(async messages => {
                const messageToLog = `${(messages.size - 1)} deletadas por ${message.author.username}`;
                await logMessage({message: messageToLog, client});
                const m = await salaAtual.send(`${num -1} mensagens apagadas...`);
                setTimeout(() => {
                    m.delete();
                }, 5000);
            }).catch(error => { 
                logError({message: 'MESSAGE_BULK_DELETE_ERROR: ', client, error});
                return message.delete();
            });
    } catch(error) {
        logError({message: 'MESSAGE_DELETE_ERROR: ', client, error});
    }
}

