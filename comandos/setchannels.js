const Discord = require('discord.js');

const {run: errorLog} = require('../funcoes/errorHandler');
const {channelsCollection} = require('../models/channels');
const { verificaRole }  = require('../funcoes/roles');
const {rolesCollection} = require('../models/roles');
const config = require("../config.json");


exports.help = {
    name: "setchannels",
    isRestricted: true,
}

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Permite editar os IDs dos canais usados nos comandos dos bots Krill e StarKid.')
            .addFields(
                {name: 'Permissão:', value: 'Administradores'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name}\n\`\`\``},
            ).setFooter({text:`${message.guild.name} - Tudo sobre Sky`});

        if (hasHelperFlag) {
            await message.reply({embeds: [embedHelper], ephemeral: true});
            return message.delete();
        }
        const messageEmbed = new Discord.EmbedBuilder()
                .setTimestamp()
                .setColor('#237feb')
                .setTitle('Configuração de Canais')
                .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
                .setDescription('Use o dropdown abaixo para alterar o ID de um Canal. Este ID será usado nos comandos dos bots Krill e StarKid.')
                .setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
        
        const channelsIds = await channelsCollection();
        const rolesIds = await rolesCollection();

        const hasPermission = await verificaRole(message.member, rolesIds.ADMIN);
        if (!hasPermission) {
            return message.reply(`Te falta **poderes** para executar este comando.\nUse \`!${config.prefix}${exports.help.name} ajuda\` para consultar permissões.`);
        }

        const channelsArray = Object.entries(channelsIds).map(([key, value]) => ({ key, value }));
        
        const options = channelsArray.map( role => {
            const objName = role.key;
            const capitalized = objName.toString().charAt(0).toUpperCase() 
                + objName.toString().toLocaleLowerCase().slice(1);
            return {
                label: capitalized,
                value: objName.toString(),
                description: `Altere o ID do canal ${objName}.`,
                emoji: `⚙️`,
            };
        });
        const menuDisplay = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('set-channels')
                    .setPlaceholder('CANAIS:')
                    .addOptions(options)
            );
        const response = await message.reply({ components: [menuDisplay], embeds: [messageEmbed] });
        return setTimeout(async () => {
            await message.delete();
            await response.delete();
        }, 60000); 
    } catch (error) {
        errorLog({message: 'SETCHANNELS_ERROR: ', client, error});
    }
};
