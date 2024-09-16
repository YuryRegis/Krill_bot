const Discord = require('discord.js');
const config = require("../config.json");

const {run: errorLog} = require('../funcoes/members');
const {run: logMessage} = require('../funcoes/logHandler');

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Use este comando para calcular a latência do Krill.')
            .addFields(
                {name: 'Permissão:', value: 'Qualquer membro do servidor.'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
    
        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }
        const m = await message.channel.send("ping?");
        let ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`Pong! Latencia --> ${ping}ms`);
        logMessage({message: `Ping --> ${ping}ms`, client});
    } catch(error) {
        errorLog({message: 'MESSAGE_DELETE_ERROR: ', client, error});
    }
}

exports.help = {
    name: "kping",
    isRestricted: false,
}
