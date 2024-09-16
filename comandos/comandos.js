const Discord = require('discord.js');
const config = require("../config.json");
const {run: errorLog} = require('../funcoes/errorHandler');

exports.help = {
    name: "comandos",
    isRestricted: false,
}

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setImage('https://media1.tenor.com/images/7129d4fbd2bd63ab987a768951ff44cb/tenor.gif')
            .setDescription('Lista todos os comandos de texto disponívels.')
            .addFields(
                {name: 'Descrição:', value: 'O bot irá listar todos os comandos de texto dispníveis.'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\``},
                {name: 'Observação:', value: 'Para ver o manual do comando, utilize a flag "ajuda" ou "help".'},
                {name: 'Exemplo:', value: `\`\`\`bash\n!kping ajuda\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});

        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }        
        const comandos = client.commands.filter(cmd => cmd.help ? true : false);
        const restrictedCommands = comandos.map(cmd => {
            if (cmd.help.isRestricted) return cmd.help.name;
        }).filter(name => name);
        const publicCommands = comandos.map(cmd => {
            if (!cmd.help.isRestricted) return cmd.help.name;
        }).filter(name => name);

        console.log({comandos, restrictedCommands, publicCommands});

        const responseEmbed = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Lista todos os comandos de texto disponívels.')
            .addFields(
                {name: 'Comandos Restritos:', value: restrictedCommands.join(' • ').trim()},
                {name: 'Comandos Públicos:', value: publicCommands.join(' • ').trim()},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\``},
                {name: 'Usando manual do comando:', value: `\`\`\`bash\n!kping ajuda\n\`\`\``},
            )
            .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
            
            await message.reply({embeds: [responseEmbed], ephemeral: true});
            return message.delete();
     } catch (error) {
        errorLog({message: 'PRIVADO_ERROR: ', client, error})
    }
}
