const Discord = require('discord.js');

const getID      = require('../funcoes/ids.json'),
{ verificaRole, verificaRoles } = require('../funcoes/roles');
const {run: logMessage} = require('../funcoes/logHandler');
const {run: errorLog} = require('../funcoes/errorHandler');  
const config = require("../config.json");

exports.help = {
    name: "mutar"
}

exports.run = async (client, message, args) => {
    try {
        const hasHelperFlag = args[0] === 'ajuda' || args[0] === 'help';
        const embedHelper = new Discord.EmbedBuilder()
            .setColor('#237feb')
            .setTitle('⛑️ Command Helper')
            .setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
            .setDescription('Silencie um usuário realizando menção ou inserindo o ID do mesmo.')
            .addFields(
                {name: 'Descrição:', value: 'O bot irá adicionar tag "silenciado" e enviar uma mensagem direta com a justificativa ao usuário alvo.'},
                {name: 'Observação:', value: 'Use menção apenas em canais que o usuário esteja presente. Em canais privados, utilize o ID do usuário alvo.'},
                {name: 'Permissão:', value: 'Administradores e Staffs'},
                {name: 'Como usar:', value: `\`\`\`bash\n${config.prefix}${exports.help.name} <@pessoa OU id-da-pessoa> <motivo>\n\`\`\``},
            )
            .setFooter({text: message.guild.name})

        if(await verificaRoles(message.member, [getID.cargo.ADMIN, getID.cargo.STAFF])) {
            
            // Captura pessoa mencionada na mensagem
            let alvo = await message.mentions.users.first();
            const targetId = alvo ? alvo.id : args[0];
            const msg = args.slice(1).join(" "); // captura motivo para mutar o usuario
            const rebelde = await message.guild.members.cache.get(targetId);

            if(hasHelperFlag || !rebelde || !msg) {    
                 await message.reply({embeds: [embedHelper], ephemeral: true});
                 return message.delete();
            }

            // verifica se usuario já não esta silenciado
            if (await verificaRole(rebelde, getID.cargo.SILENCIADOS)) 
                return message.reply(`${rebelde.displayName} já se encontra silenciado...`)

            await rebelde.send(`${message.author} silenciou você pelo seguinte motivo:\n` + 
            `\`\`\`${msg}\`\`\`\nVocê não poderá interagir nos canais de chat até que um Staff permita novamente.`)
                .then()
                .catch(err => {
                    console.log(err);
                    const errMessage = `!mutar error\nUsuário não permite mensagem privada.\n\`\`\`${err}\`\`\``;
                    errorLog({message: errMessage, client, error: err});
                });
                
            // await rebelde.roles.set([getID.cargo.SILENCIADOS]); // Define role "Silenciados" para o usuario
            await message.delete();
            const messageToLog = `${message.author} silenciou ${rebelde.displayName} usando o bot.`; 
            return logMessage({message: messageToLog, client});
        }
        else
            return message.reply("te falta poderes para usar este comando!");
    } catch (error) {
        errorLog({message: 'MUTE_COMMAND_ERROR:', client, error});
    }    
}   
