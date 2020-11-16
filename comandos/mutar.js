const getID      = require('../funcoes/ids.json'),
{ verificaRole, verificaRoles } = require('../funcoes/roles');
    

exports.help = {
    name: "mutar"
}

exports.run = async (client, message, args) => {
    
    if(await verificaRoles(message.member, [getID.cargo.ADMIN, getID.cargo.STAFF])) {
        let canal = await client.channels.cache.get(getID.sala.LOGS);
        
        // Captura pessoa mencionada na mensagem
        let alvo = await message.mentions.users.first();

        if (alvo === undefined) {
            var rebelde = await message.guild.members.cache.get(args[0]);
     
        } else {
            var rebelde = await message.guild.members.cache.get(alvo.id);
        }
        // verifica se usuario já não esta silenciado
        if (await verificaRole(rebelde, getID.cargo.SILENCIADOS)) 
           return message.reply(`${rebelde.displayName} já se encontra silenciado...`)
        
        let msg = args.slice(1).join(" "); // captura motivo para mutar o usuario

        await rebelde.send(`${message.author} silenciou você pelo seguinte motivo:\n` + 
        `\`\`\`${msg}\`\`\`\nVocê não poderá interagir nos canais de chat até que um Staff permita novamente.`)
            .then()
            .catch(err => {
                console.log(err);
                canal.send(`!mutar error\nUsuário não permite mensagem privada.\n\`\`\`${err}\`\`\``);
            });
            
        await rebelde.roles.set([getID.cargo.SILENCIADOS]); // Define role "Silenciados" para o usuario
        await message.delete();
        return canal.send(`\`${message.author}\` silenciou ${rebelde.displayName} usando o bot.`); 
    }
    else
        return message.reply("te falta poderes para usar este comando!");    
}   
